const steps = [
  {
    step: "Passo 1",
    title: "Conversa inicial",
    description:
      "Entendemos seu negócio, público-alvo e objetivos numa conversa rápida pelo WhatsApp ou videochamada.",
  },
  {
    step: "Passo 2",
    title: "Estrutura e conteúdo",
    description:
      "Organizamos juntos o conteúdo do site — textos, seções e informações que você quer destacar.",
  },
  {
    step: "Passo 3",
    title: "Design e revisão",
    description:
      "Desenvolvemos o layout e apresentamos para você ajustar detalhes até ficar exatamente como quer.",
  },
  {
    step: "Passo 4",
    title: "Site no ar",
    description:
      "Publicamos o site com domínio próprio, registrado em seu nome, pronto para receber seus clientes.",
  },
];

export default function Process() {
  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <span className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
            Como funciona
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            Processo simples
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="pt-6 border-t-2 border-accent">
              <p className="font-display text-sm font-semibold text-accent mb-3">
                {s.step}
              </p>
              <h3 className="font-semibold text-foreground text-base mb-3">
                {s.title}
              </h3>
              <p className="text-foreground-dim text-sm leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
