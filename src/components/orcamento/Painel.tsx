"use client";

import { useRef, useState, type ReactNode } from "react";
import { brl, type Categoria, type Extras, type ItemAmbiente, type LinhaOrcamento } from "@/lib/orcamento/modelo";
import { PRAZO_DIAS_UTEIS, rotuloCategoria, type cronograma } from "@/lib/orcamento/cronograma";

type Crono = ReturnType<typeof cronograma>;

export const mil = (v: number) =>
  v >= 1000 ? `R$ ${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: v >= 100000 ? 0 : 1 })} mil` : brl(v);
const curta = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

export function Cartao({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`vidro rounded-[24px] p-5 md:p-6 ${className}`}>{children}</div>;
}

export function TituloCartao({ children, extra }: { children: ReactNode; extra?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <h3 className="text-lg font-semibold">{children}</h3>
      {extra}
    </div>
  );
}

/* ---------- Composição do valor (barra de pílulas) ---------- */

const TONS = ["bg-petroleo text-white", "bg-[#1f7f95] text-white", "bg-[#5da4b4] text-white", "bg-petroleo-claro text-petroleo"];

export function BarraComposicao({ linhas }: { linhas: LinhaOrcamento[] }) {
  const total = linhas.reduce((s, l) => s + l.provavel, 0) || 1;
  const ord = [...linhas].filter((l) => l.provavel > 0).sort((a, b) => b.provavel - a.provavel);
  const top = ord.slice(0, 4);
  const resto = ord.slice(4).reduce((s, l) => s + l.provavel, 0);
  const segs = [
    ...top.map((l, i) => ({ nome: rotuloCategoria(l.categoria), valor: l.provavel, cls: TONS[i] })),
    { nome: `Outras ${ord.length - 4} categorias`, valor: resto, cls: "listrado border border-linha text-grafite" },
  ];
  return (
    <div>
      <div className="flex w-full gap-1.5">
        {segs.map((s) => {
          const p = Math.round((s.valor / total) * 100);
          return (
            <div key={s.nome} className="min-w-[44px]" style={{ flex: `${s.valor} 1 0` }} title={`${s.nome}: ${brl(s.valor)}`}>
              <p className="mb-1.5 hidden truncate text-xs text-texto-suave sm:block">{s.nome}</p>
              <div className={`flex h-10 items-center rounded-full px-3 text-xs font-semibold ${s.cls}`}>{p}%</div>
            </div>
          );
        })}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:hidden">
        {segs.map((s) => (
          <li key={s.nome} className="flex items-center gap-2">
            <span className={`h-3 w-3 shrink-0 rounded-full ${s.cls}`} />
            <span className="truncate text-texto-suave">{s.nome}</span>
            <span className="ml-auto font-semibold tabular-nums">{Math.round((s.valor / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Número grande ---------- */

export function NumeroGrande({ valor, unidade, rotulo, icone }: { valor: string; unidade?: string; rotulo: string; icone: string }) {
  return (
    <div className="min-w-0">
      <p className="whitespace-nowrap text-[clamp(1.45rem,7.4vw,2rem)] font-light leading-none tracking-tight sm:text-5xl 2xl:text-6xl">
        {valor}
        {unidade && <span className="ml-0.5 text-sm text-texto-suave sm:ml-1 sm:text-2xl">{unidade}</span>}
      </p>
      <p className="mt-2 flex items-center gap-1.5 whitespace-nowrap text-xs text-texto-suave">
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-petroleo-claro text-petroleo">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icone} />
          </svg>
        </span>
        {rotulo}
      </p>
    </div>
  );
}

/* ---------- Por ambiente (barras finas) ---------- */

const CURTO: Record<string, string> = {
  sala: "Sala", cozinha: "Coz.", suite: "Suíte", quarto: "Q2", lavanderia: "Lav.", "bwc-suite": "Ban.S", bwc: "Ban.", sacada: "Sac.", servicos: "Serv.",
};

const CURTO_TIPO: Record<string, string> = {
  living: "Sala", cozinha: "Coz.", integrado: "Living", estudio: "Estúdio", dormitorio: "Dorm.", suite: "Suíte",
  banheiro: "Ban.", lavabo: "Lavabo", lavanderia: "Lav.", sacada: "Sac.", circulacao: "Hall", outro: "Outro",
};
const curto = (a: ItemAmbiente) => CURTO[a.id] ?? (a.tipo ? CURTO_TIPO[a.tipo] : a.nome.slice(0, 5));

export function BarrasAmbientes({ ambientes: todos, prontos }: { ambientes: ItemAmbiente[]; prontos?: Record<string, Date> }) {
  // "Instalação, gestão e kits" não é um cômodo: sai das barras e vira uma linha à parte.
  const ambientes = todos.filter((a) => a.id !== "servicos");
  const servicos = todos.find((a) => a.id === "servicos");
  const max = Math.max(...ambientes.map((a) => a.valor), 1);
  const maior = ambientes.reduce((a, b) => (b.valor > a.valor ? b : a), ambientes[0]);
  const [ativo, setAtivo] = useState<string>(maior.id);
  const sel = ambientes.find((a) => a.id === ativo) ?? maior;

  // Rótulos curtos sem repetição (Ban. 1, Ban. 2)
  const base = ambientes.map(curto);
  const rotulos = base.map((r, i) => (base.filter((x) => x === r).length > 1 ? `${r} ${base.slice(0, i + 1).filter((x) => x === r).length}` : r));

  // Datas de "pronto" agrupadas: quase todos os cômodos ficam prontos juntos
  const grupos = new Map<string, string[]>();
  for (const a of ambientes) {
    const d = prontos?.[a.id];
    if (!d) continue;
    const k = curta(d);
    grupos.set(k, [...(grupos.get(k) ?? []), a.nome]);
  }
  const ordemGrupos = [...grupos.entries()].sort(([a], [b]) => a.split("/").reverse().join("").localeCompare(b.split("/").reverse().join("")));

  return (
    <div className="flex h-full flex-col">
      <p className="text-3xl font-light tracking-tight">{mil(sel.valor)}</p>
      <p className="text-xs text-texto-suave">
        {sel.nome}
        {prontos?.[sel.id] && <> · pronto em {curta(prontos[sel.id])}</>}
      </p>
      <div className="mt-4 flex h-36 items-end justify-between gap-1">
        {ambientes.map((a, i) => {
          const on = a.id === sel.id;
          return (
            <button
              key={a.id}
              type="button"
              onMouseEnter={() => setAtivo(a.id)}
              onFocus={() => setAtivo(a.id)}
              onClick={() => setAtivo(a.id)}
              className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
              aria-label={`${a.nome}: ${brl(a.valor)}`}
            >
              <span className="relative flex w-full flex-1 items-end justify-center">
                <span className="absolute inset-y-0 w-2.5 rounded-full bg-linha/60" />
                <span
                  className={`relative w-2.5 rounded-full transition-colors ${on ? "bg-salmao" : "bg-petroleo group-hover:bg-petroleo/80"}`}
                  style={{ height: `${Math.max(6, (a.valor / max) * 100)}%` }}
                />
              </span>
              <span className={`whitespace-nowrap text-[10px] ${on ? "font-semibold text-grafite" : "text-texto-suave"}`}>{rotulos[i]}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-texto-suave">
        <span className="h-2 w-2 rounded-full bg-salmao" /> Selecionado · toque numa barra
      </p>
      {ordemGrupos.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-linha pt-3 text-xs">
          {ordemGrupos.map(([d, nomes]) => (
            <li key={d} className="flex gap-2">
              <span className="shrink-0 font-semibold text-petroleo">Pronto {d}</span>
              <span className="text-texto-suave">{nomes.length === ambientes.length ? "todos os ambientes" : nomes.join(", ")}</span>
            </li>
          ))}
        </ul>
      )}
      {servicos && (
        <p className="mt-2 text-xs text-texto-suave">
          + Gestão, instalação e opcionais: <strong className="font-semibold text-grafite">{mil(servicos.valor)}</strong>
        </p>
      )}
    </div>
  );
}

/* ---------- Prazo (anel de 60 dias úteis) ---------- */

export function AnelPrazo({ c, inicioIso, onInicio }: { c: Crono; inicioIso: string; onInicio: (v: string) => void }) {
  const total = c.curva[c.curva.length - 1].acumulado || 1;
  const metade = c.curva.find((p) => p.acumulado >= total / 2)!;
  const inputRef = useRef<HTMLInputElement>(null);
  const R = 70, C = 2 * Math.PI * R;
  const fr = metade.i / PRAZO_DIAS_UTEIS;
  const ticks = Array.from({ length: PRAZO_DIAS_UTEIS }, (_, i) => i);
  return (
    <div className="flex h-full flex-col items-center">
      <div className="relative">
        <svg width="190" height="190" viewBox="0 0 190 190" role="img" aria-label={`Obra de ${PRAZO_DIAS_UTEIS} dias úteis; metade do investimento até ${curta(metade.data)}`}>
          {ticks.map((i) => {
            const a = (i / PRAZO_DIAS_UTEIS) * 2 * Math.PI - Math.PI / 2;
            const r1 = 88, r2 = i % 5 === 0 ? 81 : 84;
            return (
              <line key={i} x1={95 + r1 * Math.cos(a)} y1={95 + r1 * Math.sin(a)} x2={95 + r2 * Math.cos(a)} y2={95 + r2 * Math.sin(a)} stroke="var(--grafite-suave)" strokeOpacity={i % 5 === 0 ? 0.5 : 0.25} strokeWidth="1.2" />
            );
          })}
          <circle cx="95" cy="95" r={R} fill="none" stroke="var(--linha)" strokeWidth="12" />
          <circle cx="95" cy="95" r={R} fill="none" stroke="var(--petroleo)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${C * (1 - fr) - 4} ${C}`} strokeDashoffset={-C * fr - 2} transform="rotate(-90 95 95)" />
          <circle cx="95" cy="95" r={R} fill="none" stroke="var(--salmao)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${C * fr - 4} ${C}`} strokeDashoffset={-2} transform="rotate(-90 95 95)" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-light leading-none tracking-tight">{PRAZO_DIAS_UTEIS}</span>
          <span className="mt-1 text-xs text-texto-suave">dias úteis</span>
          <span className="text-[10px] text-texto-suave">seg. a sex. · ~3 meses</span>
        </div>
      </div>
      <div className="mt-3 flex w-full items-end justify-between gap-2">
        <div className="text-xs">
          <p className="flex items-center gap-1.5 text-texto-suave"><span className="h-2 w-2 rounded-full bg-salmao" />50% do valor até {curta(metade.data)}</p>
          <p className="mt-1">
            <span className="text-texto-suave">{curta(c.inicio)} →</span> <strong className="font-semibold">entrega {c.entrega.toLocaleDateString("pt-BR")}</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const el = inputRef.current;
            if (!el) return;
            try { el.showPicker(); } catch { el.focus(); }
          }}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-petroleo text-white shadow-md hover:brightness-110"
          aria-label="Mudar a data de início da obra"
          title="Mudar a data de início"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
          <input ref={inputRef} type="date" value={inicioIso} onChange={(e) => e.target.value && onInicio(e.target.value)} className="pointer-events-none absolute inset-0 opacity-0" tabIndex={-1} aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* ---------- Faixa de preço ---------- */

export function FaixaPreco({ total }: { total: { min: number; prov: number; max: number } }) {
  const var_ = Math.round(((total.max - total.min) / 2 / total.prov) * 100);
  const segs = [
    { r: "Mínimo", v: total.min, cls: "bg-petroleo-claro", f: 1 },
    { r: "Provável", v: total.prov, cls: "bg-petroleo", f: 1.6 },
    { r: "Máximo", v: total.max, cls: "listrado border border-linha", f: 1 },
  ];
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold whitespace-nowrap">Faixa estimada</h3>
        <span className="text-3xl font-light tracking-tight">±{var_}%</span>
      </div>
      <div className="flex gap-1.5">
        {segs.map((s) => (
          <div key={s.r} style={{ flex: `${s.f} 1 0` }}>
            <p className="text-[11px] text-texto-suave">{s.r}</p>
            <p className="mb-1.5 whitespace-nowrap text-xs font-semibold tabular-nums">{mil(s.v)}</p>
            <div className={`h-9 rounded-full ${s.cls}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Incluso (cartão escuro, interativo) ---------- */

const IC = {
  gestao: "M4 19h16M6 15l4-4 3 3 5-6",
  montagem: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z",
  ar: "M3 8h12a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8",
  automacao: "M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8",
  enxoval: "M3 7h18v10H3zM3 11h18M7 7V5h10v2",
};

export function CartaoIncluso({ extras, onAlternar }: { extras: Extras; onAlternar: (k: keyof Extras) => void }) {
  const itens: { id: string; titulo: string; sub: string; icone: string; ativo: boolean; chave?: keyof Extras }[] = [
    { id: "g", titulo: "Gestão completa da\u00a0obra", sub: "Do pedido à entrega das chaves", icone: IC.gestao, ativo: true },
    { id: "m", titulo: "Montagem e\u00a0instalação", sub: "Equipe e fornecedores Lofteria", icone: IC.montagem, ativo: true },
    { id: "a", titulo: "Ar-condicionado nos\u00a0quartos", sub: "Opcional · a sala já tem", icone: IC.ar, ativo: extras.arQuartos, chave: "arQuartos" },
    { id: "u", titulo: "Automação", sub: "Opcional · fechadura, luzes e ar", icone: IC.automacao, ativo: extras.automacao, chave: "automacao" },
    { id: "e", titulo: "Enxoval completo", sub: "Opcional · cama, banho e cozinha", icone: IC.enxoval, ativo: extras.enxoval, chave: "enxoval" },
  ];
  const n = itens.filter((i) => i.ativo).length;
  return (
    <div className="rounded-[24px] bg-grafite-profundo p-5 text-white">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold leading-tight">Incluso no orçamento</h3>
        <span className="text-3xl font-light">
          {n}/{itens.length}
        </span>
      </div>
      <ul className="space-y-1">
        {itens.map((i) => (
          <li key={i.id}>
            <button
              type="button"
              disabled={!i.chave}
              onClick={() => i.chave && onAlternar(i.chave)}
              className={`flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition ${i.chave ? "hover:bg-white/10" : "cursor-default"}`}
              aria-pressed={i.chave ? i.ativo : undefined}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${i.ativo ? "bg-white/15" : "bg-white/5"}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={i.icone} /></svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-sm leading-tight ${i.ativo ? "font-semibold" : "text-white/60"}`}>{i.titulo}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-white/60">{i.sub}</span>
              </span>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${i.ativo ? "bg-salmao" : "border border-white/40"}`}>
                {i.ativo && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 px-2 text-[11px] text-white/60">Toque nos opcionais para incluir ou tirar. Valores dos opcionais são estimativas.</p>
    </div>
  );
}

/* ---------- Por categoria (acordeão) ---------- */

const GRUPOS: { nome: string; cats: Categoria[] }[] = [
  { nome: "Marcenaria e\u00a0acabamentos", cats: ["Móveis Planejados", "Pedras", "Vidros", "Serralheria"] },
  { nome: "Mobiliário e\u00a0decoração", cats: ["Estofados", "Móveis Soltos", "Decorações", "Cortinas"] },
  { nome: "Equipamentos e\u00a0iluminação", cats: ["Eletrodomésticos", "Iluminação Decorativa", "Iluminação Técnica", "Hidráulica", "Funcionais"] },
  { nome: "Serviços e\u00a0kits", cats: ["Mão de Obra", "Gestão", "Insumos Gerais", "Kits"] },
];

export function AcordeaoCategorias({ linhas }: { linhas: LinhaOrcamento[] }) {
  const [aberto, setAberto] = useState(0);
  const por = new Map(linhas.map((l) => [l.categoria, l]));
  return (
    <ul className="divide-y divide-linha">
      {GRUPOS.map((g, gi) => {
        const ls = g.cats.map((c) => por.get(c)).filter((l): l is LinhaOrcamento => !!l && l.provavel > 0);
        const soma = ls.reduce((s, l) => s + l.provavel, 0);
        const on = aberto === gi;
        return (
          <li key={g.nome}>
            <button type="button" onClick={() => setAberto(on ? -1 : gi)} className="flex w-full items-center justify-between gap-3 py-3 text-left" aria-expanded={on}>
              <span className="text-sm">{g.nome}</span>
              <span className="flex items-center gap-2">
                <span className="whitespace-nowrap text-sm font-semibold tabular-nums">{mil(soma)}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition ${on ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
              </span>
            </button>
            {on && (
              <ul className="mb-3 space-y-2">
                {ls.map((l) => (
                  <li key={l.categoria} className="flex items-center justify-between gap-3 rounded-xl bg-nevoa px-3 py-2">
                    <span className="min-w-0">
                      <span className="block truncate text-sm">{rotuloCategoria(l.categoria)}</span>
                      <span className="text-[11px] text-texto-suave tabular-nums">
                        {mil(l.minimo)} – {mil(l.maximo)}
                      </span>
                    </span>
                    <span className="whitespace-nowrap text-sm font-semibold tabular-nums">{brl(l.provavel)}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Projetos entregues (carrossel) ---------- */

export function FotoProjetos({ fotos }: { fotos: { nome: string; legenda: string; foto: string }[] }) {
  const [i, setI] = useState(0);
  const f = fotos[i];
  return (
    <div className="relative h-full min-h-[300px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_rgba(50,60,68,0.35)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={f.foto} alt={`${f.nome}, projeto entregue pela Lofteria`} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-grafite/85 via-grafite/10 to-transparent" />
      <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-grafite backdrop-blur">Projetos entregues pela Lofteria</span>
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold">{f.nome}</p>
          <p className="truncate text-xs text-white/80">{f.legenda}</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setI((i + d + fotos.length) % fotos.length)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur hover:bg-white/25"
              aria-label={d < 0 ? "Foto anterior" : "Próxima foto"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d={d < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} /></svg>
            </button>
          ))}
        </div>
      </div>
      <div className="absolute right-4 top-4 flex gap-1">
        {fotos.map((x, j) => (
          <span key={x.nome} className={`h-1.5 rounded-full transition-all ${j === i ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
}
