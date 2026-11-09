"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Etapas da parceria sobre a foto do iceberg: a seção fica presa e as etapas acendem
// do fundo para a superfície, até a entrega final na ponta (o que a construtora vê).
// Posições em % da imagem (2000 × 1174).
const ETAPAS = [
  { x: 58.5, y: 88, titulo: "Alinhamento inicial", texto: "escopo, tipologias e cronograma" },
  { x: 55, y: 76, titulo: "Planejamento da execução", texto: "fornecedores homologados e logística" },
  { x: 65, y: 67, titulo: "Desenvolvimento do projeto", texto: "estética e execução escalável" },
  { x: 54.5, y: 59, titulo: "Execução", texto: "montagem com controle total" },
  { x: 64, y: 52.5, titulo: "Ativação comercial", texto: "renders, memorial e Walk’a" },
  { x: 60.5, y: 33, titulo: "Entrega final", texto: "unidade pronta para vender" },
];

export default function IcebergEtapas() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: raiz.current, start: "top top", end: "+=240%", pin: true, scrub: 1.2 },
        });
        // A câmera começa no fundo e sobe até a superfície
        tl.fromTo("[data-foto]", { yPercent: -22, scale: 1.25 }, { yPercent: 0, scale: 1, duration: 1 }, 0);
        ETAPAS.forEach((_, i) => {
          const em = 0.08 + i * 0.13;
          tl.fromTo(`[data-etapa="${i}"]`, { opacity: 0 }, { opacity: 1, duration: 0.04 }, em).fromTo(
            `[data-etapa="${i}"] [data-pilula]`,
            { x: -14, scale: 0.9 },
            { x: 0, scale: 1, duration: 0.05, ease: "power2.out" },
            em,
          );
        });
        tl.fromTo("[data-cta]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08 }, 0.9);
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="relative overflow-hidden bg-[#050d18] text-white lg:h-svh">
      <div className="relative aspect-[2000/1174] w-full lg:absolute lg:top-1/2 lg:left-1/2 lg:h-auto lg:w-[max(100vw,calc(100svh*2000/1174))] lg:-translate-x-1/2 lg:-translate-y-1/2">
        <div data-foto className="absolute inset-0 origin-[60%_40%]">
          <Image src="/img/iceberg.webp" alt="Iceberg: a ponta acima da água e a maior parte submersa" fill sizes="100vw" className="object-cover" />
          {ETAPAS.map((e, i) => (
            <div
              key={e.titulo}
              data-etapa={i}
              className="absolute flex items-center gap-2.5 max-lg:hidden lg:opacity-0"
              style={{ left: `${e.x}%`, top: `${e.y}%`, transform: "translate(-7px, -50%)" }}
            >
              <span className="relative size-3.5 shrink-0 rounded-full bg-salmao shadow-[0_0_0_4px_rgba(255,255,255,.25)]">
                <span className="absolute -inset-2 animate-ping rounded-full border border-salmao" />
              </span>
              <span data-pilula className="origin-left rounded-full bg-white/90 px-3.5 py-2 text-[0.8125rem] whitespace-nowrap text-grafite backdrop-blur">
                <strong className="font-semibold">{e.titulo}</strong>
                <span className="text-texto-suave"> · {e.texto}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[90rem] px-5 py-16 md:px-10 lg:pt-28">
        <p className="rotulo text-white/70">Como funciona a parceria</p>
        <h2 className="titulo-lg mt-6 max-w-[15ch]">
          A construtora vê a entrega. <span className="font-light text-white/55">O resto fica com a gente.</span>
        </h2>
        <p className="mt-6 max-w-sm text-lg leading-relaxed font-light text-white/70">
          Assumimos toda a frente técnica e comercial, integrados ao cronograma da obra e sem mobilizar a sua&nbsp;equipe.
        </p>
        <Link data-cta href="/contato" className="botao botao-claro mt-8">
          Agendar conversa
        </Link>

        {/* No celular, as etapas em lista */}
        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 lg:hidden">
          {ETAPAS.map((e) => (
            <li key={e.titulo} className="bg-[#081523] px-5 py-4">
              <strong className="font-semibold">{e.titulo}</strong> <span className="font-light text-white/60">· {e.texto}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
