"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// "Etapas da Operação" sobre a foto do iceberg, no formato do slide da apresentação:
// título fixo à esquerda, etapas dos dois lados com uma linha até o iceberg.
// A seção fica presa e as etapas aparecem em ordem, do fundo (01) até a ponta (06).
// Posições em % da imagem (2000 × 1174): y da linha, início e fim da linha em x.
type Etapa = { n: string; titulo: string; texto: string; lado: "esq" | "dir"; y: number; de: number; ate: number };

const ETAPAS: Etapa[] = [
  { n: "01", titulo: "Alinhamento Inicial", texto: "Mapeamento de escopo, tipologias, perfil de cliente, cronograma, escopo financeiro e diretrizes técnicas.", lado: "esq", y: 86, de: 13, ate: 57.5 },
  { n: "02", titulo: "Desenvolvimento do Projeto", texto: "Criação do projeto completo pela equipe da Lofteria, com foco em estética, funcionalidade e execução escalável.", lado: "dir", y: 73, de: 67.5, ate: 87 },
  { n: "03", titulo: "Ativação Comercial", texto: "Entrega de materiais de venda (renders, memorial, Walk’a), com uso estratégico da base de leads da construtora.", lado: "esq", y: 66, de: 13, ate: 53 },
  { n: "04", titulo: "Planejamento da Execução", texto: "Definição da janela de montagem, fornecedores homologados, cronograma e logística no local.", lado: "dir", y: 57, de: 70.5, ate: 87 },
  { n: "05", titulo: "Execução", texto: "Montagem realizada pela Lofteria ou parceiros homologados, com atualizações periódicas e controle total da operação.", lado: "esq", y: 51.5, de: 13, ate: 50.5 },
  { n: "06", titulo: "Entrega Final", texto: "Unidade pronta para visitação, anúncio e uso comercial, com todos os materiais de apoio (físicos e digitais) incluídos.", lado: "dir", y: 22, de: 64, ate: 87 },
];

const Numero = ({ n }: { n: string }) => (
  <span className="grid size-[2.6em] shrink-0 place-items-center rounded-full bg-grafite-profundo/80 text-[1.05em] font-semibold text-white ring-1 ring-white/30 backdrop-blur">
    {n}
  </span>
);

export default function IcebergEtapas() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: raiz.current, start: "top top", end: "+=220%", pin: true, scrub: 1 },
        });
        tl.fromTo("[data-foto]", { yPercent: -3 }, { yPercent: 2, duration: 1 }, 0);
        ETAPAS.forEach((_, i) => {
          const em = 0.06 + i * 0.13;
          const el = `[data-etapa="${i}"]`;
          tl.fromTo(`${el} [data-linha]`, { scaleX: 0 }, { scaleX: 1, duration: 0.07, ease: "power2.out" }, em)
            .fromTo(`${el} [data-num]`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.04, ease: "back.out(2)" }, em)
            .fromTo(`${el} [data-texto]`, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.05 }, em + 0.03);
        });
        tl.fromTo("[data-cta]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.06 }, 0.86);
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="relative overflow-hidden bg-[#03101c] text-white lg:h-svh">
      {/* Foto com as etapas: no desktop cobre a tela; as posições seguem a imagem */}
      <div className="relative aspect-[2000/1174] w-full text-[0.9rem] lg:absolute lg:top-1/2 lg:left-1/2 lg:w-[max(100vw,calc(100svh*2000/1174))] lg:-translate-x-1/2 lg:-translate-y-1/2 xl:text-[1rem]">
        <div data-foto className="absolute inset-0">
          <Image src="/img/iceberg.webp" alt="Iceberg: a ponta acima da água e a maior parte submersa" fill sizes="100vw" unoptimized className="object-cover" />
        </div>

        {ETAPAS.map((e, i) => (
          <div key={e.n} data-etapa={i} className="absolute inset-0 max-lg:hidden">
            {/* Linha até o iceberg */}
            <span
              data-linha
              className={`absolute h-px bg-white/55 ${e.lado === "esq" ? "origin-left" : "origin-right"}`}
              style={{ top: `${e.y}%`, left: `${e.de}%`, width: `${e.ate - e.de}%` }}
            />
            {/* Número na ponta externa da linha */}
            <span
              data-num
              className="absolute"
              style={{ top: `${e.y}%`, left: `${e.lado === "esq" ? e.de : e.ate}%`, transform: "translate(-50%, -50%)" }}
            >
              <Numero n={e.n} />
            </span>
            {/* Título e texto abaixo da linha */}
            <div
              data-texto
              className={`absolute ${e.lado === "esq" ? "w-[26%] text-left" : "w-[20%] text-right"}`}
              style={{
                top: `calc(${e.y}% + 1.9em)`,
                ...(e.lado === "esq" ? { left: `calc(${e.de}% + 1.6em)` } : { right: `calc(${100 - e.ate}% + 1.6em)` }),
              }}
            >
              <h3 className="text-[1.35em] leading-tight font-semibold">{e.titulo}</h3>
              <p className="mt-[0.5em] text-[0.82em] leading-relaxed text-white/75">{e.texto}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Título fixo no canto, sobre o céu */}
      <div className="relative mx-auto max-w-[90rem] px-5 py-14 md:px-10 lg:absolute lg:inset-x-0 lg:top-0 lg:pt-[12svh]">
        <h2 className="text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[0.95] font-semibold tracking-[-0.02em]">
          Etapas da <br />
          Operação
        </h2>
        <p className="mt-5 text-lg text-white/85">
          Modelo estruturado em <strong className="font-semibold">6 fases principais</strong>
        </p>
        <Link data-cta href="/contato" className="botao botao-claro mt-8 max-lg:hidden">
          Agendar conversa
        </Link>

        {/* No celular, as etapas em lista */}
        <ol className="mt-10 space-y-6 lg:hidden">
          {ETAPAS.map((e) => (
            <li key={e.n} className="flex gap-4 text-[0.95rem]">
              <Numero n={e.n} />
              <div>
                <h3 className="text-lg font-semibold">{e.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{e.texto}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link href="/contato" className="botao botao-claro mt-10 lg:hidden">
          Agendar conversa
        </Link>
      </div>
    </section>
  );
}
