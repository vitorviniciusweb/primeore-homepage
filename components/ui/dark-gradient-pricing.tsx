import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Benefit {
  text: string;
  checked: boolean;
}

export interface PricingCardProps {
  tier: string;
  price: string;
  bestFor: string;
  benefits: Benefit[];
  note?: string;
  cta: string;
  ctaVariant?: "default" | "ghost";
  ctaHref: string;
  highlighted?: boolean;
  highlightedLabel?: string;
  className?: string;
}

export function PricingCard({
  tier,
  price,
  bestFor,
  benefits,
  note,
  cta,
  ctaVariant = "default",
  ctaHref,
  highlighted = false,
  highlightedLabel = "Recomendado",
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-gradient-to-b p-8",
        highlighted
          ? "border-accent/40 from-background-soft to-background shadow-[0_0_48px_-8px_rgba(255,107,53,0.25)]"
          : "border-foreground/10 from-background-soft to-background",
        className
      )}
    >
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold tracking-wide">
            {highlightedLabel}
          </span>
        </div>
      )}

      {/* Tier */}
      <p className="font-display text-xs font-bold text-foreground-dim uppercase tracking-[0.18em] mb-5">
        {tier}
      </p>

      {/* Price */}
      <p className="font-display text-3xl md:text-4xl font-bold text-foreground leading-none mb-2">
        {price}
      </p>

      {/* Best for */}
      <p className="text-foreground-dim text-sm mb-7">{bestFor}</p>

      <hr className="border-foreground/10 mb-7" />

      {/* Benefits */}
      <ul className="space-y-3 flex-1 mb-8">
        {benefits.map((benefit) => (
          <li key={benefit.text} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                benefit.checked
                  ? "bg-accent text-background"
                  : "bg-foreground/10 text-foreground-dim"
              )}
            >
              {benefit.checked ? (
                <Check className="h-3 w-3" strokeWidth={3} />
              ) : (
                <X className="h-3 w-3" strokeWidth={2.5} />
              )}
            </span>
            <span
              className={cn(
                "text-sm leading-relaxed",
                benefit.checked ? "text-foreground-dim" : "text-foreground-dim/40"
              )}
            >
              {benefit.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Optional note */}
      {note && (
        <p className="text-xs text-foreground-dim mb-5 leading-relaxed">{note}</p>
      )}

      {/* CTA */}
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "block w-full text-center px-6 py-3 rounded-full font-semibold text-sm transition-colors",
          ctaVariant === "default"
            ? "bg-accent text-white hover:bg-accent/90"
            : "border border-foreground/20 text-foreground hover:bg-foreground/5"
        )}
      >
        {cta}
      </a>
    </div>
  );
}
