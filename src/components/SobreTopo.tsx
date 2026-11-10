"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Ondas from "@/components/Ondas";
import GaleriaCurva from "./GaleriaCurva";

gsap.registerPlugin(SplitText, useGSAP);

// Abertura da página Sobre: título centralizado sobre o grafismo de ondas
// e a faixa curva de fotos dos projetos logo abaixo
export default function SobreTopo() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const linhas = SplitText.create("[data-titulo]", { type: "lines,words", mask: "lines" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-surge]", { opacity: 0, y: 16, duration: 1 })
          .from(linhas.words, { yPercent: 110, duration: 1.3, stagger: 0.05 }, 0.1)
          .from("[data-galeria]", { opacity: 0, y: 80, duration: 1.6 }, 0.4);
        return () => linhas.revert();
      });
    },
    { scope: raiz },
  );

  return (
    <section
      ref={raiz}
      className="relative overflow-hidden bg-white pt-36 md:pt-44"
    >
      <Ondas className="top-16" />
      <div className="relative mx-auto max-w-[90rem] px-5 text-center md:px-10">
        <p data-surge className="rotulo justify-center text-grafite">
          Sobre a Lofteria
        </p>
        <h1 data-titulo className="mx-auto mt-6 max-w-[14ch] text-[clamp(2.4rem,4.2vw,3.75rem)] leading-[0.98] tracking-[-0.035em] text-balance text-grafite">
          <span className="font-light">Não queremos ser os maiores.</span> <strong className="font-semibold">Queremos ser únicos.</strong>
        </h1>
      </div>
      <div data-galeria className="relative bg-gradient-to-b from-transparent to-white">
        <GaleriaCurva />
      </div>
    </section>
  );
}
