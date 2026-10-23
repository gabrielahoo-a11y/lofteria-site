"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { PaineisEstilos } from "./Estilos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ETAPAS = [
  {
    titulo: "Projeto",
    foto: "/img/projetos/smart-living-604.jpg",
    itens: ["Briefing e estudo de rentabilidade", "Projeto de interiores e marcenaria", "Escolha do estilo: Urban, Eco ou Slim", "Orçamento fechado antes da obra"],
  },
  {
    titulo: "Gestão e compras",
    foto: "/img/projetos/swami-beach-316.jpg",
    itens: ["Pedidos, cotações e negociação", "Logística e recebimento", "Conferência de cada entrega", "Controle de orçamento em tempo real"],
  },
  {
    titulo: "Execução",
    foto: "/img/projetos/villa-de-algarve-301.jpg",
    itens: ["Seleção e contratação da mão de obra", "Pintura, elétrica e montagem", "Supervisão diária com cronograma rigoroso", "Vistoria final de qualidade"],
  },
  {
    titulo: "Instalação e automação",
    foto: "/img/projetos/spot-215-202.jpg",
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
    <section id="solucao" ref={raiz} className="rounded-[32px] bg-grafite-profundo py-24 text-white md:mx-3 md:rounded-[48px] md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
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

      <ul className="mt-16 border-t border-white/10 md:mt-20">
        {ETAPAS.map((e) => (
          <li key={e.titulo} data-revelar className="group relative border-b border-white/10">
            {/* Fundo que varre a linha no hover */}
            <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-700 ease-[cubic-bezier(.33,0,.2,1)] group-hover:scale-x-100" />
            <div className="relative mx-auto grid max-w-[1440px] gap-6 px-5 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] md:items-start md:px-10 md:py-10">
              <h3 className="text-2xl font-semibold tracking-tight transition-colors duration-500 group-hover:text-grafite md:text-3xl">
                {e.titulo}
              </h3>
              <ul className="space-y-2.5">
                {e.itens.map((it) => (
                  <li key={it} className="flex gap-3 text-sm text-white/60 transition-colors duration-500 group-hover:text-grafite md:text-base">
                    <span className="text-salmao">+</span>
                    {it}
                  </li>
                ))}
              </ul>
              <div className="flex items-stretch gap-3 max-md:absolute max-md:top-8 max-md:right-5">
                <div className="relative hidden h-[150px] w-[240px] lg:block">
                  <Image
                    src={e.foto}
                    alt=""
                    fill
                    sizes="240px"
                    className="rotate-[25deg] rounded-xl object-cover opacity-0 transition-[opacity,rotate] duration-[600ms] ease-[cubic-bezier(.33,0,.2,1)] group-hover:rotate-0 group-hover:opacity-100"
                  />
                </div>
                <span className="grid w-[52px] place-items-center rounded-xl bg-white/[0.07] text-white transition-colors duration-300 group-hover:bg-nevoa group-hover:text-grafite max-md:h-[52px] lg:h-[150px]">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div id="estilos" className="mx-auto mt-28 max-w-[1440px] px-5 md:mt-36 md:px-10">
        <div data-revelar className="mb-12 text-center">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-white/60 uppercase">Três linguagens. Um mesmo padrão.</p>
          <h2 className="mt-5 text-[clamp(2.2rem,4.6vw,4rem)] leading-none font-semibold tracking-tight uppercase">Descubra seu estilo</h2>
        </div>
        <div data-revelar>
          <PaineisEstilos inicial={1} />
        </div>
      </div>
    </section>
  );
}
