"use client";

const pushWaClick = () => {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: "whatsapp_click",
      event_category: "Lead",
      event_label: "WhatsApp Primeore",
    });
  }
};

const WA_URL =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20um%20or%C3%A7amento.";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-md bg-background/80">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex-shrink-0 font-display text-xl font-bold text-foreground tracking-tight outline-none focus-visible:underline focus-visible:decoration-accent">
          prime<span className="text-accent">ore</span>
        </a>
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/vitorvinicius.primeore"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da Primeore"
            className="text-foreground-dim hover:text-accent transition-colors duration-200"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={pushWaClick}
            className="inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs md:px-5 md:py-2 md:text-sm bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
