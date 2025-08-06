import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message, mode } = await req.json();

    if (!message || !mode) {
      return NextResponse.json({ error: "Message and mode are required." }, { status: 400 });
    }

    const isBlog = mode === "blog";

    const endpoint = isBlog
      ? "https://creative-corner.onrender.com/api/generate-blog"
      : "https://creative-corner.onrender.com/api/chat";

    const payload = isBlog
      ? { topic: message, tone: "professional" }
      : { prompt: message };

    const fastApiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await fastApiResponse.json();

    if (!fastApiResponse.ok) {
      return NextResponse.json(
        { error: "FastAPI error", details: data },
        { status: 500 }
      );
    }

    // For blog mode, return the generated result
    const reply = isBlog ? data.result : data.response;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in proxy route:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
