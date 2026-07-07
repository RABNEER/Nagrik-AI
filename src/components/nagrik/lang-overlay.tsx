"use client";

import { useEffect, useState } from "react";
import { useApp, type Lang } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

type LangOption = {
  code: Lang;
  name: string;
  nativeName: string;
};

const OPTIONS: LangOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "auto", name: "Auto-Detect", nativeName: "स्वचालित" },
];

export function LanguageOverlay() {
  const { lang, setLang } = useApp();
  const [isOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    const selected = localStorage.getItem("nagrik-lang-selected");
    return !selected;
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("nagrik-lang");
    if (savedLang) {
      setLang(savedLang as Lang);
    }
  }, [setLang]);

  const handleSelect = (code: Lang) => {
    setLang(code);
    localStorage.setItem("nagrik-lang", code);
    localStorage.setItem("nagrik-lang-selected", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-xl flex items-center justify-center p-6 animate-[msg-in_0.35s_ease_forwards]">
      <div className="bg-card border border-border rounded-2xl max-w-xl w-full shadow-2xl p-8 relative flex flex-col gap-6 text-center">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-trust/10 text-trust flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-foreground">
              Choose Language / भाषा चुनें
            </h2>
            <p className="text-sm text-muted-fg mt-2 max-w-sm mx-auto">
              Select your primary language for government schemes & AI conversation.
            </p>
          </div>
        </div>

        {/* Accent Bar */}
        <div className="accent-line w-24 mx-auto" />

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => handleSelect(opt.code)}
              className="hover-lift border border-border bg-card rounded-xl p-4 flex flex-col items-center gap-1.5 cursor-pointer text-center hover:border-trust transition-all duration-300 focus:outline-none"
            >
              <span className="text-base font-bold text-foreground">{opt.nativeName}</span>
              <span className="text-xs text-muted-fg font-mono uppercase">{opt.name}</span>
            </button>
          ))}
        </div>

        <p className="text-[10px] text-muted-fg mt-2">
          * You can always change this language setting from the navigation menu.
        </p>
      </div>
    </div>
  );
}
