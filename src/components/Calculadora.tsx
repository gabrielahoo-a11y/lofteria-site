"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ESTILOS,
  REGIOES,
  TIPOLOGIAS,
  brl,
  pct,
  simular,
  type Entrada,
  type Estilo,
  type Modalidade,
} from "@/lib/calculadora";
import FormularioLead from "./FormularioLead";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Número que desliza até o novo valor quando a simulação muda
function Animado({ valor, formato }: { valor: number; formato: (v: number) => string }) {
  const el = useRef<HTMLSpanElement>(null);
  const atual = useRef(valor);
  useEffect(() => {
    if (!Number.isFinite(valor)) {
      el.current!.textContent = "—";
      return;
    }
    const obj = { v: Number.isFinite(atual.current) ? atual.current : valor };
    const tween = gsap.to(obj, {
      v: valor,
      duration: 0.6,
      ease: "power3.out",
      onUpdate: () => {
        if (el.current) el.current.textContent = formato(obj.v);
      },
    });
    atual.current = valor;
    return () => {
      tween.kill();
    };
  }, [valor, formato]);
  return <span ref={el}>{Number.isFinite(valor) ? formato(valor) : "—"}</span>;
}

function Opcoes<T extends string>({
  rotulo,
  valor,
  opcoes,
  aoMudar,
}: {
  rotulo: string;
  valor: T;
  opcoes: { id: T; nome: string }[];
  aoMudar: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-texto-suave uppercase">{rotulo}</legend>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => aoMudar(o.id)}
            aria-pressed={valor === o.id}
            className={`rounded-full px-4 py-2.5 text-sm transition-all duration-300 ${
              valor === o.id
                ? "bg-grafite text-white"
                : "bg-white text-grafite ring-1 ring-linha hover:ring-grafite/40"
            }`}
          >
            {o.nome}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Deslizante({
  rotulo,
  valor,
  min,
  max,
  passo,
  formato,
  aoMudar,
}: {
  rotulo: string;
  valor: number;
  min: number;
  max: number;
  passo: number;
  formato: (v: number) => string;
  aoMudar: (v: number) => void;
}) {
  const progresso = ((valor - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-[11px] font-semibold tracking-[0.18em] text-texto-suave uppercase">{rotulo}</span>
        <span className="text-2xl font-semibold tracking-tight text-salmao tabular-nums md:text-3xl">{formato(valor)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor}
        onChange={(e) => aoMudar(Number(e.target.value))}
        className="deslizante mt-4 w-full"
        style={{ "--progresso": `${progresso}%` } as React.CSSProperties}
      />
      <span className="mt-2 flex justify-between text-xs text-texto-suave">
        <span>{formato(min)}</span>
        <span>{formato(max)}</span>
      </span>
    </label>
  );
}

const m2 = (v: number) => `${v} m²`;
const meses = (v: number) => `${Math.round(v)} meses`;
const pct1 = (v: number) => pct(v, 1);

export default function Calculadora() {
  const raiz = useRef<HTMLElement>(null);
  const [entrada, setEntrada] = useState<Entrada>({
    regiao: "norte-ilha",
    tipologia: "1d",
    area: 45,
    valorImovel: 650_000,
    modalidade: "temporada",
    estilo: "eco",
  });
  const [formAberto, setFormAberto] = useState(false);
  const r = useMemo(() => simular(entrada), [entrada]);
  const mudar = <K extends keyof Entrada>(k: K, v: Entrada[K]) => setEntrada((e) => ({ ...e, [k]: v }));

  const { investido, renda, valorizacao, total } = r.projecao;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-palavra-fundo]",
          { xPercent: 8 },
          { xPercent: -8, ease: "none", scrollTrigger: { trigger: raiz.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.from("[data-cartao-resultado]", {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-cartao-resultado]", start: "top 85%" },
        });
      });
    },
    { scope: raiz },
  );

  return (
    <section id="calculadora" ref={raiz} className="relative overflow-hidden py-28 md:py-40">
      <p
        data-palavra-fundo
        aria-hidden
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 text-[22vw] leading-none font-bold tracking-tighter whitespace-nowrap text-grafite/[0.04] select-none"
      >
        SIMULADOR
      </p>

      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-20">
        <div>
          <p className="rotulo mb-6 text-grafite">Para o investidor</p>
          <h2 className="titulo-lg max-w-[12ch] text-grafite">
            Quanto o seu imóvel <span className="font-light text-salmao">pode render?</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg font-light text-texto-suave">
            Ajuste os dados e veja, em segundos, o investimento na montagem, a renda estimada e em quanto tempo ela se
            paga.
          </p>

          <div className="mt-14 space-y-10">
            <Opcoes
              rotulo="Modalidade"
              valor={entrada.modalidade}
              opcoes={[
                { id: "temporada" as Modalidade, nome: "Temporada · Airbnb / Booking" },
                { id: "anual" as Modalidade, nome: "Locação anual" },
              ]}
              aoMudar={(v) => mudar("modalidade", v)}
            />
            <Opcoes
              rotulo="Região"
              valor={entrada.regiao}
              opcoes={REGIOES.map((x) => ({ id: x.id, nome: x.nome }))}
              aoMudar={(v) => mudar("regiao", v)}
            />
            <Opcoes
              rotulo="Tipologia"
              valor={entrada.tipologia}
              opcoes={TIPOLOGIAS.map((x) => ({ id: x.id, nome: x.nome }))}
              aoMudar={(v) => {
                const t = TIPOLOGIAS.find((x) => x.id === v)!;
                setEntrada((e) => ({ ...e, tipologia: v, area: t.areaPadrao }));
              }}
            />
            <Deslizante
              rotulo="Metragem"
              valor={entrada.area}
              min={20}
              max={180}
              passo={1}
              formato={m2}
              aoMudar={(v) => mudar("area", v)}
            />
            <Deslizante
              rotulo="Valor do imóvel"
              valor={entrada.valorImovel}
              min={250_000}
              max={5_000_000}
              passo={10_000}
              formato={brl}
              aoMudar={(v) => mudar("valorImovel", v)}
            />
            <Opcoes
              rotulo="Estilo do projeto"
              valor={entrada.estilo}
              opcoes={(Object.keys(ESTILOS) as Estilo[]).map((id) => ({ id, nome: ESTILOS[id].nome }))}
              aoMudar={(v) => mudar("estilo", v)}
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <div
            data-cartao-resultado
            className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-petroleo to-petroleo-profundo p-7 text-white shadow-2xl shadow-petroleo/30 md:p-10"
          >
            <svg aria-hidden viewBox="0 0 400 200" className="absolute -right-10 -bottom-10 w-[120%] opacity-[0.08]">
              {Array.from({ length: 14 }, (_, i) => (
                <path
                  key={i}
                  d={`M0 ${60 + i * 8} C 100 ${10 + i * 8}, 200 ${150 + i * 6}, 400 ${70 + i * 8}`}
                  fill="none"
                  stroke="white"
                />
              ))}
            </svg>

            <p className="text-[11px] font-semibold tracking-[0.2em] text-white/60 uppercase">Rentabilidade anual estimada</p>
            <p className="mt-3 text-6xl font-semibold tracking-tight tabular-nums md:text-7xl">
              <Animado valor={r.rentabilidadeAnual} formato={pct1} />
            </p>
            <p className="mt-2 text-sm text-white/60">sobre o total investido (imóvel + montagem)</p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-8">
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-white/55 uppercase">Renda líquida / mês</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  <Animado valor={r.receitaLiquidaMes} formato={brl} />
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-white/55 uppercase">Investimento na montagem</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  <Animado valor={r.investimentoMontagem} formato={brl} />
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-white/55 uppercase">A montagem se paga em</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  <Animado valor={r.paybackMeses} formato={meses} />
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-white/55 uppercase">
                  {entrada.modalidade === "temporada" ? "Diária média" : "Aluguel bruto / mês"}
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">
                  <Animado
                    valor={entrada.modalidade === "temporada" ? r.diariaMedia : r.receitaBrutaMes}
                    formato={brl}
                  />
                </dd>
              </div>
            </dl>

            <div className="mt-8 rounded-2xl bg-white/10 p-5">
              <p className="text-[11px] tracking-[0.16em] text-white/60 uppercase">Com a Lofteria × fazendo sozinho</p>
              <p className="mt-2 text-3xl font-semibold text-salmao tabular-nums">
                +<Animado valor={r.ganhoPrimeiroAnoVsSozinho} formato={brl} />
              </p>
              <p className="mt-1 text-sm text-white/65">no 1º ano: entrega em 60 dias e diárias até 17% maiores.</p>
            </div>

            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <p className="text-[11px] tracking-[0.16em] text-white/60 uppercase">Patrimônio em 5 anos</p>
                <p className="text-xl font-semibold tabular-nums">
                  <Animado valor={total} formato={brl} />
                </p>
              </div>
              <div className="mt-3 flex h-2 gap-1 overflow-hidden rounded-full">
                <span className="bg-white/80 transition-[flex-grow] duration-700" style={{ flexGrow: investido }} />
                <span className="bg-salmao transition-[flex-grow] duration-700" style={{ flexGrow: renda }} />
                <span className="bg-[#7fc3d3] transition-[flex-grow] duration-700" style={{ flexGrow: valorizacao }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/70">
                <span className="flex items-center gap-1.5">
                  <i className="size-2 rounded-full bg-white/80" /> Investido
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="size-2 rounded-full bg-salmao" /> Renda acumulada
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="size-2 rounded-full bg-[#7fc3d3]" /> Valorização
                </span>
              </div>
            </div>

            <button type="button" onClick={() => setFormAberto(true)} className="botao botao-claro mt-10 w-full">
              Receber estudo completo
            </button>
          </div>
          <p className="mt-5 px-2 text-xs leading-relaxed text-texto-suave">
            Simulação ilustrativa com parâmetros médios de mercado. Rentabilidade passada não garante resultados
            futuros. Um consultor da Lofteria valida cada estudo com os dados reais do seu imóvel.
          </p>
        </div>
      </div>

      <FormularioLead
        aberto={formAberto}
        aoFechar={() => setFormAberto(false)}
        origem="simulador"
        simulacao={{ entrada, resultado: r }}
      />
    </section>
  );
}
