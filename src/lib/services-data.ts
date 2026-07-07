// ============================================================================
// NagrikAI — Government Service Reference Dataset
// ----------------------------------------------------------------------------
// This structured dataset grounds ALL AI responses. It is embedded into the
// Gemini system prompt so every answer is grounded in real, verified service
// information — not hallucinated. This is the core of the trust-first design.
// ============================================================================

export type ServiceFee = "Free" | "Nominal fee" | "Paid";

export interface GovtService {
  id: string;
  name: string;
  category: ServiceCategory;
  nodalDepartment: string;
  portal: string;
  description: string;
  fee: ServiceFee;
  feeDetail: string;
  documents: {
    proofOfIdentity: string[];
    proofOfAddress: string[];
    proofOfDob: string[];
    specific: string[];
  };
}

export type ServiceCategory =
  | "Identity & Documents"
  | "Welfare & Financial Support"
  | "Health"
  | "Housing"
  | "Agriculture"
  | "Employment"
  | "Grievance & Transparency";

export const SERVICE_CATEGORIES: { name: ServiceCategory; icon: string }[] = [
  { name: "Identity & Documents", icon: "IdCard" },
  { name: "Welfare & Financial Support", icon: "HandCoins" },
  { name: "Health", icon: "HeartPulse" },
  { name: "Housing", icon: "Home" },
  { name: "Agriculture", icon: "Wheat" },
  { name: "Employment", icon: "Briefcase" },
  { name: "Grievance & Transparency", icon: "Scale" },
];

