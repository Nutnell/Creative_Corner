import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { authMiddleware } from "@/lib/middleware"
import { ObjectId } from "mongodb"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db("blogplatform")

    const postsCollection = db.collection("posts")
    const totalPosts = await postsCollection.countDocuments()

    if (totalPosts === 0) {
      return NextResponse.json({
        posts: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          pages: 0,
        },
      })
    }

    const posts = await postsCollection
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $addFields: {
            author: {
              $cond: {
                if: { $gt: [{ $size: "$author" }, 0] },
                then: { $arrayElemAt: ["$author", 0] },
                else: {
                  name: "Unknown Author",
                  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Unknown",
                },
              },
            },
          },
        },
        {
          $project: {
            title: 1,
            summary: 1,
            image: 1,
            createdAt: 1,
            likes: { $size: { $ifNull: ["$likedBy", []] } },
            comments: { $size: { $ifNull: ["$comments", []] } },
            views: { $ifNull: ["$views", 0] },
            "author.name": 1,
            "author.avatar": 1,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray()

    const totalPages = Math.ceil(totalPosts / limit)

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        pages: totalPages,
      },
    })
  } catch (error) {
    console.error("Get posts error:", error)

    return NextResponse.json(
      {
        posts: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
        error: "Failed to fetch posts",
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    const decoded = authMiddleware(request)
    if (decoded instanceof NextResponse) {
      return decoded
    }

    const { title, content, summary, image } = await request.json()

    if (!title || !content || !summary) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("blogplatform")

    const result = await db.collection("posts").insertOne({
      title,
      content,
      summary,
      image,
      authorId: new ObjectId(decoded.userId),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likedBy: [],
      comments: [],
    })

    return NextResponse.json({
      id: result.insertedId,
      message: "Post created successfully",
    })
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
