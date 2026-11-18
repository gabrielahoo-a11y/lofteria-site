import type { cronograma } from "./cronograma";
import type { PlantaLida } from "./leitura";
import type { Extras, Finalidade, Linha, Pacote, orcamentoCliente } from "./modelo";

/**
 * Envia o pedido de orçamento para a equipe: grava na mesma tabela `leads` do formulário
 * de contato (rota /api/leads), com origem "orcamento" e o resumo do orçamento em `simulacao`.
 */
export async function enviarLead(d: {
  lead: { nome: string; email: string; whats: string };
  planta: PlantaLida;
  finalidade: Finalidade;
  linha: Linha;
  pacote: Pacote;
  extras: Extras;
  orc: ReturnType<typeof orcamentoCliente>;
  inicio: string;
  entrega: ReturnType<typeof cronograma>["entrega"];
}) {
  const simulacao = {
    tipo: "orcamento-planta",
    unidade: d.planta.nome,
    tipologia: d.planta.tipologia,
    area_m2: d.planta.areaTotal,
    area_estimada: d.planta.areaTotalEstimada,
    finalidade: d.finalidade,
    estilo: d.linha,
    pacote: d.pacote,
    opcionais: Object.entries(d.extras)
      .filter(([, v]) => v)
      .map(([k]) => k),
    comodos: d.planta.comodos.filter((c) => c.mobiliar).map((c) => ({ nome: c.nome, tipo: c.tipo, area_m2: c.area })),
    valor: { minimo: d.orc.total.min, provavel: d.orc.total.prov, maximo: d.orc.total.max },
    inicio_obra: d.inicio,
    entrega_prevista: d.entrega.toISOString().slice(0, 10),
  };
  const resp = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: d.lead.nome,
      email: d.lead.email,
      whatsapp: d.lead.whats,
      interesse: `Orçamento pela planta · ${d.finalidade}`,
      mensagem: `${d.planta.tipologia} · ${d.planta.areaTotal.toLocaleString("pt-BR")} m² · ${d.linha} ${d.pacote}`,
      origem: "orcamento",
      simulacao,
    }),
  });
  if (!resp.ok) throw new Error(`lead ${resp.status}`);
}
