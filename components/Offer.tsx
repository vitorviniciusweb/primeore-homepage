import { PricingCard, type Benefit } from "@/components/ui/dark-gradient-pricing";

const WA_PRESENCA =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20um%20or%C3%A7amento%20do%20pacote%20Presen%C3%A7a%20Profissional.";

const WA_SOB_MEDIDA =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20conversar%20sobre%20meu%20Projeto%20Sob%20Medida.";

const BENEFITS_PRESENCA: Benefit[] = [
  { text: "Identidade visual exclusiva criada para o seu negócio", checked: true },
  { text: "Design profissional para computador e celular", checked: true },
  { text: "Texto estratégico, otimizado para o Google", checked: true },
  { text: "Botão de WhatsApp direto para seu cliente falar com você na hora", checked: true },
  { text: "Google Analytics, GTM e Meta Pixel instalados", checked: true },
  { text: "Entrega em até 5 dias úteis após o briefing", checked: true },
  { text: "Domínio registrado em seu nome — o site é seu, para sempre", checked: true },
];

const BENEFITS_SOB_MEDIDA: Benefit[] = [
  { text: "Tudo do Presença Profissional, em escopo ampliado", checked: true },
  { text: "Múltiplas páginas e seções (catálogo, portfólio, blog, equipe)", checked: true },
  { text: "Loja virtual simples com link de pagamento", checked: true },
  { text: "Páginas de campanha e lançamento", checked: true },
  { text: "Estrutura pensada para o seu segmento de mercado", checked: true },
  { text: "Bônus: cadastro profissional no Google Meu Negócio", checked: true },
];

const FLEXIBLE_NOTE = "Condições de pagamento flexíveis disponíveis — fale comigo.";

export default function Offer() {
  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-14 text-center">
          <span className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
            O que entregamos
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            Escolha como quer aparecer
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <PricingCard
            tier="Presença Profissional"
            price="R$ 1.500 – 2.500"
            bestFor="Tudo que seu negócio precisa para aparecer online do jeito que merece"
            benefits={BENEFITS_PRESENCA}
            note={FLEXIBLE_NOTE}
            cta="Pedir orçamento"
            ctaVariant="default"
            ctaHref={WA_PRESENCA}
          />
          <PricingCard
            tier="Projeto Sob Medida"
            price="A partir de R$ 3.000"
            bestFor="Para negócios que precisam de mais do que uma página — cada detalhe pensado para o seu mercado"
            benefits={BENEFITS_SOB_MEDIDA}
            note={FLEXIBLE_NOTE}
            cta="Conversar sobre meu projeto"
            ctaVariant="default"
            ctaHref={WA_SOB_MEDIDA}
          />
        </div>
      </div>
    </section>
  );
}
