"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WA_URL =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20um%20or%C3%A7amento.";

// ─── Fade-up variants for text elements ───────────────────────────────────────
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5 + i * 0.2,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

// ─── Floating geometric shape ─────────────────────────────────────────────────
interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-accent/[0.15]",
}: ElegantShapeProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduce
          ? { opacity: 0.6 }
          : { opacity: 0, y: -150, rotate: rotate - 15 }
      }
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: shouldReduce ? 0 : 2.4,
        delay: shouldReduce ? 0 : delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={shouldReduce ? {} : { y: [0, 15, 0] }}
        transition={{
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className={cn(
          "rounded-full border-2 border-foreground/[0.08]",
          "bg-gradient-to-r to-transparent",
          gradient
        )}
      />
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
}

export default function HeroGeometric({
  badge = "Santos / SP — sites para empresas locais",
  title1 = "Sua empresa existe.",
  title2 = "Agora ela precisa aparecer.",
}: HeroGeometricProps) {
  const shouldReduce = useReducedMotion();

  // When reduced-motion is on, skip the hidden→visible transition (jump to end)
  const textInitial = shouldReduce ? false : ("hidden" as const);
  const textAnimate = "visible" as const;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.05] via-transparent to-steel/[0.05]" />

      {/* Geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={-15}
          gradient="from-accent/[0.15]"
          className="-top-[60px] -left-[80px]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-25}
          gradient="from-steel/[0.15]"
          className="top-[15%] -right-[60px]"
        />
        <ElegantShape
          delay={0.4}
          width={320}
          height={80}
          rotate={20}
          gradient="from-accent/[0.15]"
          className="bottom-[25%] left-[3%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={-8}
          gradient="from-steel/[0.15]"
          className="top-[42%] left-[28%]"
        />
        <ElegantShape
          delay={0.7}
          width={160}
          height={44}
          rotate={18}
          gradient="from-accent/[0.15]"
          className="bottom-[12%] right-[18%]"
        />
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={shouldReduce ? undefined : fadeUpVariants}
          initial={textInitial}
          animate={textAnimate}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/[0.08] bg-foreground/[0.03] mb-8"
        >
          <svg
            width="6"
            height="6"
            viewBox="0 0 6 6"
            className="flex-shrink-0"
            aria-hidden
          >
            <circle cx="3" cy="3" r="3" fill="#FF6B35" fillOpacity="0.8" />
          </svg>
          <span className="text-xs text-foreground-dim tracking-[0.15em] uppercase">
            {badge}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          custom={1}
          variants={shouldReduce ? undefined : fadeUpVariants}
          initial={textInitial}
          animate={textAnimate}
        >
          <h1 className="font-display font-bold tracking-tight leading-[1.2] pt-3 mb-8">
            <span className="block text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent py-1">
              {title1}
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-r from-accent via-foreground/90 to-steel bg-clip-text text-transparent italic py-1">
              {title2}
            </span>
          </h1>
        </motion.div>

        {/* Paragraph */}
        <motion.p
          custom={2}
          variants={shouldReduce ? undefined : fadeUpVariants}
          initial={textInitial}
          animate={textAnimate}
          className="text-base sm:text-lg text-foreground-dim max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Criamos sites institucionais profissionais para empresários de Santos
          que ainda não têm presença online — ou têm uma que não representa o
          que o negócio realmente é.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={shouldReduce ? undefined : fadeUpVariants}
          initial={textInitial}
          animate={textAnimate}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-colors"
          >
            Quero meu site <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-foreground font-medium underline underline-offset-4 hover:text-accent transition-colors"
          >
            Ver projetos feitos
          </a>
        </motion.div>
      </div>
    </div>
  );
}
