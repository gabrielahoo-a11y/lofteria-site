"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Cpu, Palette, Workflow } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const PILARES = [
  { titulo: "Design", Icone: Palette, movimento: "icone-girar" },
  { titulo: "Tecnologia", Icone: Cpu, movimento: "icone-pulsar" },
  { titulo: "Processos", Icone: Workflow, movimento: "icone-fluir" },
];

// O texto "acende" palavra por palavra conforme a rolagem
export default function Manifesto() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Comprimento 1 em cada traço dos ícones, para o efeito de redesenhar no hover
      raiz.current!
        .querySelectorAll("[data-pilar] svg :is(path, circle, rect, line, polyline)")
        .forEach((el) => el.setAttribute("pathLength", "1"));

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
        gsap.from("[data-pilar]", {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-pilares]", start: "top 90%" },
        });
        return () => texto.revert();
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="bg-white px-5 py-28 text-center md:px-10 md:py-36">
      <p className="text-[11px] font-semibold tracking-[0.24em] text-grafite uppercase">Quem somos</p>
      <p
        data-manifesto
        className="mx-auto mt-10 max-w-[22ch] text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-grafite"
      >
        Somos o feat entre o funcional e o emocional, o racional e o estético. Transformamos espaços em oportunidades
        e moradias em histórias.
      </p>

      <ul data-pilares className="mx-auto mt-20 flex max-w-xl justify-center gap-12 sm:gap-20">
        {PILARES.map(({ titulo, Icone, movimento }) => (
          <li key={titulo} data-pilar className="icone-vivo group flex cursor-default flex-col items-center gap-4">
            <span className="grid size-16 place-items-center rounded-full transition-colors duration-500 group-hover:bg-salmao/10">
              <Icone
                className={`size-9 text-grafite transition-colors duration-500 group-hover:text-salmao ${movimento}`}
                strokeWidth={1.4}
                aria-hidden
              />
            </span>
            <span className="font-semibold text-grafite">{titulo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
