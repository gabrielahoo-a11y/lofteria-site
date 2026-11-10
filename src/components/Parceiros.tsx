"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Investidores e parceiros. Quem tem o logo aparece com ele (como máscara, na mesma cor
// discreta dos nomes, e salmão ao passar o mouse); os demais, pelo nome em texto.
// Logo da Adore: arquivo oficial do site adoreincorporadora.com.br.
type Parceiro = { nome: string; logo?: string; proporcao?: number };
const PARCEIROS: Parceiro[] = [
  { nome: "FAZ", logo: "/img/parceiros/faz-logo.png", proporcao: 387 / 144 },
  { nome: "DZ7" },
  { nome: "Azzes" },
  { nome: "Adore", logo: "/img/parceiros/adore-logo.png", proporcao: 647 / 256 },
];

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
          {[...sequencia, ...sequencia].map((p, i) => (
            <li
              key={i}
              aria-hidden={i >= PARCEIROS.length}
              className="px-10 text-[clamp(2rem,4vw,3.5rem)] font-semibold tracking-[0.04em] whitespace-nowrap uppercase text-grafite/25 transition-colors duration-300 hover:text-salmao md:px-16"
            >
              {p.logo ? (
                <span
                  role="img"
                  aria-label={p.nome}
                  className="block h-[1.4em] bg-current"
                  style={{
                    aspectRatio: p.proporcao,
                    maskImage: `url(${p.logo})`,
                    WebkitMaskImage: `url(${p.logo})`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              ) : (
                p.nome
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
