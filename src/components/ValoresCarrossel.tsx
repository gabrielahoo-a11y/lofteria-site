"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Simbolo } from "./Logo";

// Valores do manual de marca (Rebranding 2025)
const VALORES = [
  { titulo: "Conexão", texto: "Valorizamos pessoas e relações." },
  { titulo: "Comprometimento", texto: "Excelência em cada detalhe." },
  { titulo: "Inovação e evolução", texto: "Aprendizado constante e mentalidade criativa." },
  { titulo: "Experiência única", texto: "Surpreender e encantar em cada entrega." },
  { titulo: "Responsabilidade", texto: "Crescimento sustentável e consciente, social e ambiental." },
];

// Carrossel com setas e barra de progresso, no lugar do "time" da referência
export default function ValoresCarrossel() {
  const trilho = useRef<HTMLUListElement>(null);
  const [progresso, setProgresso] = useState(0);
  const [inicio, setInicio] = useState(true);
  const [fim, setFim] = useState(false);

  useEffect(() => {
    const el = trilho.current!;
    const medir = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgresso(max > 0 ? el.scrollLeft / max : 1);
      setInicio(el.scrollLeft < 4);
      setFim(el.scrollLeft > max - 4);
    };
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      el.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, []);

  const rolar = (direcao: 1 | -1) => {
    const el = trilho.current!;
    const cartao = el.querySelector("li");
    el.scrollBy({ left: direcao * ((cartao?.clientWidth ?? 300) + 16), behavior: "smooth" });
  };

  return (
    <section className="bg-nevoa py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="rotulo mb-6 text-grafite">Valores</p>
            <h2 className="titulo-lg text-grafite">
              Únicos <span className="font-light text-texto-suave">de propósito</span>
            </h2>
          </div>
          <div className="flex gap-2">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => rolar(d)}
                disabled={d === -1 ? inicio : fim}
                aria-label={d === -1 ? "Valor anterior" : "Próximo valor"}
                className="grid size-11 place-items-center rounded-full bg-grafite text-white transition-all hover:bg-salmao disabled:bg-grafite/15 disabled:text-grafite/40"
              >
                {d === -1 ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
              </button>
            ))}
          </div>
        </div>

        <ul
          ref={trilho}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {VALORES.map((v, i) => (
            <li
              key={v.titulo}
              className="group relative flex aspect-[4/5] w-[78vw] max-w-[340px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[22px] bg-grafite-profundo p-7 text-white sm:w-[40vw] lg:w-[23vw]"
            >
              <Simbolo className="absolute -right-10 -bottom-10 w-56 text-white/[0.04] transition-all duration-1000 group-hover:-rotate-12 group-hover:text-salmao/20" />
              <span className="text-xs text-salmao tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div className="relative">
                <h3 className="text-3xl font-semibold tracking-tight">{v.titulo}</h3>
                <p className="mt-3 max-w-[22ch] font-light text-white/65">{v.texto}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 h-px bg-linha">
          <div className="h-px origin-left bg-grafite transition-transform duration-300" style={{ transform: `scaleX(${Math.max(0.15, progresso)})` }} />
        </div>
      </div>
    </section>
  );
}
