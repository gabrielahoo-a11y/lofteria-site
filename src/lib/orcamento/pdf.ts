import { jsPDF } from "jspdf";
import { brl, type Extras, type ItemAmbiente, type Linha, type LinhaOrcamento, type Pacote } from "./modelo";
import { PRAZO_DIAS_UTEIS, rotuloCategoria, type cronograma } from "./cronograma";
import type { PlantaLida } from "./leitura";

type Crono = ReturnType<typeof cronograma>;

export type DadosPdf = {
  nome: string;
  planta: PlantaLida;
  linha: Linha;
  pacote: Pacote;
  finalidade: string;
  extras: Extras;
  orc: { linhas: LinhaOrcamento[]; ambientes: ItemAmbiente[]; total: { min: number; prov: number; max: number }; area: number };
  crono: Crono;
  prontos: Record<string, Date>;
  logoPng?: string | null;
};

const SALMAO: [number, number, number] = [228, 111, 107];
const PETROLEO: [number, number, number] = [15, 96, 115];
const GRAFITE: [number, number, number] = [50, 60, 68];
const SUAVE: [number, number, number] = [107, 118, 128];
const LINHA: [number, number, number] = [225, 230, 234];
const FUNDO: [number, number, number] = [238, 241, 243];
const COR_TIPO: Record<string, [number, number, number]> = {
  dormitorio: [251, 228, 227], suite: [251, 228, 227], banheiro: [213, 230, 234], lavabo: [213, 230, 234],
  lavanderia: [227, 237, 240], sacada: [244, 239, 230], circulacao: [238, 241, 243], outro: [238, 241, 243],
};
const data = (d: Date) => d.toLocaleDateString("pt-BR");
/** Junta as duas últimas palavras (espaço inseparável) para não sobrar palavra sozinha na última linha. */
const semViuva = (t: string) => t.replace(/ +· +/g, "\u00a0· ").replace(/ (\S+)\s*$/, "\u00a0$1");

/** Logo (SVG) convertido em PNG para o PDF. */
export async function logoComoPng(src: string): Promise<string | null> {
  try {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = 800;
    c.height = Math.round((800 * img.naturalHeight) / img.naturalWidth) || 140;
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/png");
  } catch {
    return null;
  }
}

