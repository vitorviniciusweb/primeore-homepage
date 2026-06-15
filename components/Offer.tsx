import { Check } from "lucide-react";

const WA_URL =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20um%20or%C3%A7amento.";

const items = [
  "Site de uma página, com estrutura ideal (sobre, serviços, diferenciais, contato)",
  "Design profissional, para computador e celular",
  "Botão de WhatsApp direto",
  "Texto organizado junto com o cliente",
  "Entrega em até 5 dias úteis",
];

export default function Offer() {
  return (
    <section className="bg-background-soft py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div>
          <span className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
            O que entregamos
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-5">
            Site Institucional Express
          </h2>
          <p className="text-foreground-dim mb-8 leading-relaxed">
            Tudo que uma empresa local precisa para ter presença profissional na
            internet — sem enrolação, sem prazo longo.
          </p>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                <span className="text-foreground text-sm leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — price card */}
        <div className="rounded-2xl border border-border bg-background p-8">
          <span className="inline-block text-xs text-accent bg-accent/10 px-3 py-1 rounded-full mb-6 font-medium">
            Ponto de entrada
          </span>
          <p className="text-foreground-dim text-sm mb-1">Site Institucional</p>
          <p className="font-display text-5xl font-bold text-foreground mb-4 leading-none">
            R$ 1.500 – 2.500
          </p>
          <p className="text-foreground-dim text-sm mb-8 leading-relaxed">
            O valor varia conforme o volume e complexidade do conteúdo.
            Orçamento sem compromisso.
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center px-7 py-3.5 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-colors"
          >
            Pedir orçamento
          </a>
        </div>
      </div>
    </section>
  );
}
