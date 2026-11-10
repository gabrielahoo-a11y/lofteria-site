"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Ondas from "@/components/Ondas";

gsap.registerPlugin(SplitText, useGSAP);

// Título centralizado sobre o grafismo de ondas, que sobe palavra por palavra (topo das páginas simples)
export default function TituloCentral({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const linhas = SplitText.create("[data-titulo]", { type: "lines,words", mask: "lines" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-surge]", { opacity: 0, y: 16, duration: 1 })
          .from(linhas.words, { yPercent: 110, duration: 1.3, stagger: 0.05 }, 0.1);
        return () => linhas.revert();
      });
    },
    { scope: raiz },
  );

  return (
    <section
      ref={raiz}
      className="relative overflow-hidden bg-white px-5 pt-36 pb-16 text-center md:px-10 md:pt-44 md:pb-24"
    >
      <Ondas className="top-16" />
      <p data-surge className="rotulo relative justify-center text-grafite">
        {rotulo}
      </p>
      <h1 data-titulo className="relative mx-auto mt-6 max-w-[16ch] text-[clamp(2.4rem,4.2vw,3.75rem)] leading-[0.98] tracking-[-0.035em] text-balance text-grafite">
        {children}
      </h1>
    </section>
  );
}
