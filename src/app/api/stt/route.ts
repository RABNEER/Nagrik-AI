// Groq Whisper Speech-to-Text API route
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const lang = formData.get("lang") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY environment variable on server" }, { status: 500 });
    }

    // Build the request body for Groq's transcription endpoint
    const groqForm = new FormData();
    // Rename/ensure correct filename and content type
    const blob = new Blob([await file.arrayBuffer()], { type: file.type || "audio/webm" });
    groqForm.append("file", blob, "audio.webm");
    groqForm.append("model", "whisper-large-v3");

    // Whisper supports ISO 639-1 language codes (e.g. hi, bn, ta, mr, en)
    if (lang && lang !== "auto") {
      groqForm.append("language", lang);
    }

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
      },
      body: groqForm,
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[/api/stt] Groq API returned error:", data);
      return NextResponse.json(
        { error: data?.error?.message || "Failed to transcribe audio" },
        { status: res.status }
      );
    }

    return NextResponse.json({ text: data.text || "" });
  } catch (error) {
    console.error("[/api/stt] error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `STT service error: ${msg}` },
      { status: 500 }
    );
  }
}
