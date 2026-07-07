"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/lib/store";
import {
  GOVT_SERVICES,
  SERVICE_CATEGORIES,
  type ServiceCategory,
  type GovtService,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";
import { Search, ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/translations";

const getDocsList = (s: GovtService) => {
  if (!s.documents) return [];
  const list = [
    ...(s.documents.proofOfIdentity || []),
    ...(s.documents.proofOfAddress || []),
    ...(s.documents.proofOfDob || []),
    ...(s.documents.specific || []),
  ];
  return Array.from(new Set(list.filter(Boolean)));
};

export function ServiceDirectory() {
  const goChatWith = useApp((s) => s.goChatWith);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<ServiceCategory | "All">("All");
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GOVT_SERVICES.filter((s) => {
      const matchCat = activeCat === "All" || s.category === activeCat;
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.nodalDepartment.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCat]);

  const grouped = useMemo(() => {
    const map = new Map<ServiceCategory, GovtService[]>();
    for (const s of filtered) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return map;
  }, [filtered]);

  return (
    <section id="services" className="py-16 md:py-24 animate-fade-up">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="mb-12">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight">{t("services.title")}</h2>
          <p className="text-muted-fg text-base md:text-lg mt-3 max-w-2xl">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
          {/* Categories */}
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Service categories">
            <button
              onClick={() => setActiveCat("All")}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all cursor-pointer focus:outline-none",
                activeCat === "All"
                  ? "bg-trust border-trust text-white shadow-sm"
                  : "bg-card border-border text-muted-fg hover:border-muted-fg/40 hover:text-foreground"
              )}
              role="tab"
              aria-selected={activeCat === "All"}
            >
              {t("services.all")}
            </button>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCat(cat.name)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all cursor-pointer focus:outline-none",
                  activeCat === cat.name
                    ? "bg-trust border-trust text-white shadow-sm"
                    : "bg-card border-border text-muted-fg hover:border-muted-fg/40 hover:text-foreground"
                )}
                role="tab"
                aria-selected={activeCat === cat.name}
              >
                {cat.name === "Identified Scam Schemes" ? t("services.scam_filters") : cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("services.search")}
              className="w-full bg-card border-2 border-border rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:border-ring transition-colors placeholder:text-muted-fg/60"
              aria-label="Search services"
            />
          </div>
        </div>

        {/* Grouped Services Grid */}
        <div className="space-y-12">
          {Array.from(grouped.entries()).map(([cat, list]) => (
            <div key={cat} className="space-y-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-fg border-l-2 border-trust pl-3">
                {cat === "Identified Scam Schemes" ? t("services.scam_filters") : cat}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {list.map((s) => {
                  const docs = getDocsList(s);
                  return (
                    <div
                      key={s.id}
                      className={cn(
                        "hover-lift bg-card border rounded-lg p-5 flex flex-col justify-between gap-5 min-h-[220px]",
                        s.category === "Identified Scam Schemes"
                          ? "border-destructive/20 shadow-[0_2px_10px_-3px_rgba(239,68,68,0.1)]"
                          : "border-border shadow-sm"
                      )}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <h4 className="text-base font-semibold leading-tight text-foreground">{s.name}</h4>
                          <span
                            className={cn(
                              "text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold",
                              s.fee === "Free"
                                ? "bg-success/10 text-success"
                                : s.fee === "Nominal fee"
                                ? "bg-trust/10 text-trust"
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                            )}
                          >
                            {s.fee}
                          </span>
                        </div>
                        <p className="text-sm text-muted-fg leading-relaxed line-clamp-3 mb-4">{s.description}</p>
                      </div>

                      <div className="flex flex-col gap-2 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-fg">{t("services.official_fee")}:</span>
                          <span className="font-semibold text-foreground truncate max-w-[160px]" title={s.feeDetail}>{s.feeDetail}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-fg">{t("services.documents")}:</span>
                          <span className="font-semibold text-foreground text-right truncate max-w-[160px]" title={docs.join(", ")}>
                            {docs.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-muted-fg">{t("services.portal")}:</span>
                          {s.portal ? (
                            <a
                              href={s.portal}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[11px] text-trust hover:underline"
                            >
                              <span>Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-muted-fg">None (Scam Scheme)</span>
                          )}
                        </div>
                        <button
                          onClick={() => goChatWith(`Tell me about ${s.name}: eligibility, documents required, fees, and the official portal.`)}
                          className="mt-3 text-left text-xs font-semibold text-trust hover:underline cursor-pointer focus:outline-none self-start"
                        >
                          {t("services.ask")} →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-card rounded-lg border border-border p-12 text-center text-muted-fg">
              <p className="text-sm">No services found matching your query.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
