"use client";

import { useEffect, useRef, useState } from "react";
import { brl } from "@/lib/orcamento/modelo";
import { ETAPAS_FIXAS_FIM, ETAPAS_FIXAS_INICIO, PRAZO_DIAS_UTEIS, type cronograma } from "@/lib/orcamento/cronograma";

type Crono = ReturnType<typeof cronograma>;

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const curta = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
const pct = (n: number) => `${(n / PRAZO_DIAS_UTEIS) * 100}%`;
const milhar = (v: number) => (v >= 1000 ? `R$ ${Math.round(v / 1000)} mil` : brl(v));

/** Posição (em dias úteis) do primeiro dia útil de cada mês dentro da obra. */
function marcasDeMes(c: Crono) {
  const marcas: { i: number; rotulo: string }[] = [];
  let mesAnterior = c.curva[0].data.getMonth();
  for (const p of c.curva) {
    const m = p.data.getMonth();
    if (m !== mesAnterior) marcas.push({ i: p.i, rotulo: MESES[m] });
    mesAnterior = m;
  }
  return marcas;
}

function useLargura<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/* ---------------- Gantt ---------------- */

export function GanttObra({ c }: { c: Crono }) {
  const [ativa, setAtiva] = useState<string | null>(null);
  const meses = marcasDeMes(c);

  const linhaFixa = (e: { rotulo: string; de: number; ate: number }) => (
    <div key={e.rotulo} className="contents">
      <span className="truncate py-1 text-xs text-texto-suave">{e.rotulo}</span>
      <div className="relative h-6">
        <span
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-petroleo"
          style={{ left: pct(e.de), width: `max(6px, ${pct(e.ate - e.de)})` }}
        />
      </div>
    </div>
  );

  return (
    <div>
      {/* Celular: lista simples em vez do gráfico */}
      <ol className="space-y-2 md:hidden">
        <li className="flex items-center justify-between gap-3 rounded-2xl bg-nevoa px-3 py-2 text-sm">
          <span className="text-texto-suave">Início da obra</span>
          <strong className="font-semibold">{curta(c.inicio)}</strong>
        </li>
        {c.trilhas.map((t) => (
          <li key={t.categoria} className="rounded-2xl border border-linha px-3 py-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold">{t.rotulo}</span>
              <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-petroleo">pronto {curta(t.vistoria)}</span>
            </div>
            <div className="relative mt-1.5 h-1.5 rounded-full bg-linha/70">
              <span className="absolute inset-y-0 rounded-full bg-salmao/40" style={{ left: pct(t.dc), width: pct(t.dr - t.dc) }} />
              <span className="absolute inset-y-0 rounded-full bg-salmao" style={{ left: pct(t.dr), width: `max(3px, ${pct(t.dv - t.dr)})` }} />
            </div>
            <p className="mt-1 text-[11px] text-texto-suave">Pedido {curta(t.compra)} · chega {curta(t.chegada)}</p>
          </li>
        ))}
        <li className="flex items-center justify-between gap-3 rounded-2xl bg-petroleo px-3 py-2 text-sm text-white">
          <span>Entrega das chaves</span>
          <strong className="font-semibold">{c.entrega.toLocaleDateString("pt-BR")}</strong>
        </li>
      </ol>
    <div className="-mx-2 hidden overflow-x-auto px-2 md:block">
      <div className="relative min-w-[540px]">
        {/* grade de meses + linha de entrega */}
        <div className="pointer-events-none absolute inset-y-0 left-32 right-0 md:left-40" aria-hidden>
          {meses.map((m) => (
            <div key={m.i} className="absolute inset-y-0 border-l border-linha" style={{ left: pct(m.i) }}>
              {PRAZO_DIAS_UTEIS - m.i > 6 && (
                <span className="absolute -top-0.5 left-1 text-[11px] font-semibold uppercase text-texto-suave">{m.rotulo}</span>
              )}
            </div>
          ))}
          <div className="absolute inset-y-0 border-l-2 border-dashed border-grafite" style={{ left: pct(PRAZO_DIAS_UTEIS) }}>
            <span className="absolute -top-0.5 right-1.5 whitespace-nowrap text-[11px] font-semibold uppercase">Entrega</span>
          </div>
        </div>

        <div className="grid grid-cols-[8rem_1fr] gap-x-0 pt-6 md:grid-cols-[10rem_1fr]">
          {ETAPAS_FIXAS_INICIO.map(linhaFixa)}
          <div className="col-span-2 my-1 border-t border-linha" />

          {c.trilhas.map((t) => {
            const aberta = ativa === t.categoria;
            return (
              <div key={t.categoria} className="contents">
                <span className={`truncate py-1 text-sm ${aberta ? "font-semibold" : ""}`}>{t.rotulo}</span>
                <button
                  type="button"
                  className="group relative h-7 text-left"
                  onMouseEnter={() => setAtiva(t.categoria)}
                  onMouseLeave={() => setAtiva(null)}
                  onFocus={() => setAtiva(t.categoria)}
                  onBlur={() => setAtiva(null)}
                  onClick={() => setAtiva(aberta ? null : t.categoria)}
                  aria-label={`${t.rotulo}: pedido em ${curta(t.compra)}, chegada em ${curta(t.chegada)}, pronto em ${curta(t.vistoria)}`}
                >
                  <span className={`absolute inset-y-0.5 inset-x-0 rounded-md ${aberta ? "bg-nevoa" : ""}`} />
                  {/* produção e logística */}
                  <span className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-l-full bg-salmao/40" style={{ left: pct(t.dc), width: pct(t.dr - t.dc) }} />
                  {/* instalação */}
                  <span className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-r-full bg-salmao" style={{ left: pct(t.dr), width: `max(4px, ${pct(t.dv - 1 - t.dr)})` }} />
                  {/* pedido */}
                  <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-grafite ring-2 ring-branco" style={{ left: pct(t.dc) }} />
                  {/* vistoria */}
                  <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-grafite ring-2 ring-branco" style={{ left: pct(t.dv) }} />
                  {aberta && (
                    <span
                      className="absolute bottom-full z-10 mb-1 w-max -translate-x-1/2 rounded-xl bg-grafite px-3 py-2 text-xs text-white shadow-lg"
                      style={{ left: `clamp(110px, ${pct((t.dc + t.dv) / 2)}, calc(100% - 110px))` }}
                    >
                      <strong className="block text-sm">{t.rotulo}</strong>
                      Pedido {curta(t.compra)} · Chegada {curta(t.chegada)} · Pronto {curta(t.vistoria)}
                      <span className="block text-white/70">{brl(t.valor)}</span>
                    </span>
                  )}
                </button>
              </div>
            );
          })}

          <div className="col-span-2 my-1 border-t border-linha" />
          {ETAPAS_FIXAS_FIM.map(linhaFixa)}
          <span className="py-1 text-xs font-semibold">Entrega das chaves</span>
          <div className="relative h-6">
            <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-salmao" style={{ left: pct(PRAZO_DIAS_UTEIS) }} />
          </div>
        </div>
      </div>

      <ul className="mt-5 hidden flex-wrap gap-x-5 gap-y-2 text-xs text-texto-suave md:flex">
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rotate-45 bg-grafite" />Pedido</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-5 rounded-full bg-salmao/40" />Produção e entrega</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-5 rounded-full bg-salmao" />Instalação</li>
        <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-grafite" />Pronto e conferido</li>
        <li className="flex items-center gap-2"><span className="h-2 w-5 rounded-full bg-petroleo" />Etapas da obra</li>
      </ul>
    </div>
    </div>
  );
}

