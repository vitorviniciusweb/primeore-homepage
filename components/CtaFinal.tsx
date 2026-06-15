import { CTASection } from "@/components/ui/cta-with-rectangle";

export default function CtaFinal() {
  return (
    <CTASection
      title="Bora colocar sua empresa no mapa?"
      description="Manda uma mensagem agora e te respondo no mesmo dia."
      action={{
        text: "Falar no WhatsApp agora",
        href: "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vi%20o%20site%20da%20Primeore%20e%20quero%20colocar%20minha%20empresa%20no%20ar.",
        variant: "default",
      }}
      withGlow={true}
    />
  );
}
