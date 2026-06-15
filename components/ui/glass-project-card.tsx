"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

// ─── Accent theme map (static strings — Tailwind detects every class) ──────────
type AccentKey = "accent" | "steel" | "gold";

const accentMap: Record<AccentKey, { hoverBorder: string; overlayBtn: string }> = {
  accent: { hoverBorder: "hover:border-accent/50", overlayBtn: "bg-accent text-white" },
  steel: { hoverBorder: "hover:border-steel/50", overlayBtn: "bg-steel text-white" },
  gold: { hoverBorder: "hover:border-gold/50", overlayBtn: "bg-gold text-background" },
};

// ─── Props ─────────────────────────────────────────────────────────────────────
export interface GlassProjectCardProps {
  title: string;
  description: string;
  badges: [string, string];
  logo: string;
  href: string;
  accentColor: AccentKey;
  index?: number;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function GlassProjectCard({
  title,
  description,
  badges,
  logo,
  href,
  accentColor,
  index = 0,
}: GlassProjectCardProps) {
  const shouldReduce = useReducedMotion();
  const theme = accentMap[accentColor];

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: shouldReduce ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className={`group block rounded-2xl border border-foreground/10 bg-background-soft/40 backdrop-blur-md overflow-hidden hover:shadow-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground/30 ${theme.hoverBorder}`}
    >
      {/* ── Image area ── */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={logo}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Readability gradient at base of image */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />

        {/* Hover overlay with CTA button */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold ${theme.overlayBtn}`}
          >
            Ver site <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        {/* Badges — bottom of image area, above gradient */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
          {badges.map((label) => (
            <span
              key={label}
              className="text-xs text-foreground tracking-wide uppercase bg-foreground/15 backdrop-blur-sm border border-foreground/20 rounded-full px-3 py-1"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Text content ── */}
      <div className="p-6">
        <h3 className="font-display font-semibold text-foreground text-xl mb-2">
          {title}
        </h3>
        <p className="text-foreground-dim text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.a>
  );
}
