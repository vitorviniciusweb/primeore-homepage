"use client";

import { Warp } from "@paper-design/shaders-react";
import { Search, Users, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Shader configs ────────────────────────────────────────────────────────────
type ShaderConfig = {
  colors: string[];
  proportion: number;
  softness: number;
  distortion: number;
  swirl: number;
  speed: number;
};

function getShaderConfig(index: number): ShaderConfig {
  const configs: ShaderConfig[] = [
    // Card 1 — orange tones (#FF6B35)
    {
      colors: [
        "hsl(20, 90%, 28%)",
        "hsl(28, 100%, 65%)",
        "hsl(14, 88%, 38%)",
        "hsl(30, 100%, 58%)",
      ],
      proportion: 0.38,
      softness: 0.75,
      distortion: 0.19,
      swirl: 0.2,
      speed: 0.3,
    },
    // Card 2 — steel blue tones (#3D5A80)
    {
      colors: [
        "hsl(210, 45%, 22%)",
        "hsl(210, 60%, 58%)",
        "hsl(204, 48%, 32%)",
        "hsl(212, 58%, 62%)",
      ],
      proportion: 0.38,
      softness: 0.75,
      distortion: 0.19,
      swirl: 0.2,
      speed: 0.3,
    },
    // Card 3 — warm gold/amber bridging orange and dark background
    {
      colors: [
        "hsl(32, 80%, 28%)",
        "hsl(24, 100%, 52%)",
        "hsl(210, 42%, 26%)",
        "hsl(38, 90%, 55%)",
      ],
      proportion: 0.38,
      softness: 0.75,
      distortion: 0.19,
      swirl: 0.2,
      speed: 0.3,
    },
  ];
  return configs[index];
}

// ─── Per-card theme ────────────────────────────────────────────────────────────
type CardTheme = {
  iconWrapClass: string;
  iconColorClass: string;
  barClass: string;
};

const cardThemes: CardTheme[] = [
  {
    iconWrapClass: "bg-foreground/5 border border-foreground/15",
    iconColorClass: "text-accent",
    barClass: "from-accent/60 via-accent/30 to-transparent",
  },
  {
    iconWrapClass: "bg-foreground/5 border border-foreground/15",
    iconColorClass: "text-steel",
    barClass: "from-steel/60 via-steel/30 to-transparent",
  },
  {
    iconWrapClass: "bg-foreground/5 border border-foreground/15",
    iconColorClass: "text-accent",
    barClass: "from-accent/40 via-steel/30 to-steel/50",
  },
];

// ─── Feature data ──────────────────────────────────────────────────────────────
const features: { Icon: LucideIcon; title: string; description: string }[] = [
  {
    Icon: Search,
    title: "Cliente pesquisa, não encontra",
    description:
      "Sem site, sua empresa não aparece no Google quando alguém busca pelo que você oferece em Santos.",
  },
  {
    Icon: Users,
    title: "Instagram não é cartão de visitas",
    description:
      "Rede social é ferramenta de alcance, não de credibilidade. Um site transmite confiança que o perfil não consegue.",
  },
  {
    Icon: ShieldCheck,
    title: "Credibilidade se constrói visualmente",
    description:
      "Um site bem-feito muda a percepção do cliente antes mesmo de você falar com ele — e vende antes de você abrir a boca.",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function FeatureShaderCards() {
  return (
    <section className="bg-background-soft border-y border-border py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {features.map(({ Icon, title, description }, i) => {
            const theme = cardThemes[i];
            return (
              <div
                key={title}
                className={`relative rounded-3xl overflow-hidden h-full shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300${i === 2 ? " ring-1 ring-foreground/10" : ""}`}
              >
                {/* Warp shader — fills the card background */}
                <Warp
                  className="absolute inset-0 w-full h-full"
                  {...getShaderConfig(i)}
                />

                {/* Card overlay — opaque enough for legibility */}
                <div className="relative z-10 bg-background/85 border border-foreground/10 rounded-3xl min-h-[340px] h-full flex flex-col overflow-hidden">
                  {/* Inner text block — extra blur layer for contrast */}
                  <div className="flex-1 bg-background/60 backdrop-blur-sm rounded-2xl m-1.5 p-6 flex flex-col">
                    {/* Icon container */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0 ${theme.iconWrapClass}`}
                    >
                      <Icon
                        className={`w-7 h-7 ${theme.iconColorClass}`}
                        strokeWidth={1.5}
                      />
                    </div>

                    <h3 className="font-display text-xl font-bold text-accent mb-3">
                      {title}
                    </h3>
                    <p className="text-foreground-dim text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Bottom gradient bar — same height/opacity, only color varies */}
                  <div
                    className={`h-1 mx-1.5 mb-1.5 rounded-full bg-gradient-to-r ${theme.barClass}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
