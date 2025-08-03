import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, signToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("blogplatform")

    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    })

    const token = signToken({ userId: result.insertedId, email })

    return NextResponse.json({
      token,
      user: {
        id: result.insertedId,
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
