// ============================================================================
// NagrikAI — App Store (Zustand)
// ----------------------------------------------------------------------------
// Lightweight global state for the active view + cross-component chat pre-fill
// (e.g. clicking a service card pre-fills + sends a chat query).
// ============================================================================

import { create } from "zustand";

export type View = "home" | "chat" | "scam" | "grievance" | "services" | "schemes";

export type Lang = "auto" | "hi" | "en" | "bn" | "ta" | "mr";

export const LANG_LABELS: Record<Lang, string> = {
  auto: "Auto",
  hi: "हिंदी",
  en: "English",
  bn: "বাংলা",
  ta: "தமிழ்",
  mr: "मराठी",
};

export const LANG_INSTRUCTIONS: Record<Lang, string> = {
  auto: "",
  hi: "कृपया अपना उत्तर हिंदी में दें।",
  en: "Please respond in English.",
  bn: "অনুগ্রহ করে বাংলায় উত্তর দিন।",
  ta: "தயவுசெய்து தமிழில் பதிலளிக்கவும்।",
  mr: "कृपया मराठीत उत्तर द्या.",
};

interface AppState {
  view: View;
  pendingChat: string | null; // message to pre-fill/send when navigating to chat
  lang: Lang;
  setView: (v: View) => void;
  goChatWith: (message: string) => void; // set view=chat + queue a message
  consumePending: () => string | null; // chat reads & clears pending message
  setLang: (l: Lang) => void;
}

export const useApp = create<AppState>((set, get) => ({
  view: "home",
  pendingChat: null,
  lang: "auto",
  setView: (v) => set({ view: v }),
  goChatWith: (message) => set({ view: "chat", pendingChat: message }),
  consumePending: () => {
    const p = get().pendingChat;
    if (p) set({ pendingChat: null });
    return p;
  },
  setLang: (l) => set({ lang: l }),
}));
