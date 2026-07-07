// Scam Shield endpoint — analyses suspicious messages and returns a verdict
import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import { SCAM_SHIELD_SYSTEM_PROMPT } from "@/lib/prompts";
import type { ScamCheckResponse, ScamVerdict } from "@/lib/types";

export const runtime = "nodejs";

const LANG_NAMES: Record<string, string> = {
  hi: "Hindi (हिंदी)",
  en: "English",
  bn: "Bengali (বাংলা)",
  ta: "Tamil (தமிழ்)",
  mr: "Marathi (मराठी)",
};

export async function POST(req: NextRequest) {
  let selectedLang = "en";
  try {
    const body = await req.json();
    const { message, lang } = body;
    selectedLang = lang === "auto" ? "en" : lang || "en";

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Suspicious message text is required" },
        { status: 400 }
      );
    }

    let systemPrompt = SCAM_SHIELD_SYSTEM_PROMPT;
    const langName = LANG_NAMES[selectedLang];

    if (langName) {
      systemPrompt = `${systemPrompt}\n\nIMPORTANT: The user has selected their language preference as ${langName}. You MUST respond completely in ${langName} using its native script (e.g. Devanagari script for Hindi, Bengali script for Bengali, Tamil script for Tamil, Marathi script for Marathi). Ensure all JSON fields like 'verdict', 'reasons', and 'safeAction' are written in ${langName}. Do not respond in English.`;
    }

    const verdict = await generateJSON<ScamVerdict>(
      systemPrompt,
      message
    );

    // Defensive: ensure arrays exist
    if (!Array.isArray(verdict.reasons)) verdict.reasons = [];
    if (!Array.isArray(verdict.redFlags)) verdict.redFlags = [];

    return NextResponse.json<ScamCheckResponse>({ verdict });
  } catch (error) {
    console.error("[/api/scam-check] error:", error);
    
    // Localized fallbacks
    const isHi = selectedLang === "hi";
    const isBn = selectedLang === "bn";
    const isTa = selectedLang === "ta";
    const isMr = selectedLang === "mr";

    const defaultVerdict = isHi
      ? "❓ सत्यापित नहीं किया जा सकता — आधिकारिक पोर्टल की जाँच करें"
      : isBn
      ? "❓ যাচাই করা যাচ্ছে না — অফিসিয়াল পোর্টাল চেক করুন"
      : isTa
      ? "❓ சரிபார்க்க முடியவில்லை — அதிகாரப்பூர்வ தளத்தை சரிபார்க்கவும்"
      : isMr
      ? "❓ पडताळणी करता येत नाही — अधिकृत पोर्टल तपासा"
      : "❓ Can't verify — check official portal";

    const defaultReason = isHi
      ? "हम इस समय संदेश का विश्लेषण नहीं कर सके। कृपया सीधे आधिकारिक सरकारी पोर्टल पर जाएँ।"
      : isBn
      ? "আমরা এই মুহূর্তে এই বার্তাটি বিশ্লেষণ করতে পারিনি। অনুগ্রহ করে সরাসরি অফিসিয়াল পোর্টাল চেক করুন।"
      : isTa
      ? "எங்களால் இந்த செய்தியை பகுப்பாய்வு செய்ய முடியவில்லை. நேரடியாக அதிகாரப்பூர்வ தளத்திற்கு செல்லவும்."
      : isMr
      ? "आम्ही सध्या या संदेशाचे विश्लेषण करू शकलो नाही. कृपया अधिकृत पोर्टलला भेट द्या."
      : "We couldn't analyse this message right now. Please verify directly on the official government portal.";

    const defaultSafe = isHi
      ? "कोई शुल्क न दें या विवरण साझा न करें। अपनी स्थिति की जांच करने के लिए सीधे आधिकारिक सरकारी पोर्टल पर जाएं।"
      : isBn
      ? "কোন ফি প্রদান করবেন না বা বিবরণ শেয়ার করবেন না। সরাসরি অফিসিয়াল পোর্টালে যান।"
      : isTa
      ? "எந்த கட்டணமும் செலுத்த வேண்டாம், தகவல்களை பகிர வேண்டாம். நேரடியாக அதிகாரப்பூர்வ தளத்திற்கு செல்லவும்."
      : isMr
      ? "कोणतेही शुल्क देऊ नका किंवा माहिती सामायिक करू नका. थेट अधिकृत सरकारी पोर्टलला भेट द्या."
      : "Do not pay or share any details. Visit the official government portal directly to check your status.";

    return NextResponse.json<ScamCheckResponse>({
      verdict: {
        verdict: defaultVerdict,
        confidence: "Low",
        reasons: [defaultReason],
        claimedScheme: "Unknown",
        realFee: "N/A",
        officialPortal: "https://www.myScheme.gov.in",
        safeAction: defaultSafe,
        redFlags: ["Analysis service temporarily unavailable"],
      },
    });
  }
}
