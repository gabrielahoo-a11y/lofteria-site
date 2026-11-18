"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CampoNumero } from "@/components/orcamento/CampoNumero";
import { PlantaInterativa, proporcaoDoDesenho } from "@/components/orcamento/PlantaInterativa";
import { CurvaGastos, GanttObra } from "@/components/orcamento/Cronograma";
import {
  AcordeaoCategorias,
  AnelPrazo,
  BarraComposicao,
  BarrasAmbientes,
  Cartao,
  CartaoIncluso,
  FaixaPreco,
  FotoProjetos,
  NumeroGrande,
  TituloCartao,
  mil,
} from "@/components/orcamento/Painel";
import { PRAZO_DIAS_UTEIS, cronograma, inicioSugerido, isoData, lerIso, prontoPorAmbiente, somarDiasUteis } from "@/lib/orcamento/cronograma";
import { lerPlanta, previaDoArquivo, type PlantaLida, type TipoComodo } from "@/lib/orcamento/leitura";
import {
  DESCRICAO_LINHA,
  DESCRICAO_PACOTE,
  PLANTA_EXEMPLO,
  brl,
  orcamentoCliente,
  type Extras,
  type Finalidade,
  type Linha,
  type Pacote,
  type BaseTipologia,
  type Tipologia,
} from "@/lib/orcamento/modelo";
import { enviarLead } from "@/lib/orcamento/lead";

const FOTOS_PROJETOS = [
  { nome: "Vox Jurerê 409", legenda: "Entregue em mai/2025 · Jurerê", foto: "/img/orcamento/vox409.jpg" },
  { nome: "Sunset Lagoa", legenda: "Entregue em ago/2024 · Lagoa da Conceição", foto: "/img/orcamento/sunset.jpg" },
  { nome: "Lago di Garda 07", legenda: "Entregue em out/2024", foto: "/img/orcamento/garda07.jpg" },
];

const NUMEROS_LOFTERIA = [
  ["+ 400", "imóveis concluídos"],
  ["+ R$ 15 mi", "gerenciados em obras"],
  ["8.054 m²", "desenvolvidos"],
  ["+ 10 países", "com clientes Lofteria"],
];

type Etapa = "envio" | "lendo" | "conferir" | "preferencias" | "resultado";

const ETAPAS: { id: Etapa; rotulo: string }[] = [
  { id: "envio", rotulo: "Planta" },
  { id: "conferir", rotulo: "Conferir" },
  { id: "preferencias", rotulo: "Estilo" },
  { id: "resultado", rotulo: "Orçamento" },
];

const CONTAINER = "mx-auto w-full max-w-[90rem] px-5 md:px-10";
const BOTAO_PRIMARIO = "botao botao-salmao";
const BOTAO_SECUNDARIO = "botao botao-contorno text-grafite hover:text-salmao";

/** Etapas mostradas enquanto a IA lê a planta (segundos a partir do envio). */
const PASSOS_LEITURA: [number, string][] = [
  [0, "Abrindo a planta"],
  [6, "Identificando os cômodos"],
  [22, "Lendo as áreas"],
  [40, "Remontando a planta"],
];

/** Cômodos que o cliente pode adicionar quando a IA não encontrou. */
const NOVOS_COMODOS: { tipo: TipoComodo; nome: string; area: number }[] = [
  { tipo: "sacada", nome: "Sacada", area: 5 },
  { tipo: "lavanderia", nome: "Lavanderia", area: 2.5 },
  { tipo: "banheiro", nome: "Banheiro", area: 3 },
  { tipo: "lavabo", nome: "Lavabo", area: 1.8 },
  { tipo: "dormitorio", nome: "Dormitório", area: 9 },
  { tipo: "living", nome: "Sala", area: 14 },
  { tipo: "cozinha", nome: "Cozinha", area: 7 },
];

const mesAno = (d: Date) => `${d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}/${String(d.getFullYear()).slice(2)}`;
const dataLonga = (d: Date) => d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

/** Orçamentos-base já carregados, por tipologia (vêm de /api/orcamento-base). */
const cacheBase = new Map<Tipologia, Promise<BaseTipologia>>();
function carregarBase(t: Tipologia): Promise<BaseTipologia> {
  let p = cacheBase.get(t);
  if (!p) {
    p = fetch(`/api/orcamento-base?tipologia=${encodeURIComponent(t)}`).then(async (r) => {
      if (!r.ok) throw new Error("base indisponível");
      return (await r.json()) as BaseTipologia;
    });
    p.catch(() => cacheBase.delete(t));
    cacheBase.set(t, p);
  }
  return p;
}
/** Base vazia: só para os cálculos não quebrarem enquanto a base real carrega. */
const BASE_VAZIA: BaseTipologia = { tipologia: "2D", areaRef: 60, categorias: {}, ambientes: {}, fracaoSacada: { Basic: 0, Essential: 0, Design: 0 } };

function Opcao({ ativo, onClick, titulo, descricao }: { ativo: boolean; onClick: () => void; titulo: string; descricao?: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={ativo}
      className={`flex flex-col items-start rounded-3xl border p-4 text-left transition ${
        ativo ? "border-petroleo bg-petroleo text-white shadow-lg" : "vidro hover:border-petroleo/40"
      }`}
    >
      <span className="flex w-full items-center justify-between gap-2 font-semibold">
        {titulo}
        <span className={`h-4 w-4 rounded-full border-2 ${ativo ? "border-white bg-salmao" : "border-linha"}`} />
      </span>
      {descricao && <span className={`mt-1 text-sm font-light ${ativo ? "text-white/80" : "text-texto-suave"}`}>{descricao}</span>}
    </button>
  );
}

