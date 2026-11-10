"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// "Etapas da Operação" em camadas (céu, água, iceberg e textos), com paralaxe na rolagem
// e ondulação na linha d'água.
//
// As imagens são 32:9 (4814 × 1354 px) com o iceberg no centro. A área útil é uma janela
// 2000 × 1174 no meio delas: essa janela sempre aparece inteira na tela, e as laterais
// e a folga vertical preenchem o resto em qualquer proporção. Título, linhas e textos
// usam % dessa janela e cqw (largura dela), por isso não cortam nem se sobrepõem.
const PALCO = { left: -70.35, top: -7.67, width: 240.7, height: 115.33 }; // palco 32:9 em % da janela
const ICEBERG = { left: 45.64, top: 28.8, width: 8.77, height: 59.97 }; // recorte do iceberg em % do palco

type Etapa = { n: string; titulo: string; texto: string; lado: "esq" | "dir"; y: number; de: number; ate: number };

// y, de e ate em % da janela. O iceberg ocupa de ~39,5% a ~60,5% na horizontal.
const ETAPAS: Etapa[] = [
  { n: "01", titulo: "Alinhamento Inicial", texto: "Mapeamento de escopo, tipologias, perfil de cliente, cronograma, escopo financeiro e diretrizes técnicas.", lado: "esq", y: 80, de: 6, ate: 46.5 },
  { n: "02", titulo: "Desenvolvimento do Projeto", texto: "Criação do projeto completo pela equipe da Lofteria, com foco em estética, funcionalidade e execução escalável.", lado: "dir", y: 71, de: 56.5, ate: 94 },
  { n: "03", titulo: "Ativação Comercial", texto: "Entrega de materiais de venda (renders, memorial, Walk’a), com uso estratégico da base de leads da construtora.", lado: "esq", y: 65, de: 6, ate: 43.5 },
  { n: "04", titulo: "Planejamento da Execução", texto: "Definição da janela de montagem, fornecedores homologados, cronograma e logística no local.", lado: "dir", y: 56, de: 58, ate: 94 },
  { n: "05", titulo: "Execução", texto: "Montagem realizada pela Lofteria ou parceiros homologados, com atualizações periódicas e controle total da operação.", lado: "esq", y: 51, de: 6, ate: 42 },
  { n: "06", titulo: "Entrega Final", texto: "Unidade pronta para visitação, anúncio e uso comercial, com todos os materiais de apoio (físicos e digitais) incluídos.", lado: "dir", y: 17, de: 52, ate: 94 },
];

const pct = (o: { left: number; top: number; width: number; height: number }) => ({
  left: `${o.left}%`,
  top: `${o.top}%`,
  width: `${o.width}%`,
  height: `${o.height}%`,
});

// Paralaxe com o mouse: cada camada se desloca proporcionalmente à "profundidade" (px no
// extremo da tela). Usa a propriedade CSS translate, separada do transform da rolagem.
const prof = (k: number) => ({ translate: `calc(var(--mx, 0) * ${k}px) calc(var(--my, 0) * ${k}px)` });

