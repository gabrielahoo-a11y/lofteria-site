/**
 * Modelo do orçamento do cliente.
 * Os valores-base de cada tipologia NÃO ficam neste repositório: vêm do Supabase
 * (tabela orcamento_base) pela rota /api/orcamento-base. Ver supabase/orcamento_base.sql.
 */

export type Linha = "Urban" | "Eco" | "Slim";
export type Pacote = "Basic" | "Essential" | "Design";
export type Tipologia = "Studio" | "Spot" | "Loft" | "1D" | "2D" | "3D" | "4D";

/** As 17 categorias do modelo de orçamento atual da Lofteria. */
export const CATEGORIAS = [
  "Móveis Planejados",
  "Serralheria",
  "Pedras",
  "Vidros",
  "Estofados",
  "Cortinas",
  "Móveis Soltos",
  "Decorações",
  "Hidráulica",
  "Funcionais",
  "Iluminação Decorativa",
  "Iluminação Técnica",
  "Eletrodomésticos",
  "Insumos Gerais",
  "Mão de Obra",
  "Gestão",
  "Kits",
] as const;
export type Categoria = (typeof CATEGORIAS)[number];

import type { TipoComodo } from "./leitura";

type PorPacote = Record<Pacote, number>;
/** Orçamento-base de uma tipologia, como chega da rota /api/orcamento-base. */
export type BaseTipologia = {
  tipologia: Tipologia;
  /** Área de referência do orçamento-base (m²). */
  areaRef: number;
  /** Valor por categoria, por pacote (venda à vista). */
  categorias: Record<string, PorPacote>;
  /** Valor por ambiente, por pacote (Cozinha, Sala, Quarto 1, Banheiro 1, Geral…). */
  ambientes: Record<string, PorPacote>;
  /** Fração do total que a sacada representa (do base 3D), para tipologias sem sacada no base. */
  fracaoSacada: PorPacote;
};

export type Comodo = {
  id: string;
  nome: string;
  tipo: TipoComodo;
  area: number; // m²
  areaEstimada?: boolean;
  mobiliar: boolean;
  /** Posição na planta remontada, em frações (0–1) do contorno da unidade. */
  ret?: { x: number; y: number; w: number; h: number };
};

const r = (x: number, y: number, w: number, h: number) => ({ x: x / 7, y: (y + 1.5) / 9, w: w / 7, h: h / 9 });

/** O que a IA "leu" na planta de exemplo. */
export const PLANTA_EXEMPLO = {
  nome: "Planta exemplo · Apto 2D",
  areaTotal: 62,
  areaTotalEstimada: false,
  tipologia: "2D" as Tipologia,
  tipologiaDetectada: "2D" as Tipologia,
  proporcao: 7 / 9,
  avisos: [] as string[],
  comodos: [
    { id: "sacada", nome: "Sacada", tipo: "sacada", area: 6.6, mobiliar: true, ret: r(0, -1.5, 4.4, 1.5) },
    { id: "sala", nome: "Sala / Jantar", tipo: "living", area: 18.4, mobiliar: true, ret: r(0, 0, 4.6, 4) },
    { id: "cozinha", nome: "Cozinha", tipo: "cozinha", area: 7.2, mobiliar: true, ret: r(4.6, 0, 2.4, 3) },
    { id: "lavanderia", nome: "Lavanderia", tipo: "lavanderia", area: 2.6, mobiliar: true, ret: r(4.6, 3, 2.4, 1.1) },
    { id: "suite", nome: "Suíte", tipo: "suite", area: 11.8, mobiliar: true, ret: r(0, 4, 3.4, 3.5) },
    { id: "bwc-suite", nome: "BWC suíte", tipo: "banheiro", area: 3.4, mobiliar: true, ret: r(3.4, 4, 1.5, 2.3) },
    { id: "quarto", nome: "Quarto 2", tipo: "dormitorio", area: 8.9, mobiliar: true, ret: r(4.9, 4.1, 2.1, 3.4) },
    { id: "bwc", nome: "BWC social", tipo: "banheiro", area: 3.1, mobiliar: true, ret: r(3.4, 6.3, 1.5, 1.2) },
  ] satisfies Comodo[] as Comodo[],
};

