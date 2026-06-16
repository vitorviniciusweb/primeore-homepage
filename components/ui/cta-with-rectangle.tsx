"use client";

import { cn } from "@/lib/utils";

const pushWaClick = () => {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: "whatsapp_click",
      event_category: "Lead",
      event_label: "WhatsApp Primeore",
    });
  }
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface CTAAction {
  text: string;
  href: string;
  variant?: "default" | "outline";
}

export interface CTASectionProps {
  title: string;
  description?: string;
  action: CTAAction;
  withGlow?: boolean;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function CTASection({
  title,
  description,
  action,
  withGlow = false,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background py-24 px-6",
        className
      )}
    >
      {/* Subtle radial bg glow behind the rectangle */}
      {withGlow && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 50% 100%, hsl(var(--brand) / 0.35), transparent)",
          }}
        />
      )}

      {/* Rectangle card */}
      <div
        className={cn(
          "relative mx-auto max-w-container w-full rounded-3xl border border-foreground/10 bg-background-soft/50 backdrop-blur-sm px-8 py-16 text-center animate-fade-in-up",
          withGlow && "shadow-glow"
        )}
      >
        {/* Title */}
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5 animate-fade-in">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-foreground-dim text-lg mb-10 max-w-xl mx-auto animate-fade-in">
            {description}
          </p>
        )}

        {/* CTA button */}
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={pushWaClick}
          className={cn(
            "inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-base transition-colors animate-scale-in",
            action.variant === "outline"
              ? "border border-foreground/20 text-foreground hover:bg-foreground/5"
              : "bg-accent text-background hover:bg-accent/90"
          )}
        >
          {action.text}
        </a>
      </div>
    </section>
  );
}
