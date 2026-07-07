# NagrikAI — Your Trusted AI Companion for Every Government Service

> A GenAI-powered civic companion for Indian citizens. Built for the **"Smart Bharat"** hackathon.
> **Trust-first by design:** unlike generic "gov chatbot" submissions, NagrikAI doesn't just answer questions — it actively **protects citizens from scams** impersonating government schemes, and is built on **DPDP Act 2023** data-minimization principles from the ground up.

---

## 🇮🇳 What NagrikAI Does

NagrikAI is a multi-page Next.js web application with six core GenAI capabilities:

| Feature | What it does |
|---|---|
| **AI Chat Companion** | Ask any question about government schemes in plain language. Get grounded answers in your language. Features **Groq Whisper STT** for accurate voice input. |
| **Scam Shield** ⭐ | Paste a suspicious message. We cross-check claimed fees against real fee structures and verify URLs against official government domains to detect fraud. |
| **Personalized Scheme Finder** ⭐ | Fill out a simple demographic profile (state, age, social category, income range) to discover central and state government schemes you qualify for. |
| **AI Document Analyzer** ⭐ | Upload photos of Aadhaar / PAN cards. The AI Vision system checks if the document is complete, readable, and masks sensitive info for privacy. |
| **Grievance Reporting & Smart Routing** | Describe any public issue. AI classifies and routes the complaint to the correct state/national portal, issuing a trackable ticket. |
| **Service Directory** | Search and filter 20+ government services in a clean grid. Click any card to instantly ask the AI Companion about it. |

**Key differentiators for judges:** Scam Shield, Document OCR checking, and Groq Whisper. Most civic-tech entries only provide simple FAQ bots. NagrikAI protects, verifies, and personalizes.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui + Lucide icons
- **LLM Integrations:**
  - **Google Gemini API** (`gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-1.5-flash`): Primary engine for chat, scheme matching, and vision-based document OCR.
  - **Groq API** (`llama-3.3-70b`, `mixtral-8x7b`, `whisper-large-v3`): Actively used as the fallback provider to recover from rate limits, and provides the Speech-to-Text transcription.
- **Database:** Prisma ORM + SQLite (grievance tracking storage)
- **State Management:** Zustand (view and language persistence)
- **Deploy target:** Vercel / Standalone Node.js server

> **AI Redundancy Strategy:** NagrikAI implements a self-healing LLM chain. If the Gemini API rate limit or quota is exceeded, the server automatically fails over in under 2 seconds to the corresponding Groq model.

---

## 🚀 Setup

```bash
# 1. Install dependencies
bun install   # or npm install

# 2. Set up the database (SQLite, already configured)
bun run db:push

# 3. Run the dev server
bun run dev   # http://localhost:3000

# 4. Lint
bun run lint
```

### 🔑 Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL=file:./db/custom.db
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI Chat Companion endpoint
│   │   ├── stt/route.ts           # Speech-to-Text transcription (Groq Whisper v3)
│   │   ├── recommend/route.ts     # Personalized Scheme Recommender endpoint
│   │   ├── doc-analyze/route.ts   # Document analysis (Gemini Vision OCR)
│   │   ├── scam-check/route.ts    # Scam Shield endpoint (returns JSON verdict)
│   │   └── grievance/route.ts     # POST (classify+create) / GET (list tracker)
│   ├── chat/
│   ├── docs/                      # AI Document Analyzer page
│   ├── grievance/
│   ├── scam/
│   ├── schemes/                   # Personalized Scheme Finder page
│   ├── services/
│   ├── globals.css                # Custom OKLCH palette (instrument fonts)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   └── nagrik/
│       ├── header.tsx             # Nav bar + active language selector
│       ├── footer.tsx             # Responsive footer
│       ├── hero.tsx               # Landing page hero
│       ├── chat-companion.tsx     # Chat component + voice recorder
│       ├── scam-shield.tsx        # Scam detector UI
│       ├── grievance-report.tsx   # Complaint file + live status tracker
│       ├── scheme-recommender.tsx # Personalized profile form & recommendations
│       ├── doc-analyzer.tsx       # Secure document Vision OCR checker
│       └── service-directory.tsx  # Categorized service grid
└── lib/
    ├── services-data.ts           # Service grounding dataset
    ├── prompts.ts                 # Heuristics system prompts
    ├── gemini.ts                  # Fetch client wrapper with Gemini -> Groq fallback
    ├── store.ts                    # Zustand: view + language
    ├── types.ts                    # Shared API contracts
    └── db.ts                       # Prisma client