/** Incerteza típica por categoria (± %) — viria do erro histórico de cada categoria. */
const INCERTEZA: Record<Categoria, number> = {
  "Móveis Planejados": 0.12,
  Serralheria: 0.35,
  Pedras: 0.18,
  Vidros: 0.2,
  Estofados: 0.15,
  Cortinas: 0.15,
  "Móveis Soltos": 0.2,
  Decorações: 0.3,
  Hidráulica: 0.15,
  Funcionais: 0.2,
  "Iluminação Decorativa": 0.4,
  "Iluminação Técnica": 0.25,
  Eletrodomésticos: 0.08,
  "Insumos Gerais": 0.3,
  "Mão de Obra": 0.18,
  Gestão: 0.05,
  Kits: 0.1,
};

export type LinhaOrcamento = {
  categoria: Categoria;
  minimo: number;
  provavel: number;
  maximo: number;
};

/* ---------- Cálculo a partir dos orçamentos-base da Lofteria ---------- */

/** Ajuste leve pela área: o valor depende mais dos cômodos que dos m². Limitado a −15% / +20%. */
const fatorArea = (area: number, ref: number) => (area > 0 ? Math.min(1.2, Math.max(0.85, Math.pow(area / ref, 0.35))) : 1); // sem área: sem ajuste

type Grupo = "cozinha" | "lavanderia" | "sala" | "quarto" | "banheiro" | "lavabo" | "sacada" | "geral";

/** Valor de cada tipo de cômodo no orçamento-base (tipologia + pacote), normalizado para fechar com o total por categoria. */
function valoresPorCômodo(base: BaseTipologia, p: Pacote): Record<Grupo, number> {
  const amb = base.ambientes;
  const cat = base.categorias;
  const v = (n: string) => amb[n]?.[p] ?? 0;
  const nomes = Object.keys(amb);
  const media = (filtro: (n: string) => boolean) => {
    const ns = nomes.filter(filtro);
    return ns.length ? ns.reduce((s, n) => s + v(n), 0) / ns.length : 0;
  };
  const totalAmb = nomes.reduce((s, n) => s + v(n), 0);
  const totalCat = Object.values(cat).reduce((s, c) => s + c[p], 0);
  const k = totalAmb > 0 ? totalCat / totalAmb : 1;
  const cozLav = v("Cozinha/Lavanderia");
  const banheiro = media((n) => n.startsWith("Banheiro"));
  const g: Record<Grupo, number> = {
    cozinha: v("Cozinha") || cozLav * 0.75,
    lavanderia: v("Lavanderia") || cozLav * 0.25,
    sala: v("Sala") || v("Sala Jantar") + v("Sala Estar"),
    quarto: media((n) => /^(Quarto|Suíte|Demi)/.test(n)),
    banheiro,
    lavabo: v("Lavabo") || banheiro * 0.7,
    sacada: v("Sacada") || base.fracaoSacada[p] * totalCat,
    geral: v("Geral"),
  };
  for (const key of Object.keys(g) as Grupo[]) g[key] *= k;
  return g;
}

