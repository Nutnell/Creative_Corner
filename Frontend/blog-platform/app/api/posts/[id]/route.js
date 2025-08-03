import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { authMiddleware } from "@/lib/middleware"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db("blogplatform")

    await db.collection("posts").updateOne({ _id: new ObjectId(params.id) }, { $inc: { views: 1 } })

    const post = await db
      .collection("posts")
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $lookup: {
            from: "users",
            localField: "comments.userId",
            foreignField: "_id",
            as: "commentUsers",
          },
        },
        {
          $project: {
            title: 1,
            content: 1,
            summary: 1,
            image: 1,
            createdAt: 1,
            updatedAt: 1,
            views: 1,
            likes: { $size: { $ifNull: ["$likedBy", []] } },
            comments: {
              $map: {
                input: "$comments",
                as: "comment",
                in: {
                  _id: "$$comment._id",
                  text: "$$comment.text",
                  createdAt: "$$comment.createdAt",
                  user: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$commentUsers",
                          cond: { $eq: ["$$this._id", "$$comment.userId"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
            "author.name": 1,
            "author.avatar": 1,
          },
        },
      ])
      .toArray()

    if (!post.length) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post[0])
  } catch (error) {
    console.error("Get post error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const decoded = authMiddleware(request)
    if (decoded instanceof NextResponse) {
      return decoded
    }

    const { title, content, summary, image } = await request.json()

    const client = await clientPromise
    const db = client.db("blogplatform")

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(params.id),
      authorId: new ObjectId(decoded.userId),
    })

    if (!post) {
      return NextResponse.json({ message: "Post not found or unauthorized" }, { status: 404 })
    }

    await db.collection("posts").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          title,
          content,
          summary,
          image,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Post updated successfully" })
  } catch (error) {
    console.error("Update post error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const decoded = authMiddleware(request)
    if (decoded instanceof NextResponse) {
      return decoded
    }

    const client = await clientPromise
    const db = client.db("blogplatform")

    const result = await db.collection("posts").deleteOne({
      _id: new ObjectId(params.id),
      authorId: new ObjectId(decoded.userId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Post not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