function Interruptor({ ativo, onClick, rotulo, detalhe }: { ativo: boolean; onClick: () => void; rotulo: string; detalhe: string }) {
  return (
    <button onClick={onClick} role="switch" aria-checked={ativo} className="vidro flex w-full items-center justify-between gap-4 rounded-3xl p-4 text-left">
      <span>
        <span className="block font-semibold">{rotulo}</span>
        <span className="text-sm font-light text-texto-suave">{detalhe}</span>
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${ativo ? "bg-petroleo" : "bg-linha"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${ativo ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

export default function Ferramenta() {
  const [etapa, setEtapa] = useState<Etapa>("envio");
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const [planta, setPlanta] = useState<PlantaLida>(PLANTA_EXEMPLO);
  const [comodos, setComodos] = useState(PLANTA_EXEMPLO.comodos);
  const [previa, setPrevia] = useState<string | null>(null);
  const [erroLeitura, setErroLeitura] = useState<string | null>(null);
  const [verOriginal, setVerOriginal] = useState(false);
  const leituraRef = useRef<AbortController | null>(null);
  const [lead, setLead] = useState({ nome: "", email: "", whats: "" });
  const [base, setBase] = useState<BaseTipologia | null>(null);
  const [falhaBase, setFalhaBase] = useState<string | null>(null);
  const [tentativaBase, setTentativaBase] = useState(0);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [erroPdf, setErroPdf] = useState<string | null>(null);
  const [finalidade, setFinalidade] = useState<Finalidade>("Short stay");
  const [linha, setLinha] = useState<Linha>("Urban");
  const [pacote, setPacote] = useState<Pacote>("Essential");
  const [extras, setExtras] = useState<Extras>({ arQuartos: false, automacao: false, enxoval: false });
  const [enviado, setEnviado] = useState(false);
  const [inicio, setInicio] = useState(() => isoData(inicioSugerido()));
  const inputRef = useRef<HTMLInputElement>(null);
  const [ultimoArquivo, setUltimoArquivo] = useState<File | null>(null);
  const [segundos, setSegundos] = useState(0);
  const [erroPermissao, setErroPermissao] = useState(false);
  const [adicionando, setAdicionando] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [formVisivel, setFormVisivel] = useState(false);

  // Cronômetro da leitura
  useEffect(() => {
    if (etapa !== "lendo") return;
    const t = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [etapa]);

  // A barra fixa de download some quando o formulário está na tela
  useEffect(() => {
    if (etapa !== "resultado" || !formRef.current) return;
    const io = new IntersectionObserver(([e]) => setFormVisivel(e.isIntersecting), { threshold: 0.2 });
    io.observe(formRef.current);
    return () => io.disconnect();
  }, [etapa]);

  // Ao trocar de etapa, volta para o topo
  useEffect(() => {
    if (etapa !== "lendo") window.scrollTo({ top: 0 });
  }, [etapa]);

  // No celular, leva o cliente até a mensagem de erro
  useEffect(() => {
    if (erroLeitura && window.innerWidth < 1024) document.getElementById("cartao-envio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [erroLeitura]);

  const tipologia = planta.tipologia;
  // Orçamento-base da tipologia: carrega assim que a tipologia é conhecida
  useEffect(() => {
    let vivo = true;
    carregarBase(tipologia).then(
      (b) => vivo && setBase(b),
      () => vivo && setFalhaBase(`${tipologia}:${tentativaBase}`),
    );
    return () => {
      vivo = false;
    };
  }, [tipologia, tentativaBase]);
  const baseAtual = base && base.tipologia === tipologia ? base : null;
  const erroBase = !baseAtual && falhaBase === `${tipologia}:${tentativaBase}`;
  const baseCalc = baseAtual ?? BASE_VAZIA;
  const orc = useMemo(
    () => orcamentoCliente({ comodos, linha, pacote, extras, base: baseCalc, areaTotal: planta.areaTotal }),
    [comodos, linha, pacote, extras, baseCalc, planta.areaTotal],
  );
  const dataInicio = lerIso(inicio) ?? inicioSugerido();
  const crono = useMemo(() => cronograma(dataInicio, orc.linhas), [inicio, orc]); // eslint-disable-line react-hooks/exhaustive-deps
  const prontos = useMemo(() => prontoPorAmbiente(crono, orc.ambientes), [crono, orc.ambientes]);
  const valorM2 = Math.round(orc.total.prov / Math.max(planta.areaTotal, 1));

  const aplicarPlanta = (p: PlantaLida) => {
    setPlanta(p);
    setComodos(p.comodos);
    setEtapa("conferir");
  };

  const usarExemplo = () => {
    leituraRef.current?.abort();
    setErroLeitura(null);
    setPrevia(null);
    setNomeArquivo("planta-exemplo-2d.pdf");
    setSegundos(0);
    setEtapa("lendo");
    setTimeout(() => aplicarPlanta(PLANTA_EXEMPLO), 1400);
  };

  const iniciarLeitura = async (arquivo: File) => {
    leituraRef.current?.abort();
    const ctl = new AbortController();
    leituraRef.current = ctl;
    setErroLeitura(null);
    setErroPermissao(false);
    setUltimoArquivo(arquivo);
    setNomeArquivo(arquivo.name);
    setSegundos(0);
    setEtapa("lendo");
    setVerOriginal(false);
    setPrevia(await previaDoArquivo(arquivo));
    try {
      const p = await lerPlanta(arquivo, ctl.signal);
      if (!ctl.signal.aborted) aplicarPlanta(p);
    } catch (e) {
      if (ctl.signal.aborted) return;
      setErroLeitura(e instanceof Error ? e.message : "Não conseguimos ler esta planta.");
      setErroPermissao(!!(e as { indisponivel?: boolean }).indisponivel);
      setEtapa("envio");
    }
  };

  const testarOutraPlanta = () => {
    leituraRef.current?.abort();
    setErroLeitura(null);
    setPrevia(null);
    setEnviado(false);
    setAdicionando(false);
    setEtapa("envio");
  };

  const cancelarLeitura = () => {
    leituraRef.current?.abort();
    setEtapa("envio");
  };

  const baixarPdf = async () => {
    setGerandoPdf(true);
    setErroPdf(null);
    try {
      const { gerarPdf, logoComoPng, salvarPdf } = await import("@/lib/orcamento/pdf");
      // O pedido vai para a equipe (tabela de leads); se falhar, o cliente recebe o PDF mesmo assim
      enviarLead({ lead, planta: { ...planta, comodos }, finalidade, linha, pacote, extras, orc, inicio, entrega: crono.entrega }).catch(() => {});
      const logoPng = await logoComoPng("/marca/logo-escura.svg");
      const blob = gerarPdf({ nome: lead.nome.trim(), planta: { ...planta, comodos }, linha, pacote, finalidade, extras, orc, crono, prontos, logoPng });
      await salvarPdf(blob, `orcamento-lofteria-${planta.tipologia.toLowerCase()}.pdf`);
      setEnviado(true);
    } catch (e) {
      const code = (e as { code?: string }).code;
      setErroPdf(code === "declined" ? "Download cancelado. Clique de novo para baixar." : "Não conseguimos gerar o PDF agora. Tente de novo.");
    } finally {
      setGerandoPdf(false);
    }
  };

  const editarComodo = (id: string, mudanca: Partial<{ nome: string; area: number }>) =>
    setComodos((cs) => cs.map((c) => (c.id === id ? { ...c, ...mudanca, ...(mudanca.area != null ? { areaEstimada: false } : {}) } : c)));
  const adicionarComodo = (n: (typeof NOVOS_COMODOS)[number]) => {
    const iguais = comodos.filter((c) => c.tipo === n.tipo).length;
    setComodos((cs) => [...cs, { id: `novo-${n.tipo}-${Date.now()}`, nome: iguais ? `${n.nome} ${iguais + 1}` : n.nome, tipo: n.tipo, area: n.area, areaEstimada: true, mobiliar: true }]);
    setAdicionando(false);
  };
  const removerComodo = (id: string) => setComodos((cs) => cs.filter((c) => c.id !== id));
  const irParaFormulario = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => document.getElementById("lead-nome")?.focus({ preventScroll: true }), 450);
  };

  const alternar = (id: string) => setComodos((cs) => cs.map((c) => (c.id === id ? { ...c, mobiliar: !c.mobiliar } : c)));
  const alternarExtra = (k: keyof Extras) => setExtras((e) => ({ ...e, [k]: !e[k] }));
  const idxEtapa = ETAPAS.findIndex((e) => e.id === (etapa === "lendo" ? "envio" : etapa));
  const nAmbientes = comodos.filter((c) => c.mobiliar).length;

  return (
    <div className="orcamento flex min-h-screen flex-col bg-white">
      {/* Etapas */}
      <div className={`${CONTAINER} pt-28 md:pt-32`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-linha pb-5">
          <p className="rotulo text-grafite">Orçamento pela planta</p>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Etapas">
            {ETAPAS.map((e, i) => (
              <button
                key={e.id}
                type="button"
                disabled={i >= idxEtapa || etapa === "lendo"}
                onClick={() => setEtapa(e.id)}
                aria-current={i === idxEtapa ? "step" : undefined}
                title={i < idxEtapa ? `Voltar para ${e.rotulo}` : undefined}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase transition md:px-4 ${
                  i === idxEtapa ? "bg-grafite-profundo text-white" : i < idxEtapa ? "text-grafite hover:bg-nevoa" : "text-texto-suave"
                }`}
              >
                <span className={`flex size-5 items-center justify-center rounded-full text-[10px] tracking-normal ${i === idxEtapa ? "bg-salmao text-white" : i < idxEtapa ? "bg-nevoa" : "ring-1 ring-linha"}`}>
                  {i < idxEtapa ? "✓" : i + 1}
                </span>
                {e.rotulo}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 sm:hidden" aria-label="Etapa atual">
            <span className="text-xs whitespace-nowrap">
              <span className="text-texto-suave">{idxEtapa + 1}/4 · </span>
              <strong className="font-semibold">{ETAPAS[idxEtapa].rotulo}</strong>
            </span>
            <span className="flex w-16 gap-1">
              {ETAPAS.map((e, i) => (
                <span key={e.id} className={`h-1 flex-1 rounded-full ${i <= idxEtapa ? "bg-salmao" : "bg-linha"}`} />
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className={`${CONTAINER} flex flex-1 flex-col pt-8 pb-20 md:pt-12 md:pb-28`}>
        {/* 1. Envio */}
        {(etapa === "envio" || etapa === "lendo") && (
          <section className="my-auto grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] 2xl:gap-20">
            <div className={etapa === "lendo" ? "hidden lg:block" : ""}>
              <h1 className="titulo-lg text-grafite">
                Envie a planta e receba o orçamento <span className="font-light text-salmao">para mobiliar.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed font-light text-texto-suave">
                Nossa IA lê a planta, entende cada cômodo e calcula o investimento com base em mais de 400 imóveis que a Lofteria já
                entregou prontos para morar ou alugar.
              </p>
              <ol className="mt-8 flex flex-wrap gap-2">
                {["Envie a planta", "Escolha o estilo", "Receba o orçamento"].map((t, i) => (
                  <li key={t} className="flex items-center gap-2 rounded-full bg-nevoa py-1.5 pr-4 pl-1.5 text-sm">
                    <span className="flex size-7 items-center justify-center rounded-full bg-grafite-profundo text-xs font-semibold text-white">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
              <dl className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
                {NUMEROS_LOFTERIA.map(([n, t]) => (
                  <div key={t}>
                    <dt className="text-2xl font-semibold tracking-tight whitespace-nowrap text-grafite xl:text-[1.7rem]">{n}</dt>
                    <dd className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-xs text-texto-suave">
                      <span className="h-1.5 w-1.5 rounded-full bg-salmao" />
                      {t}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div id="cartao-envio" className={`scroll-mt-28 rounded-[24px] bg-nevoa p-6 md:p-8 ${etapa === "lendo" ? "mx-auto w-full max-w-xl lg:max-w-none" : ""}`}>
              {etapa === "envio" ? (
                <>
                  {erroLeitura && (
                    <div className="mb-4 rounded-2xl border border-salmao/40 bg-salmao-claro px-4 py-3 text-sm" role="alert">
                      <p className="font-semibold text-salmao">Não conseguimos ler a planta</p>
                      <p className="mt-0.5 text-grafite">{erroLeitura}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ultimoArquivo && !erroLeitura.includes("fora do ar") && (
                          <button onClick={() => ultimoArquivo && iniciarLeitura(ultimoArquivo)} className="rounded-full bg-salmao px-4 py-1.5 font-semibold text-white hover:brightness-95">
                            Tentar de novo
                          </button>
                        )}
                        {erroPermissao && (
                          <button onClick={usarExemplo} className="rounded-full bg-white px-4 py-1.5 font-semibold text-petroleo hover:bg-petroleo-claro">
                            Usar a planta de exemplo
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f) iniciarLeitura(f);
                    }}
                    className="group relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-[20px] border-2 border-dashed border-grafite/20 bg-white px-6 py-14 text-center transition hover:border-salmao"
                  >
                    <span className="flex size-16 items-center justify-center rounded-full bg-salmao text-white shadow-lg transition group-hover:scale-105">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                      </svg>
                    </span>
                    <span className="text-lg font-semibold">Arraste a planta aqui</span>
                    <span className="text-sm font-light text-texto-suave">ou clique para escolher · PDF, JPG ou PNG</span>
                    <span className="text-xs font-light text-texto-suave">Dica: só a planta do seu apartamento, vista de cima, funciona melhor.</span>
                  </button>
                  <input
                    ref={inputRef}
                    id="arquivo-planta"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      if (f) iniciarLeitura(f);
                    }}
                  />
                  <div className="my-5 flex items-center gap-3 text-xs text-texto-suave">
                    <span className="h-px flex-1 bg-linha" /> não tem a planta agora? <span className="h-px flex-1 bg-linha" />
                  </div>
                  <button onClick={usarExemplo} className="botao botao-claro w-full ring-1 ring-linha">
                    Ver com uma planta de exemplo
                  </button>
                  <p className="mt-5 text-center text-xs font-light text-texto-suave">Sua planta é usada só para calcular o orçamento.</p>
                </>
              ) : (
                <div className="flex flex-col items-center gap-5 py-6 text-center" aria-live="polite">
                  {previa ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previa} alt="Planta enviada" className="h-full w-full object-contain opacity-60" />
                      <div className="absolute inset-x-0 top-0 h-1/3 animate-pulse bg-gradient-to-b from-petroleo/25 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-14 w-14 animate-spin rounded-full border-4 border-petroleo-claro border-t-petroleo" />
                  )}
                  <div>
                    <p className="text-lg font-semibold">Lendo sua planta…</p>
                    <p className="text-sm font-light text-texto-suave">{nomeArquivo}</p>
                  </div>
                  <div className="w-full max-w-sm">
                    <div className="h-1.5 overflow-hidden rounded-full bg-linha" role="progressbar" aria-label="Progresso da leitura" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(Math.min(95, (1 - Math.exp(-segundos / 25)) * 100))}>
                      <div className="h-full rounded-full bg-petroleo transition-all duration-1000" style={{ width: `${Math.min(95, (1 - Math.exp(-segundos / 25)) * 100)}%` }} />
                    </div>
                    <ol className="mt-4 space-y-2 text-left text-sm">
                      {PASSOS_LEITURA.map(([t, rotulo], i) => {
                        const prox = PASSOS_LEITURA[i + 1]?.[0] ?? Infinity;
                        const feito = segundos >= prox;
                        const atual = segundos >= t && !feito;
                        return (
                          <li key={rotulo} className={`flex items-center gap-2 ${feito ? "text-petroleo" : atual ? "font-semibold" : "text-texto-suave/60"}`}>
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${feito ? "bg-petroleo text-white" : atual ? "border-2 border-petroleo" : "border border-linha"}`}>
                              {feito ? "✓" : atual ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-petroleo" /> : null}
                            </span>
                            {rotulo}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                  {previa && (
                    <p className="text-xs text-texto-suave">
                      {segundos < 75 ? "A leitura leva cerca de 1 minuto." : "Está levando mais que o normal. Pode esperar mais um pouco ou cancelar."}{" "}
                      <span className="tabular-nums">{Math.floor(segundos / 60)}:{String(segundos % 60).padStart(2, "0")}</span>
                    </p>
                  )}
                  <button onClick={cancelarLeitura} className="text-sm font-semibold text-petroleo underline-offset-4 hover:underline">Cancelar</button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 2. Conferir */}
        {etapa === "conferir" && (
          <section className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[1.2fr_1fr] 2xl:grid-cols-[1.5fr_1fr] 2xl:gap-8">
            <div className="vidro relative flex flex-col gap-3 rounded-[32px] p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">{verOriginal ? "Planta enviada" : "Planta remontada"}</p>
                {previa && (
                  <div className="flex rounded-full bg-nevoa p-1 text-xs">
                    {[false, true].map((o) => (
                      <button key={String(o)} onClick={() => setVerOriginal(o)} className={`rounded-full px-3 py-1.5 font-semibold ${verOriginal === o ? "bg-white shadow-sm" : "text-texto-suave"}`}>
                        {o ? "Original" : "Remontada"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mx-auto flex w-full flex-1 items-center justify-center" style={{ minHeight: 220 }}>
                {verOriginal && previa ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previa} alt="Planta enviada" className="max-w-full rounded-xl bg-white object-contain" style={{ maxHeight: "min(62vh, 560px)" }} />
                ) : (
                  <div style={{ aspectRatio: String(proporcaoDoDesenho(comodos, planta.proporcao)), width: `min(100%, calc(min(62vh, 560px) * ${proporcaoDoDesenho(comodos, planta.proporcao)}))` }}>
                    <PlantaInterativa comodos={comodos} proporcao={planta.proporcao} onAlternar={alternar} />
                  </div>
                )}
              </div>
              <p className="text-center text-xs text-texto-suave">Toque num cômodo para tirar ou incluir. Tracejado = fora do orçamento.</p>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="titulo-md text-grafite">
                  Confira o que <span className="font-light text-salmao">entendemos</span>
                </h2>
                <p className="mt-2 font-light text-texto-suave">
                  {planta.nome}. A IA pode errar: confira os cômodos e as áreas e corrija o que for preciso.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:gap-8">
                <NumeroGrande valor={planta.tipologia} rotulo="tipologia" icone="M3 10.5 12 3l9 7.5V21H3z" />
                <NumeroGrande valor={planta.areaTotal.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} unidade="m²" rotulo={planta.areaTotalEstimada ? "área estimada" : "área da planta"} icone="M4 4h16v16H4zM4 12h16M12 4v16" />
                <NumeroGrande valor={String(nAmbientes)} rotulo="a mobiliar" icone="M5 12l5 5 9-10" />
              </div>
              {planta.avisos.length > 0 && (
                <ul className="space-y-1 rounded-2xl bg-salmao-claro/70 px-4 py-3 text-sm">
                  {planta.avisos.map((a) => (
                    <li key={a} className="flex gap-2"><span className="text-salmao">•</span>{a}</li>
                  ))}
                </ul>
              )}
              <div className="vidro flex flex-wrap items-center gap-3 rounded-3xl p-3 text-sm">
                <span className="pl-1 font-semibold">Tipologia e área:</span>
                <div className="flex rounded-full bg-nevoa p-1">
                  {(["Studio", "1D", "2D", "3D", "4D"] as Tipologia[]).map((t) => (
                    <button key={t} onClick={() => setPlanta((p) => ({ ...p, tipologia: t }))} className={`rounded-full px-3 py-1 ${planta.tipologia === t ? "bg-petroleo font-semibold text-white" : "text-texto-suave"}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2">
                  <CampoNumero id="area-total" rotulo="Área total em m²" valor={planta.areaTotal} min={10} max={500} onChange={(v) => setPlanta((p) => ({ ...p, areaTotal: v, areaTotalEstimada: false }))} className="w-24" />
                  m²
                </label>
              </div>
              <div className="vidro rounded-3xl">
                <div className="flex items-center justify-between px-4 pb-1 pt-3 text-xs text-texto-suave">
                  <span>Mobiliar · cômodo</span>
                  <span>área (m²)</span>
                </div>
                <ul className="divide-y divide-linha">
                  {comodos.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 px-4 py-2">
                      <input id={`comodo-${c.id}`} type="checkbox" checked={c.mobiliar} onChange={() => alternar(c.id)} aria-label={`Mobiliar ${c.nome}`} className="h-5 w-5 shrink-0 accent-[var(--petroleo)]" />
                      <input
                        value={c.nome}
                        onChange={(e) => editarComodo(c.id, { nome: e.target.value })}
                        aria-label="Nome do cômodo"
                        className={`min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 outline-none hover:border-linha focus:border-petroleo focus:bg-white ${c.mobiliar ? "" : "text-texto-suave line-through"}`}
                      />
                      {c.areaEstimada && <span className="text-xs text-texto-suave" title="Área estimada">≈</span>}
                      <CampoNumero rotulo={`Área de ${c.nome} em m²`} valor={c.area} min={0.5} max={200} onChange={(v) => editarComodo(c.id, { area: v })} className="w-20 text-sm" />
                      {c.id.startsWith("novo-") && (
                        <button onClick={() => removerComodo(c.id)} aria-label={`Remover ${c.nome}`} className="text-texto-suave hover:text-salmao">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-linha px-4 py-3">
                  {!adicionando ? (
                    <button onClick={() => setAdicionando(true)} className="flex items-center gap-2 text-sm font-semibold text-petroleo hover:underline">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-petroleo-claro">+</span>
                      Faltou algum cômodo? Adicionar
                    </button>
                  ) : (
                    <div>
                      <p className="mb-2 text-sm">Qual cômodo faltou?</p>
                      <div className="flex flex-wrap gap-2">
                        {NOVOS_COMODOS.map((n) => (
                          <button key={n.tipo} onClick={() => adicionarComodo(n)} className="rounded-full border border-linha bg-white px-3 py-1.5 text-sm hover:border-petroleo">
                            {n.nome}
                          </button>
                        ))}
                        <button onClick={() => setAdicionando(false)} className="px-2 text-sm text-texto-suave hover:underline">Cancelar</button>
                      </div>
                      <p className="mt-2 text-xs text-texto-suave">Ele entra no orçamento com uma área média; ajuste a área se souber.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button onClick={() => setEtapa("envio")} className={BOTAO_SECUNDARIO}>Trocar planta</button>
                <button onClick={() => setEtapa("preferencias")} className={`flex-1 ${BOTAO_PRIMARIO}`}>Está certo, continuar</button>
              </div>
            </div>
          </section>
        )}

        {/* 3. Preferências */}
        {etapa === "preferencias" && (
          <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 xl:max-w-5xl">
            <div>
              <h2 className="titulo-md text-grafite">
                Como você quer o <span className="font-light text-salmao">seu apartamento?</span>
              </h2>
              <p className="mt-2 font-light text-texto-suave">Escolhas rápidas. Você pode mudar depois, no resultado.</p>
            </div>
            <div>
              <p className="mb-3 font-semibold">Para que é o apartamento?</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(["Short stay", "Long stay", "Morar"] as Finalidade[]).map((f) => (
                  <Opcao key={f} ativo={finalidade === f} onClick={() => setFinalidade(f)} titulo={f} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-semibold">Estilo</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(["Urban", "Eco", "Slim"] as Linha[]).map((l) => (
                  <Opcao key={l} ativo={linha === l} onClick={() => setLinha(l)} titulo={l} descricao={DESCRICAO_LINHA[l]} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-semibold">Nível de acabamento</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(["Basic", "Essential", "Design"] as Pacote[]).map((p) => (
                  <Opcao key={p} ativo={pacote === p} onClick={() => setPacote(p)} titulo={p} descricao={DESCRICAO_PACOTE[p]} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-semibold">Itens opcionais</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Interruptor ativo={extras.arQuartos} onClick={() => alternarExtra("arQuartos")} rotulo={"Ar-condicionado nos\u00a0quartos"} detalhe={"A sala já tem ar-condicionado\u00a0incluso"} />
                <Interruptor ativo={extras.automacao} onClick={() => alternarExtra("automacao")} rotulo="Automação" detalhe="Fechadura digital, luzes e ar pelo celular" />
                <Interruptor ativo={extras.enxoval} onClick={() => alternarExtra("enxoval")} rotulo="Enxoval completo" detalhe="Cama, banho e cozinha prontos para o hóspede" />
              </div>
            </div>
            <div>
              <p className="mb-1 font-semibold">Quando você quer começar a obra?</p>
              <p className="mb-3 text-sm font-light text-texto-suave">A obra leva em média {PRAZO_DIAS_UTEIS} dias úteis, cerca de 3 meses.</p>
              <div className="vidro flex flex-wrap items-center gap-4 rounded-3xl p-4">
                <input
                  id="inicio-obra"
                  type="date"
                  value={inicio}
                  min={isoData(new Date())}
                  onChange={(e) => e.target.value && setInicio(e.target.value)}
                  className="rounded-full border border-linha bg-white px-4 py-2.5 font-semibold outline-none focus:border-petroleo"
                />
                <p className="text-sm">
                  Entrega prevista em <strong className="font-semibold text-petroleo">{dataLonga(somarDiasUteis(dataInicio, PRAZO_DIAS_UTEIS))}</strong>
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button onClick={() => setEtapa("conferir")} className={BOTAO_SECUNDARIO}>Voltar</button>
              <button onClick={() => setEtapa("resultado")} className={`flex-1 ${BOTAO_PRIMARIO}`}>Ver meu orçamento</button>
            </div>
          </section>
        )}

        {/* 4. Resultado — painel */}
        {etapa === "resultado" && !baseAtual && (
          <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 py-16 text-center" aria-live="polite">
            {erroBase ? (
              <>
                <p className="titulo-md text-grafite">Não conseguimos calcular agora.</p>
                <p className="font-light text-texto-suave">Tente de novo em instantes. Se continuar, fale com a gente pelo contato que um consultor faz o orçamento.</p>
                <div className="flex flex-wrap justify-center gap-5">
                  <button onClick={() => setTentativaBase((n) => n + 1)} className={BOTAO_PRIMARIO}>Tentar de novo</button>
                  <a href="/contato" className={BOTAO_SECUNDARIO}>Falar com a Lofteria</a>
                </div>
              </>
            ) : (
              <>
                <span className="size-12 animate-spin rounded-full border-4 border-nevoa border-t-salmao" />
                <p className="font-light text-texto-suave">Calculando seu orçamento…</p>
              </>
            )}
          </section>
        )}

        {etapa === "resultado" && baseAtual && (
          <section className="flex flex-col gap-4 md:gap-5">
            {/* Cabeçalho do painel */}
            <div className="grid gap-6 pb-2 xl:grid-cols-[1.6fr_1fr] xl:items-end">
              <div>
                <div className="mb-3 flex flex-wrap gap-2 text-xs">
                  {[`${planta.nome} · ${planta.tipologia}`, linha, finalidade].map((t) => (
                    <span key={t} className="vidro rounded-full px-3 py-1">{t}</span>
                  ))}
                  <button onClick={testarOutraPlanta} className="rounded-full border border-petroleo/30 px-3 py-1 font-semibold text-petroleo hover:bg-petroleo-claro">
                    ↺ Testar outra planta
                  </button>
                </div>
                <h1 className="titulo-md text-grafite">
                  Seu apartamento pronto por <span className="text-salmao">{brl(orc.total.prov)}</span>
                </h1>
                <div className="mt-5 grid grid-cols-3 gap-1 rounded-3xl bg-white/60 p-1 backdrop-blur sm:inline-flex sm:rounded-full" role="tablist" aria-label="Nível de acabamento">
                  {(["Basic", "Essential", "Design"] as Pacote[]).map((p) => {
                    const t = orcamentoCliente({ comodos, linha, pacote: p, extras, base: baseCalc, areaTotal: planta.areaTotal }).total.prov;
                    return (
                      <button
                        key={p}
                        role="tab"
                        aria-selected={pacote === p}
                        onClick={() => setPacote(p)}
                        className={`flex flex-col items-center rounded-full px-3 py-2 text-sm transition sm:flex-row sm:gap-1 sm:px-4 ${pacote === p ? "bg-petroleo text-white shadow" : "text-texto-suave hover:text-grafite"}`}
                      >
                        <span className="font-semibold">{p}</span> <span className="text-xs tabular-nums opacity-80 sm:text-sm">{mil(t)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:flex sm:justify-between sm:gap-6 xl:justify-end xl:gap-8">
                <NumeroGrande valor={planta.areaTotal.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} unidade="m²" rotulo="área total" icone="M4 4h16v16H4zM4 12h16M12 4v16" />
                <NumeroGrande valor={valorM2.toLocaleString("pt-BR")} unidade="/m²" rotulo="valor por m²" icone="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                <NumeroGrande valor={String(PRAZO_DIAS_UTEIS)} rotulo="dias úteis" icone="M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-texto-suave">Para onde vai o investimento</p>
              <BarraComposicao linhas={orc.linhas} />
            </div>

            {/* Grade de cartões */}
            <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-12">
              <div className="md:col-span-2 xl:col-span-3 xl:row-span-1">
                <FotoProjetos fotos={FOTOS_PROJETOS} />
              </div>
              <Cartao className="xl:col-span-3">
                <TituloCartao>Por ambiente</TituloCartao>
                <BarrasAmbientes ambientes={orc.ambientes} prontos={prontos} />
              </Cartao>
              <Cartao className="xl:col-span-3">
                <TituloCartao>Prazo da obra</TituloCartao>
                <AnelPrazo c={crono} inicioIso={inicio} onInicio={setInicio} />
              </Cartao>
              <div className="flex min-w-0 flex-col gap-4 md:col-span-2 md:grid md:grid-cols-2 md:items-start md:gap-5 xl:col-span-3 xl:row-span-2 xl:flex xl:flex-col xl:items-stretch">
                <Cartao>
                  <FaixaPreco total={orc.total} />
                </Cartao>
                <CartaoIncluso extras={extras} onAlternar={alternarExtra} />
              </div>

              <Cartao className="md:col-span-2 xl:col-span-9">
                <TituloCartao
                  extra={
                    <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs">
                      <span className="rounded-full bg-nevoa px-3 py-1">{mesAno(crono.inicio)}</span>
                      <span className="text-texto-suave">→</span>
                      <span className="rounded-full bg-petroleo px-3 py-1 text-white">{mesAno(crono.entrega)}</span>
                    </span>
                  }
                >
                  Cronograma da obra
                </TituloCartao>
                <GanttObra c={crono} />
              </Cartao>

              <Cartao className="md:col-span-2 xl:col-span-3">
                <TituloCartao>Por categoria</TituloCartao>
                <AcordeaoCategorias linhas={orc.linhas} />
              </Cartao>
              <Cartao className="md:col-span-2 xl:col-span-9">
                <TituloCartao>Quando o investimento acontece</TituloCartao>
                <CurvaGastos c={crono} />
                <p className="mt-4 text-xs font-light text-texto-suave">
                  Simulação: metade de cada categoria no pedido e metade na chegada; gestão e mão de obra ao longo da obra. As condições
                  de pagamento são combinadas na proposta.
                </p>
              </Cartao>
            </div>

            {/* Contato no final */}
            <div ref={formRef} id="baixar" className="relative mt-2 grid scroll-mt-28 gap-6 overflow-hidden rounded-[24px] bg-grafite-profundo p-6 text-white md:p-8 lg:grid-cols-[1fr_1.4fr] lg:items-center 2xl:grid-cols-[1fr_1.8fr] 2xl:p-10">
              <span className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[28px] border-salmao/80" aria-hidden />
              <div className="relative">
                <p className="text-2xl font-light md:text-3xl">
                  Baixe o <strong className="font-semibold">orçamento completo em PDF</strong>
                </p>
                <p className="mt-2 font-light text-white/80">Com a planta, os valores por ambiente e categoria, o valor por m² e o cronograma da obra.</p>
              </div>
              {!enviado ? (
                <form
                  className="relative grid gap-3 sm:grid-cols-2 2xl:grid-cols-[1fr_1fr_1fr_auto]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!gerandoPdf) baixarPdf();
                  }}
                >
                  <input id="lead-nome" required autoComplete="name" placeholder="Seu nome" value={lead.nome} onChange={(e) => setLead((l) => ({ ...l, nome: e.target.value }))} className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white outline-none backdrop-blur placeholder:text-white/60 focus:border-salmao" />
                  <input id="lead-email" required type="email" autoComplete="email" placeholder="Seu e-mail" value={lead.email} onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))} className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white outline-none backdrop-blur placeholder:text-white/60 focus:border-salmao" />
                  <input id="lead-whats" inputMode="tel" autoComplete="tel" required placeholder="Seu WhatsApp" value={lead.whats} onChange={(e) => setLead((l) => ({ ...l, whats: e.target.value }))} className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white outline-none backdrop-blur placeholder:text-white/60 focus:border-salmao" />
                  <button disabled={gerandoPdf} className="flex items-center justify-center gap-2 rounded-full bg-salmao px-6 py-3 font-semibold text-white hover:brightness-95 disabled:opacity-70">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
                    <span className="whitespace-nowrap">{gerandoPdf ? "Gerando…" : "Baixar PDF"}</span>
                  </button>
                  {erroPdf && <p className="text-sm text-salmao-claro sm:col-span-2 2xl:col-span-4" role="alert">{erroPdf}</p>}
                  <p className="text-xs font-light text-white/70 sm:col-span-2 2xl:col-span-4">
                    Usamos seus dados só para enviar este orçamento e falar com você sobre ele. Não compartilhamos seus dados. Ao
                    baixar, você concorda com esse contato.
                  </p>
                </form>
              ) : (
                <div className="relative rounded-3xl bg-white/10 p-5">
                  <p className="text-lg font-semibold">Pronto, {lead.nome.split(" ")[0]}! Seu PDF foi gerado.</p>
                  <p className="font-light text-white/80">Um especialista da Lofteria vai conferir sua planta e falar com você para agendar a visita técnica.</p>
                  <button onClick={baixarPdf} className="mt-3 text-sm font-semibold underline underline-offset-4">Baixar de novo</button>
                </div>
              )}
            </div>

            {/* Barra fixa de download (some quando o formulário aparece) */}
            {!enviado && (
              <div
                className={`fixed inset-x-0 bottom-20 z-30 px-3 transition-all duration-300 md:bottom-24 md:px-6 ${formVisivel ? "pointer-events-none translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
                aria-hidden={formVisivel}
              >
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-full border border-linha bg-white py-2 pl-5 pr-2 shadow-[0_12px_40px_-12px_rgba(50,60,68,0.45)]">
                  <div className="min-w-0 leading-tight">
                    <p className="text-[11px] text-texto-suave">{linha} {pacote} · {planta.tipologia}</p>
                    <p className="truncate font-semibold tabular-nums">{brl(orc.total.prov)}</p>
                  </div>
                  <button onClick={irParaFormulario} tabIndex={formVisivel ? -1 : 0} className="flex shrink-0 items-center gap-2 rounded-full bg-salmao px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
                    Baixar PDF
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pb-20 md:pb-24">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setEtapa("preferencias")} className={BOTAO_SECUNDARIO}>Ajustar escolhas</button>
                <button onClick={testarOutraPlanta} className={BOTAO_SECUNDARIO}>Testar outra planta</button>
              </div>
              <p className="max-w-2xl text-xs font-light text-texto-suave">
                Estimativa automática a partir da sua planta e dos orçamentos-base da Lofteria para cada tipologia. Não é uma proposta
                comercial: o valor final é confirmado após visita técnica e projeto. Projetos sob medida de alto padrão podem passar da faixa.
                Não inclui obras civis.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
