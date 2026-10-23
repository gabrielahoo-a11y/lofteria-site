"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, useGSAP);

// Título centralizado sobre linhas finas, que sobe palavra por palavra (topo das páginas simples)
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
      className="bg-white bg-[repeating-linear-gradient(90deg,transparent_0_11px,rgba(50,60,68,.045)_11px_12px)] px-5 pt-36 pb-16 text-center md:px-10 md:pt-44 md:pb-24"
    >
      <p data-surge className="rotulo justify-center text-grafite">
        {rotulo}
      </p>
      <h1 data-titulo className="mx-auto mt-6 max-w-[16ch] text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.98] tracking-[-0.035em] text-balance text-grafite">
        {children}
      </h1>
    </section>
  );
}
