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

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.userId) }, { projection: { password: 0 } })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
