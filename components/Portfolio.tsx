"use client";

import { motion, useReducedMotion } from "framer-motion";

const projects = [
  {
    name: "Editora HNG",
    url: "https://www.editorahng.com.br/",
    tag: "Editora · Institucional",
    description:
      "Editora especializada em livros que eternizam trajetórias empresariais.",
    from: "#3d5a80",
    to: "#16191f",
  },
  {
    name: "Cambuí Exclusividade",
    url: "https://cambuiexclusividade.com.br/",
    tag: "Imóveis de alto padrão",
    description:
      "Landing page de lançamento imobiliário em Campinas, foco em geração de leads.",
    from: "#1a3550",
    to: "#16191f",
  },
  {
    name: "Bastidores do Sucesso",
    url: "https://www.silviasimone.com.br/",
    tag: "Podcast · Santos/SP",
    description:
      "Site para podcast que entrevista empresários da Baixada Santista.",
    from: "#2a1a3a",
    to: "#16191f",
  },
];

export default function Portfolio() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="portfolio" className="bg-background py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <span className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
            Portfólio
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            Projetos feitos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: shouldReduce ? 0 : 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={shouldReduce ? {} : { y: -6 }}
              className="group block rounded-2xl overflow-hidden border border-border hover:border-accent transition-colors duration-300"
            >
              <div
                className="h-44"
                style={{
                  background: `linear-gradient(135deg, ${p.from}, ${p.to})`,
                }}
                aria-hidden
              />
              <div className="p-6 bg-background-soft">
                <span className="text-xs text-foreground-dim tracking-wide uppercase block mb-2">
                  {p.tag}
                </span>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {p.name}
                </h3>
                <p className="text-foreground-dim text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
