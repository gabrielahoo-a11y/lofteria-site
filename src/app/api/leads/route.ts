// Recebe os contatos do simulador e do formulário e grava na tabela `leads`
// do Supabase (ver supabase/leads.sql). Sem as variáveis de ambiente, responde 503.

const URL_SUPABASE = process.env.SUPABASE_URL;
const CHAVE = process.env.SUPABASE_PUBLISHABLE_KEY;

const texto = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  if (!URL_SUPABASE || !CHAVE) {
    return Response.json({ erro: "Captação de leads ainda não configurada" }, { status: 503 });
  }

  const corpo = await request.json().catch(() => null);
  const lead = {
    nome: texto(corpo?.nome),
    email: texto(corpo?.email),
    whatsapp: texto(corpo?.whatsapp, 40),
    mensagem: texto(corpo?.mensagem, 2000) || null,
    origem: texto(corpo?.origem, 40) || "site",
    simulacao: corpo?.simulacao ?? null,
  };
  // A newsletter só pede o e-mail; os demais formulários pedem nome, e-mail e WhatsApp
  const soEmail = lead.origem === "newsletter";
  if (!lead.email.includes("@") || (!soEmail && (!lead.nome || !lead.whatsapp))) {
    return Response.json({ erro: "Preencha nome, e-mail e WhatsApp" }, { status: 400 });
  }

  const resp = await fetch(`${URL_SUPABASE}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: CHAVE,
      Authorization: `Bearer ${CHAVE}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(lead),
  });
  if (!resp.ok) {
    console.error("Falha ao gravar lead", resp.status, await resp.text());
    return Response.json({ erro: "Não foi possível registrar agora" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
