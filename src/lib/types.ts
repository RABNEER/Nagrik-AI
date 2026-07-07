// ============================================================================
// NagrikAI — Shared API Types
// ----------------------------------------------------------------------------

// Chat
export interface ChatRequest {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
}
export interface ChatResponse {
  reply: string;
}

// Scam Shield
export interface ScamVerdict {
  verdict: "⚠️ Likely Scam" | "✅ Appears Legitimate" | "❓ Can't verify — check official portal";
  confidence: "High" | "Medium" | "Low";
  reasons: string[];
  claimedScheme: string;
  realFee: string;
  officialPortal: string;
  safeAction: string;
  redFlags: string[];
}
export interface ScamCheckRequest {
  message: string;
}
export interface ScamCheckResponse {
  verdict: ScamVerdict;
}

// Grievance
export interface GrievanceClassification {
  category: string;
  routedTo: string;
  portal: string;
  portalName: string;
  contact: string;
  summary: string;
  suggestedAction: string;
}
export interface GrievanceRequest {
  description: string;
  location?: string;
}
export interface GrievanceRecord {
  id: string;
  ticketId: string;
  category: string;
  description: string;
  routedTo: string;
  portal: string;
  portalName: string;
  contact: string;
  status: string;
  location: string | null;
  summary: string;
  suggestedAction: string;
  createdAt: string;
}
export interface GrievanceResponse {
  grievance: GrievanceRecord;
}

// Personalized Scheme Recommender
export interface UserProfile {
  state: string;
  age: string;
  gender: string;
  category: string;
  income: string;
}

export interface SchemeRecommendation {
  name: string;
  category: string;
  description: string;
  eligibility: string;
  documents: string[];
  portalLink: string;
}

export interface RecommendResponse {
  recommendations: SchemeRecommendation[];
}

// Document Analyzer
export interface DocAnalysis {
  docType: string;
  isComplete: boolean;
  extractedFields: Record<string, string>;
  issues: string[];
  recommendations: string[];
}
