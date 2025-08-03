import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { authMiddleware } from "@/lib/middleware"
import { ObjectId } from "mongodb"

export async function GET(request) {
  try {
    const decoded = authMiddleware(request)
    if (decoded instanceof NextResponse) {
      return decoded
    }

    const client = await clientPromise
    const db = client.db("blogplatform")

    const posts = await db
      .collection("posts")
      .aggregate([
        { $match: { authorId: new ObjectId(decoded.userId) } },
        {
          $project: {
            title: 1,
            summary: 1,
            createdAt: 1,
            views: { $ifNull: ["$views", 0] },
            likes: { $size: { $ifNull: ["$likedBy", []] } },
            comments: { $size: { $ifNull: ["$comments", []] } },
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Get user posts error:", error)
    return NextResponse.json({ posts: [] }, { status: 500 })
  }
}