```

---

## 🧠 Prompt Workflow / Strategy

This is the heart of NagrikAI. Every AI feature is **grounded** in a single structured dataset so responses are accurate, not hallucinated.

### (a) How the service reference data grounds responses

`src/lib/services-data.ts` defines a typed dataset of **20 Indian government services** — Aadhaar, PAN, Voter ID, Ration Card, PM-Kisan, Ayushman Bharat, PM Awas Yojana, e-Shram, RTPS, EPF, Vahan/Sarathi, MGNREGA, PM Ujjwala, DigiLocker, RTI, PM Jan Dhan, NPS, Jeevan Pramaan, National Scholarship Portal, and more.

Each service carries:
- `name`, `category`, `nodalDepartment`
- `portal` — the **official URL** (ground truth for scam URL checks)
- `description` — one-liner
- `fee` — **Free / Nominal fee / Paid** (critical for Scam Shield)
- `feeDetail` — exact fee in ₹
- `documents` — Proof of Identity / Address / DOB / scheme-specific requirements

This dataset is serialized into a Markdown table + structured lists and **embedded directly into the system prompt** (`src/lib/prompts.ts` → `CHAT_SYSTEM_PROMPT`). The model is explicitly instructed: *"You ONLY use the verified service reference dataset below. You never invent portal URLs, fees, or document requirements."* This converts the LLM from a confident guesser into a grounded retrieval-augmented responder.

### (b) Intent detection logic

The chat system prompt instructs the model to detect one of four intents and respond accordingly:

1. **Informational** ("What is PM-Kisan?") → simple explanation + official portal.
2. **Document checklist** ("Documents for Aadhaar?") → grouped checklist (Identity / Address / DOB / Scheme-specific) + portal.
3. **Service recommendation** ("I'm a farmer with 2 acres") → match the citizen's situation to the most relevant scheme(s) from the dataset, explain *why* it fits, list eligibility + documents, and link the portal. Up to 3 recommendations.
4. **Scam check** ("I got a message asking ₹500 for PM-Kisan renewal") → apply Scam Shield logic inline (see below).

Intent is detected from the natural-language query — no rigid keyword matching — so citizens can phrase things any way they like.

### (c) Scam Shield heuristic design

Scam Shield (`SCAM_SHIELD_SYSTEM_PROMPT`) is a separate, stricter prompt that forces a **strict-JSON verdict**. The heuristics, all grounded in the service dataset:

1. **Fee cross-check** — Compare any payment demand against the dataset's `fee`/`feeDetail`. PM-Kisan, Aadhaar, Ayushman Bharat, Voter ID, RTI (BPL), Jan Dhan, e-SHRAM, DigiLocker, Jeevan Pramaan, PM Ujjwala, MGNREGA, PMAY are all **Free**. *Any* demand for money on these = instant red flag. Only Vahan/Sarathi, PAN (₹107), NPS, RTPS (₹0–40), RTI non-BPL (₹10) legitimately charge — and always tiny, always via official channels.
2. **URL / domain check** — Extract links; if the domain is **not** in the official domains list derived from the dataset, flag it. Catches `bit.ly` shorteners, misspelled domains (`pmkisan-update.com`), non-`.gov.in` domains claiming to be government.
3. **Sensitive-info requests** — Aadhaar number, OTP, PAN, bank details, UPI PIN via SMS/WhatsApp = immediate red flag. Government never asks for these via message.
4. **Urgency / threat language** — "Account will be blocked", "Pay now or benefits stopped", "Last date today" = classic scam signatures.
5. **Renewal fee for free schemes** — PM-Kisan, Ayushman, Voter ID, e-SHRAM require **no** renewal fees. Any "renewal" payment demand = scam.
6. **Channel check** — Government communicates via official portals / designated SMS senders / post, not random WhatsApp numbers asking for payment.

The response is a strict JSON object: `verdict`, `confidence`, `reasons[]`, `claimedScheme`, `realFee`, `officialPortal`, `safeAction`, `redFlags[]`. The UI renders this with a color-coded banner (red / green / amber) — visually distinct from the chat so judges immediately recognize it as a separate capability.

### (d) Multilingual handling

**Entirely prompt-based — no translation API.** The chat system prompt instructs: *"Detect the language of the citizen's message and ALWAYS reply in the SAME language."* Minimum support: Hindi (Devanagari), English, Bengali, Tamil, Marathi. The model handles this natively. Official scheme names are never translated.

For extra control, the UI exposes a **language selector** (Auto / हिंदी / English / বাংলা / தமிழ் / मराठी). When a specific language is chosen, a short instruction in that language is prepended to the message sent to the API (e.g. `"कृपया अपना उत्तर हिंदी में दें।"`), overriding auto-detection. In "Auto" mode, the model detects from the user's message. The grievance router similarly writes its summary in the citizen's language while keeping official fields (category, portal) in English.

### (e) Grievance classification logic

`GRIEVANCE_SYSTEM_PROMPT` classifies a free-text complaint into one of **7 jurisdictional categories** and returns the routing authority + portal as strict JSON:

| Category | Routed to | Portal |
|---|---|---|
| Civic Infrastructure & Roads | Municipal Corp / PWD | local portal |
| Sanitation & Waste | Municipal Health Dept | Swachhata App |
| Water Supply & Quality | PHED / Water Board | state PHED portal |
| Electricity | State DISCOM | DISCOM app / 1912 |
| Central Govt Services | CPGRAMS | pgportal.gov.in |
| State Govt Services & Entitlements | State RTPS / Lok Shikayat | state portal |
| Corruption & Malpractice | CVC / Lokayukta | portal.cvc.gov.in |

The model returns `{ category, routedTo, portal, portalName, contact, summary, suggestedAction }`. The server generates a human-readable ticket ID (`NGK-XXXXXX`), persists the grievance with status `Pending`, and returns the full record. A status tracker lists all submissions.

### (f) DPDP-aligned data minimization approach

NagrikAI is built to respect the **Digital Personal Data Protection Act 2023**:

- **We never ask for or store Aadhaar numbers.** The chat UI explicitly warns: *"Never share Aadhaar numbers, OTPs, or passwords in chat."*
- **Grievance records store only routing-essential fields:** category, description, routed authority, portal, status, and an optional coarse location (area/locality, capped at 120 chars). No names, no phone numbers, no house numbers.
- **No auth / no accounts.** Citizens use NagrikAI anonymously. Grievances are tracked by ticket ID, not personal identity.
- **Local-first storage.** The SQLite DB lives on the server; no third-party analytics, no PII shipped to external services. The only external call is to the LLM, which receives the citizen's *question* (not stored identifiers).
- **Scam Shield never persists** the messages citizens paste — they're analysed ephemerally and the verdict is returned without storage.

This is called out in the UI ("Privacy-first: DPDP Act 2023 aligned") so the trust-first framing is visible to judges, not just buried in code.

---

## ✨ Feature Walkthrough

### 1. Landing Page
Hero with the trust-first tagline, four quick-access cards (Ask / Check Suspicious Message / Report Issue / Browse Services), three trust pillars (Scam Shield, DPDP, Multilingual), example prompts, and featured services.

### 2. AI Chat Companion
Conversation UI with markdown rendering, typing indicator, suggestion chips, language-aware responses, and a "never share sensitive info" reminder. Grounded in the 20-service dataset. Clicking any service card or example prompt pre-fills + sends a query.

### 3. Scam Shield ⭐
Distinct red/amber-themed interface. Paste a message or try a sample. Get a color-coded verdict with: claimed scheme, **real fee** (from dataset), reasons, red-flag chips, safe action, and the verified official portal as a safe alternative.

### 4. Personalized Scheme Finder ⭐
A demographic form (State, Age, Gender, Category, Income) that maps matching government schemes. Returns cards showing category, matching logic, required documents checklist, direct links, and a shortcut button to discuss a scheme directly with the AI Chat Companion.

### 5. AI Document Analyzer ⭐
Upload an image of an Aadhaar or PAN card. The AI Vision system scans and parses the document, checks if the photo and details are readable and complete, flags any issues (like blurriness), masks sensitive fields, and lists corrective recommendations.

### 6. Grievance Reporting + Tracker
Describe an issue → AI classifies + routes → get a ticket ID + routing card. A status tracker below shows all complaints (seeded with 3 demo entries so judges see a populated tracker immediately) with Pending / In Progress / Resolved badges.

### 7. Service Directory
Searchable, category-filterable grid of all 20 services. Each card shows the fee badge (Free / Nominal / Paid), nodal department, an "Ask AI" button (pre-fills chat), and a direct link to the official portal.

---

## 🎨 Design Notes

- **Visual identity:** Saffron / white / India-green tricolour accents on a clean civic-blue primary. High-contrast, accessible typography.
- **Scam Shield is visually distinct** — red/amber theme, separate header treatment — so it reads as a separate capability, not "just another chat mode".
- **Mobile-first, responsive** throughout. Large touch targets (44px+). Sticky header with tricolour strip. Sticky footer with trust signals.
- **Accessibility:** semantic HTML (`header`/`main`/`footer`/`section`), ARIA labels on icon buttons, keyboard-operable (Enter to send), screen-reader-friendly markup.

---

## ⚠️ Honest Limitations (for judges)

- **Mocked data where real integration would take too long.** The service dataset is hand-curated and current as of build time — it is *not* a live API. Always verify on official `.gov.in` portals (the app links them).
- **Grievance status** does not sync with real government systems. The tracker shows demo + locally-submitted entries. This is stated in the footer.
- **Scam Shield** is a heuristic classifier, not a guarantee. The "Can't verify" verdict always directs to the official portal.

---

## 📜 License

MIT — built with ❤️ for India.
