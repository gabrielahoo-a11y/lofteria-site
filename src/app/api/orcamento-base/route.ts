import { readFile } from "node:fs/promises";
import path from "node:path";
import type { BaseTipologia, Pacote, Tipologia } from "@/lib/orcamento/modelo";

// Entrega o orçamento-base de UMA tipologia para a ferramenta de orçamento (/orcamento).
// Os valores não ficam no repositório: vêm da tabela `orcamento_base` do Supabase
// (ver supabase/orcamento_base.sql), lida com a chave secreta, só no servidor.
// Em desenvolvimento, sem Supabase, lê o arquivo local dados-privados/orcamento-base.json (fora do git).

export const runtime = "nodejs";

const TIPOLOGIAS: Tipologia[] = ["Spot", "Studio", "Loft", "1D", "2D", "3D", "4D"];
const PACOTES: Pacote[] = ["Basic", "Essential", "Design"];
type Linha = { tipologia: Tipologia; area_ref: number; categorias: BaseTipologia["categorias"]; ambientes: BaseTipologia["ambientes"] };

let cache: { quando: number; linhas: Map<Tipologia, Linha> } | null = null;
const VALIDADE_MS = 10 * 60 * 1000;

async function lerTabela(): Promise<Map<Tipologia, Linha> | null> {
  if (cache && Date.now() - cache.quando < VALIDADE_MS) return cache.linhas;
  let linhas: Linha[] | null = null;

  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SECRET_KEY;
  if (url && chave) {
    const resp = await fetch(`${url}/rest/v1/orcamento_base?select=tipologia,area_ref,categorias,ambientes`, {
      headers: { apikey: chave },
      cache: "no-store",
    });
    if (!resp.ok) {
      console.error("Falha ao ler orcamento_base", resp.status, await resp.text());
      return null;
    }
    linhas = (await resp.json()) as Linha[];
  } else if (process.env.NODE_ENV !== "production") {
    try {
      const arquivo = path.join(process.cwd(), "dados-privados", "orcamento-base.json");
      linhas = JSON.parse(await readFile(arquivo, "utf8")) as Linha[];
    } catch {
      return null;
    }
  }
  if (!linhas?.length) return null;
  const mapa = new Map(linhas.map((l) => [l.tipologia, l]));
  cache = { quando: Date.now(), linhas: mapa };
  return mapa;
}

const somaPacote = (m: Record<string, Record<Pacote, number>>, p: Pacote) => Object.values(m).reduce((s, v) => s + (v[p] ?? 0), 0);

export async function GET(req: Request) {
  const tipologia = new URL(req.url).searchParams.get("tipologia") as Tipologia | null;
  if (!tipologia || !TIPOLOGIAS.includes(tipologia)) {
    return Response.json({ erro: "Tipologia inválida" }, { status: 400 });
  }
  const tabela = await lerTabela();
  const linha = tabela?.get(tipologia);
  if (!tabela || !linha) {
    return Response.json({ erro: "Orçamento indisponível no momento" }, { status: 503 });
  }

  // Tipologias sem sacada no orçamento-base usam a proporção da sacada no base 3D
  const ref = tabela.get("3D");
  const fracaoSacada = Object.fromEntries(
    PACOTES.map((p) => {
      const total = ref ? somaPacote(ref.categorias, p) : 0;
      return [p, ref && total > 0 ? (ref.ambientes["Sacada"]?.[p] ?? 0) / total : 0];
    }),
  ) as Record<Pacote, number>;

  const base: BaseTipologia = {
    tipologia,
    areaRef: Number(linha.area_ref),
    categorias: linha.categorias,
    ambientes: linha.ambientes,
    fracaoSacada,
  };
  return Response.json(base, { headers: { "Cache-Control": "private, max-age=600" } });
}
