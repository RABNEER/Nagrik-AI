// Document Analyzer API endpoint using Gemini Vision
import { NextRequest, NextResponse } from "next/server";
import type { DocAnalysis } from "@/lib/types";

export const runtime = "nodejs";

const LANG_NAMES: Record<string, string> = {
  hi: "Hindi (हिंदी)",
  en: "English",
  bn: "Bengali (বাংলা)",
  ta: "Tamil (தமிழ்)",
  mr: "Marathi (मराठी)",
};

const DOC_ANALYZE_PROMPT = `You are a professional government document verification assistant for Indian citizens.
Analyze the provided document image and extract details. For security and privacy (DPDP Act compliance):
- MASK all sensitive ID numbers except the last 4 digits (e.g., replace '123456789012' with 'XXXX-XXXX-9012').
- Do not extract any phone numbers or sensitive private biometric markers.

Return a raw JSON object matching the following structure:
{
  "docType": "Document Name (e.g. Aadhaar Card, PAN Card, Voter ID, Ration Card, Driving License)",
  "isComplete": true/false (true if readable and all critical fields are present),
  "extractedFields": {
    "Name": "Extracted name",
    "ID Number": "XXXX-XXXX-1234",
    "Date of Birth": "DD/MM/YYYY or YYYY if only year is present",
    "State / Address": "State name or partial address"
  },
  "issues": ["Issue 1 (e.g. Blurry photo, missing signature, address looks old)"],
  "recommendations": ["Recommendation 1 (e.g. Ensure the photo is clear, link with PAN card, update address online)"]
}`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const lang = formData.get("lang") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Read the file and convert to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY environment variable on server" }, { status: 500 });
    }
    const selectedLang = lang === "auto" ? "en" : lang || "en";
    const langName = LANG_NAMES[selectedLang];

    let userPrompt = DOC_ANALYZE_PROMPT;
    if (langName) {
      userPrompt = `${userPrompt}\n\nIMPORTANT: The user has selected their language preference as ${langName}. You MUST write all fields like 'docType', 'extractedFields' values, 'issues', and 'recommendations' completely in ${langName} using its native script. Do not write in English.`;
    }

    // Call Gemini 1.5 Flash Vision API directly
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: userPrompt },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );
    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) {
      console.error("[/api/doc-analyze] Gemini Vision failed:", data);
      return NextResponse.json(
        { error: data?.error?.message || "Failed to analyze document" },
        { status: res.status }
      );
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("Empty response from vision model");
    }

    // Strip formatting and parse JSON
    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    const analysis = JSON.parse(cleaned) as DocAnalysis;

    // Defensive: ensure lists are arrays
    if (!Array.isArray(analysis.issues)) analysis.issues = [];
    if (!Array.isArray(analysis.recommendations)) analysis.recommendations = [];
    if (!analysis.extractedFields || typeof analysis.extractedFields !== "object") {
      analysis.extractedFields = {};
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("[/api/doc-analyze] error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Document analyzer error: ${msg}` },
      { status: 500 }
    );
  }
}
