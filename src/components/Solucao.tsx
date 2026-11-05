"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PaineisEstilos } from "./Estilos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ETAPAS = [
  {
    titulo: "Projeto",
    itens: ["Briefing e estudo de rentabilidade", "Projeto de interiores e marcenaria", "Escolha do estilo: Urban, Eco ou Slim", "Orçamento fechado antes da obra"],
  },
  {
    titulo: "Gestão e compras",
    itens: ["Pedidos, cotações e negociação", "Logística e recebimento", "Conferência de cada entrega", "Controle de orçamento em tempo real"],
  },
  {
    titulo: "Execução",
    itens: ["Seleção e contratação da mão de obra", "Pintura, elétrica e montagem", "Supervisão diária com cronograma rigoroso", "Vistoria final de qualidade"],
  },
  {
    titulo: "Instalação e automação",
    itens: ["Pedras, móveis e eletrodomésticos", "Enxoval e utensílios completos", "Alexa, ar, TV e iluminação por voz", "Pronto para o primeiro hóspede"],
  },
];

// Etapas no formato da lista de serviços da referência: no hover, um fundo claro varre a linha
// da esquerda para a direita, o texto escurece e a foto entra girando ao lado da seta.
// Logo abaixo, no mesmo bloco escuro, os três estilos.
export default function Solucao() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.batch(raiz.current!.querySelectorAll("[data-revelar]"), {
          start: "top 88%",
          once: true,
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }),
        });
      });
    },
    { scope: raiz },
  );

  return (
    <section id="solucao" ref={raiz} className="bg-grafite-profundo py-24 text-white md:py-32">
      <div className="mx-auto max-w-[90rem] px-5 md:px-10">
        <div data-revelar className="flex flex-wrap items-end justify-between gap-8">
          <h2 className="titulo-lg max-w-[14ch]">
            Do projeto às chaves, <span className="font-light text-white/45">sem você gerenciar nada.</span>
          </h2>
          <div className="text-right">
            <p className="rotulo justify-end text-white/50">Entrega média</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              60<span className="text-salmao"> dias</span>
            </p>
          </div>
        </div>
      </div>

      {/* As quatro etapas lado a lado; no hover, um fundo claro sobe pela coluna */}
      <ul className="mx-auto mt-16 grid max-w-[90rem] border-t border-white/10 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
        {ETAPAS.map((e) => (
          <li
            key={e.titulo}
            data-revelar
            className="group relative border-b border-white/10 sm:border-r sm:even:border-r-0 lg:border-b-0 lg:even:border-r lg:last:border-r-0"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-700 ease-[cubic-bezier(.33,0,.2,1)] group-hover:scale-y-100" />
            <div className="relative px-5 py-10 md:px-10 md:py-12">
              <h3 className="text-2xl font-semibold tracking-tight transition-colors duration-500 group-hover:text-grafite md:text-3xl">
                {e.titulo}
              </h3>
              <ul className="mt-6 space-y-2.5">
                {e.itens.map((it) => (
                  <li key={it} className="flex gap-3 text-sm text-white/60 transition-colors duration-500 group-hover:text-grafite md:text-base">
                    <span className="text-salmao">+</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      <div id="estilos" className="mx-auto mt-28 max-w-[90rem] px-5 md:mt-36 md:px-10">
        <div data-revelar className="mb-12 text-center">
          <p className="text-[0.6875rem] font-semibold tracking-[0.24em] text-white/60 uppercase">Três linguagens. Um mesmo padrão.</p>
          <h2 className="mt-5 text-[clamp(2.2rem,4.6vw,4rem)] leading-none font-semibold tracking-tight uppercase">Descubra seu estilo</h2>
        </div>
        <div data-revelar>
          <PaineisEstilos inicial={1} />
        </div>
      </div>
    </section>
  );
}
