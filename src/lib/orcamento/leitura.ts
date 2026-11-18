import { z } from "zod";
import type { Comodo, Tipologia } from "./modelo";

/*
  Leitura da planta com IA.
  O mesmo prompt e o mesmo formato servem para os dois caminhos:
  - servidor: /api/ler-planta (API do Claude, precisa de ANTHROPIC_API_KEY);
  - protótipo publicado: capacidade "sample" do artefato (usa a conta Claude de quem abre).
*/

export const TIPOS_COMODO = [
  "living",
  "cozinha",
  "integrado",
  "estudio",
  "dormitorio",
  "suite",
  "banheiro",
  "lavabo",
  "lavanderia",
  "sacada",
  "circulacao",
  "outro",
] as const;
export type TipoComodo = (typeof TIPOS_COMODO)[number];

export const LeituraSchema = z.object({
  ePlanta: z.boolean(),
  unidade: z.string().nullable(),
  tipologia: z.enum(["Studio", "1D", "2D", "3D", "4D"]),
  areaTotal: z.number().nullable(),
  areaTotalFonte: z.enum(["escrita", "estimada"]),
  proporcao: z.number(),
  comodos: z.array(
    z.object({
      nome: z.string(),
      tipo: z.enum(TIPOS_COMODO),
      area: z.number().nullable(),
      areaFonte: z.enum(["escrita", "estimada"]),
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number(),
    }),
  ),
  avisos: z.array(z.string()),
});
export type Leitura = z.infer<typeof LeituraSchema>;

export const PROMPT_LEITURA = `Você é arquiteto da Lofteria, empresa que mobilia apartamentos. A imagem é a planta baixa de um apartamento enviada por um cliente.
Tarefa: identificar os cômodos e remontar a planta de forma simplificada, para o cliente reconhecer o imóvel dele.

Regras:
1. Se a imagem mostrar mais de uma unidade, use só a unidade principal (a que tem nome ou área em destaque, ou a mais completa e central) e escreva qual é em "unidade". Ignore áreas comuns, corredores do prédio e unidades vizinhas.
2. Use as áreas ESCRITAS na planta sempre que existirem (ex.: "a=6,99m²", "14,99 m²") e marque areaFonte "escrita". Sem área escrita, estime pelas cotas, pela escala ou pelo mobiliário (cama de casal ≈ 1,40 x 1,90 m, vaso sanitário ≈ 0,40 x 0,65 m) e marque "estimada".
3. Área total: use a área privativa escrita da unidade (ex.: "Área: 52,60 m²", "A: 69.72m²", "Estúdio 06 – 37,76 m²") com areaTotalFonte "escrita". Se não houver, some os cômodos e marque "estimada". Nunca invente uma área total diferente da escrita.
4. Tipologia: "Studio" quando não há dormitório separado por parede; senão conte os dormitórios ("dormitorio" + "suite"; demi-suíte conta como suíte): 1 = "1D", 2 = "2D", 3 = "3D", 4 ou mais = "4D".
5. Tipos de cômodo: living (sala), cozinha, integrado (sala e cozinha no mesmo ambiente), estudio (sala, cozinha e cama no mesmo ambiente), dormitorio, suite (dormitório com banheiro próprio), banheiro, lavabo, lavanderia (área de serviço), sacada (varanda, terraço), circulacao (hall, corredor interno), outro.
6. Para cada cômodo dê um retângulo aproximado: x, y, w, h em frações de 0 a 1 do contorno da unidade (x = 0 na borda esquerda, y = 0 na borda de cima), na MESMA orientação da imagem. Os retângulos devem ficar lado a lado como na planta, sem se sobrepor, cobrindo a unidade. Use um retângulo por cômodo; um cômodo em "L" vira o retângulo da parte maior.
7. proporcao = largura dividida pela altura do contorno da unidade, como aparece na imagem.
8. Não invente cômodos que não aparecem. Banheiro dentro de suíte é um cômodo separado do tipo "banheiro".
9. Em "avisos", escreva em português curto o que ficou incerto (ex.: "áreas estimadas, a planta não tem cotas").
10. Se a imagem não for uma planta baixa de apartamento, responda ePlanta false, comodos vazio e explique em avisos.

Responda somente com um JSON neste formato:
{"ePlanta":true,"unidade":"Apto 408","tipologia":"2D","areaTotal":52.6,"areaTotalFonte":"escrita","proporcao":0.78,
 "comodos":[{"nome":"Living e cozinha","tipo":"integrado","area":16.43,"areaFonte":"escrita","x":0,"y":0,"w":0.48,"h":0.72}],
 "avisos":[]}`;