// Céu, água (com a ondulação na faixa da superfície) e iceberg, empilhados
function Camadas() {
  return (
    <div data-palco className="pointer-events-none absolute" style={pct(PALCO)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-ceu src="/img/iceberg/ceu.webp" alt="" className="absolute inset-0 h-full w-full" style={prof(-8)} />
      <div data-agua className="absolute inset-0" style={prof(10)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/iceberg/agua.webp" alt="" className="absolute inset-0 h-full w-full" />
        {/* Faixa da superfície com ondulação (filtro SVG animado) */}
        <div className="absolute inset-x-0 top-[40%] h-[14%] overflow-hidden" style={{ filter: "url(#ondas)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/iceberg/agua.webp" alt="" className="absolute inset-x-0 top-[-285.7%] h-[714.3%] w-full max-w-none" />
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-iceberg
        src="/img/iceberg/iceberg.webp"
        alt="Iceberg: a ponta acima da água e a maior parte submersa"
        className="absolute"
        style={{ ...pct(ICEBERG), ...prof(24) }}
      />
    </div>
  );
}

export default function IcebergEtapas() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1280px) and (prefers-reduced-motion: no-preference)", () => {
        // Paralaxe na rolagem (seção presa por pouco tempo): o céu quase parado ao fundo;
        // água, iceberg e textos sobem juntos à frente
        const h = () => window.innerHeight;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: raiz.current, start: "top top", end: "+=80%", pin: true, scrub: 1 },
          })
          .fromTo("[data-ceu]", { y: () => -h() * 0.015 }, { y: () => h() * 0.015, duration: 1 }, 0)
          .fromTo(["[data-agua]", "[data-iceberg]", "[data-textos]"], { y: () => h() * 0.03 }, { y: () => -h() * 0.03, duration: 1 }, 0);

        // As etapas entram sozinhas, em sequência, assim que a seção aparece na tela
        const entrada = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        ETAPAS.forEach((_, i) => {
          const el = `[data-etapa="${i}"]`;
          const em = 0.2 + i * 0.22;
          entrada
            .fromTo(`${el} [data-linha]`, { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, em)
            .fromTo(`${el} [data-num]`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, em)
            .fromTo(`${el} [data-texto]`, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, em + 0.15);
        });
        entrada.fromTo("[data-cta]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2 + ETAPAS.length * 0.22);
        ScrollTrigger.create({ trigger: raiz.current, start: "top 55%", once: true, onEnter: () => entrada.play() });
      });

      // Paralaxe com o mouse (só em telas grandes com mouse): o fundo vai para um lado,
      // a água e o iceberg para o outro, com suavização
      mm.add("(min-width: 1280px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const el = raiz.current!;
        const pos = { x: 0, y: 0 };
        const aplicar = () => {
          el.style.setProperty("--mx", pos.x.toFixed(4));
          el.style.setProperty("--my", pos.y.toFixed(4));
        };
        const irX = gsap.quickTo(pos, "x", { duration: 1.2, ease: "power3.out", onUpdate: aplicar });
        const irY = gsap.quickTo(pos, "y", { duration: 1.2, ease: "power3.out", onUpdate: aplicar });
        const mover = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          irX(((e.clientX - r.left) / r.width) * 2 - 1);
          irY(((e.clientY - r.top) / r.height) * 2 - 1);
        };
        const sair = () => {
          irX(0);
          irY(0);
        };
        el.addEventListener("pointermove", mover);
        el.addEventListener("pointerleave", sair);
        return () => {
          el.removeEventListener("pointermove", mover);
          el.removeEventListener("pointerleave", sair);
          el.style.removeProperty("--mx");
          el.style.removeProperty("--my");
        };
      });
    },
    { scope: raiz },
  );

  return (
    <section
      ref={raiz}
      className="relative overflow-hidden bg-[#02070d] text-white xl:bg-[linear-gradient(180deg,#00112a_0%,#0c2c4a_42%,#020c18_52%,#000000_100%)] xl:grid xl:h-svh xl:place-items-center"
    >
      {/* Filtro da ondulação: ruído animado que desloca a faixa da superfície */}
      <svg aria-hidden className="absolute size-0">
        <filter id="ondas" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.06" numOctaves="2" seed="3" result="ruido">
            <animate attributeName="baseFrequency" dur="14s" values="0.004 0.06;0.006 0.09;0.004 0.06" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Desktop: janela 2000 × 1174 sempre inteira; as camadas 32:9 preenchem em volta */}
      <div className="@container relative hidden aspect-[2000/1174] w-[min(100vw,calc(100svh*2000/1174))] xl:block">
        <Camadas />

        <div data-textos className="absolute inset-0" style={prof(16)}>
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
      </div>

      {/* Celular e tablet: a cena em camadas e a lista numerada */}
      <div className="xl:hidden">
        <div className="relative aspect-[2000/1174] w-full overflow-hidden">
          <Camadas />
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
