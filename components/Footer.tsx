export default function Footer() {
  return (
    <footer className="bg-background-soft border-t border-border py-8 px-6 text-center">
      <p className="text-foreground-dim text-sm">
        <span className="font-display font-semibold text-foreground">
          prime<span className="text-accent">ore</span>
        </span>{" "}
        · Santos/SP · feito sob medida, projeto por projeto ·{" "}
        <a
          href="https://www.instagram.com/vitorvinicius.primeore"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-dim hover:text-accent transition-colors duration-200 inline-flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
          @vitorvinicius.primeore
        </a>
      </p>
    </footer>
  );
}