const AREA_MINIMA: Partial<Record<TipoComodo, number>> = { circulacao: 0, outro: 0 };

/** Converte a resposta da IA nos cômodos usados pelo orçamento. Lança erro se não der para usar. */
export function normalizarLeitura(bruto: unknown): PlantaLida {
  const r = LeituraSchema.safeParse(bruto);
  if (!r.success) throw new ErroLeitura("A leitura falhou no meio do caminho. Toque em “Tentar de novo”.");
  const l = r.data;
  if (!l.ePlanta || l.comodos.length === 0)
    throw new ErroLeitura(`Não encontramos uma planta baixa nesta imagem.${l.avisos[0] ? " " + l.avisos[0] : ""} Envie a planta do apartamento (vista de cima, com os cômodos).`);

  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const contagem: Record<string, number> = {};
  const comodos: Comodo[] = l.comodos.map((c) => {
    contagem[c.tipo] = (contagem[c.tipo] ?? 0) + 1;
    const x = clamp(c.x), y = clamp(c.y);
    return {
      id: `${c.tipo}-${contagem[c.tipo]}`,
      nome: c.nome,
      tipo: c.tipo,
      area: Math.round((c.area ?? 0) * 100) / 100,
      areaEstimada: c.areaFonte === "estimada" || c.area == null,
      mobiliar: (AREA_MINIMA[c.tipo] ?? 1) > 0,
      ret: { x, y, w: Math.max(0.02, Math.min(1 - x, c.w)), h: Math.max(0.02, Math.min(1 - y, c.h)) },
    };
  });

  const soma = comodos.reduce((s, c) => s + c.area, 0);
  const areaTotal = l.areaTotal && l.areaTotal > 0 ? l.areaTotal : Math.round(soma * 100) / 100;
  return {
    nome: l.unidade ?? "Sua planta",
    tipologia: l.tipologia as Tipologia,
    areaTotal,
    areaTotalEstimada: l.areaTotalFonte === "estimada" || !l.areaTotal,
    proporcao: l.proporcao > 0.2 && l.proporcao < 5 ? l.proporcao : 4 / 3,
    comodos,
    avisos: l.avisos,
  };
}

export type PlantaLida = {
  nome: string;
  tipologia: Tipologia;
  areaTotal: number;
  areaTotalEstimada: boolean;
  proporcao: number;
  comodos: Comodo[];
  avisos: string[];
};

/* ---------- Leitura no navegador ---------- */

type SampleFn = ((input: string, opts?: Record<string, unknown>) => Promise<{ text: string }>) & {
  json: (input: string, opts?: Record<string, unknown>) => Promise<unknown>;
  limits: () => Promise<{ images?: { mediaTypes: string[] } }>;
};
type JanelaClaude = Window & {
  claude?: { use: (n: string) => Promise<unknown> };
  pdfjsLib?: {
    GlobalWorkerOptions: { workerSrc: string };
    getDocument: (src: { data: ArrayBuffer }) => { promise: Promise<PdfDoc> };
  };
};
type PdfDoc = {
  getPage: (n: number) => Promise<{
    getViewport: (o: { scale: number }) => { width: number; height: number };
    render: (o: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void> };
  }>;
};

