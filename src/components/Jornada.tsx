"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// A jornada do imóvel com a Lofteria, do primeiro contato à entrega
const ETAPAS = [
  {
    marco: "Briefing",
    titulo: "Uma conversa antes de qualquer número",
    texto: "Entendemos o seu objetivo: short-stay, locação anual, venda ou morar. Cada decisão do projeto parte daí.",
    foto: "sala-estante",
  },
  {
    marco: "Projeto",
    titulo: "Ambientes pensados para performar",
    texto: "Planejamos cada espaço com funcionalidade, criatividade e estética, no estilo Urban, Eco ou Slim.",
    foto: "jantar-quadro",
  },
  {
    marco: "Compras",
    titulo: "Orçamento fechado e seguido à risca",
    texto: "Pedidos, cotações, logística e conferência de cada entrega ficam com a gente, com o orçamento sob controle.",
    foto: "cozinha-grafite",
  },
  {
    marco: "Execução",
    titulo: "Obra supervisionada todos os dias",
    texto: "Profissionais especializados, cronograma rigoroso e supervisores garantindo eficiência e qualidade.",
    foto: "studio-integrado",
  },
  {
    marco: "Entrega",
    titulo: "Pronto para o primeiro hóspede em 60 dias",
    texto: "Móveis, eletros, enxoval e automação instalados. O apartamento já sai pronto para render.",
    foto: "quarto-janela",
  },
];

export default function Jornada() {
  const raiz = useRef<HTMLElement>(null);
  const [ativa, setAtiva] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const barra = raiz.current!.querySelector<HTMLElement>("[data-barra]")!;
        let atual = 0;
        ScrollTrigger.create({
          trigger: raiz.current,
          start: "top top",
          end: `+=${ETAPAS.length * 70}%`,
          pin: true,
          scrub: true,
          onUpdate: (st) => {
            barra.style.transform = `scaleX(${st.progress})`;
            const i = Math.min(ETAPAS.length - 1, Math.floor(st.progress * ETAPAS.length));
            if (i !== atual) {
              atual = i;
              setAtiva(i);
            }
          },
        });
        gsap.fromTo(
          "[data-palavra]",
          { xPercent: 6 },
          {
            xPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: raiz.current, start: "top top", end: `+=${ETAPAS.length * 70}%`, scrub: true },
          },
        );
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="relative flex h-svh min-h-[640px] flex-col overflow-hidden bg-white">
      <p
        data-palavra
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[26vw] leading-none font-semibold tracking-tighter text-grafite/[0.05] select-none"
      >
        Jornada
      </p>

      <div className="relative mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-8 px-5 pt-20 md:grid-cols-[1fr_auto_1fr] md:px-10">
        {/* Texto: no desktop alterna entre os lados da imagem; no celular fica sempre embaixo */}
        {(["esquerda", "direita"] as const).map((lado) => (
          <div key={lado} className={`relative min-h-[170px] ${lado === "esquerda" ? "max-md:hidden md:order-1" : "max-md:order-2 md:order-3"}`}>
            {ETAPAS.map((e, i) => {
              const daEsquerda = i % 2 === 0;
              if (lado === "esquerda" && !daEsquerda) return null;
              const visivel = i === ativa;
              return (
                <div
                  key={e.marco}
                  aria-hidden={!visivel}
                  className={`absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${
                    visivel ? "opacity-100" : "pointer-events-none translate-y-[-30%] opacity-0"
                  } ${lado === "esquerda" ? "text-right" : ""} ${lado === "direita" && daEsquerda ? "md:hidden" : ""}`}
                >
                  <p className={`rotulo text-grafite ${lado === "esquerda" ? "justify-end" : ""}`}>
                    {String(i + 1).padStart(2, "0")} · {e.marco}
                  </p>
                  <h3 className={`mt-4 max-w-[18ch] text-2xl font-semibold tracking-tight text-grafite md:text-3xl ${lado === "esquerda" ? "ml-auto" : ""}`}>
                    {e.titulo}
                  </h3>
                  <p className={`mt-3 max-w-sm text-sm leading-relaxed font-light text-texto-suave ${lado === "esquerda" ? "ml-auto" : ""}`}>
                    {e.texto}
                  </p>
                </div>
              );
            })}
          </div>
        ))}

        <div className="relative mx-auto aspect-[3/4] w-[min(60vw,300px)] overflow-hidden rounded-[22px] shadow-2xl shadow-grafite/20 max-md:order-1 md:order-2 md:w-[min(22vw,320px)]">
          {ETAPAS.map((e, i) => (
            <Image
              key={e.foto}
              src={`/img/${e.foto}.jpg`}
              alt={i === ativa ? `${e.marco}: ${e.titulo}` : ""}
              fill
              sizes="320px"
              className={`object-cover transition-[opacity,scale] duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] ${
                i === ativa ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Linha do tempo */}
      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-10 md:px-10">
        <ol className="grid grid-cols-5 text-xs">
          {ETAPAS.map((e, i) => (
            <li
              key={e.marco}
              className={`transition-colors duration-500 ${i === ativa ? "text-grafite" : "text-texto-suave/60"} ${
                i === ETAPAS.length - 1 ? "text-right" : i > 0 ? "text-center" : ""
              }`}
            >
              {e.marco}
            </li>
          ))}
        </ol>
        <div className="mt-3 h-px bg-linha">
          <div data-barra className="h-px origin-left scale-x-0 bg-grafite" />
        </div>
      </div>
    </section>
  );
}
