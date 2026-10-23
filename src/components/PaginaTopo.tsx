"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Props = {
  rotulo: string;
  titulo: React.ReactNode;
  texto: React.ReactNode;
  foto: string;
  fotoAlt: string;
  acao?: { href: string; rotulo: string };
};

// Topo das páginas internas: título que sobe palavra por palavra e uma foto
// que sai de uma janela estreita e ocupa a largura da tela conforme a rolagem.
export default function PaginaTopo({ rotulo, titulo, texto, foto, fotoAlt, acao }: Props) {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const linhas = SplitText.create("[data-titulo]", { type: "lines,words", mask: "lines" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(linhas.words, { yPercent: 110, duration: 1.2, stagger: 0.04 })
          .from("[data-surge]", { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.35)
          .from("[data-janela]", { clipPath: "inset(30% 30% 30% 30% round 32px)", duration: 1.6, ease: "expo.inOut" }, 0.2);

        gsap.fromTo(
          "[data-janela]",
          { clipPath: "inset(0% 6% 0% 6% round 32px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: "[data-janela]", start: "top 80%", end: "top 10%", scrub: 1 },
          },
        );
        gsap.fromTo(
          "[data-janela] img",
          { scale: 1.15 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-janela]", start: "top bottom", end: "bottom top", scrub: true } },
        );
        return () => linhas.revert();
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="bg-white pt-32 md:pt-40">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 md:px-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p data-surge className="rotulo mb-8 text-grafite">
            {rotulo}
          </p>
          <h1 data-titulo className="text-[clamp(2.6rem,6vw,6rem)] leading-[0.98] tracking-[-0.035em] text-grafite">
            {titulo}
          </h1>
        </div>
        <div className="lg:pb-3">
          <div data-surge className="max-w-md text-lg leading-relaxed font-light text-texto-suave">
            {texto}
          </div>
          {acao && (
            <Link data-surge href={acao.href} className="botao botao-salmao mt-8">
              {acao.rotulo}
            </Link>
          )}
        </div>
      </div>

      <div
        data-janela
        className="relative mt-16 h-[62svh] min-h-[360px] overflow-hidden md:mt-20 md:h-[78svh]"
        style={{ clipPath: "inset(0% 6% 0% 6% round 32px)" }}
      >
        <Image src={`/img/${foto}.jpg`} alt={fotoAlt} fill sizes="100vw" preload className="object-cover" />
      </div>
    </section>
  );
}
