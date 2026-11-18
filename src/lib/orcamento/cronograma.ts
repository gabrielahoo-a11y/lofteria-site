import { afinidade, type Categoria, type ItemAmbiente, type LinhaOrcamento } from "./modelo";

/*
  Prazos padrão por categoria, em dias úteis a partir do início da obra (obra-base de 60 dias úteis).
  Fonte: "Gerador de Marcos Temporais da Obra" da Lofteria (lofteria.com.br/gerador-marcos), tabela SLA.
  compra = dia do pedido · chegada = entrega do fornecedor e início da instalação · vistoria = conferência final.
*/
type Sla = { compra: number; producao: number; instalacao: number };

const SLA: Record<string, Sla> = {
  "Vidros": { compra: 5, producao: 10, instalacao: 1 },
  "Iluminação Decorativa": { compra: 5, producao: 45, instalacao: 3 },
  "Móveis Planejados": { compra: 5, producao: 40, instalacao: 10 },
  "Iluminação Técnica": { compra: 10, producao: 5, instalacao: 3 },
  "Cortinas": { compra: 10, producao: 30, instalacao: 1 },
  "Estofados": { compra: 10, producao: 40, instalacao: 2 },
  "Móveis Soltos": { compra: 10, producao: 40, instalacao: 2 },
  "Funcionais": { compra: 17, producao: 30, instalacao: 2 },
  "Hidráulica": { compra: 17, producao: 30, instalacao: 3 },
  "Decorações": { compra: 20, producao: 30, instalacao: 2 },
  "Pedras": { compra: 27, producao: 20, instalacao: 2 },
  "Serralheria": { compra: 35, producao: 10, instalacao: 10 },
  "Eletrodomésticos": { compra: 45, producao: 5, instalacao: 2 },
  "Kits": { compra: 50, producao: 5, instalacao: 1 }, // enxoval, utensílios e kit anfitrião
};

const ROTULO: Partial<Record<Categoria, string>> = { Kits: "Enxoval e kits", Cortinas: "Cortinas e persianas" };

/** Categorias sem trilha própria: o gasto é distribuído ao longo da obra. */
const DISTRIBUIDAS: Partial<Record<Categoria, [number, number]>> = {
  "Gestão": [0, 60],
  "Mão de Obra": [2, 56],
  "Insumos Gerais": [2, 56],
};

export const PRAZO_DIAS_UTEIS = 60;

export function somarDiasUteis(inicio: Date, n: number) {
  const d = new Date(inicio.getTime());
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  let a = 0;
  while (a < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) a++;
  }
  return d;
}

/**
  Data de início sugerida: primeira segunda-feira útil de janeiro (as obras costumam começar no início do ano),
  quando janeiro está a até 4 meses; senão, a primeira segunda-feira a pelo menos 30 dias de hoje.
*/
export function inicioSugerido(hoje = new Date()) {
  const janeiro = new Date(hoje.getMonth() === 0 && hoje.getDate() < 5 ? hoje.getFullYear() : hoje.getFullYear() + 1, 0, 2);
  while (janeiro.getDay() !== 1) janeiro.setDate(janeiro.getDate() + 1);
  const dias = (janeiro.getTime() - hoje.getTime()) / 86400000;
  if (dias >= 7 && dias <= 125) return janeiro;
  const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 30);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  return d;
}

export const isoData = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const lerIso = (v: string) => {
  const [a, m, d] = v.split("-").map(Number);
  return a && m && d ? new Date(a, m - 1, d) : null;
};

export type Trilha = {
  categoria: Categoria;
  rotulo: string;
  valor: number;
  compra: Date;
  chegada: Date;
  vistoria: Date;
  /** posições em dias úteis */
  dc: number;
  dr: number;
  dv: number;
};

export type Etapa = { rotulo: string; de: number; ate: number };

export const ETAPAS_FIXAS_INICIO: Etapa[] = [
  { rotulo: "Solicitações iniciais", de: 0, ate: 1 },
  { rotulo: "Visita inicial à obra", de: 1, ate: 2 },
];
export const ETAPAS_FIXAS_FIM: Etapa[] = [
  { rotulo: "Limpeza", de: PRAZO_DIAS_UTEIS - 4, ate: PRAZO_DIAS_UTEIS - 2 },
  { rotulo: "Fotos e vídeo", de: PRAZO_DIAS_UTEIS - 2, ate: PRAZO_DIAS_UTEIS - 1 },
];

