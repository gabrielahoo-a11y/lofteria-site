"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Quem somos como manifesto: uma citação com aspas grandes, sem ícones.
// O texto "acende" palavra por palavra conforme a rolagem.
export default function Manifesto() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const texto = SplitText.create("[data-manifesto]", { type: "words" });
        gsap.fromTo(
          texto.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: "[data-manifesto]", start: "top 85%", end: "bottom 50%", scrub: true },
          },
        );
        gsap.from("[data-aspas]", {
          scale: 0.6,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: raiz.current, start: "top 75%" },
        });
        return () => texto.revert();
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="bg-white px-5 py-28 text-center md:px-10 md:py-40">
      <p className="rotulo justify-center text-grafite">Quem somos</p>
      <figure className="relative mx-auto mt-14 max-w-[72rem]">
        <span
          data-aspas
          aria-hidden
          className="block font-serif text-[clamp(6rem,12vw,10rem)] h-[0.5em] leading-[0.9] text-salmao select-none"
        >
          “
        </span>
        <blockquote
          data-manifesto
          className="mx-auto mt-4 text-[clamp(1.9rem,3.4vw,3.1rem)] leading-[1.15] font-semibold tracking-[-0.025em] text-grafite [text-wrap:wrap]"
        >
          {/* Quebras do manifesto fixas a partir do tablet; no celular o texto corre livre */}
          Somos o feat entre o funcional e o <br className="hidden md:inline" />
          emocional, o racional e o estético. <br className="hidden md:inline" />
          Transformamos espaços em oportunidades <br className="hidden md:inline" />e moradias em&nbsp;histórias.
        </blockquote>
        <figcaption className="mt-10 text-[0.6875rem] font-semibold tracking-[0.22em] text-texto-suave uppercase">
          Manifesto Lofteria
        </figcaption>
      </figure>
    </section>
  );
}
