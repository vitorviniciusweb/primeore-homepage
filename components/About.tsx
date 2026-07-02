"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function About() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="bg-background-soft py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-accent mb-3 block">
            Sobre
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
            Quem está por trás
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 items-center">
          {/* Left: photo */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                width: "280px",
                height: "380px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                border: "1px solid rgba(242,240,235,0.1)",
              }}
            >
              <Image
                src="/sobre-2.png"
                alt="Vitor Vinícius"
                width={280}
                height={380}
                className="w-full h-full object-cover object-top"
                priority
              />
            </div>
          </motion.div>

          {/* Right: trajectory text */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="mb-6 leading-relaxed text-[16px] text-foreground-dim">
              Trabalho com presença online porque acredito que negócio bom precisa ser
              encontrado. Meu objetivo é simples: entregar um site que o cliente se orgulha de
              mostrar — e que traz resultado real.
            </p>
            <p className="font-display font-bold mb-1 text-[22px] text-foreground">
              Vitor Vinícius
            </p>
            <p className="text-[14px] text-foreground-dim">
              Marketing digital · 5 anos de experiência
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
