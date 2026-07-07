"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { ScamVerdict } from "@/lib/types";
import { ShieldCheck, ShieldAlert, ExternalLink, RotateCcw, Loader2, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { useApp } from "@/lib/store";

const EXAMPLES = [
  {
    label: "Fake PM-Kisan renewal",
    text: "Dear PM-Kisan beneficiary, your ₹2000 installment is pending. Pay ₹50 renewal fee at pmkisan-update.com before today to activate. Reply STOP to opt out.",
  },
  {
    label: "Aadhaar suspension threat",
    text: "URGENT: Your Aadhaar will be SUSPENDED! Update immediately at aadhar-renew.in and pay ₹100 processing fee. Click: bit.ly/aadhaar-update-now",
  },
  {
    label: "Ayushman card + WhatsApp",
    text: "Your Ayushman Bharat card is approved! Pay ₹10 processing fee on WhatsApp 9876543210 to activate your ₹5,00,000 health card. Send Aadhaar + OTP to confirm.",
  },
  {
    label: "Legitimate message",
    text: "Visit uidai.gov.in to check your Aadhaar enrolment status. No payment is required for Aadhaar services. — UIDAI",
  },
];

export function ScamShield() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<ScamVerdict | null>(null);
  const { t } = useTranslation();
  const lang = useApp((s) => s.lang);

  async function check(text?: string) {
    const content = (text ?? input).trim();
    if (!content) {
      toast({ title: "Paste a message first", variant: "destructive" });
      return;
    }
    if (text) setInput(text);
    setLoading(true);
    setVerdict(null);
    try {
      const res = await fetch("/api/scam-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setVerdict(data.verdict);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast({
        title: "Couldn't analyse message",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setInput("");
    setVerdict(null);
  }

  const isScam = verdict?.verdict.includes("Likely Scam") || verdict?.verdict.includes("घोटाला");
  const isLegit = verdict?.verdict.includes("Legitimate") || verdict?.verdict.includes("आधिकारिक");
  const isUnsure = verdict && !isScam && !isLegit;

  return (
    <section id="scam-shield" className="py-16 md:py-24 animate-fade-up">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-trust/10 text-trust">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight">{t("scam.title")}</h2>
          </div>
          <p className="text-muted-fg text-base md:text-lg mb-8">
            {t("scam.subtitle")}
          </p>
        </div>

        <div className="max-w-3xl">
          <div className="bg-card rounded-lg border border-border shield-border p-6">
            <label htmlFor="scam-input" className="block text-sm font-medium mb-2">
              {t("scam.label")}
            </label>
            <textarea
              id="scam-input"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-ring transition-colors placeholder:text-muted-fg/60"
              placeholder={t("scam.placeholder")}
              aria-describedby="scam-hint"
              disabled={loading}
            />
            <p id="scam-hint" className="text-xs text-muted-fg mt-2 mb-4">
              {t("scam.hint")}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                id="scam-analyze-btn"
                onClick={() => void check()}
                disabled={loading || !input.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg bg-trust text-white text-sm font-medium hover:bg-trust/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("chat.analyzing")}
                  </>
                ) : (
                  t("chat.analyze")
                )}
              </button>
              {(input || verdict) && (
                <button
                  onClick={reset}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-fg hover:text-foreground cursor-pointer focus:outline-none min-h-[44px] px-3"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t("scam.clear")}
                </button>
              )}
            </div>

            {/* Example chips */}
            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-muted-fg">{t("scam.try_sample")}</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => void check(ex.text)}
                    disabled={loading}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-left text-xs font-medium text-foreground shadow-sm transition-colors hover:border-trust hover:bg-trust/5 disabled:opacity-50 cursor-pointer focus:outline-none"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Result Area */}
            {verdict && (
              <div id="scam-result" className="mt-6 border-t border-border pt-6 animate-[msg-in_0.25s_ease_forwards]" role="alert" aria-live="assertive">
                <div
                  id="scam-verdict"
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg mb-4 animate-[verdict-pulse_2s_infinite_ease-in-out]",
                    isScam && "bg-destructive/10 text-destructive border border-destructive/20",
                    isLegit && "bg-success/10 text-success border border-success/20",
                    isUnsure && "bg-trust/10 text-trust border border-trust/20"
                  )}
                >
                  <span id="scam-icon" className="flex-shrink-0" aria-hidden="true">
                    {isScam && <AlertTriangle className="w-6 h-6" />}
                    {isLegit && <ShieldCheck className="w-6 h-6" />}
                    {isUnsure && <HelpCircle className="w-6 h-6" />}
                  </span>
                  <div>
                    <p id="scam-verdict-text" className="text-base font-semibold leading-tight">
                      {verdict.verdict}
                    </p>
                    <p id="scam-verdict-sub" className="text-xs mt-1 opacity-80">
                      {t("scam.confidence")}: {verdict.confidence}
                    </p>
                  </div>
                </div>

                {verdict.officialPortal && (
                  <div id="scam-official" className="mb-4 bg-background border border-border rounded-lg p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-fg mb-1.5">
                      {t("scam.correct_portal")}
                    </p>
                    <a
                      id="scam-official-url"
                      href={verdict.officialPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs text-trust hover:underline break-all focus:outline-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                      <span>{verdict.officialPortal}</span>
                    </a>
                  </div>
                )}

                <div
                  id="scam-explanation"
                  className="text-sm leading-relaxed bg-background border border-border rounded-lg p-4 text-muted-fg space-y-3"
                >
                  <p className="font-semibold text-foreground">{t("scam.analysis_details")}</p>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs">
                    {verdict.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  {verdict.redFlags.length > 0 && (
                    <div className="pt-2">
                      <p className="font-semibold text-destructive text-xs">{t("scam.red_flags")}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {verdict.redFlags.map((flag, idx) => (
                          <span
                            key={idx}
                            className="bg-destructive/10 text-destructive text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border">
                    <p className="font-semibold text-foreground text-xs">{t("scam.safe_checklist")}</p>
                    <p className="text-xs mt-1">{verdict.safeAction}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
