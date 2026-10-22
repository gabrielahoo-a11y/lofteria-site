"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ETAPAS = [
  {
    titulo: "Projeto",
    foto: "jantar-quadro",
    itens: ["Briefing e estudo de rentabilidade", "Projeto de interiores e marcenaria", "Escolha do estilo: Urban, Eco ou Slim", "Orçamento fechado antes da obra"],
  },
  {
    titulo: "Gestão e compras",
    foto: "cozinha-grafite",
    itens: ["Pedidos, cotações e negociação", "Logística e recebimento", "Conferência de cada entrega", "Controle de orçamento em tempo real"],
  },
  {
    titulo: "Execução",
    foto: "studio-integrado",
    itens: ["Seleção e contratação da mão de obra", "Pintura, elétrica e montagem", "Supervisão diária com cronograma rigoroso", "Vistoria final de qualidade"],
  },
  {
    titulo: "Instalação e automação",
    foto: "quarto-janela",
    itens: ["Pedras, móveis e eletrodomésticos", "Enxoval e utensílios completos", "Alexa, ar, TV e iluminação por voz", "Pronto para o primeiro hóspede"],
  },
];

const INCLUSOS = ["Ar-condicionado", "TV", "Cortinas", "Internet", "Alexa", "Armários", "Tapetes", "Mesa e cadeiras", "Forno embutido", "Cooktop", "Micro-ondas", "Iluminação", "Louças", "Talheres", "Utensílios", "Decoração"];

export default function Solucao() {
  const raiz = useRef<HTMLElement>(null);
  const [aberta, setAberta] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-etapa]", {
          y: 50,
          opacity: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-etapas]", start: "top 80%" },
        });
        gsap.to("[data-faixa]", { xPercent: -50, ease: "none", duration: 40, repeat: -1 });
      });
    },
    { scope: raiz },
  );

  return (
    <section id="solucao" ref={raiz} className="rounded-t-[32px] bg-grafite-profundo pt-24 text-white md:rounded-t-[48px] md:pt-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="rotulo mb-6 text-white/70">Nossa solução</p>
            <h2 className="titulo-lg max-w-[14ch]">
              Do projeto às chaves, <span className="font-light text-white/45">sem você gerenciar nada.</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="rotulo justify-end text-white/50">Entrega média</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              60<span className="text-salmao"> dias</span>
            </p>
          </div>
        </div>

        <div data-etapas className="mt-16 border-t border-white/10 md:mt-24">
          {ETAPAS.map((e, i) => {
            const ativa = aberta === i;
            return (
              <div key={e.titulo} data-etapa className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setAberta(ativa ? -1 : i)}
                  aria-expanded={ativa}
                  className="group grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 py-7 text-left md:grid-cols-[5rem_1fr_auto] md:py-9"
                >
                  <span className="text-sm text-salmao tabular-nums">0{i + 1}</span>
                  <span className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-salmao md:text-4xl">
                    {e.titulo}
                  </span>
                  <span
                    className={`grid size-11 place-items-center rounded-full border border-white/15 text-lg transition-transform duration-500 ${
                      ativa ? "rotate-45 bg-salmao" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${
                    ativa ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-8 pb-10 md:grid-cols-[5rem_1fr_1fr] md:gap-4">
                      <span className="hidden md:block" />
                      <ul className="space-y-3 text-white/70">
                        {e.itens.map((it) => (
                          <li key={it} className="flex gap-3">
                            <span className="text-salmao">+</span>
                            {it}
                          </li>
                        ))}
                      </ul>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                        <Image src={`/img/${e.foto}.jpg`} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tudo o que vem no apartamento */}
      <div className="mt-24 overflow-hidden border-y border-white/10 py-6 md:mt-32">
        <div data-faixa className="flex w-max gap-10 whitespace-nowrap">
          {[...INCLUSOS, ...INCLUSOS].map((item, i) => (
            <span key={i} className="flex items-center gap-10 text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
              {item}
              <span className="size-1.5 bg-salmao" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
