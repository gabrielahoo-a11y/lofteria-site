"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const PILARES = [
  { titulo: "Tecnologia", texto: "Automação, gestão de compras e cronograma em uma só plataforma." },
  { titulo: "Design", texto: "Ambientes que encantam o hóspede e sustentam diárias mais altas." },
  { titulo: "Inteligência imobiliária", texto: "Cada decisão de projeto pensada para o retorno do investidor." },
];

// O texto "acende" palavra por palavra conforme a rolagem
export default function Manifesto() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const texto = SplitText.create("[data-manifesto]", { type: "words" });
        gsap.fromTo(
          texto.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: "[data-manifesto]", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
        gsap.from("[data-pilar]", {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-pilares]", start: "top 85%" },
        });
        return () => texto.revert();
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <p className="rotulo mb-10 text-grafite">Quem somos</p>
      <p data-manifesto className="titulo-md max-w-[24ch] text-grafite md:text-[clamp(2rem,4.2vw,3.75rem)]">
        Somos o feat entre o funcional e o emocional, o racional e o estético. Transformamos espaços em oportunidades
        e moradias em histórias.
      </p>

      <div data-pilares className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-linha md:grid-cols-3">
        {PILARES.map((p, i) => (
          <div key={p.titulo} data-pilar className="bg-nevoa p-8 md:p-10">
            <span className="text-xs text-salmao tabular-nums">0{i + 1}</span>
            <h3 className="mt-6 text-xl font-semibold text-grafite">{p.titulo}</h3>
            <p className="mt-3 leading-relaxed font-light text-texto-suave">{p.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
