// Schemes Recommendation API endpoint
import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import type { UserProfile, SchemeRecommendation } from "@/lib/types";

export const runtime = "nodejs";

const LANG_NAMES: Record<string, string> = {
  hi: "Hindi (हिंदी)",
  en: "English",
  bn: "Bengali (বাংলা)",
  ta: "Tamil (தமிழ்)",
  mr: "Marathi (मराठी)",
};

const ADVISOR_SYSTEM_PROMPT = `You are a professional government scheme advisor for Indian citizens. Your goal is to simplify complex government information and help citizens find welfare programs they qualify for.

Given the user's profile, recommend 4-6 highly relevant welfare, subsidy, educational, agricultural, or health schemes (central or state-level).

You must return a raw JSON object matching the following structure:
{
  "recommendations": [
    {
      "name": "Scheme name in native script or official title",
      "category": "Badge category (e.g. Agriculture, Health, Education, Financial Assistance)",
      "description": "Short description of the scheme and its benefits",
      "eligibility": "Summary of eligibility requirements and why the profile matches",
      "documents": ["Required document 1", "Required document 2"],
      "portalLink": "Official HTTPS URL link to apply or check status"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, lang } = body as { profile: UserProfile; lang: string };

    if (!profile) {
      return NextResponse.json({ error: "User profile details are required" }, { status: 400 });
    }

    const selectedLang = lang === "auto" ? "en" : lang || "en";
    const langName = LANG_NAMES[selectedLang];

    let systemPrompt = ADVISOR_SYSTEM_PROMPT;
    if (langName) {
      systemPrompt = `${systemPrompt}\n\nIMPORTANT: The user has selected their language preference as ${langName}. You MUST write the scheme names, categories, descriptions, eligibility, and document titles completely in ${langName} using its native script (e.g. Devanagari script for Hindi, Tamil script for Tamil, Bengali script for Bengali, Marathi script for Marathi). Do not write in English.`;
    }

    const userMessage = `User Profile:
State: ${profile.state}
Age: ${profile.age}
Gender: ${profile.gender}
Social Category: ${profile.category}
Annual Household Income: ₹${profile.income}`;

    const data = await generateJSON<{ recommendations: SchemeRecommendation[] }>(
      systemPrompt,
      userMessage
    );

    const recommendations = Array.isArray(data?.recommendations) ? data.recommendations : [];

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("[/api/recommend] error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Recommendation service error: ${msg}` },
      { status: 500 }
    );
  }
}