/** Primeira página do PDF como PNG (pdf.js carregado pela página do protótipo). */
async function pdfParaImagem(arquivo: File): Promise<Blob> {
  const pdfjs = (window as JanelaClaude).pdfjsLib;
  if (!pdfjs) throw new ErroLeitura("Não conseguimos abrir PDF aqui. Envie uma foto ou um print da planta (JPG ou PNG).");
  const doc = await pdfjs.getDocument({ data: await arquivo.arrayBuffer() }).promise;
  const pagina = await doc.getPage(1);
  const base = pagina.getViewport({ scale: 1 });
  const escala = Math.min(3, 2200 / Math.max(base.width, base.height));
  const vp = pagina.getViewport({ scale: escala });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(vp.width);
  canvas.height = Math.round(vp.height);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await pagina.render({ canvasContext: ctx, viewport: vp }).promise;
  return new Promise((ok, erro) => canvas.toBlob((b) => (b ? ok(b) : erro(new Error("Falha ao converter o PDF."))), "image/png"));
}

/** Imagem que dá para mostrar ao lado da planta remontada. */
export async function previaDoArquivo(arquivo: File): Promise<string | null> {
  try {
    const img = arquivo.type === "application/pdf" ? await pdfParaImagem(arquivo) : arquivo;
    return URL.createObjectURL(img);
  } catch {
    return null;
  }
}

export class ErroLeitura extends Error {
  constructor(message: string, public indisponivel = false) {
    super(message);
  }
}

/**
  Lê a planta. Ordem: capacidade "sample" do artefato (protótipo publicado) e,
  se não existir, a rota /api/ler-planta do app.
*/
export async function lerPlanta(arquivo: File, signal?: AbortSignal): Promise<PlantaLida> {
  const w = window as JanelaClaude;
  const sample = w.claude ? ((await w.claude.use("sample").catch(() => null)) as SampleFn | null) : null;

  if (sample) {
    const imagem = arquivo.type === "application/pdf" ? await pdfParaImagem(arquivo) : arquivo;
    try {
      const bruto = await sample.json(PROMPT_LEITURA, { images: [imagem], modelTier: "complex", signal });
      return normalizarLeitura(bruto);
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "not_granted" || code === "sampling_disabled" || code === "images_unavailable")
        throw new ErroLeitura("Para ler a planta precisamos da sua permissão para usar a IA. Toque em “Tentar de novo” e escolha permitir.", true);
      if (code === "rate_limited") throw new ErroLeitura("Muitas leituras em pouco tempo. Espere um minuto e toque em “Tentar de novo”.");
      if (code === "cancelled") throw new ErroLeitura("Leitura cancelada.");
      if (code === "image_rejected") throw new ErroLeitura("Este arquivo não abriu. Envie a planta em JPG, PNG ou PDF, com até 20 MB.");
      if (code === "invalid_json" || code === "upstream_error")
        throw new ErroLeitura("A leitura falhou no meio do caminho. Toque em “Tentar de novo”; se repetir, envie uma imagem mais nítida.");
      if (e instanceof Error) throw new ErroLeitura(e.message);
      throw new ErroLeitura("Não conseguimos ler esta planta. Tente uma imagem mais nítida, só com o seu apartamento.");
    }
  }

  const form = new FormData();
  form.append("planta", arquivo);
  let resp: Response;
  try {
    resp = await fetch("/api/ler-planta", { method: "POST", body: form, signal });
  } catch {
    throw new ErroLeitura("A leitura automática está fora do ar agora. Veja como funciona com a planta de exemplo.", true);
  }
  const corpo = await resp.json().catch(() => null);
  if (!resp.ok) throw new ErroLeitura(corpo?.erro ?? "Não conseguimos ler esta planta.", resp.status === 503 || resp.status === 404);
  return normalizarLeitura(corpo);
}
