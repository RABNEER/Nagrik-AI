"use client";

import { useApp } from "@/lib/store";
import { GOVT_SERVICES } from "@/lib/services-data";
import { MessageSquare, ShieldCheck, FileText, ArrowRight, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AnimatedSphere } from "./animated-sphere";
import { useTranslation } from "@/lib/translations";

export function Hero() {
  const { goChatWith } = useApp();
  const [animatedTitle] = useState<React.ReactNode[]>(() => {
    const text = "NagrikAI";
    return Array.from(text).map((char, i) => (
      <span
        key={i}
        className="inline-block opacity-0 animate-[char-reveal_0.45s_cubic-bezier(0.22,1,0.36,1)_forwards]"
        style={{ animationDelay: `${i * 0.06}s` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  });
  const { t } = useTranslation();

  // Popular services to preview on the landing page
  const featured = ["pm-kisan", "aadhaar", "ayushman-bharat", "pmay", "e-shram", "digilocker"]
    .map((id) => GOVT_SERVICES.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <div className="animate-fade-up">
      {/* Hero Section */}
      <section id="hero" className="relative pt-6 pb-20 md:pt-10 md:pb-28 lg:pt-12 lg:pb-32 overflow-hidden noise-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            {/* Left Content Column */}
            <div className="max-w-2xl md:col-span-3">
              <h1 id="hero-title" className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight animate-char-in">
                {animatedTitle.length > 0 ? animatedTitle : "NagrikAI"}
              </h1>
              <div className="accent-line w-16 mt-6 mb-6"></div>
              <p className="text-lg md:text-xl text-muted-fg leading-relaxed max-w-lg">
                {t("hero.desc")}
              </p>
            </div>

            {/* Right Sphere Column (JARVIS AI Vibe) */}
            <div className="md:col-span-2 flex justify-center items-center">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-border bg-card shadow-sm p-4 relative flex items-center justify-center">
                {/* Embedded Sphere Canvas */}
                <AnimatedSphere />
                {/* Overlay ring glow */}
                <div className="absolute inset-0 rounded-full border-2 border-trust/10 pointer-events-none animate-pulse" />
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <Link
              href="/chat"
              className="hover-lift group text-left bg-card border border-border rounded-lg p-5 flex flex-col gap-3 cursor-pointer focus:outline-none"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-trust/10 text-trust group-hover:bg-trust group-hover:text-white transition-colors duration-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-foreground">{t("hero.ask_title")}</p>
                <p className="text-sm text-muted-fg mt-0.5">{t("hero.ask_desc")}</p>
              </div>
            </Link>

            <Link
              href="/scam"
              className="hover-lift group text-left bg-card border border-border rounded-lg p-5 flex flex-col gap-3 cursor-pointer focus:outline-none"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-trust/10 text-trust group-hover:bg-trust group-hover:text-white transition-colors duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-foreground">{t("hero.scam_title")}</p>
                <p className="text-sm text-muted-fg mt-0.5">{t("hero.scam_desc")}</p>
              </div>
            </Link>

            <Link
              href="/grievance"
              className="hover-lift group text-left bg-card border border-border rounded-lg p-5 flex flex-col gap-3 cursor-pointer focus:outline-none"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-trust/10 text-trust group-hover:bg-trust group-hover:text-white transition-colors duration-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-foreground">{t("hero.grievance_title")}</p>
                <p className="text-sm text-muted-fg mt-0.5">{t("hero.grievance_desc")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-12 border-t border-b border-border bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-trust/10 text-trust self-start">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold">{t("hero.pillar1_title")}</h3>
              <p className="text-sm text-muted-fg leading-relaxed">
                {t("hero.pillar1_desc")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-trust/10 text-trust self-start">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold">{t("hero.pillar2_title")}</h3>
              <p className="text-sm text-muted-fg leading-relaxed">
                {t("hero.pillar2_desc")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-trust/10 text-trust self-start">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold">{t("hero.pillar3_title")}</h3>
              <p className="text-sm text-muted-fg leading-relaxed">
                {t("hero.pillar3_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular services */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl tracking-tight">{t("hero.popular")}</h2>
            <p className="text-sm text-muted-fg mt-1">{t("hero.popular_sub")}</p>
          </div>
          <Link
            href="/services"
            className="flex items-center gap-1.5 text-sm font-semibold text-trust hover:underline cursor-pointer focus:outline-none"
          >
            {t("hero.view_all")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <Link
              key={s!.id}
              href="/chat"
              onClick={() => goChatWith(`Tell me about ${s!.name}: eligibility, documents required, fees, and the official portal.`)}
              className="text-left hover-lift bg-card border border-border rounded-lg p-5 flex flex-col gap-3 cursor-pointer focus:outline-none"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[15px] font-semibold text-foreground">{s!.name}</h3>
                <span
                  className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold",
                    s!.fee === "Free"
                      ? "bg-success/10 text-success"
                      : s!.fee === "Nominal fee"
                      ? "bg-trust/10 text-trust"
                      : "bg-muted text-muted-fg"
                  )}
                >
                  {s!.fee}
                </span>
              </div>
              <p className="text-sm text-muted-fg leading-relaxed flex-1 line-clamp-2">
                {s!.description}
              </p>
              <span className="text-xs font-semibold text-trust hover:underline self-start">
                {t("hero.ask_about_this")}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