/* ---------------- Curva de gastos ---------------- */

export function CurvaGastos({ c }: { c: Crono }) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const total = c.curva[c.curva.length - 1].acumulado || 1;
  const H = 240;
  const m = { t: 16, r: 12, b: 28, l: 64 };
  const W = Math.max(largura, 220);
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const x = (i: number) => m.l + (i / PRAZO_DIAS_UTEIS) * iw;
  const y = (v: number) => m.t + ih - (v / total) * ih;

  // degraus: o valor sobe no dia em que é pago
  let d = `M${x(0)},${y(0)}`;
  let prev = 0;
  for (const p of c.curva) {
    d += ` L${x(p.i)},${y(prev)} L${x(p.i)},${y(p.acumulado)}`;
    prev = p.acumulado;
  }
  const area = `${d} L${x(PRAZO_DIAS_UTEIS)},${y(0)} Z`;
  const metade = c.curva.find((p) => p.acumulado >= total / 2)!;
  const meses = marcasDeMes(c);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const ponto = hover != null ? c.curva[hover] : null;

  const mover = (clientX: number, el: SVGSVGElement) => {
    const r = el.getBoundingClientRect();
    const i = Math.round(((clientX - r.left - m.l) / iw) * PRAZO_DIAS_UTEIS);
    setHover(Math.min(PRAZO_DIAS_UTEIS, Math.max(0, i)));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(260px,320px)]">
    <div>
      <p className="text-sm font-light text-texto-suave">
        Metade do investimento sai até <strong className="font-semibold text-grafite">{curta(metade.data)}</strong>, quando
        os principais pedidos são feitos. O restante acompanha a chegada dos itens.
      </p>
      <div ref={ref} className="relative mt-4">
        {largura > 0 && (
          <svg
            width={W}
            height={H}
            className="block touch-none"
            role="img"
            aria-label={`Gasto acumulado ao longo da obra, de ${curta(c.inicio)} a ${curta(c.entrega)}, total ${brl(total)}`}
            onMouseMove={(e) => mover(e.clientX, e.currentTarget)}
            onMouseLeave={() => setHover(null)}
            onTouchMove={(e) => mover(e.touches[0].clientX, e.currentTarget)}
            onTouchEnd={() => setHover(null)}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={m.l} x2={W - m.r} y1={y(total * t)} y2={y(total * t)} stroke="var(--linha)" />
                <text x={m.l - 8} y={y(total * t) + 4} textAnchor="end" fontSize="11" fill="var(--grafite-suave)">
                  {milhar(total * t)}
                </text>
              </g>
            ))}
            {meses.map((mm) => (
              <text key={mm.i} x={x(mm.i) + 4} y={H - 8} fontSize="11" fontWeight="600" fill="var(--grafite-suave)">
                {mm.rotulo.toUpperCase()}
              </text>
            ))}
            <path d={area} fill="var(--petroleo)" opacity="0.12" />
            <path d={d} fill="none" stroke="var(--petroleo)" strokeWidth="2" strokeLinejoin="round" />
            <line x1={x(PRAZO_DIAS_UTEIS)} x2={x(PRAZO_DIAS_UTEIS)} y1={m.t} y2={m.t + ih} stroke="var(--grafite)" strokeDasharray="3 3" />
            <circle cx={x(metade.i)} cy={y(metade.acumulado)} r="4" fill="var(--salmao)" stroke="var(--branco)" strokeWidth="2" />
            {ponto && (
              <g>
                <line x1={x(ponto.i)} x2={x(ponto.i)} y1={m.t} y2={m.t + ih} stroke="var(--grafite)" strokeOpacity="0.4" />
                <circle cx={x(ponto.i)} cy={y(ponto.acumulado)} r="4.5" fill="var(--petroleo)" stroke="var(--branco)" strokeWidth="2" />
              </g>
            )}
          </svg>
        )}
        {ponto && (
          <div
            className="pointer-events-none absolute top-0 z-10 w-max max-w-[240px] rounded-xl bg-grafite px-3 py-2 text-xs text-white shadow-lg"
            style={{ left: Math.max(0, Math.min(x(ponto.i) - 110, W - 230)) }}
          >
            <strong className="block text-sm">{curta(ponto.data)}</strong>
            Acumulado: {brl(Math.round(ponto.acumulado / 10) * 10)} ({Math.round((ponto.acumulado / total) * 100)}%)
            {ponto.itens.filter((it) => it.valor >= 300).length > 0 && (
              <span className="mt-1 block text-white/75">
                Neste dia: {ponto.itens.filter((it) => it.valor >= 300).map((it) => it.categoria).slice(0, 3).join(", ")}
              </span>
            )}
          </div>
        )}
      </div>

    </div>
      <div className="grid grid-cols-2 content-start gap-3">
        {c.porMes.map((mm) => (
          <div key={mm.data.toISOString()} className="rounded-2xl bg-nevoa p-4">
            <p className="text-xs font-semibold uppercase text-texto-suave">
              {MESES[mm.data.getMonth()]} {mm.data.getFullYear()}
            </p>
            <p className="text-lg font-semibold tabular-nums">{brl(Math.round(mm.valor / 10) * 10)}</p>
            <p className="text-xs font-light text-texto-suave">{mm.principais.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
