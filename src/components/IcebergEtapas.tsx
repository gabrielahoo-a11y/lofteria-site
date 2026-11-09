"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// "Etapas da Operação" sobre a foto do iceberg, no formato do slide da apresentação.
// No desktop a composição inteira funciona como um slide: a foto aparece sempre inteira
// na tela e título, linhas, números e textos são medidos pela largura dela (cqw), então
// nada corta nem se sobrepõe em nenhuma resolução. Abaixo de 1280 px vira lista.
// Posições em % da imagem (2000 × 1174): y da linha, início e fim da linha em x.
type Etapa = { n: string; titulo: string; texto: string; lado: "esq" | "dir"; y: number; de: number; ate: number };

const ETAPAS: Etapa[] = [
  { n: "01", titulo: "Alinhamento Inicial", texto: "Mapeamento de escopo, tipologias, perfil de cliente, cronograma, escopo financeiro e diretrizes técnicas.", lado: "esq", y: 80, de: 6, ate: 57.5 },
  { n: "02", titulo: "Desenvolvimento do Projeto", texto: "Criação do projeto completo pela equipe da Lofteria, com foco em estética, funcionalidade e execução escalável.", lado: "dir", y: 71, de: 67.5, ate: 94 },
  { n: "03", titulo: "Ativação Comercial", texto: "Entrega de materiais de venda (renders, memorial, Walk’a), com uso estratégico da base de leads da construtora.", lado: "esq", y: 64.5, de: 6, ate: 53 },
  { n: "04", titulo: "Planejamento da Execução", texto: "Definição da janela de montagem, fornecedores homologados, cronograma e logística no local.", lado: "dir", y: 55, de: 70.5, ate: 94 },
  { n: "05", titulo: "Execução", texto: "Montagem realizada pela Lofteria ou parceiros homologados, com atualizações periódicas e controle total da operação.", lado: "esq", y: 49, de: 6, ate: 50.5 },
  { n: "06", titulo: "Entrega Final", texto: "Unidade pronta para visitação, anúncio e uso comercial, com todos os materiais de apoio (físicos e digitais) incluídos.", lado: "dir", y: 17, de: 64, ate: 94 },
];

export default function IcebergEtapas() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1280px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: raiz.current, start: "top top", end: "+=220%", pin: true, scrub: 1 },
        });
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
    <section
      ref={raiz}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#0d2a45_0%,#0a2238_45%,#03101c_60%,#020a12_100%)] text-white xl:grid xl:h-svh xl:place-items-center"
    >
      {/* Desktop: o "slide" inteiro, sempre visível por completo */}
      <div className="@container relative hidden aspect-[2000/1174] w-[min(100vw,calc(100svh*2000/1174))] xl:block">
        {/* Versão ampliada da foto (mar e céu continuados nas bordas): o slide fica inteiro
            e a imagem preenche o resto da tela, sem faixas nas laterais nem em cima/embaixo */}
        <div className="pointer-events-none absolute top-[-22.4%] left-[-30%] h-[144.8%] w-[160%]">
          <Image src="/img/iceberg-amplo.webp" alt="Iceberg: a ponta acima da água e a maior parte submersa" fill sizes="160vw" unoptimized className="object-cover" />
        </div>

        <div className="absolute top-[9%] left-[6%]">
          <h2 className="text-[4.4cqw] leading-[0.95] font-semibold tracking-[-0.02em]">
            Etapas da <br />
            Operação
          </h2>
          <p className="mt-[0.9cqw] text-[1.25cqw] text-white/85">
            Modelo estruturado em <strong className="font-semibold">6 fases principais</strong>
          </p>
          <Link data-cta href="/contato" className="botao botao-claro mt-[1.8cqw] px-[1.6cqw]! py-[0.9cqw]! text-[0.8cqw]!">
            Agendar conversa
          </Link>
        </div>

        {ETAPAS.map((e, i) => (
          <div key={e.n} data-etapa={i} className="absolute inset-0">
            <span
              data-linha
              className={`absolute h-px bg-white/55 ${e.lado === "esq" ? "origin-left" : "origin-right"}`}
              style={{ top: `${e.y}%`, left: `${e.de}%`, width: `${e.ate - e.de}%` }}
            />
            <span
              data-num
              className="absolute grid size-[2.3cqw] place-items-center rounded-full bg-grafite-profundo/80 text-[0.95cqw] font-semibold ring-1 ring-white/30 backdrop-blur"
              style={{ top: `${e.y}%`, left: `${e.lado === "esq" ? e.de : e.ate}%`, transform: "translate(-50%, -50%)" }}
            >
              {e.n}
            </span>
            <div
              data-texto
              className={`absolute w-[24%] ${e.lado === "esq" ? "text-left" : "text-right"}`}
              style={{
                top: `calc(${e.y}% + 1.7cqw)`,
                ...(e.lado === "esq" ? { left: `calc(${e.de}% + 1.9cqw)` } : { right: `calc(${100 - e.ate}% + 1.9cqw)` }),
              }}
            >
              <h3 className="text-[1.3cqw] leading-tight font-semibold whitespace-nowrap">{e.titulo}</h3>
              <p className="mt-[0.4cqw] text-[0.86cqw] leading-[1.55] text-white/75">{e.texto}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Celular e tablet: foto e lista numerada */}
      <div className="xl:hidden">
        <div className="relative aspect-[2000/1174] w-full">
          <Image src="/img/iceberg.webp" alt="Iceberg: a ponta acima da água e a maior parte submersa" fill sizes="100vw" unoptimized className="object-cover" />
        </div>
        <div className="mx-auto max-w-3xl px-5 py-14 md:px-10">
          <h2 className="text-[clamp(2.4rem,7vw,4rem)] leading-[0.95] font-semibold tracking-[-0.02em]">Etapas da Operação</h2>
          <p className="mt-4 text-lg text-white/85">
            Modelo estruturado em <strong className="font-semibold">6 fases principais</strong>
          </p>
          <ol className="mt-10 space-y-6">
            {ETAPAS.map((e) => (
              <li key={e.n} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-semibold ring-1 ring-white/30">{e.n}</span>
                <div>
                  <h3 className="text-lg font-semibold">{e.titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{e.texto}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/contato" className="botao botao-claro mt-10">
            Agendar conversa
          </Link>
        </div>
      </div>
    </section>
  );
}
