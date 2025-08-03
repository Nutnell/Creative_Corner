import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { authMiddleware } from "@/lib/middleware"
import { ObjectId } from "mongodb"

export async function POST(request, { params }) {
  try {
    const decoded = authMiddleware(request)
    if (decoded instanceof NextResponse) {
      return decoded
    }

    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ message: "Comment text is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("blogplatform")

    const comment = {
      _id: new ObjectId(),
      text,
      userId: new ObjectId(decoded.userId),
      createdAt: new Date(),
    }

    await db.collection("posts").updateOne({ _id: new ObjectId(params.id) }, { $push: { comments: comment } })

    return NextResponse.json({
      message: "Comment added successfully",
      comment,
    })
  } catch (error) {
    console.error("Add comment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
