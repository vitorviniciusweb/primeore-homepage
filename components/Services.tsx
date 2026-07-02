"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Building2, Target, TrendingUp, LayoutGrid, type LucideIcon } from "lucide-react";

const pushWaClick = () => {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: "whatsapp_click",
      event_category: "Lead",
      event_label: "WhatsApp Primeore",
    });
  }
};

const WA_URL =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20n%C3%A3o%20sei%20qual%20tipo%20de%20site%20preciso.%20Podemos%20conversar%3F";

interface ServiceType {
  icon: LucideIcon;
  name: string;
  forWhat: string;
  benefit: string;
}

const SERVICE_TYPES: ServiceType[] = [
  {
    icon: Building2,
    name: "Institucional",
    forWhat: "Apresenta sua empresa por completo — quem você é, o que faz, por que confiar.",
    benefit: "Constrói autoridade e te coloca no Google antes mesmo do cliente te procurar.",
  },
  {
    icon: Target,
    name: "Página de Captura",
    forWhat: "Página única, focada em captar contato de quem tem interesse — formulário ou WhatsApp direto.",
    benefit: "Gera lead qualificado antes de qualquer campanha paga rodar.",
  },
  {
    icon: TrendingUp,
    name: "Página de Vendas",
    forWhat: "Página construída pra vender uma oferta específica, com foco total em conversão.",
    benefit: "Ideal pra lançamento ou promoção com prazo — sem distrair o visitante com outras informações.",
  },
  {
    icon: LayoutGrid,
    name: "Catálogo",
    forWhat: "Vitrine organizada dos seus produtos ou serviços, fácil de navegar.",
    benefit: "Pode evoluir pra uma loja completa conforme sua necessidade crescer.",
  },
];

export default function Services() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="bg-background-soft py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14 text-center max-w-2xl mx-auto"
        >
          <span className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
            Formatos de site
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Qual desses é o seu site?
          </h2>
          <p className="text-foreground-dim text-sm sm:text-base leading-relaxed">
            A gente descobre o formato certo numa conversa de diagnóstico — mas aqui vai um
            panorama. Todo site Primeore já nasce pronto pra rodar tráfego pago quando você
            decidir escalar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICE_TYPES.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: shouldReduce ? 0 : 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              className="rounded-2xl border border-foreground/10 bg-background p-8"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                <service.icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {service.name}
              </h3>
              <p className="text-foreground text-sm leading-relaxed mb-3">{service.forWhat}</p>
              <p className="text-foreground-dim text-sm leading-relaxed">{service.benefit}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={pushWaClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/20 text-foreground text-sm font-semibold hover:bg-foreground/5 transition-colors"
          >
            Não sabe qual é o seu? Bora conversar
          </a>
        </motion.div>
      </div>
    </section>
  );
}
