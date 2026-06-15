const WA_URL =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20um%20or%C3%A7amento.";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-md bg-background/80">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex-shrink-0 font-display text-xl font-bold text-foreground tracking-tight outline-none focus-visible:underline focus-visible:decoration-accent">
          prime<span className="text-accent">ore</span>
        </a>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs md:px-5 md:py-2 md:text-sm bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-colors"
        >
          Falar no WhatsApp
        </a>
      </div>
    </header>
  );
}
