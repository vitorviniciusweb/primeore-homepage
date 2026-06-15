import { PricingCard, type Benefit } from "@/components/ui/dark-gradient-pricing";

const WA_EXPRESS =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20um%20or%C3%A7amento%20do%20pacote%20Site%20Express.";

const WA_COMPLETO =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20um%20or%C3%A7amento%20do%20pacote%20Site%20Completo.";

const BENEFITS_EXPRESS: Benefit[] = [
  { text: "Site de uma página (sobre, serviços, diferenciais, contato)", checked: true },
  { text: "Identidade visual exclusiva para sua marca", checked: true },
  { text: "Design profissional, para computador e celular", checked: true },
  { text: "Botão de WhatsApp direto", checked: true },
  { text: "Google Analytics, GTM e Pixel instalados", checked: true },
  { text: "Texto organizado junto com você", checked: true },
  { text: "Copy otimizada para ser encontrada no Google", checked: true },
  { text: "Entrega em até 5 dias úteis", checked: true },
];

const BENEFITS_PERSONALIZADO: Benefit[] = [
  { text: "Tudo do Site Express, em um projeto sob medida", checked: true },
  { text: "Múltiplas páginas e seções (catálogo, portfólio, blog)", checked: true },
  { text: "Loja virtual simples com link de pagamento", checked: true },
  { text: "Páginas de campanhas e lançamentos", checked: true },
  { text: "Estrutura sob medida para o seu negócio", checked: true },
];

export default function Offer() {
  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-14 text-center">
          <span className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
            O que entregamos
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            Escolha o pacote ideal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <PricingCard
            tier="Site Express"
            price="R$ 1.500 – 2.500"
            bestFor="Site institucional completo para sua empresa"
            benefits={BENEFITS_EXPRESS}
            cta="Pedir orçamento"
            ctaVariant="ghost"
            ctaHref={WA_EXPRESS}
          />
          <PricingCard
            tier="Projeto Personalizado"
            price="A partir de R$ 3.000"
            bestFor="Para negócios que precisam de mais do que uma página"
            benefits={BENEFITS_PERSONALIZADO}
            note="O valor final depende do escopo — vamos conversar sobre o que seu projeto precisa."
            cta="Conversar sobre meu projeto"
            ctaVariant="default"
            ctaHref={WA_COMPLETO}
            highlighted
            highlightedLabel="Para projetos maiores"
          />
        </div>
      </div>
    </section>
  );
}