export function gerarPdf(d: DadosPdf): Blob {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const M = 42;
  const FW = PW - 2 * M;
  const cor = (c: [number, number, number], t: "fill" | "text" | "draw") =>
    t === "fill" ? doc.setFillColor(...c) : t === "text" ? doc.setTextColor(...c) : doc.setDrawColor(...c);

  const rodape = (n: number) => {
    cor(LINHA, "draw");
    doc.setLineWidth(0.5);
    doc.line(M, PH - 40, PW - M, PH - 40);
    cor(SUAVE, "text");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Estimativa automática a partir da planta e de projetos entregues pela Lofteria. Não é proposta comercial:", M, PH - 28);
    doc.text("o valor final é confirmado após visita técnica e projeto. Não inclui obras civis.", M, PH - 18);
    doc.text(`Página ${n}`, PW - M, PH - 18, { align: "right" });
  };
  const topo = () => {
    cor(SALMAO, "fill");
    doc.rect(0, 0, PW, 5, "F");
  };
  const titulo = (t: string, y: number) => {
    cor(GRAFITE, "text");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(t, M, y);
    return y + 16;
  };

  /* ---------- Página 1 ---------- */
  topo();
  let y = 46;
  if (d.logoPng) doc.addImage(d.logoPng, "PNG", M, y - 6, 120, 21);
  else {
    cor(SALMAO, "text");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("LOFTERIA", M, y + 10);
  }
  cor(SUAVE, "text");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Gerado em ${data(new Date())}`, PW - M, y + 6, { align: "right" });
  y += 46;

  cor(GRAFITE, "text");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(`Orçamento estimado para ${d.nome.split(" ")[0]}`, M, y);
  y += 17;
  cor(SUAVE, "text");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text(
    `${d.planta.nome} · ${d.planta.tipologia} · ${d.planta.areaTotal.toLocaleString("pt-BR")} m²${d.planta.areaTotalEstimada ? " (estimada)" : ""} · ${d.linha} ${d.pacote} · ${d.finalidade}`,
    M,
    y,
  );
  y += 22;

  // Cartões principais
  const cards: [string, string, boolean][] = [
    ["INVESTIMENTO PROVÁVEL", brl(d.orc.total.prov), true],
    ["FAIXA ESTIMADA", `${brl(d.orc.total.min)} a ${brl(d.orc.total.max)}`, false],
    ["VALOR POR M²", `${brl(Math.round(d.orc.total.prov / d.planta.areaTotal))}/m²`, false],
    ["PRAZO", `${PRAZO_DIAS_UTEIS} dias úteis, entrega em ${data(d.crono.entrega)}`, false],
  ];
  const cw = (FW - 3 * 8) / 4;
  cards.forEach(([r, v, dest], i) => {
    const x = M + i * (cw + 8);
    cor(dest ? PETROLEO : FUNDO, "fill");
    doc.roundedRect(x, y, cw, 58, 6, 6, "F");
    cor(dest ? [255, 255, 255] : SUAVE, "text");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(r, x + 10, y + 16);
    cor(dest ? [255, 255, 255] : GRAFITE, "text");
    doc.setFontSize(dest ? 14 : 9.5);
    doc.text(doc.splitTextToSize(semViuva(v), cw - 20), x + 10, y + (dest ? 38 : 33));
  });
  y += 76;

  // Planta remontada + ambientes
  y = titulo("Sua planta e o que entra em cada ambiente", y);
  const caixa = { x: M, y, w: 230, h: 230 };
  const prop = d.planta.proporcao;
  const pw = prop >= 1 ? caixa.w : caixa.h * prop;
  const ph = prop >= 1 ? caixa.w / prop : caixa.h;
  const px = caixa.x + (caixa.w - pw) / 2;
  const py = caixa.y + (caixa.h - ph) / 2;
  for (const c of d.planta.comodos) {
    if (!c.ret) continue;
    const rx = px + c.ret.x * pw, ry = py + c.ret.y * ph, rw = c.ret.w * pw, rh = c.ret.h * ph;
    cor(c.mobiliar ? (COR_TIPO[c.tipo] ?? [220, 236, 239]) : [255, 255, 255], "fill");
    cor(GRAFITE, "draw");
    doc.setLineWidth(c.mobiliar ? 1 : 0.5);
    doc.roundedRect(rx + 1, ry + 1, Math.max(rw - 2, 2), Math.max(rh - 2, 2), 2, 2, "FD");
    if (rw > 30 && rh > 16) {
      cor(GRAFITE, "text");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(Math.min(7, rw / 9));
      doc.text(doc.splitTextToSize(semViuva(c.nome), rw - 6).slice(0, 2), rx + rw / 2, ry + rh / 2, { align: "center", baseline: "middle" });
    }
  }
  cor(GRAFITE, "draw");
  doc.setLineWidth(2);
  doc.roundedRect(px, py, pw, ph, 3, 3, "S");

  let ly = y + 4;
  const lx = M + 250;
  for (const a of d.orc.ambientes) {
    if (ly > y + 240) break;
    cor(GRAFITE, "text");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(a.nome, lx, ly + 8);
    doc.text(brl(a.valor), PW - M, ly + 8, { align: "right" });
    cor(SUAVE, "text");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const pronto = d.prontos[a.id] ? `Pronto em ${data(d.prontos[a.id])}` : "";
    const linhas = doc.splitTextToSize(semViuva([pronto, a.destaques.join(" · ")].filter(Boolean).join(" · ")), PW - M - lx) as string[];
    doc.text(linhas, lx, ly + 20);
    const alt = 20 + (linhas.length - 1) * 9.5;
    cor(LINHA, "draw");
    doc.setLineWidth(0.5);
    doc.line(lx, ly + alt + 6, PW - M, ly + alt + 6);
    ly += alt + 11;
  }
  y = Math.max(y + 240, ly) + 14;

  // Por categoria
  y = titulo("Por categoria", y);
  const cats = [...d.orc.linhas].filter((l) => l.provavel > 0).sort((a, b) => b.provavel - a.provavel);
  const colW = FW / 2 - 8;
  cats.forEach((l, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * (colW + 16), yy = y + row * 16;
    cor(GRAFITE, "text");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(rotuloCategoria(l.categoria), x, yy + 8);
    doc.setFont("helvetica", "bold");
    doc.text(brl(l.provavel), x + colW, yy + 8, { align: "right" });
    cor(LINHA, "draw");
    doc.line(x, yy + 12, x + colW, yy + 12);
  });
  rodape(1);

  /* ---------- Página 2: cronograma ---------- */
  doc.addPage();
  topo();
  y = titulo("Cronograma da obra", 52);
  cor(SUAVE, "text");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Início ${data(d.crono.inicio)} · entrega prevista ${data(d.crono.entrega)} · ${PRAZO_DIAS_UTEIS} dias úteis. Prazos médios das obras da Lofteria.`, M, y);
  y += 18;

  const labW = 128, tx0 = M + labW, tW = FW - labW, rowH = 17;
  const xOf = (dv: number) => tx0 + (dv / PRAZO_DIAS_UTEIS) * tW;
  const fixas: [string, number, number][] = [["Início e visita à obra", 0, 2]];
  const fim: [string, number, number][] = [["Limpeza, fotos e vídeo", PRAZO_DIAS_UTEIS - 4, PRAZO_DIAS_UTEIS - 1]];
  const linhaFixa = ([n, a, b]: [string, number, number]) => {
    cor(SUAVE, "text");
    doc.setFontSize(8);
    doc.text(n, M, y + 11);
    cor(PETROLEO, "fill");
    doc.roundedRect(xOf(a), y + 5, Math.max(xOf(b) - xOf(a), 3), 6, 3, 3, "F");
    y += rowH;
  };
  fixas.forEach(linhaFixa);
  for (const t of d.crono.trilhas) {
    cor(GRAFITE, "text");
    doc.setFontSize(8.5);
    doc.text(t.rotulo, M, y + 11);
    cor([246, 196, 194], "fill");
    doc.roundedRect(xOf(t.dc), y + 4, Math.max(xOf(t.dr) - xOf(t.dc), 2), 8, 2, 2, "F");
    cor(SALMAO, "fill");
    doc.roundedRect(xOf(t.dr), y + 4, Math.max(xOf(t.dv - 1) - xOf(t.dr), 3), 8, 2, 2, "F");
    cor(GRAFITE, "fill");
    doc.circle(xOf(t.dv), y + 8, 2.4, "F");
    y += rowH;
  }
  fim.forEach(linhaFixa);
  cor(GRAFITE, "draw");
  doc.setLineDashPattern([2, 2], 0);
  doc.line(xOf(PRAZO_DIAS_UTEIS), 96, xOf(PRAZO_DIAS_UTEIS), y);
  doc.setLineDashPattern([], 0);
  y += 10;
  cor(SUAVE, "text");
  doc.setFontSize(7.5);
  doc.text("Rosa claro: produção e entrega do fornecedor · Salmão: instalação · Ponto: pronto e conferido · Azul: etapas da obra · Tracejado: entrega", M, y);
  y += 26;

  // Tabela de datas
  y = titulo("Datas por categoria", y);
  const cols = ["Categoria", "Pedido", "Chegada", "Pronto", "Valor"];
  const cx = [M, M + 200, M + 280, M + 360, PW - M];
  cor(GRAFITE, "fill");
  doc.rect(M, y, FW, 18, "F");
  cor([255, 255, 255], "text");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  cols.forEach((c, i) => doc.text(c, cx[i] + (i === 4 ? -6 : 6), y + 12, { align: i === 4 ? "right" : "left" }));
  y += 18;
  doc.setFont("helvetica", "normal");
  d.crono.trilhas.forEach((t, i) => {
    if (i % 2) {
      cor(FUNDO, "fill");
      doc.rect(M, y, FW, 16, "F");
    }
    cor(GRAFITE, "text");
    const vals = [t.rotulo, data(t.compra), data(t.chegada), data(t.vistoria), brl(t.valor)];
    vals.forEach((v, j) => doc.text(v, cx[j] + (j === 4 ? -6 : 6), y + 11, { align: j === 4 ? "right" : "left" }));
    y += 16;
  });

  y += 24;
  cor(SALMAO, "fill");
  doc.roundedRect(M, y, FW, 64, 8, 8, "F");
  cor([255, 255, 255], "text");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Próximo passo", M + 16, y + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text("Um especialista da Lofteria confere sua planta e fala com você para agendar a visita técnica.", M + 16, y + 40);
  doc.text("lofteria.com.br", M + 16, y + 54);
  rodape(2);

  return doc.output("blob");
}

/** Entrega o PDF: pela capacidade de downloads do artefato ou, no site, por um link de download. */
export async function salvarPdf(blob: Blob, nomeArquivo: string) {
  const w = window as Window & { claude?: { use: (n: string) => Promise<unknown> } };
  const downloads = w.claude
    ? ((await w.claude.use("downloads").catch(() => null)) as { save: (r: { filename: string; data: Blob }) => Promise<unknown> } | null)
    : null;
  if (downloads) {
    await downloads.save({ filename: nomeArquivo, data: blob });
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
