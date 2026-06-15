"use client";

import { CircularTestimonials } from "@/components/ui/circular-testimonials";

const slides = [
  {
    src: "/sobre-3.png",
    name: "Vitor Vinícius",
    designation: "Fundador da Primeore · Santos/SP",
    quote:
      "Comecei no mercado imobiliário com 15 anos e aprendi na prática que a primeira impressão de um negócio começa muito antes do primeiro contato. Um site bem feito não é luxo — é o básico que todo empresário merece ter.",
  },
  {
    src: "/sobre-1.png",
    name: "Vitor Vinícius",
    designation: "Criador de sites · Especialista em presença digital",
    quote:
      "Cada projeto que entrego é pensado do zero pra aquele cliente. Nada de modelo pronto, nada de copiar e colar. O site precisa representar o que o negócio realmente é — não uma versão genérica dele.",
  },
  {
    src: "/sobre-2.png",
    name: "Vitor Vinícius",
    designation: "Marketing digital · 5 anos de experiência",
    quote:
      "Trabalho com presença online porque acredito que negócio bom precisa ser encontrado. Meu objetivo é simples: entregar um site que o cliente se orgulha de mostrar — e que traz resultado real.",
  },
];

export default function About() {
  return (
    <section className="bg-background-soft py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header — left-aligned, outside the carousel */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-accent mb-3 block">
            Sobre
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
            Quem está por trás
          </h2>
        </div>

        <CircularTestimonials
          testimonials={slides}
          autoplay={true}
          colors={{
            name: "var(--foreground)",
            designation: "var(--foreground-dim)",
            testimony: "var(--foreground-dim)",
            arrowBackground: "var(--background-soft)",
            arrowForeground: "var(--foreground)",
            arrowHoverBackground: "var(--accent)",
          }}
          fontSizes={{
            name: "22px",
            designation: "14px",
            quote: "16px",
          }}
          style={{ maxWidth: "1024px" }}
        />
      </div>
    </section>
  );
}
