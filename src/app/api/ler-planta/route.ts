import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { LeituraSchema, PROMPT_LEITURA } from "@/lib/orcamento/leitura";

// Lê a planta enviada pelo cliente (imagem ou PDF) e devolve os cômodos em JSON.
// Precisa da variável ANTHROPIC_API_KEY no servidor (ex.: Vercel). O arquivo não é guardado.

export const runtime = "nodejs";
export const maxDuration = 120;

const TIPOS_IMAGEM = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
type TipoImagem = (typeof TIPOS_IMAGEM)[number];
const LIMITE_BYTES = 15 * 1024 * 1024;

// Limite simples de leituras por endereço IP, para evitar abuso (cada leitura tem custo).
// Fica na memória da instância: é uma proteção básica, não exata.
const LEITURAS_POR_HORA = 10;
const leituras = new Map<string, number[]>();
function passouDoLimite(ip: string) {
  const agora = Date.now();
  const recentes = (leituras.get(ip) ?? []).filter((t) => agora - t < 3_600_000);
  if (recentes.length >= LEITURAS_POR_HORA) return true;
  recentes.push(agora);
  leituras.set(ip, recentes);
  if (leituras.size > 5000) leituras.clear();
  return false;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return Response.json({ erro: "A leitura automática está fora do ar agora. Veja como funciona com a planta de exemplo." }, { status: 503 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (passouDoLimite(ip)) {
    return Response.json({ erro: "Você já leu várias plantas na última hora. Tente mais tarde ou fale com a gente pelo contato." }, { status: 429 });
  }

  const form = await req.formData().catch(() => null);
  const arquivo = form?.get("planta");
  if (!(arquivo instanceof File)) return Response.json({ erro: "Envie a planta no campo 'planta'." }, { status: 400 });
  if (arquivo.size > LIMITE_BYTES) return Response.json({ erro: "Arquivo grande demais (máximo 15 MB)." }, { status: 413 });

  const dados = Buffer.from(await arquivo.arrayBuffer()).toString("base64");
  let anexo: Anthropic.Beta.BetaContentBlockParam;
  if (arquivo.type === "application/pdf") {
    anexo = { type: "document", source: { type: "base64", media_type: "application/pdf", data: dados } };
  } else if ((TIPOS_IMAGEM as readonly string[]).includes(arquivo.type)) {
    anexo = { type: "image", source: { type: "base64", media_type: arquivo.type as TipoImagem, data: dados } };
  } else {
    return Response.json({ erro: "Formato não aceito. Envie PDF, JPG, PNG ou WebP." }, { status: 415 });
  }

  const client = new Anthropic();
  try {
    const resposta = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "high", format: zodOutputFormat(LeituraSchema) },
      messages: [{ role: "user", content: [anexo, { type: "text", text: PROMPT_LEITURA }] }],
    });
    if (resposta.stop_reason === "refusal" || !resposta.parsed_output) {
      return Response.json({ erro: "Não conseguimos ler esta planta. Tente outra imagem." }, { status: 422 });
    }
    return Response.json(resposta.parsed_output);
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return Response.json({ erro: "Muitas leituras agora. Tente em um minuto." }, { status: 429 });
    if (e instanceof Anthropic.BadRequestError) return Response.json({ erro: "Não conseguimos abrir este arquivo." }, { status: 400 });
    if (e instanceof Anthropic.APIError) return Response.json({ erro: "Serviço de leitura indisponível no momento." }, { status: 502 });
    throw e;
  }
}