/** Quanto cada cômodo da planta vale, pelo tipo. */
function valorDoCômodo(tipo: TipoComodo, g: Record<Grupo, number>, temLavanderia: boolean): number {
  switch (tipo) {
    case "living": return g.sala;
    case "cozinha": return g.cozinha + (temLavanderia ? 0 : g.lavanderia); // área de serviço junto da cozinha
    case "integrado": return g.sala + g.cozinha + (temLavanderia ? 0 : g.lavanderia);
    case "estudio": return g.sala + g.cozinha + g.quarto + (temLavanderia ? 0 : g.lavanderia);
    case "dormitorio":
    case "suite": return g.quarto;
    case "banheiro": return g.banheiro;
    case "lavabo": return g.lavabo;
    case "lavanderia": return g.lavanderia;
    case "sacada": return g.sacada;
    default: return 0;
  }
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/* ---------- Fluxo do cliente (site) ---------- */

export type Finalidade = "Short stay" | "Long stay" | "Morar";

export type Extras = {
  arQuartos: boolean;
  automacao: boolean;
  enxoval: boolean;
};

export const DESCRICAO_LINHA: Record<Linha, string> = {
  Urban: "Contemporânea e versátil, a mais pedida para short stay",
  Eco: "Materiais naturais, madeira e tons terrosos",
  Slim: "Linhas retas, essencial e funcional",
};

export const DESCRICAO_PACOTE: Record<Pacote, string> = {
  Basic: "Marcenaria, eletros e o essencial para usar",
  Essential: "Tudo do Basic + decoração e iluminação",
  Design: "Projeto completo, peças assinadas e acabamento premium",
};

/** Peso de cada tipo de cômodo em cada categoria (para dividir o valor por ambiente). */
const AFINIDADE_BASE: Partial<Record<Categoria, Partial<Record<TipoComodo, number>>>> = {
  "Móveis Planejados": { living: 1, cozinha: 1.6, lavanderia: 0.6, suite: 1.3, dormitorio: 1, banheiro: 0.5, lavabo: 0.3 },
  Pedras: { cozinha: 2, lavanderia: 0.6, banheiro: 1, lavabo: 0.6 },
  Vidros: { banheiro: 1 },
  Estofados: { living: 1.4, suite: 1, dormitorio: 0.8 },
  Cortinas: { living: 1, suite: 1, dormitorio: 1 },
  "Móveis Soltos": { living: 1.6, suite: 0.6, dormitorio: 0.6, sacada: 0.6 },
  Decorações: { living: 1.5, suite: 0.7, dormitorio: 0.5, sacada: 0.3, lavabo: 0.2 },
  Hidráulica: { cozinha: 1, lavanderia: 0.6, banheiro: 1, lavabo: 0.5 },
  Funcionais: { living: 0.6, banheiro: 1, lavanderia: 0.4, lavabo: 0.3 },
  Eletrodomésticos: { cozinha: 2.2, lavanderia: 1, living: 1 },
};
/** Ambientes integrados somam os pesos dos ambientes que juntam. */
const JUNTA: Partial<Record<TipoComodo, TipoComodo[]>> = {
  integrado: ["living", "cozinha"],
  estudio: ["living", "cozinha", "dormitorio"],
};
export function afinidade(cat: Categoria, tipo: TipoComodo): number {
  const base = AFINIDADE_BASE[cat];
  if (!base) return 0;
  const partes = JUNTA[tipo] ?? [tipo];
  return partes.reduce((s, t) => s + (base[t] ?? 0), 0);
}
export const CATEGORIAS_DE_AMBIENTE = Object.keys(AFINIDADE_BASE) as Categoria[];

export type ItemAmbiente = { id: string; nome: string; tipo?: TipoComodo; valor: number; destaques: string[] };

const DESTAQUES: Partial<Record<TipoComodo, string[]>> = {
  living: ["Sofá e mesa de jantar", "Painel de TV e TV", "Cortinas e iluminação"],
  cozinha: ["Armários planejados", "Bancada em pedra", "Geladeira, cooktop, forno e micro-ondas"],
  integrado: ["Sofá, mesa e painel de TV", "Cozinha planejada com bancada em pedra", "Eletrodomésticos completos"],
  estudio: ["Cama, sofá e mesa no mesmo ambiente", "Cozinha planejada", "Eletrodomésticos completos"],
  lavanderia: ["Armário aéreo", "Lava e seca"],
  suite: ["Roupeiro planejado", "Cama queen com colchão", "Cabeceira e cortina blackout"],
  dormitorio: ["Roupeiro planejado", "Cama e colchão", "Cortina blackout"],
  banheiro: ["Gabinete e bancada", "Box e espelho", "Metais e acessórios"],
  lavabo: ["Gabinete e espelho", "Metais e acessórios"],
  sacada: ["Mesa e cadeiras de área externa"],
};

/** Valores dos opcionais (estimativas a validar com a equipe: os orçamentos-base não trazem esses itens). */
export const VALOR_OPCIONAIS = { arPorQuarto: 2900, instalacaoArPorQuarto: 750, automacao: 4200, enxovalPorQuarto: 2000, enxovalBase: 2000 };

export function orcamentoCliente(params: {
  comodos: Comodo[];
  linha: Linha;
  pacote: Pacote;
  extras: Extras;
  base: BaseTipologia;
  areaTotal?: number;
}) {
  const ativos = params.comodos.filter((c) => c.mobiliar);
  const area = ativos.reduce((s, c) => s + c.area, 0);
  const g = valoresPorCômodo(params.base, params.pacote);
  const f = fatorArea(params.areaTotal ?? area, params.base.areaRef);
  const temLavanderia = ativos.some((c) => c.tipo === "lavanderia");
  const quartos = ativos.filter((c) => c.tipo === "suite" || c.tipo === "dormitorio" || c.tipo === "estudio").length;

  // 1) Valor por cômodo (orçamento-base da tipologia, ajustado pela área) + parte geral
  const porAmbiente = ativos.map((c) => ({ c, valor: valorDoCômodo(c.tipo, g, temLavanderia) * f }));
  const geral = g.geral;
  const somaComodos = porAmbiente.reduce((s, x) => s + x.valor, 0);
  const totalBase = somaComodos + geral;

  // 2) Categorias: mesma proporção do orçamento-base, escaladas para o total desta planta
  const cat = params.base.categorias;
  const totalCatBase = CATEGORIAS.reduce((s, c) => s + (cat[c]?.[params.pacote] ?? 0), 0) || 1;
  const escala = totalBase / totalCatBase;
  const extrasPorCat: Partial<Record<Categoria, number>> = {
    Eletrodomésticos: params.extras.arQuartos ? quartos * VALOR_OPCIONAIS.arPorQuarto : 0,
    "Mão de Obra": params.extras.arQuartos ? quartos * VALOR_OPCIONAIS.instalacaoArPorQuarto : 0,
    Kits:
      (params.extras.automacao ? VALOR_OPCIONAIS.automacao : 0) +
      (params.extras.enxoval ? VALOR_OPCIONAIS.enxovalBase + quartos * VALOR_OPCIONAIS.enxovalPorQuarto : 0),
  };
  const r10 = (v: number) => Math.max(0, Math.round(v / 10) * 10);
  const linhas: LinhaOrcamento[] = CATEGORIAS.map((categoria) => {
    const provavel = (cat[categoria]?.[params.pacote] ?? 0) * escala + (extrasPorCat[categoria] ?? 0);
    const inc = INCERTEZA[categoria];
    return { categoria, provavel: r10(provavel), minimo: r10(provavel * (1 - inc)), maximo: r10(provavel * (1 + inc)) };
  });

  const extrasTotal = Object.values(extrasPorCat).reduce((s, v) => s + (v ?? 0), 0);
  const ambientes: ItemAmbiente[] = porAmbiente
    .map(({ c, valor }) => ({ id: c.id, nome: c.nome, tipo: c.tipo, valor: r10(valor), destaques: DESTAQUES[c.tipo] ?? [] }))
    .filter((a) => a.valor > 0)
    .sort((a, b) => b.valor - a.valor);
  ambientes.push({
    id: "servicos",
    nome: "Gestão, instalação e opcionais",
    valor: r10(geral + extrasTotal),
    destaques: ["Gestão completa da obra", "Montagem, mão de obra e materiais", params.extras.enxoval ? "Enxoval de cama e banho" : "", params.extras.automacao ? "Automação (fechadura, luzes, ar)" : ""].filter(Boolean),
  });

  const total = linhas.reduce(
    (s, l) => ({ min: s.min + l.minimo, prov: s.prov + l.provavel, max: s.max + l.maximo }),
    { min: 0, prov: 0, max: 0 },
  );
  return { linhas, ambientes, total, area, tipologiaBase: params.base.tipologia };
}
