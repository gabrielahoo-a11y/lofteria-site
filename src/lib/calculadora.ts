// Simulador de investimento da Lofteria.
//
// ATENÇÃO: todos os números de PARAMETROS são PROVISÓRIOS, só para a prévia.
// Antes de publicar, o comercial/financeiro precisa trocar pelos valores reais
// (custo de montagem por m², diárias e ocupação por região, taxas e valorização).

export type Modalidade = "temporada" | "anual";
export type Estilo = "urban" | "eco" | "slim";

export const REGIOES = [
  { id: "norte-ilha", nome: "Florianópolis · Norte da Ilha", fatorDiaria: 1.15, ocupacao: 0.68 },
  { id: "lagoa", nome: "Florianópolis · Lagoa e Leste", fatorDiaria: 1.05, ocupacao: 0.64 },
  { id: "centro", nome: "Florianópolis · Centro", fatorDiaria: 0.9, ocupacao: 0.72 },
  { id: "penha", nome: "Penha · Litoral Norte", fatorDiaria: 0.95, ocupacao: 0.6 },
] as const;

export const TIPOLOGIAS = [
  { id: "studio", nome: "Studio", areaPadrao: 30, diariaBase: 320 },
  { id: "1d", nome: "1 dormitório", areaPadrao: 45, diariaBase: 420 },
  { id: "2d", nome: "2 dormitórios", areaPadrao: 70, diariaBase: 580 },
  { id: "3d", nome: "3+ dormitórios", areaPadrao: 110, diariaBase: 820 },
] as const;

export const ESTILOS: Record<Estilo, { nome: string; descricao: string; custoM2: number }> = {
  urban: { nome: "Urban", descricao: "Design atemporal", custoM2: 2900 },
  eco: { nome: "Eco", descricao: "Conforto e sofisticação", custoM2: 3200 },
  slim: { nome: "Slim", descricao: "Tecnologia e inovação", custoM2: 3500 },
};

export const PARAMETROS = {
  // Temporada (Airbnb / Booking)
  taxaGestaoTemporada: 0.2,
  taxaPlataforma: 0.05,
  custoFixoM2Mes: 12, // condomínio, energia, internet… por m²
  // Anual
  aluguelAnualPctMes: 0.0055, // aluguel mensal como % do valor do imóvel
  taxaGestaoAnual: 0.08,
  // Patrimônio
  valorizacaoMontagem: 0.1, // quanto o imóvel montado vale a mais que o cru
  valorizacaoAnual: 0.06,
  // Comparativo "fazendo sozinho"
  ganhoDiariaLofteria: 0.17, // +17% na diária (número do site atual)
  mesesEntregaLofteria: 2, // #entregaem60dias
  mesesEntregaSozinho: 6,
  anosProjecao: 5,
};

export type Entrada = {
  regiao: (typeof REGIOES)[number]["id"];
  tipologia: (typeof TIPOLOGIAS)[number]["id"];
  area: number;
  valorImovel: number;
  modalidade: Modalidade;
  estilo: Estilo;
};

export type Resultado = {
  investimentoMontagem: number;
  diariaMedia: number;
  ocupacao: number;
  receitaBrutaMes: number;
  receitaLiquidaMes: number;
  rentabilidadeAnual: number;
  paybackMeses: number;
  valorizacaoImediata: number;
  ganhoPrimeiroAnoVsSozinho: number;
  projecao: { investido: number; renda: number; valorizacao: number; total: number };
};

export function simular(e: Entrada): Resultado {
  const regiao = REGIOES.find((r) => r.id === e.regiao) ?? REGIOES[0];
  const tipo = TIPOLOGIAS.find((t) => t.id === e.tipologia) ?? TIPOLOGIAS[0];
  const p = PARAMETROS;

  const investimentoMontagem = e.area * ESTILOS[e.estilo].custoM2;
  // A diária cresce com a área, mas menos que proporcionalmente
  const diariaMedia = tipo.diariaBase * regiao.fatorDiaria * Math.sqrt(e.area / tipo.areaPadrao);

  const liquidoTemporada = (diaria: number) => {
    const bruto = diaria * 30 * regiao.ocupacao;
    return { bruto, liquido: bruto * (1 - p.taxaGestaoTemporada - p.taxaPlataforma) - e.area * p.custoFixoM2Mes };
  };

  let receitaBrutaMes: number;
  let receitaLiquidaMes: number;
  let liquidoSozinho: number;
  if (e.modalidade === "temporada") {
    const com = liquidoTemporada(diariaMedia);
    receitaBrutaMes = com.bruto;
    receitaLiquidaMes = com.liquido;
    liquidoSozinho = liquidoTemporada(diariaMedia / (1 + p.ganhoDiariaLofteria)).liquido;
  } else {
    receitaBrutaMes = e.valorImovel * p.aluguelAnualPctMes;
    receitaLiquidaMes = receitaBrutaMes * (1 - p.taxaGestaoAnual);
    liquidoSozinho = receitaLiquidaMes / (1 + p.ganhoDiariaLofteria);
  }
  receitaLiquidaMes = Math.max(0, receitaLiquidaMes);
  liquidoSozinho = Math.max(0, liquidoSozinho);

  const totalInvestido = e.valorImovel + investimentoMontagem;
  const rentabilidadeAnual = (receitaLiquidaMes * 12) / totalInvestido;
  const paybackMeses = receitaLiquidaMes > 0 ? investimentoMontagem / receitaLiquidaMes : Infinity;
  const valorizacaoImediata = e.valorImovel * p.valorizacaoMontagem;

  const ganhoPrimeiroAnoVsSozinho =
    receitaLiquidaMes * (12 - p.mesesEntregaLofteria) - liquidoSozinho * (12 - p.mesesEntregaSozinho);

  const anos = p.anosProjecao;
  const meses = anos * 12 - p.mesesEntregaLofteria;
  const renda = receitaLiquidaMes * meses;
  const valorFuturo = (e.valorImovel + valorizacaoImediata) * Math.pow(1 + p.valorizacaoAnual, anos);
  const valorizacao = valorFuturo - e.valorImovel;

  return {
    investimentoMontagem,
    diariaMedia,
    ocupacao: regiao.ocupacao,
    receitaBrutaMes,
    receitaLiquidaMes,
    rentabilidadeAnual,
    paybackMeses,
    valorizacaoImediata,
    ganhoPrimeiroAnoVsSozinho,
    projecao: { investido: totalInvestido, renda, valorizacao, total: totalInvestido + renda + valorizacao },
  };
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const pct = (v: number, casas = 1) =>
  `${(v * 100).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`;
