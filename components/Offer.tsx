"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
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
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20realizar%20um%20diagn%C3%B3stico%20do%20meu%20neg%C3%B3cio.";

const DELIVERABLES = [
  "Identidade visual exclusiva criada para o seu negócio",
  "Design profissional para computador e celular",
  "Texto estratégico que comunica o seu diferencial",
  "Botão de WhatsApp direto para seu cliente falar com você na hora",
  "Google Analytics e Pixel da Meta instalados — você acompanha cada resultado",
  "Domínio registrado em seu nome — o site é seu, para sempre",
  "Pronto para rodar anúncio no Google, Facebook e Instagram quando você decidir escalar",
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
            <CardContent className="px-8 py-8 sm:px-10 sm:py-10 max-w-md mx-auto">
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

              <a
                href={WA_PRESENCA}
                target="_blank"
                rel="noopener noreferrer"
                onClick={pushWaClick}
                className="mt-8 block w-full text-center px-6 py-3 rounded-full font-semibold text-sm bg-accent text-white hover:bg-accent/90 transition-colors"
              >
                Realizar Diagnóstico do Meu Negócio
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
