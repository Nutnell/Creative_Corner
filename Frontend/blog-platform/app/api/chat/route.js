import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    // Forward to FastAPI backend (which expects { prompt })
    const fastApiResponse = await fetch('https://creative-corner.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message }),
    });

    if (!fastApiResponse.ok) {
      const errorText = await fastApiResponse.text();
      return NextResponse.json({ error: 'FastAPI error', details: errorText }, { status: 500 });
    }

    const data = await fastApiResponse.json();

    return NextResponse.json({ reply: data.response }); // Return formatted reply
  } catch (error) {
    console.error("Error in proxy route:", error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
