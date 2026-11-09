"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { semViuva } from "@/lib/texto";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Etapas da parceria como um iceberg: acima da linha d'água fica o que a construtora vê
// (a unidade pronta); abaixo, tudo o que a Lofteria resolve. Ao rolar, cada etapa acende
// o ponto correspondente no iceberg.

const SUPERFICIE = {
  titulo: "Entrega final",
  texto: "Unidade pronta para visitação, anúncio e uso comercial, com todos os materiais de apoio físicos e digitais.",
};

const SUBMERSAS = [
  {
    titulo: "Alinhamento inicial",
    texto: "Mapeamento de escopo, tipologias, perfil de cliente, cronograma, escopo financeiro e diretrizes técnicas.",
  },
  {
    titulo: "Planejamento da execução",
    texto: "Definição da janela de montagem, fornecedores homologados, cronograma e logística no local.",
  },
  {
    titulo: "Desenvolvimento do projeto",
    texto: "Projeto completo feito pela equipe da Lofteria, com foco em estética, funcionalidade e execução escalável.",
  },
  {
    titulo: "Execução",
    texto: "Montagem pela Lofteria ou por parceiros homologados, com atualizações periódicas e controle total da operação.",
  },
  {
    titulo: "Ativação comercial",
    texto: "Materiais de venda (renders, memorial e Walk’a), com uso estratégico da base de leads da construtora.",
  },
];

// Pontos no desenho (viewBox 0 0 400 640): o primeiro acima d'água, os demais descendo
const PONTOS = [
  { x: 205, y: 92 },
  { x: 150, y: 250 },
  { x: 250, y: 318 },
  { x: 170, y: 392 },
  { x: 236, y: 462 },
  { x: 196, y: 538 },
];

function Iceberg({ ativo }: { ativo: number }) {
  return (
    <svg viewBox="0 0 400 640" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ice-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f7f8" />
          <stop offset="1" stopColor="#dbe6ea" />
        </linearGradient>
        <linearGradient id="ice-mar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b5566" />
          <stop offset="0.5" stopColor="#173543" />
          <stop offset="1" stopColor="#0d1f28" />
        </linearGradient>
        <linearGradient id="ice-topo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9dbe2" />
        </linearGradient>
        <linearGradient id="ice-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fc3d3" stopOpacity="0.75" />
          <stop offset="1" stopColor="#3f8197" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill="url(#ice-ceu)" />
      <rect y="160" width="400" height="480" fill="url(#ice-mar)" />

      <g className="iceberg-flutua">
        {/* Parte visível */}
        <path d="M120 160 L168 104 L196 58 L214 78 L238 50 L262 108 L292 160 Z" fill="url(#ice-topo)" />
        <path d="M196 58 L214 78 L206 160 L168 104 Z" fill="#ffffff" opacity="0.7" />
        <path d="M238 50 L262 108 L292 160 L244 160 Z" fill="#b7cdd6" opacity="0.6" />
        {/* Parte submersa */}
        <path
          d="M108 160 L292 160 L330 232 L312 330 L292 420 L256 520 L206 600 L160 540 L120 450 L82 360 L76 262 Z"
          fill="url(#ice-base)"
        />
        <path d="M108 160 L206 160 L150 300 L76 262 Z" fill="#a9d5e2" opacity="0.18" />
        <path d="M206 160 L292 160 L330 232 L250 330 Z" fill="#cdeaf2" opacity="0.12" />
        <path d="M150 300 L250 330 L292 420 L206 600 L120 450 Z" fill="#7cb4c6" opacity="0.14" />
      </g>

      {/* Linha d'água */}
      <path d="M0 160 H400" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" />
      <path className="iceberg-onda" d="M0 164 Q50 158 100 164 T200 164 T300 164 T400 164" stroke="#ffffff" strokeOpacity="0.25" fill="none" />

      {PONTOS.map((p, i) => (
        <g key={i} className="transition-opacity duration-500" opacity={i === ativo ? 1 : 0.45}>
          <circle cx={p.x} cy={p.y} r={i === ativo ? 14 : 6} fill="#e46f6b" opacity="0.25" className="transition-all duration-500" />
          <circle cx={p.x} cy={p.y} r="5" fill={i === ativo ? "#e46f6b" : "#ffffff"} className="transition-colors duration-500" />
        </g>
      ))}
    </svg>
  );
}

export default function IcebergEtapas() {
  const raiz = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState(0);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-etapa]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (st) => st.isActive && setAtivo(i),
        });
      });
    },
    { scope: raiz },
  );

  const todas = [SUPERFICIE, ...SUBMERSAS];

  return (
    <section ref={raiz} className="bg-grafite-profundo text-white">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-[10svh] lg:h-[80svh] lg:self-start">
          <p className="rotulo text-white/60">Como funciona a parceria</p>
          <h2 className="titulo-lg mt-6 max-w-[16ch]">
            A construtora vê a entrega. <span className="font-light text-white/45">O resto fica com a gente.</span>
          </h2>
          <div className="mx-auto mt-10 aspect-[400/640] max-h-[52svh] overflow-hidden rounded-[28px] lg:mx-0">
            <Iceberg ativo={ativo} />
          </div>
        </div>

        <ol className="lg:pt-[18svh]">
          {todas.map((e, i) => (
            <li
              key={e.titulo}
              data-etapa
              className={`border-t border-white/10 py-10 transition-opacity duration-500 lg:min-h-[34svh] ${i === ativo ? "opacity-100" : "lg:opacity-35"}`}
            >
              <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-salmao uppercase">
                {i === 0 ? "Acima da linha d’água" : "Abaixo da linha d’água"}
              </p>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{e.titulo}</h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed font-light text-white/65">{semViuva(e.texto)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
