const WA_URL =
  "https://wa.me/5513978109003?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Primeore%20e%20gostaria%20de%20um%20or%C3%A7amento.";

export default function CtaFinal() {
  return (
    <section className="bg-background py-28 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
          Bora colocar sua empresa no mapa?
        </h2>
        <p className="text-foreground-dim text-lg mb-10">
          Manda uma mensagem agora e te respondo no mesmo dia.
        </p>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-9 py-4 bg-accent text-white font-semibold text-lg rounded-full hover:bg-accent/90 transition-colors"
        >
          Falar no WhatsApp agora
        </a>
      </div>
    </section>
  );
}
