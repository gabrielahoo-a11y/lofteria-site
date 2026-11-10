"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Textos da página "Para o investidor" do site atual
const LINHAS = [
  { tarefa: "Projeto", sem: "Projeto inviável" },
  { tarefa: "Orçamentos", sem: "Inúmeros orçamentos" },
  { tarefa: "Comprar e receber", sem: "Um por um" },
  { tarefa: "Contratar equipe", sem: "De 5 a 10 pessoas" },
  { tarefa: "Gerenciar obra", sem: "É com você" },
  { tarefa: "Imprevistos", sem: "Por sua conta" },
  { tarefa: "Decoração", sem: "Caríssima" },
  { tarefa: "Mobiliário", sem: "Sem design" },
  { tarefa: "Automação", sem: "Complexa" },
  { tarefa: "Manutenção", sem: "Sem manutenção" },
];

// As duas situações ficam lado a lado (sem alternância), para não haver confusão:
// cada etapa mostra, na mesma linha, como é sem a Lofteria e como é com a Lofteria.
export default function Comparativo() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-linha]", {
          opacity: 0,
          y: 18,
          duration: 0.7,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-tabela]", start: "top 80%" },
        });
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="bg-nevoa py-24 md:py-32">
      <div className="mx-auto max-w-[68.75rem] px-5 md:px-10">
        <p className="rotulo mb-6 text-grafite">Faça a comparação</p>
        <h2 className="titulo-lg max-w-[13ch] text-grafite">
          Quem cuida de <span className="font-light text-salmao">cada etapa?</span>
        </h2>

        <div data-tabela className="mt-12 overflow-hidden rounded-3xl bg-white ring-1 ring-linha" role="table" aria-label="Comparação: sem e com a Lofteria">
          {/* Cabeçalho */}
          <div role="row" className="grid grid-cols-2 border-b border-linha md:grid-cols-[1.1fr_1fr_1fr]">
            <span role="columnheader" className="hidden px-6 py-5 text-[0.6875rem] font-semibold tracking-[0.22em] text-texto-suave uppercase md:block">
              Etapa
            </span>
            <span role="columnheader" className="flex items-center gap-2 px-5 py-5 text-[0.6875rem] font-semibold tracking-[0.22em] text-grafite uppercase md:px-6">
              <span className="grid size-5 place-items-center rounded-full bg-grafite/10">
                <X className="size-3" strokeWidth={3} aria-hidden />
              </span>
              Sem Lofteria
            </span>
            <span role="columnheader" className="flex items-center gap-2 bg-salmao px-5 py-5 text-[0.6875rem] font-semibold tracking-[0.22em] text-white uppercase md:px-6">
              <span className="grid size-5 place-items-center rounded-full bg-white/25">
                <Check className="size-3" strokeWidth={3} aria-hidden />
              </span>
              Com Lofteria
            </span>
          </div>

          {LINHAS.map((l, i) => (
            <div
              key={l.tarefa}
              data-linha
              role="row"
              className={`grid grid-cols-2 md:grid-cols-[1.1fr_1fr_1fr] ${i < LINHAS.length - 1 ? "border-b border-linha" : ""}`}
            >
              {/* No celular a etapa ocupa a linha inteira, acima das duas colunas */}
              <span role="rowheader" className="col-span-2 px-5 pt-5 font-semibold text-grafite md:col-span-1 md:px-6 md:py-5">
                {l.tarefa}
              </span>
              <span role="cell" className="flex items-center gap-2 px-5 py-4 text-sm text-texto-suave md:px-6 md:py-5">
                <X className="size-4 shrink-0 text-grafite/40" strokeWidth={2.5} aria-hidden />
                {l.sem}
              </span>
              <span role="cell" className="flex items-center gap-2 bg-salmao/[0.06] px-5 py-4 text-sm font-medium text-grafite md:px-6 md:py-5">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-salmao text-white">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                A Lofteria cuida
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
