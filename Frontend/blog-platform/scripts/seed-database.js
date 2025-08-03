const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function seedDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable is required")
    process.exit(1)
  }

  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("blogplatform")

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("posts").deleteMany({})

    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 12)

    const users = await db.collection("users").insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=John Doe",
        createdAt: new Date(),
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jane Smith",
        createdAt: new Date(),
      },
    ])

    const userIds = Object.values(users.insertedIds)

    // Create sample posts
    await db.collection("posts").insertMany([
      {
        title: "Getting Started with Next.js 15",
        summary:
          "Learn about the latest features in Next.js 15 and how to build modern web applications with improved performance and developer experience.",
        content:
          "Next.js 15 brings exciting new features including improved App Router, better performance optimizations, and enhanced developer tools. In this comprehensive guide, we'll explore all the new capabilities and how to leverage them in your projects.",
        image: "/placeholder.svg?height=300&width=600&text=Next.js+15",
        authorId: userIds[0],
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 156,
        likedBy: [],
        comments: [],
      },
      {
        title: "The Future of AI in Web Development",
        summary:
          "Exploring how artificial intelligence is transforming the way we build web applications and what developers need to know.",
        content:
          "Artificial intelligence is revolutionizing web development in unprecedented ways. From automated code generation to intelligent user interfaces, AI is becoming an integral part of the modern web development workflow. This article explores the current trends and future possibilities.",
        image: "/placeholder.svg?height=300&width=600&text=AI+Web+Development",
        authorId: userIds[1],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        views: 234,
        likedBy: [],
        comments: [],
      },
      {
        title: "Building Responsive Layouts with Tailwind CSS",
        summary:
          "Master the art of creating beautiful, responsive layouts using Tailwind CSS utility classes and modern design principles.",
        content:
          "Tailwind CSS has revolutionized how we approach styling in web development. This comprehensive guide covers everything from basic utility classes to advanced responsive design patterns, helping you create stunning layouts that work across all devices.",
        image: "/placeholder.svg?height=300&width=600&text=Tailwind+CSS",
        authorId: userIds[0],
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
        views: 189,
        likedBy: [],
        comments: [],
      },
    ])

    console.log("Database seeded successfully!")
    console.log(`Created ${userIds.length} users and 3 posts`)
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
