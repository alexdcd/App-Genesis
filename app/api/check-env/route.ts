import { NextResponse } from "next/server"

export async function GET() {
  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY

    // Check if the API key exists without revealing it
    const keyStatus = {
      exists: !!GROQ_API_KEY,
      length: GROQ_API_KEY ? GROQ_API_KEY.length : 0,
      // Show first 4 characters masked with * to help verify it's the right key
      // without revealing the full key
      preview: GROQ_API_KEY
        ? `${GROQ_API_KEY.substring(0, 4)}${"*".repeat(Math.max(0, GROQ_API_KEY.length - 4))}`
        : null,
    }

    return NextResponse.json({ status: "success", keyStatus })
  } catch (error) {
    console.error("Error checking environment variables:", error)
    return NextResponse.json({ status: "error", message: "Failed to check environment variables" }, { status: 500 })
  }
}
