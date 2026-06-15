"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Testimonial {
  src: string;
  name: string;
  designation: string;
  quote: string;
}

interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}

interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}

export interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
  style?: React.CSSProperties;
}

// ─── Image position: center large, sides smaller with rotateY depth ────────────
function getImageStyle(
  index: number,
  activeIndex: number,
  total: number
): React.CSSProperties {
  const raw = ((index - activeIndex) % total + total) % total;
  const pos = raw > Math.floor(total / 2) ? raw - total : raw;
  const absPos = Math.abs(pos);
  const dir = pos > 0 ? 1 : pos < 0 ? -1 : 0;

  if (absPos > 1) return { display: "none" };

  if (absPos === 0) {
    return {
      zIndex: 3,
      transform: "translateX(0px) scale(1) rotateY(0deg)",
      opacity: 1,
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  }

  return {
    zIndex: 2,
    transform: `translateX(${dir * 155}px) scale(0.85) rotateY(${dir * -15}deg)`,
    opacity: 0.65,
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function CircularTestimonials({
  testimonials,
  autoplay = false,
  colors = {},
  fontSizes = {},
  style,
}: CircularTestimonialsProps) {
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [autoplay, next]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const activeTestimonial = testimonials[active];

  return (
    <div className="w-full" style={style}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-center">

        {/* Left: image stack with 3D perspective */}
        <div
          className="relative h-72 md:h-[32rem] flex items-center justify-center overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          {testimonials.map((t, i) => {
            const raw = ((i - active) % total + total) % total;
            const pos = raw > Math.floor(total / 2) ? raw - total : raw;
            const absPos = Math.abs(pos);
            const imgStyle = getImageStyle(i, active, total);
            if (imgStyle.display === "none") return null;
            return (
              <button
                key={t.src}
                onClick={() => setActive(i)}
                // Side images hidden on mobile to prevent overflow on narrow screens
                className={`absolute focus:outline-none${absPos > 0 ? " hidden md:block" : ""}`}
                style={{
                  ...imgStyle,
                  width: "280px",
                  height: "380px",
                  borderRadius: "1.5rem",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(242,240,235,0.1)",
                  cursor: i === active ? "default" : "pointer",
                }}
                aria-label={`Ver slide ${i + 1}`}
              >
                <Image
                  src={t.src}
                  alt={t.name}
                  width={280}
                  height={380}
                  className="w-full h-full object-cover object-top"
                  priority={i === 0}
                />
              </button>
            );
          })}
        </div>

        {/* Right: animated text + controls */}
        <div className="flex flex-col">

          {/* Quote: word-by-word blur/fade triggered by key change */}
          <div key={active} className="mb-6 leading-relaxed min-h-[160px]">
            <p
              style={{
                color: colors.testimony ?? "var(--foreground-dim)",
                fontSize: fontSizes.quote ?? "16px",
              }}
            >
              {activeTestimonial.quote.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut", delay: 0.025 * i }}
                  style={{ display: "inline-block" }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </p>
          </div>

          {/* Name + designation: fade on slide change */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`meta-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <p
                className="font-display font-bold mb-1"
                style={{
                  color: colors.name ?? "var(--foreground)",
                  fontSize: fontSizes.name ?? "22px",
                }}
              >
                {activeTestimonial.name}
              </p>
              <p
                style={{
                  color: colors.designation ?? "var(--foreground-dim)",
                  fontSize: fontSizes.designation ?? "14px",
                }}
              >
                {activeTestimonial.designation}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows + dots */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={prev}
              style={{
                background: colors.arrowBackground ?? "var(--background-soft)",
                color: colors.arrowForeground ?? "var(--foreground)",
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
              aria-label="Anterior"
            >
              <FaArrowLeft size={13} />
            </button>

            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="w-2 h-2 rounded-full transition-all duration-300 focus:outline-none"
                  style={{
                    background:
                      i === active
                        ? (colors.arrowHoverBackground ?? "var(--accent)")
                        : "var(--foreground-dim)",
                    opacity: i === active ? 1 : 0.35,
                    transform: i === active ? "scale(1.4)" : "scale(1)",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              style={{
                background: colors.arrowBackground ?? "var(--background-soft)",
                color: colors.arrowForeground ?? "var(--foreground)",
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
              aria-label="Proximo"
            >
              <FaArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
