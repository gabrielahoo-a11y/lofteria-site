"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Chamada de fechamento com foto de fundo, antes do rodapé
export default function ChamadaFinal({
  titulo = "Seu imóvel pronto para performar começa aqui",
  foto = "sala-azul",
  rotulo = "Vamos começar",
  acao = { href: "/contato", texto: "Agendar conversa" },
}: {
  titulo?: string;
  foto?: string;
  rotulo?: string;
  acao?: { href: string; texto: string };
}) {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-fundo]",
          { yPercent: -12, scale: 1.15 },
          { yPercent: 12, scale: 1.05, ease: "none", scrollTrigger: { trigger: raiz.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="relative grid min-h-[80svh] place-items-center overflow-hidden px-5 py-28 text-center text-white">
      <div data-fundo className="absolute inset-0">
        <Image src={`/img/${foto}.jpg`} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-grafite-profundo/70 via-grafite-profundo/55 to-grafite-profundo" />
      <div className="relative">
        <p className="rotulo justify-center text-white/70">{rotulo}</p>
        <h2 className="mx-auto mt-6 max-w-[16ch] text-[clamp(2.4rem,5.5vw,5rem)] leading-[1] font-semibold tracking-[-0.03em] text-balance">
          {titulo}
        </h2>
        <Link href={acao.href} className="botao botao-claro mt-10">
          {acao.texto}
        </Link>
      </div>
    </section>
  );
}
