"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PROJETOS, foto, type Projeto } from "@/lib/projetos";

gsap.registerPlugin(useGSAP);

type Tipo = Projeto["tipo"];

const FILTROS: { id: Tipo | "todos"; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "studio", rotulo: "Studio e loft" },
  { id: "spot", rotulo: "Spot" },
  { id: "1d", rotulo: "1 dormitório" },
  { id: "2d", rotulo: "2 dormitórios" },
  { id: "3d", rotulo: "3 ou mais" },
];

export default function ListaProjetos() {
  const raiz = useRef<HTMLElement>(null);
  const [filtro, setFiltro] = useState<Tipo | "todos">("todos");
  const visiveis = PROJETOS.filter((p) => filtro === "todos" || p.tipo === filtro);

  // Os cartões entram em sequência sempre que o filtro muda
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-cartao-projeto]",
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.05, ease: "expo.out" },
      );
    },
    { scope: raiz, dependencies: [filtro] },
  );

  return (
    <section ref={raiz} className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <h2 className="titulo-md max-w-[18ch] text-grafite">
          {PROJETOS.length} projetos em destaque <span className="font-light text-texto-suave">de mais de 350 entregues</span>
        </h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipologia">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              aria-pressed={filtro === f.id}
              className={`rounded-full px-4 py-2.5 text-sm transition-all duration-300 ${
                filtro === f.id ? "bg-grafite text-white" : "bg-white text-grafite ring-1 ring-linha hover:ring-grafite/40"
              }`}
            >
              {f.rotulo}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visiveis.map((p) => (
          <li key={p.slug} data-cartao-projeto className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-grafite-profundo">
            <Image
              src={foto(p)}
              alt={`Apartamento ${p.nome} montado pela Lofteria`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-[11px] tracking-[0.16em] text-white/70 uppercase">
                {p.tipologia} · {p.local}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight transition-transform duration-500 group-hover:-translate-y-1">
                {p.nome}
              </h3>
            </div>
          </li>
        ))}
      </ul>
      {visiveis.length === 0 && (
        <p className="mt-14 text-texto-suave">Nenhum projeto com essa tipologia na lista por enquanto.</p>
      )}
    </section>
  );
}
