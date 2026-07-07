"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { GrievanceRecord } from "@/lib/types";
import { Send, Loader2, MapPin, ExternalLink, Ticket, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { useApp } from "@/lib/store";

const EXAMPLES = [
  "Streetlight near my house has been broken for 2 weeks and it's unsafe at night",
  "Water supply in our area is contaminated and muddy for the past week",
  "Electricity goes out every evening for 3 hours, no one is fixing it",
  "The ration shop dealer demands extra money grain grains that should be free",
];

export function GrievanceReport() {
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrievanceRecord | null>(null);
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const { t } = useTranslation();
  const lang = useApp((s) => s.lang);

  const fetchGrievances = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/grievance");
      if (!res.ok) throw new Error("Failed to load grievances");
      const data = await res.json();
      setGrievances(data.grievances);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void fetchGrievances();
  }, [fetchGrievances]);

  async function submit(text?: string) {
    const desc = (text ?? description).trim();
    if (desc.length < 5) {
      toast({
        title: "Please write more details",
        description: "Grievance description must be at least 5 characters.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc, location, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setResult(data.grievance);
      setDescription("");
      setLocation("");
      toast({
        title: "Grievance Registered",
        description: `Registered ticket: ${data.grievance.ticketId}`,
      });
      void fetchGrievances();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast({
        title: "Could not file grievance",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit();
  };

  return (
    <section id="grievance" className="py-16 md:py-24 animate-fade-up">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* File Grievance Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-trust/10 text-trust">
                <Send className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-3xl tracking-tight">{t("grievance.title")}</h2>
            </div>
            <p className="text-muted-fg text-sm leading-relaxed mb-8">
              {t("grievance.subtitle")}
            </p>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="grievance-desc" className="block text-sm font-medium mb-1.5">
                    {t("grievance.desc_label")}
                  </label>
                  <textarea
                    id="grievance-desc"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-background border-2 border-border rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-ring transition-colors placeholder:text-muted-fg/60"
                    placeholder={t("grievance.desc_placeholder")}
                    aria-describedby="grievance-desc-hint"
                    disabled={loading}
                  />
                  <p id="grievance-desc-hint" className="text-[11px] text-muted-fg mt-1.5">
                    {t("grievance.desc_hint")}
                  </p>
                </div>

                <div>
                  <label htmlFor="grievance-location" className="block text-sm font-medium mb-1.5">
                    {t("grievance.loc_label")}
                  </label>
                  <input
                    id="grievance-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-background border-2 border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-ring transition-colors placeholder:text-muted-fg/60 min-h-[44px]"
                    placeholder={t("grievance.loc_placeholder")}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || description.trim().length < 5}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg bg-trust text-white text-sm font-medium hover:bg-trust/90 transition-colors mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("grievance.routing")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t("grievance.submit")}
                    </>
                  )}
                </button>
              </form>

              {/* Examples */}
              <div className="mt-6 border-t border-border pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-fg">{t("grievance.sample")}</p>
                <div className="flex flex-col gap-2">
                  {EXAMPLES.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => void submit(ex)}
                      disabled={loading}
                      className="text-left text-xs text-muted-fg hover:text-trust hover:underline cursor-pointer focus:outline-none"
                    >
                      • {ex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy/DPDP notice */}
              <div className="mt-6 bg-background rounded-lg border border-border p-4">
                <p className="text-xs text-muted-fg leading-relaxed">
                  {t("grievance.dpdp")}
                </p>
              </div>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="lg:col-span-3">
            {result && (
              <div className="mb-6 bg-card border border-border rounded-lg p-5 animate-[msg-in_0.25s_ease_forwards]">
                <div className="flex items-center gap-2 text-success font-semibold text-sm mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                  {t("grievance.routed_success")} {result.ticketId}
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-trust/10 text-trust">
                      {result.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">
                      Routed
                    </span>
                  </div>
                  <div className="bg-background rounded-lg border border-border p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-fg">{t("grievance.routed_to")}</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{result.routedTo}</p>
                  </div>
                  {result.summary && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-fg">{t("grievance.summary")}</p>
                      <p className="text-sm text-foreground">{result.summary}</p>
                    </div>
                  )}
                  {result.suggestedAction && (
                    <div className="bg-muted rounded-lg border border-border p-3 text-xs text-muted-fg leading-relaxed">
                      <p className="font-semibold text-foreground text-xs mb-1">{t("grievance.next_steps")}</p>
                      {result.suggestedAction}
                    </div>
                  )}
                  {result.portal && (
                    <a
                      href={result.portal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-trust hover:underline focus:outline-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t("grievance.official_link")}
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold">{t("grievance.tracker_title")}</h3>
              <span className="text-xs text-muted-fg font-mono" id="grievance-count">
                {grievances.length} records
              </span>
            </div>

            {loadingList ? (
              <div className="bg-card rounded-lg border border-border p-6 text-center text-muted-fg">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-fg mb-2" />
                <p className="text-sm">Loading complaints...</p>
              </div>
            ) : grievances.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-fg">
                <p className="text-sm">No complaints found. Submit your grievance to track it here.</p>
              </div>
            ) : (
              <div id="grievance-list" className="flex flex-col gap-3">
                {grievances.map((g) => (
                  <div key={g.id} className="hover-lift bg-card rounded-lg border border-border p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold leading-snug text-foreground">{g.description}</p>
                        <p className="text-xs text-muted-fg mt-2 flex items-center gap-1.5 font-mono">
                          <Ticket className="w-3.5 h-3.5 text-trust" />
                          {g.ticketId}
                          {g.location && (
                            <>
                              <span className="text-border">|</span>
                              <MapPin className="w-3 h-3 text-muted-fg" />
                              <span>{g.location}</span>
                            </>
                          )}
                        </p>
                        <div className="mt-2.5 flex items-center gap-4 text-xs text-muted-fg">
                          <span className="font-semibold text-trust">{g.routedTo}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(g.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full",
                          g.status === "Pending" && "bg-muted text-muted-fg",
                          g.status === "In Progress" && "bg-trust/10 text-trust",
                          g.status === "Resolved" && "bg-success/10 text-success"
                        )}
                        role="status"
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            g.status === "Pending" && "bg-muted-fg",
                            g.status === "In Progress" && "bg-trust",
                            g.status === "Resolved" && "bg-success"
                          )}
                          aria-hidden="true"
                        />
                        {g.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