/**
  Premissa de pagamento (a validar com o financeiro): 50% no pedido e 50% na chegada de cada categoria;
  gestão, mão de obra e insumos distribuídos por igual no período em que acontecem.
*/
export function cronograma(inicio: Date, linhas: LinhaOrcamento[]) {
  const dia = (n: number) => somarDiasUteis(inicio, n);
  const trilhas: Trilha[] = [];
  const gastoPorDia: { categoria: Categoria; valor: number }[][] = Array.from({ length: PRAZO_DIAS_UTEIS + 1 }, () => []);

  for (const l of linhas) {
    if (l.provavel <= 0) continue;
    const sla = SLA[l.categoria];
    if (sla) {
      const dc = sla.compra;
      const dr = dc + sla.producao;
      const dv = dr + sla.instalacao + 1;
      trilhas.push({
        categoria: l.categoria,
        rotulo: ROTULO[l.categoria] ?? l.categoria,
        valor: l.provavel,
        compra: dia(dc),
        chegada: dia(dr),
        vistoria: dia(dv),
        dc,
        dr,
        dv,
      });
      gastoPorDia[dc].push({ categoria: l.categoria, valor: l.provavel / 2 });
      gastoPorDia[dr].push({ categoria: l.categoria, valor: l.provavel / 2 });
      continue;
    }
    const [de, ate] = DISTRIBUIDAS[l.categoria] ?? [0, PRAZO_DIAS_UTEIS];
    const n = ate - de + 1;
    for (let i = de; i <= ate; i++) gastoPorDia[i].push({ categoria: l.categoria, valor: l.provavel / n });
  }
  trilhas.sort((a, b) => a.dc - b.dc || a.dr - b.dr);

  // Curva acumulada, um ponto por dia útil.
  let acumulado = 0;
  const curva = gastoPorDia.map((itens, i) => {
    const doDia = itens.reduce((s, x) => s + x.valor, 0);
    acumulado += doDia;
    return { i, data: dia(i), doDia, acumulado, itens };
  });

  // Resumo por mês (também serve de tabela para leitura sem o gráfico).
  const meses = new Map<string, { data: Date; valor: number; cats: Map<string, number> }>();
  for (const p of curva) {
    const chave = `${p.data.getFullYear()}-${p.data.getMonth()}`;
    if (!meses.has(chave)) meses.set(chave, { data: new Date(p.data.getFullYear(), p.data.getMonth(), 1), valor: 0, cats: new Map() });
    const m = meses.get(chave)!;
    for (const it of p.itens) {
      m.valor += it.valor;
      const r = ROTULO[it.categoria] ?? it.categoria;
      m.cats.set(r, (m.cats.get(r) ?? 0) + it.valor);
    }
  }
  const porMes = [...meses.values()].map((m) => ({
    data: m.data,
    valor: m.valor,
    principais: [...m.cats.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c),
  }));

  return { inicio: dia(0), entrega: dia(PRAZO_DIAS_UTEIS), trilhas, curva, porMes, dia };
}

export const rotuloCategoria = (c: Categoria) => ROTULO[c] ?? c;

/**
  Quando cada ambiente fica pronto: a última vistoria entre as categorias que entram nele
  (ex.: cozinha = planejados, pedras, hidráulica, eletrodomésticos). Serviços e kits ficam prontos na entrega.
*/
export function prontoPorAmbiente(c: ReturnType<typeof cronograma>, ambientes: ItemAmbiente[]) {
  const pronto: Record<string, Date> = {};
  for (const a of ambientes) {
    if (!a.tipo) {
      pronto[a.id] = c.entrega;
      continue;
    }
    const ultimas = c.trilhas.filter((t) => afinidade(t.categoria, a.tipo!) > 0).map((t) => t.dv);
    pronto[a.id] = ultimas.length ? c.dia(Math.max(...ultimas)) : c.entrega;
  }
  return pronto;
}
