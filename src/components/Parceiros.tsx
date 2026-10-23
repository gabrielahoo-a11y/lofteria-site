"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Investidores e parceiros. Enquanto não temos os arquivos das logos, os nomes aparecem
// em texto; trocar por <Image src="/parceiros/…svg"> quando chegarem.
const PARCEIROS = ["Faz", "Aldora", "Level Up"];

export default function Parceiros() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const faixa = gsap.to("[data-trilho]", { xPercent: -50, ease: "none", duration: 30, repeat: -1 });
        const el = raiz.current!.querySelector("[data-trilho]")!;
        const devagar = () => gsap.to(faixa, { timeScale: 0.2, duration: 0.6 });
        const normal = () => gsap.to(faixa, { timeScale: 1, duration: 0.6 });
        el.addEventListener("mouseenter", devagar);
        el.addEventListener("mouseleave", normal);
        return () => {
          el.removeEventListener("mouseenter", devagar);
          el.removeEventListener("mouseleave", normal);
        };
      });
    },
    { scope: raiz },
  );

  // Repete a lista para a faixa nunca ficar vazia
  const sequencia = Array.from({ length: 4 }, () => PARCEIROS).flat();

  return (
    <section ref={raiz} className="overflow-hidden bg-white py-20 md:py-28">
      <div className="flex justify-center">
        <p className="rotulo text-grafite">Investidores e parceiros</p>
      </div>
      <div className="mt-12 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul data-trilho className="flex w-max items-center">
          {[...sequencia, ...sequencia].map((nome, i) => (
            <li
              key={i}
              aria-hidden={i >= PARCEIROS.length}
              className="px-10 text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-tight whitespace-nowrap text-grafite/25 transition-colors duration-300 hover:text-salmao md:px-16"
            >
              {nome}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
