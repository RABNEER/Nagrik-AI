"use client";

import { useApp, LANG_LABELS, type Lang } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Globe, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/translations";

type NavItem = {
  path: string;
  labelKey: string;
};

const NAV: NavItem[] = [
  { path: "/services", labelKey: "nav.services" },
  { path: "/schemes", labelKey: "nav.schemes" },
  { path: "/docs", labelKey: "nav.docs" },
  { path: "/chat", labelKey: "nav.chat" },
  { path: "/scam", labelKey: "nav.scam" },
  { path: "/grievance", labelKey: "nav.grievance" },
];

export function Header() {
  const { lang, setLang } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Spacer so content doesn't get hidden under fixed header */}
      <div className={cn("transition-all duration-500", isScrolled ? "h-14" : "h-20")} />

      <header
        className={cn(
          "fixed z-50 transition-all duration-500",
          isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
        )}
      >
        <nav
          className={cn(
            "mx-auto transition-all duration-500",
            isScrolled || isMobileMenuOpen
              ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
              : "bg-background/50 backdrop-blur-md max-w-[1400px]"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-500 px-6 lg:px-8",
              isScrolled ? "h-14" : "h-20"
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
              aria-label="NagrikAI home"
            >
              <span
                className={cn(
                  "font-serif tracking-tight text-foreground transition-all duration-500",
                  isScrolled ? "text-xl" : "text-2xl"
                )}
              >
                NagrikAI
              </span>
              <span
                className={cn(
                  "text-muted-fg font-mono transition-all duration-500",
                  isScrolled ? "text-[10px] mt-0.5" : "text-xs mt-1"
                )}
              >
                TM
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-12">
              {NAV.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "text-sm relative group transition-all duration-300",
                      active
                        ? "text-trust font-semibold"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {t(item.labelKey)}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-px bg-trust transition-all duration-300 group-hover:w-full",
                        active ? "w-full bg-trust" : "w-0 bg-foreground"
                      )}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA (Language Selector) */}
            <div className="hidden md:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-full text-muted-fg hover:text-foreground text-[14px] font-medium"
                    aria-label="Select language"
                  >
                    <Globe className="h-4 w-4" />
                    <span>{LANG_LABELS[lang]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border border-border">
                  {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                    <DropdownMenuItem
                      key={l}
                      onClick={() => setLang(l)}
                      className={cn(
                        "cursor-pointer text-sm py-2 px-3 flex items-center hover:bg-muted transition-colors",
                        lang === l && "font-bold text-trust"
                      )}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      {LANG_LABELS[l]}
                      {lang === l && <span className="ml-auto text-trust">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Actions Group */}
            <div className="flex items-center gap-1 md:hidden">
              {/* Language Selector (Mobile) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-full text-muted-fg hover:text-foreground px-2"
                    aria-label="Select language"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-xs uppercase">{lang}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border border-border">
                  {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                    <DropdownMenuItem
                      key={l}
                      onClick={() => setLang(l)}
                      className={cn(
                        "cursor-pointer text-sm py-2 px-3 flex items-center",
                        lang === l && "font-bold text-trust"
                      )}
                    >
                      {LANG_LABELS[l]}
                      {lang === l && <span className="ml-auto text-trust">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-foreground focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Full Screen Overlay */}
        <div
          className={cn(
            "md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 flex flex-col px-8 pt-28 pb-8",
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          style={{ top: 0 }}
        >
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            {NAV.map((link, i) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-5xl font-serif text-foreground hover:text-muted-foreground transition-all duration-500",
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  pathname === link.path && "text-trust font-bold"
                )}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>

          {/* Bottom Language Selector for Mobile Menu */}
          <div
            className={cn(
              "flex flex-col gap-3 pt-8 border-t border-foreground/10 transition-all duration-500",
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-fg">Choose Language</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold border border-border transition-colors",
                    lang === l ? "bg-trust text-white border-trust" : "bg-card text-foreground"
                  )}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
