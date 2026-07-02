"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const pushWaClick = () => {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: "whatsapp_click",
      event_category: "Lead",
      event_label: "WhatsApp Primeore",
    });
  }
};

const WA_PRESENCA =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20um%20or%C3%A7amento%20do%20pacote%20Presen%C3%A7a%20Profissional.";

const DELIVERABLES = [
  "Identidade visual exclusiva criada para o seu negócio",
  "Design profissional para computador e celular",
  "Texto estratégico, otimizado para o Google",
  "Botão de WhatsApp direto para seu cliente falar com você na hora",
  "Google Analytics e Pixel da Meta instalados no site",
  "Domínio registrado em seu nome",
  "Entrega rápida",
];

export default function Offer() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14 text-center"
        >
          <span className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
            O que entregamos
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Comece sua Presença Profissional Online
          </h2>
          <p className="text-foreground-dim text-sm sm:text-base max-w-md mx-auto">
            Tudo que seu negócio precisa para aparecer online do jeito que merece. Não sabe por
            onde começar? Chama no WhatsApp e a gente descobre juntos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <Card className="border border-foreground/10 ring-0">
            <CardContent className="px-8 py-8 sm:px-10 sm:py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-x-12">
                {/* Coluna esquerda: preço e ação */}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground-dim uppercase tracking-[0.18em] mb-4 block">
                    Pacote Presença Profissional
                  </span>

                  <span className="text-xs text-foreground-dim mb-1 block">A partir de</span>
                  <p className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-none whitespace-nowrap mb-3">
                    R$ 1.497
                  </p>

                  <p className="text-sm text-foreground-dim mb-1.5">
                    + manutenção e hospedagem gerenciada a partir de R$47/mês
                  </p>
                  <p className="text-xs text-foreground-dim/80 leading-relaxed mb-5">
                    Backup automático, segurança e velocidade — sem você precisar pensar nisso.
                  </p>

                  <a
                    href={WA_PRESENCA}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={pushWaClick}
                    className="mt-auto block w-full text-center px-6 py-3 rounded-full font-semibold text-sm bg-accent text-white hover:bg-accent/90 transition-colors"
                  >
                    Realizar Diagnóstico do Meu Negócio
                  </a>
                </div>

                {/* Coluna direita: entregáveis */}
                <div className="md:border-l md:border-foreground/10 md:pl-12 flex flex-col justify-start">
                  <ul className="space-y-4">
                    {DELIVERABLES.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                        </span>
                        <span className="text-sm leading-relaxed text-foreground-dim">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-start gap-3 mt-6">
                    <span className="mt-0.5 w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                      <Megaphone className="h-4 w-4 text-accent" strokeWidth={2} />
                    </span>
                    <p className="text-sm text-foreground-dim leading-relaxed">
                      Pronto pra rodar anúncio no Google, Meta e Instagram assim que você decidir.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
