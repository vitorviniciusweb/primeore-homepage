"use client"

import { motion } from "framer-motion"

export default function Testimonial() {
  return (
    <section className="py-20 bg-background-soft border-t border-b border-foreground/5">
      <div className="container mx-auto px-4 max-w-4xl">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-accent block mb-3">
            Depoimentos
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
            O que nossos clientes dizem
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          viewport={{ once: true }}
          className="bg-background border border-foreground/10 rounded-2xl overflow-hidden"
        >
          {/* Contexto — quem é */}
          <div className="px-8 pt-8 pb-6 border-b border-foreground/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
              <span className="text-accent font-serif font-bold text-lg">R</span>
            </div>
            <div>
              <p className="text-foreground font-semibold text-base leading-tight">Renata Baldo</p>
              <p className="text-foreground-dim text-sm">Diretora Administrativa · Editora HNG</p>
            </div>
            <div className="ml-auto hidden md:block">
              <a
                href="https://www.editorahng.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-foreground-dim hover:text-accent transition-colors"
              >
                editorahng.com.br ↗
              </a>
            </div>
          </div>

          {/* Vídeo — embed YouTube */}
          <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
            <iframe
              src="https://www.youtube.com/embed/tK7G44xh5v8?rel=0&modestbranding=1&color=white"
              title="Depoimento Renata Baldo — Editora HNG · Primeore"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            />
          </div>

          {/* Rodapé sutil */}
          <div className="px-8 py-4 flex items-center justify-between">
            <p className="text-xs text-foreground-dim italic">
              &ldquo;Depoimento espontâneo gravado após a entrega do projeto.&rdquo;
            </p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FF6B35">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  )
}