export const GOVT_SERVICES: GovtService[] = [
  // ── Identity & Documents ──────────────────────────────────────────────
  {
    id: "aadhaar",
    name: "Aadhaar",
    category: "Identity & Documents",
    nodalDepartment: "UIDAI (Unique Identification Authority of India)",
    portal: "https://uidai.gov.in",
    description: "12-digit unique identity number linked to biometric and demographic data.",
    fee: "Free",
    feeDetail: "Enrolment is FREE. Only updates have a small fee (₹50-₹100) at centres.",
    documents: {
      proofOfIdentity: ["PAN card", "Driving licence", "Voter ID", "Ration card"],
      proofOfAddress: ["Electricity bill", "Bank statement", "Passport", "Ration card"],
      proofOfDob: ["Birth certificate", "SSC certificate", "Passport"],
      specific: ["Biometric capture (fingerprints + iris) at enrolment centre"],
    },
  },
  {
    id: "pan",
    name: "PAN Card",
    category: "Identity & Documents",
    nodalDepartment: "Income Tax Department / NSDL & UTIITSL",
    portal: "https://www.protean-tinpan.com (NSDL) / https://www.utiitsl.com",
    description: "10-character alphanumeric Permanent Account Number for tax purposes.",
    fee: "Nominal fee",
    feeDetail: "₹107 (India address) / ₹1017 (foreign address) for new PAN via NSDL.",
    documents: {
      proofOfIdentity: ["Aadhaar", "Voter ID", "Driving licence", "Passport"],
      proofOfAddress: ["Aadhaar", "Electricity bill", "Bank statement"],
      proofOfDob: ["Birth certificate", "Aadhaar", "Matriculation certificate"],
      specific: ["Photograph (passport size)"],
    },
  },
  {
    id: "voter-id",
    name: "Voter ID / EPIC",
    category: "Identity & Documents",
    nodalDepartment: "Election Commission of India (CEO of respective state)",
    portal: "https://voters.eci.gov.in",
    description: "Electoral Photo Identity Card (EPIC) required to vote in elections.",
    fee: "Free",
    feeDetail: "FREE for new registration, corrections, and EPIC issuance.",
    documents: {
      proofOfIdentity: ["Aadhaar", "Driving licence", "PAN card"],
      proofOfAddress: ["Utility bill", "Bank statement", "Ration card"],
      proofOfDob: ["Birth certificate", "Aadhaar", "Class 10 certificate"],
      specific: ["Passport-size photograph", "Form 6 (new voter) / Form 8 (correction)"],
    },
  },
  {
    id: "ration-card",
    name: "Ration Card / PDS",
    category: "Identity & Documents",
    nodalDepartment: "State Food & Civil Supplies Department",
    portal: "https://nfsa.gov.in (state portals vary)",
    description: "Document for subsidized foodgrains under Public Distribution System (NFSA).",
    fee: "Free",
    feeDetail: "FREE to apply. No fee for issuance of ration card.",
    documents: {
      proofOfIdentity: ["Aadhaar of all members", "Voter ID"],
      proofOfAddress: ["Electricity bill", "Rent agreement", "Bank passbook"],
      proofOfDob: ["Aadhaar", "Birth certificate"],
      specific: ["Income certificate", "Surrender certificate of old card (if any)"],
    },
  },
  {
    id: "digilocker",
    name: "DigiLocker",
    category: "Identity & Documents",
    nodalDepartment: "NeGD, Ministry of Electronics & IT (MeitY)",
    portal: "https://www.digilocker.gov.in",
    description: "Cloud platform to store and share government-issued documents digitally.",
    fee: "Free",
    feeDetail: "FREE to sign up and use. 1 GB free cloud storage.",
    documents: {
      proofOfIdentity: ["Aadhaar (used for verification)", "Mobile linked to Aadhaar"],
      proofOfAddress: ["Aadhaar"],
      proofOfDob: ["Aadhaar"],
      specific: ["Active mobile number linked to Aadhaar for OTP"],
    },
  },

  // ── Welfare & Financial Support ───────────────────────────────────────
  {
    id: "pm-kisan",
    name: "PM-Kisan Samman Nidhi",
    category: "Welfare & Financial Support",
    nodalDepartment: "Ministry of Agriculture & Farmers Welfare",
    portal: "https://pmkisan.gov.in",
    description: "₹6,000/year income support to small & marginal farmer families in 3 installments.",
    fee: "Free",
    feeDetail: "FREE to register. NO registration or renewal fee ever. Government pays YOU.",
    documents: {
      proofOfIdentity: ["Aadhaar", "Land records (khata/khatauni)"],
      proofOfAddress: ["Aadhaar"],
      proofOfDob: ["Aadhaar"],
      specific: ["Land ownership proof (patta/khata)", "Bank account details", "Mobile number"],
    },
  },
  {
    id: "pm-jan-dhan",
    name: "PM Jan Dhan Yojana",
    category: "Welfare & Financial Support",
    nodalDepartment: "Ministry of Finance / Department of Financial Services",
    portal: "https://pmjdy.gov.in",
    description: "Zero-balance bank account with RuPay debit card, accident insurance & overdraft.",
    fee: "Free",
    feeDetail: "FREE — zero minimum balance. No account opening fee.",
    documents: {
      proofOfIdentity: ["Aadhaar", "Voter ID", "PAN"],
      proofOfAddress: ["Aadhaar", "Utility bill"],
      proofOfDob: ["Aadhaar", "Birth certificate"],
      specific: ["One passport-size photograph", "Bank account opening form"],
    },
  },
  {
    id: "nps",
    name: "National Pension System (NPS)",
    category: "Welfare & Financial Support",
    nodalDepartment: "PFRDA (Pension Fund Regulatory & Development Authority)",
    portal: "https://www.npstrust.org.in",
    description: "Voluntary, long-term retirement savings contribution pension scheme.",
    fee: "Nominal fee",
    feeDetail: "Low-cost. No joining fee; minimal transaction charges (₹15-₹35 per contribution).",
    documents: {
      proofOfIdentity: ["PAN (mandatory)", "Aadhaar"],
      proofOfAddress: ["Aadhaar", "Utility bill"],
      proofOfDob: ["Aadhaar", "PAN"],
      specific: ["NPS registration form", "Bank account details", "Nominee details"],
    },
  },

  // ── Health ────────────────────────────────────────────────────────────
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat (PMJAY)",
    category: "Health",
    nodalDepartment: "National Health Authority (NHA)",
    portal: "https://pmjay.gov.in",
    description: "₹5 lakh/year health cover per family for secondary & tertiary hospitalisation.",
    fee: "Free",
    feeDetail: "FREE for eligible families. NO premium, NO card fee, NO renewal fee ever.",
    documents: {
      proofOfIdentity: ["Aadhaar", "Ration card"],
      proofOfAddress: ["Aadhaar", "Ration card"],
      proofOfDob: ["Aadhaar", "Birth certificate"],
      specific: ["Family roster/SECC data", "Mobile number", "Family ID (state-dependent)"],
    },
  },

  // ── Housing ───────────────────────────────────────────────────────────
  {
    id: "pmay",
    name: "PM Awas Yojana (Urban + Gramin)",
    category: "Housing",
    nodalDepartment: "MoHUA (Urban) / Ministry of Rural Development (Gramin)",
    portal: "https://pmaymis.gov.in (Urban) / https://pmayg.nic.in (Gramin)",
    description: "Housing assistance for economically weaker sections to build/buy a pucca house.",
    fee: "Free",
    feeDetail: "FREE to apply. Subsidy/assistance is GIVEN to beneficiary. No application fee.",
    documents: {
      proofOfIdentity: ["Aadhaar", "Voter ID"],
      proofOfAddress: ["Aadhaar", "Ration card"],
      proofOfDob: ["Aadhaar", "Birth certificate"],
      specific: ["Income certificate", "Caste certificate (if applicable)", "Bank passbook", "Land documents"],
    },
  },

  // ── Agriculture ───────────────────────────────────────────────────────
  {
    id: "pm-ujjwala",
    name: "PM Ujjwala Yojana",
    category: "Agriculture",
    nodalDepartment: "Ministry of Petroleum & Natural Gas",
    portal: "https://www.pmuy.gov.in",
    description: "Free LPG connection to women from BPL households with first refill & stove.",
    fee: "Free",
    feeDetail: "FREE LPG connection (with stove + first refill). No connection fee for eligible.",
    documents: {
      proofOfIdentity: ["Aadhaar of woman applicant"],
      proofOfAddress: ["Aadhaar", "Ration card"],
      proofOfDob: ["Aadhaar"],
      specific: ["BPL/Socio-Economic Caste Census data", "Bank account details", "Passport photo"],
    },
  },

  // ── Employment ────────────────────────────────────────────────────────
  {
    id: "e-shram",
    name: "e-SHRAM",
    category: "Employment",
    nodalDepartment: "Ministry of Labour & Employment",
    portal: "https://eshram.gov.in",
    description: "National database of unorganised workers with accident insurance (₹2 lakh).",
    fee: "Free",
    feeDetail: "FREE to register. NO fee. Get accident insurance cover upon registration.",
    documents: {
      proofOfIdentity: ["Aadhaar (mandatory)", "Mobile linked to Aadhaar"],
      proofOfAddress: ["Aadhaar"],
      proofOfDob: ["Aadhaar"],
      specific: ["Bank account details", "Occupation details", "Income details"],
    },
  },
  {
    id: "mgnrega",
    name: "MGNREGA Job Card",
    category: "Employment",
    nodalDepartment: "Ministry of Rural Development",
    portal: "https://nregapro.nic.in",
    description: "Guarantees 100 days of wage employment/year to rural households on demand.",
    fee: "Free",
    feeDetail: "FREE to apply for job card. NO fee. Wages are PAID to worker.",
    documents: {
      proofOfIdentity: ["Aadhaar", "Voter ID"],
      proofOfAddress: ["Ration card", "Aadhaar"],
      proofOfDob: ["Aadhaar", "Birth certificate"],
      specific: ["Photograph of household members", "Bank/post office account details"],
    },
  },
  {
    id: "epf",
    name: "Employees' Provident Fund (EPF)",
    category: "Employment",
    nodalDepartment: "EPFO (Employees' Provident Fund Organisation)",
    portal: "https://www.epfindia.gov.in",
    description: "Retirement savings scheme for salaried employees (12% employer + 12% employee).",
    fee: "Free",
    feeDetail: "FREE for employees. Contributions are deducted from salary, not an extra fee.",
    documents: {
      proofOfIdentity: ["Aadhaar", "PAN"],
      proofOfAddress: ["Aadhaar", "Utility bill"],
      proofOfDob: ["Aadhaar", "PAN"],
      specific: ["UAN (Universal Account Number)", "Bank account details", "Employer details"],
    },
  },
  {
    id: "scholarship",
    name: "National Scholarship Portal",
    category: "Employment",
    nodalDepartment: "Ministry of Education / Various Ministries",
    portal: "https://scholarships.gov.in",
    description: "Single portal for all central & state scholarships for students.",
    fee: "Free",
    feeDetail: "FREE to apply. Scholarship money is DISBURSED to student. No application fee.",
    documents: {
      proofOfIdentity: ["Aadhaar", "Student ID"],
      proofOfAddress: ["Aadhaar", "Parent's address proof"],
      proofOfDob: ["Aadhaar", "Birth certificate"],
      specific: ["Mark sheets / income certificate", "Bank account details", "Institute verification certificate"],
    },
  },

  // ── Grievance & Transparency ──────────────────────────────────────────
  {
    id: "rtps",
    name: "RTPS Certificates (Bihar / State e-Services)",
    category: "Grievance & Transparency",
    nodalDepartment: "State IT Department / General Administration",
    portal: "https://serviceonline.bihar.gov.in (varies by state)",
    description: "Online issuance of caste, income & residence certificates within a fixed timeframe.",
    fee: "Nominal fee",
    feeDetail: "Usually free or a minimal state fee (₹0-₹40). Never large sums.",
    documents: {
      proofOfIdentity: ["Aadhaar", "Voter ID"],
      proofOfAddress: ["Aadhaar", "Ration card"],
      proofOfDob: ["Aadhaar", "Birth certificate"],
      specific: ["Application form (specific to certificate)", "Photograph", "Supporting docs per certificate type"],
    },
  },
  {
    id: "rti",
    name: "Right to Information (RTI)",
    category: "Grievance & Transparency",
    nodalDepartment: "Concerned Public Authority / State Information Commission",
    portal: "https://rtionline.gov.in (central) / state RTI portals",
    description: "Right to request information from any public authority within 30 days.",
    fee: "Nominal fee",
    feeDetail: "₹10 application fee (central). FREE for BPL applicants. NO other fees.",
    documents: {
      proofOfIdentity: ["Aadhaar", "Any photo ID"],
      proofOfAddress: ["Aadhaar", "Utility bill"],
      proofOfDob: ["Aadhaar"],
      specific: ["BPL certificate (for fee waiver)", "Specific questions for the public authority"],
    },
  },
  {
    id: "vahan-sarathi",
    name: "Vahan / Sarathi (RTO Services)",
    category: "Identity & Documents",
    nodalDepartment: "Ministry of Road Transport & Highways (MoRTH)",
    portal: "https://parivahan.gov.in",
    description: "Vehicle registration (Vahan) & driving licence (Sarathi) services online.",
    fee: "Paid",
    feeDetail: "Statutory fees apply (RC, licence fees per Central Motor Vehicles Rules). NOT free.",
    documents: {
      proofOfIdentity: ["Aadhaar", "PAN"],
      proofOfAddress: ["Aadhaar", "Utility bill"],
      proofOfDob: ["Birth certificate", "Aadhaar", "SSC certificate"],
      specific: ["For licence: medical certificate, learner's licence", "For RC: vehicle invoice, insurance, pollution cert"],
    },
  },
  {
    id: "jeevan-pramaan",
    name: "Jeevan Pramaan (Digital Life Certificate)",
    category: "Welfare & Financial Support",
    nodalDepartment: "Ministry of Electronics & IT (MeitY)",
    portal: "https://jeevanpramaan.gov.in",
    description: "Digital life certificate for pensioners, removes need for physical visit to bank.",
    fee: "Free",
    feeDetail: "FREE. Biometric authentication via Aadhaar. No fee charged.",
    documents: {
      proofOfIdentity: ["Aadhaar (mandatory)"],
      proofOfAddress: ["Aadhaar"],
      proofOfDob: ["Aadhaar", "Pension Payment Order (PPO)"],
      specific: ["PPO number", "Bank account number", "Mobile linked to Aadhaar", "Biometric device"],
    },
  },
];

// Quick lookup for the Scam Shield to cross-check fees
export const FREE_SERVICES = GOVT_SERVICES.filter((s) => s.fee === "Free").map((s) => s.name);
export const PAID_SERVICES = GOVT_SERVICES.filter((s) => s.fee === "Paid").map((s) => s.name);

// Official portal domains — used by Scam Shield to flag non-official links
export const OFFICIAL_DOMAINS = GOVT_SERVICES.map((s) => {
  try {
    return new URL(s.portal).hostname.replace(/^www\./, "");
  } catch {
    return s.portal;
  }
});

export function getServiceById(id: string): GovtService | undefined {
  return GOVT_SERVICES.find((s) => s.id === id);
}
