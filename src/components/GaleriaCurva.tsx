"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const FOTOS = [
  "sunset-lagoa",
  "plenty-sea",
  "sala-estante",
  "quarto-janela",
  "studio-integrado",
  "sala-azul",
  "jantar-quadro",
  "cozinha-grafite",
];

// Faixa de fotos que corre sozinha e se curva como a parede de um cilindro:
// as fotos das pontas giram e crescem, as do centro ficam retas.
export default function GaleriaCurva() {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const trilho = raiz.current!.querySelector<HTMLElement>("[data-trilho]")!;
      const cartoes = Array.from(trilho.children) as HTMLElement[];
      const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let x = 0;

      const curvar = () => {
        const meio = window.innerWidth / 2;
        cartoes.forEach((c) => {
          const r = c.getBoundingClientRect();
          const d = gsap.utils.clamp(-1.4, 1.4, (r.left + r.width / 2 - meio) / meio);
          c.style.transform = `perspective(1100px) rotateY(${-d * 24}deg) scale(${1 + 0.18 * d * d})`;
        });
      };

      const passo = (_: number, delta: number) => {
        if (!reduzido) {
          const metade = trilho.scrollWidth / 2;
          x = (x - delta * 0.045) % metade;
          trilho.style.transform = `translate3d(${x}px, 0, 0)`;
        }
        curvar();
      };
      gsap.ticker.add(passo);
      return () => gsap.ticker.remove(passo);
    },
    { scope: raiz },
  );

  return (
    <div ref={raiz} className="relative mt-14 overflow-hidden py-10 md:mt-20">
      <div data-trilho className="flex w-max gap-4 will-change-transform md:gap-5">
        {[...FOTOS, ...FOTOS].map((f, i) => (
          <div
            key={i}
            aria-hidden={i >= FOTOS.length}
            className="relative h-[34vh] min-h-[220px] w-[26vh] min-w-[170px] shrink-0 overflow-hidden rounded-[18px] md:h-[40vh] md:w-[30vh]"
          >
            <Image src={`/img/${f}.jpg`} alt={i < FOTOS.length ? "Apartamento montado pela Lofteria" : ""} fill sizes="30vh" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
