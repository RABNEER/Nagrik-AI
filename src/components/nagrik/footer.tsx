"use client";

import Link from "next/link";

export function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-8">
      {/* Tricolor Stripe */}
      <div className="tricolor-stripe" aria-hidden="true" />
      <div className="bg-primary text-primary-fg">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <p className="font-serif text-2xl mb-3">NagrikAI</p>
              <p className="text-sm text-primary-fg/60 leading-relaxed max-w-xs">
                Built for the citizens of India. Making government services accessible, understandable, and safe for everyone.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-fg/40 mb-4">Sections</p>
              <div className="flex flex-col gap-2.5">
                <Link href="/services" onClick={handleScrollToTop} className="text-sm text-left text-primary-fg/70 hover:text-primary-fg transition-colors focus:outline-none">
                  Service Directory
                </Link>
                <Link href="/chat" onClick={handleScrollToTop} className="text-sm text-left text-primary-fg/70 hover:text-primary-fg transition-colors focus:outline-none">
                  AI Chat
                </Link>
                <Link href="/scam" onClick={handleScrollToTop} className="text-sm text-left text-primary-fg/70 hover:text-primary-fg transition-colors focus:outline-none">
                  Scam Shield
                </Link>
                <Link href="/grievance" onClick={handleScrollToTop} className="text-sm text-left text-primary-fg/70 hover:text-primary-fg transition-colors focus:outline-none">
                  Grievance Tracker
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-fg/40 mb-4">About</p>
              <div className="flex flex-col gap-2.5">
                <p className="text-sm text-primary-fg/70">Smart Bharat Hackathon Project</p>
                <p className="text-sm text-primary-fg/70">Privacy First (DPDP Act 2023 Aligned)</p>
                <p className="text-sm text-primary-fg/70">Accessibility First (WCAG AA)</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-primary-fg/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-primary-fg/40">&copy; 2026 NagrikAI. Made with care for digital India.</p>
            <p className="text-xs text-primary-fg/40">WCAG AA Compliant · Keyboard Navigable · Screen Reader Friendly</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
