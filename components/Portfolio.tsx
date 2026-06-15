import { GlassProjectCard } from "@/components/ui/glass-project-card";

const projects = [
  {
    title: "Editora HNG",
    description:
      "Editora especializada em livros que eternizam trajetórias empresariais.",
    badges: ["Editora", "Institucional"] as [string, string],
    logo: "/portfolio/editora-hng.png",
    href: "https://www.editorahng.com.br/",
    accentColor: "steel" as const,
  },
  {
    title: "Cambuí Exclusividade",
    description:
      "Landing page de lançamento imobiliário em Campinas, foco em geração de leads.",
    badges: ["Imóveis de Luxo", "Campinas/SP"] as [string, string],
    logo: "/portfolio/cambui-exclusividade.png",
    href: "https://cambuiexclusividade.com.br/",
    accentColor: "accent" as const,
  },
  {
    title: "Bastidores do Sucesso",
    description:
      "Site para podcast que entrevista empresários da Baixada Santista.",
    badges: ["Podcast", "Santos/SP"] as [string, string],
    logo: "/portfolio/bastidores-sucesso.png",
    href: "https://www.silviasimone.com.br/",
    accentColor: "gold" as const,
  },
];

export default function Portfolio() {
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
            <GlassProjectCard key={p.title} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
