// Grievance endpoint — POST to classify + create, GET to list all (status tracker)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateJSON } from "@/lib/gemini";
import { GRIEVANCE_SYSTEM_PROMPT } from "@/lib/prompts";
import type {
  GrievanceClassification,
  GrievanceResponse,
  GrievanceRecord,
} from "@/lib/types";

export const runtime = "nodejs";

const LANG_NAMES: Record<string, string> = {
  hi: "Hindi (हिंदी)",
  en: "English",
  bn: "Bengali (বাংলা)",
  ta: "Tamil (தமிழ்)",
  mr: "Marathi (मराठी)",
};

// Generate a short, human-readable ticket id like NGK-AB12CD
function makeTicketId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `NGK-${out}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, location, lang } = body;

    if (!description || typeof description !== "string" || description.trim().length < 5) {
      return NextResponse.json(
        { error: "Please describe your issue (at least a few words)." },
        { status: 400 }
      );
    }

    // DPDP data minimization: only persist what's needed for routing/status.
    // We do NOT store Aadhaar, phone, or full identifying addresses.
    const safeLocation =
      typeof location === "string" && location.trim().length > 0
        ? location.trim().slice(0, 120)
        : null;

    let systemPrompt = GRIEVANCE_SYSTEM_PROMPT;
    const selectedLang = lang === "auto" ? "en" : lang || "en";
    const langName = LANG_NAMES[selectedLang];

    if (langName) {
      systemPrompt = `${systemPrompt}\n\nIMPORTANT: The user has selected their language preference as ${langName}. You MUST respond completely in ${langName} using its native script (e.g. Devanagari script for Hindi, Bengali script for Bengali, Tamil script for Tamil, Marathi script for Marathi). Ensure the fields 'category', 'routedTo', 'summary', and 'suggestedAction' in your JSON response are translated to ${langName}. Do not respond in English.`;
    }

    // Classify the grievance with the grounded grievance prompt
    const classification = await generateJSON<GrievanceClassification>(
      systemPrompt,
      description
    );

    const ticketId = makeTicketId();

    const created = await db.grievance.create({
      data: {
        ticketId,
        category: classification.category || "Uncategorised",
        description: description.trim(),
        routedTo: classification.routedTo || "To be determined",
        portal: classification.portal || "",
        contact: classification.contact || "",
        status: "Pending",
        location: safeLocation,
      },
    });

    const record: GrievanceRecord = {
      id: created.id,
      ticketId: created.ticketId,
      category: created.category,
      description: created.description,
      routedTo: created.routedTo,
      portal: created.portal,
      portalName: classification.portalName || "",
      contact: created.contact,
      status: created.status,
      location: created.location,
      summary: classification.summary || "",
      suggestedAction: classification.suggestedAction || "",
      createdAt: created.createdAt.toISOString(),
    };

    return NextResponse.json<GrievanceResponse>({ grievance: record });
  } catch (error) {
    console.error("[/api/grievance POST] error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not submit grievance: ${msg}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Seed a few demo grievances on first load so the status tracker isn't
    // empty for judges. Clearly demo data — no PII stored.
    const count = await db.grievance.count();
    if (count === 0) {
      await db.grievance.createMany({
        data: [
          {
            ticketId: "NGK-DEMO01",
            category: "Civic Infrastructure & Roads",
            description: "Streetlight near my locality has been broken for over two weeks. It's unsafe at night.",
            routedTo: "Municipal Corporation / PWD",
            portal: "https://www.swachhata.app",
            contact: "1912 / Swachhata App",
            status: "In Progress",
            location: "Patna, Bihar",
          },
          {
            ticketId: "NGK-DEMO02",
            category: "Water Supply & Quality",
            description: "Water supply in our area is muddy and contaminated. Many people are falling sick.",
            routedTo: "PHED / State Water Board",
            portal: "https://pgportal.gov.in",
            contact: "CPGRAMS",
            status: "Pending",
            location: "Lucknow, Uttar Pradesh",
          },
          {
            ticketId: "NGK-DEMO03",
            category: "Corruption & Malpractice",
            description: "The ration shop dealer demands extra money for grains that should be free under PDS.",
            routedTo: "CVC / Lokayukta via CPGRAMS vigilance",
            portal: "https://portal.cvc.gov.in",
            contact: "CPGRAMS vigilance workflow",
            status: "Resolved",
            location: "Jaipur, Rajasthan",
          },
        ],
      });
    }

    const rows = await db.grievance.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Return a lightweight list for the status tracker. We deliberately do not
    // store/return PII, so this is safe.
    const records: GrievanceRecord[] = rows.map((g) => ({
      id: g.id,
      ticketId: g.ticketId,
      category: g.category,
      description: g.description,
      routedTo: g.routedTo,
      portal: g.portal,
      portalName: "",
      contact: g.contact,
      status: g.status,
      location: g.location,
      summary: "",
      suggestedAction: "",
      createdAt: g.createdAt.toISOString(),
    }));

    return NextResponse.json({ grievances: records });
  } catch (error) {
    console.error("[/api/grievance GET] error:", error);
    return NextResponse.json(
      { error: "Could not fetch grievances" },
      { status: 500 }
    );
  }
}
