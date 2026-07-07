// AI Chat Companion endpoint
import { NextRequest, NextResponse } from "next/server";
import { generateChat } from "@/lib/gemini";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompts";
import type { ChatResponse } from "@/lib/types";

export const runtime = "nodejs";

const LANG_NAMES: Record<string, string> = {
  hi: "Hindi (हिंदी)",
  en: "English",
  bn: "Bengali (বাংলা)",
  ta: "Tamil (தமிழ்)",
  mr: "Marathi (मराठी)",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, lang } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const safeHistory = Array.isArray(history) ? history : [];

    // Append translation instructions directly to the system prompt
    let systemPrompt = CHAT_SYSTEM_PROMPT;
    const selectedLang = lang === "auto" ? "en" : lang;
    const langName = LANG_NAMES[selectedLang];
    
    if (langName) {
      systemPrompt = `${systemPrompt}\n\nIMPORTANT: The user has selected their language preference as ${langName}. You MUST respond completely in ${langName} using its native script (e.g. Devanagari script for Hindi, Bengali script for Bengali, Tamil script for Tamil, Marathi script for Marathi). Do not respond in English or any other language unless explicitly requested by the user. Transliterate or translate all scheme titles, eligibility rules, and portals accordingly.`;
    }

    const reply = await generateChat(systemPrompt, safeHistory, message);

    return NextResponse.json<ChatResponse>({ reply });
  } catch (error) {
    console.error("[/api/chat] error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `AI service error: ${msg}` },
      { status: 500 }
    );
  }
}
