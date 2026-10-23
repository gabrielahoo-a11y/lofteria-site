"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Check, X } from "lucide-react";

gsap.registerPlugin(useGSAP);

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

export default function Comparativo() {
  const raiz = useRef<HTMLElement>(null);
  const [com, setCom] = useState(true);
  const { contextSafe } = useGSAP({ scope: raiz });

  const alternar = contextSafe((valor: boolean) => {
    if (valor === com) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCom(valor);
      return;
    }
    gsap.to("[data-estado]", {
      rotationX: 90,
      opacity: 0,
      duration: 0.22,
      stagger: 0.03,
      ease: "power2.in",
      onComplete: () => {
        setCom(valor);
        gsap.fromTo(
          "[data-estado]",
          { rotationX: -90, opacity: 0 },
          { rotationX: 0, opacity: 1, duration: 0.45, stagger: 0.03, ease: "back.out(1.6)" },
        );
      },
    });
  });

  return (
    <section ref={raiz} className="bg-nevoa py-24 md:py-32">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="rotulo mb-6 text-grafite">Faça a comparação</p>
            <h2 className="titulo-lg max-w-[13ch] text-grafite">
              Quem cuida de <span className="font-light text-salmao">cada etapa?</span>
            </h2>
          </div>
          <div role="radiogroup" aria-label="Cenário" className="flex rounded-full bg-white p-1.5 shadow-sm ring-1 ring-linha">
            {[
              { v: false, rotulo: "Sem Lofteria" },
              { v: true, rotulo: "Com Lofteria" },
            ].map((o) => (
              <button
                key={o.rotulo}
                type="button"
                role="radio"
                aria-checked={com === o.v}
                onClick={() => alternar(o.v)}
                className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase transition-colors duration-300 ${
                  com === o.v ? (o.v ? "bg-salmao text-white" : "bg-grafite text-white") : "text-grafite hover:bg-nevoa"
                }`}
              >
                {o.rotulo}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-linha [perspective:800px] sm:grid-cols-2">
          {LINHAS.map((l) => (
            <li key={l.tarefa} className="flex items-center justify-between gap-4 bg-white px-6 py-5">
              <span className="font-semibold text-grafite">{l.tarefa}</span>
              <span data-estado className="flex items-center gap-2 text-sm whitespace-nowrap">
                {com ? (
                  <>
                    <span className="text-petroleo">A Lofteria cuida</span>
                    <span className="grid size-6 place-items-center rounded-full bg-salmao text-white">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-texto-suave">{l.sem}</span>
                    <span className="grid size-6 place-items-center rounded-full bg-grafite/10 text-grafite">
                      <X className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
