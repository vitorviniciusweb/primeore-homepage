export default function About() {
  return (
    <section className="bg-background-soft py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Visual block */}
        <div className="relative aspect-square max-w-xs mx-auto md:mx-0 rounded-2xl border border-border bg-background flex items-center justify-center overflow-hidden">
          <span
            className="font-display font-bold text-accent select-none leading-none"
            style={{ fontSize: "clamp(8rem, 20vw, 12rem)" }}
            aria-hidden
          >
            P
          </span>
          <span className="absolute bottom-5 left-5 text-xs text-foreground-dim tracking-widest uppercase">
            Santos / SP
          </span>
        </div>

        {/* Text */}
        <div>
          <span className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
            Sobre
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8">
            Quem está por trás
          </h2>
          <div className="space-y-5 text-foreground-dim leading-relaxed">
            <p>
              Comecei a trabalhar com presença online dentro do mercado
              imobiliário, onde vi de perto como a falta de um site sério faz
              empresas perderem credibilidade e clientes todos os dias.
            </p>
            <p>
              A Primeore nasceu para atender empresários da Baixada Santista
              que precisam de um site sério e rápido — sem orçamento de
              agência grande, sem prazo de meses.
            </p>
            <p>
              Cada projeto é pensado para durar. Do conteúdo ao design, tudo
              construído junto com o cliente, para representar de verdade o
              que ele faz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
