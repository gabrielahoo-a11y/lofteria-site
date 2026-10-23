"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import GaleriaCurva from "./GaleriaCurva";

gsap.registerPlugin(SplitText, useGSAP);

// Abertura da página Sobre: título centralizado sobre um fundo de linhas finas
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
      className="overflow-hidden bg-white bg-[repeating-linear-gradient(90deg,transparent_0_11px,rgba(50,60,68,.045)_11px_12px)] pt-36 md:pt-44"
    >
      <div className="mx-auto max-w-[1440px] px-5 text-center md:px-10">
        <p data-surge className="rotulo justify-center text-grafite">
          Sobre a Lofteria
        </p>
        <h1 data-titulo className="mx-auto mt-6 max-w-[14ch] text-[clamp(2.6rem,6.4vw,6.2rem)] leading-[0.98] tracking-[-0.035em] text-balance text-grafite">
          <span className="font-light">Não queremos ser os maiores.</span> <strong className="font-semibold">Queremos ser únicos.</strong>
        </h1>
      </div>
      <div data-galeria className="bg-gradient-to-b from-transparent to-white">
        <GaleriaCurva />
      </div>
    </section>
  );
}
