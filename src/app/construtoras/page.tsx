import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu";
import PaginaTopo from "@/components/PaginaTopo";
import Revelar from "@/components/Revelar";
import ChamadaFinal from "@/components/ChamadaFinal";
import { semViuva } from "@/lib/texto";

// Conteúdo da apresentação "Soluções em Design de Interiores para Incorporadoras"
// (Roadshow / Apresentações 2.0 da Lofteria)

export const metadata: Metadata = {
  title: "Construtoras e incorporadoras · Lofteria",
  description:
    "Transformamos unidades prontas em produtos imobiliários completos, mais atrativos e competitivos. Projeto, execução e materiais de venda em até 60 dias, sem sobrecarregar a obra.",
};

const DIFERENCIAIS = [
  {
    titulo: "Projetos para todas as plantas",
    texto: "Modelo padronizado e replicável, adaptado a cada tipologia do empreendimento e ao perfil do comprador.",
  },
  {
    titulo: "Apartamento modelo, não só decorado",
    texto: "Unidades completas, prontas para visitação, anúncio e uso, no lugar do decorado tradicional.",
  },
  {
    titulo: "Walk’a como ferramenta de vendas",
    texto: "Tour virtual criado pela Lofteria, com plantas, acabamentos e diferenciais do imóvel em um só link.",
  },
];

const ETAPAS = [
  {
    titulo: "Alinhamento inicial",
    texto: "Mapeamento de escopo, tipologias, perfil de cliente, cronograma, escopo financeiro e diretrizes técnicas.",
  },
  {
    titulo: "Planejamento da execução",
    texto: "Definição da janela de montagem, fornecedores homologados, cronograma e logística no local.",
  },
  {
    titulo: "Desenvolvimento do projeto",
    texto: "Projeto completo feito pela equipe da Lofteria, com foco em estética, funcionalidade e execução escalável.",
  },
  {
    titulo: "Execução",
    texto: "Montagem pela Lofteria ou por parceiros homologados, com atualizações periódicas e controle total da operação.",
  },
  {
    titulo: "Ativação comercial",
    texto: "Entrega de materiais de venda (renders, memorial e Walk’a), com uso estratégico da base de leads da construtora.",
  },
  {
    titulo: "Entrega final",
    texto: "Unidade pronta para visitação, anúncio e uso comercial, com todos os materiais de apoio físicos e digitais.",
  },
];

const MODELOS = [
  { titulo: "Unidade-piloto", texto: "Teste a solução em uma unidade específica, iniciada em até 7 dias úteis após o recebimento dos materiais." },
  { titulo: "Parceria escalável", texto: "Modelo replicável para múltiplas unidades do mesmo empreendimento ou de novos lançamentos." },
  { titulo: "Estudo de viabilidade", texto: "Análise aplicada a uma tipologia específica, antes de qualquer compromisso." },
];

export default function Construtoras() {
  return (
    <>
      <Menu />
      <main>
        <PaginaTopo
          rotulo="Construtoras e incorporadoras"
          titulo={
            <>
              <strong className="font-semibold">Estoque pronto,</strong>{" "}
              <span className="font-light">produto que vende.</span>
            </>
          }
          texto="Somos parceiros de construtoras que querem acelerar a venda de unidades prontas, reduzir a vacância e elevar a percepção de valor dos empreendimentos. Projetamos, executamos e entregamos, sem sobrecarregar a sua operação."
          foto="studio-integrado"
          fotoAlt="Studio integrado com cozinha e quarto, montado pela Lofteria"
          acao={{ href: "/contato", rotulo: "Falar com um consultor" }}
        />

        {/* Dado de abertura do deck */}
        <Revelar className="mx-auto max-w-[90rem] px-5 py-24 text-center md:px-10 md:py-32">
          <p data-revelar className="text-[clamp(4rem,12vw,10rem)] leading-none font-semibold tracking-[-0.04em] text-salmao">
            81%
          </p>
          <p data-revelar className="titulo-md mx-auto mt-6 max-w-[22ch] text-grafite">
            dos compradores não conseguem entender um imóvel se ele estiver vazio.
          </p>
          <p data-revelar className="mt-6 text-[0.6875rem] font-semibold tracking-[0.22em] text-texto-suave uppercase">
            Fonte: Associação Americana de Corretores
          </p>
        </Revelar>

        {/* Proposta de valor */}
        <section className="bg-grafite-profundo py-24 text-white md:py-32">
          <Revelar className="mx-auto grid max-w-[90rem] gap-12 px-5 md:px-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <h2 data-revelar className="titulo-lg">
              Não somos uma empresa de decoração. <span className="font-light text-white/45">Somos uma operação técnica.</span>
            </h2>
            <p data-revelar className="max-w-xl text-lg leading-relaxed font-light text-white/70">
              {semViuva(
                "Entendemos a lógica da incorporação, respeitamos o cronograma da obra e geramos valor direto no VGV. Uma alternativa ao decorado tradicional: mais ágil, padronizável e escalável, com fornecedores homologados, materiais padronizados e total visibilidade sobre prazos, custos e execução.",
              )}
            </p>
          </Revelar>
          <Revelar className="mx-auto mt-16 grid max-w-[90rem] gap-3 px-5 md:mt-20 md:grid-cols-3 md:px-10">
            {DIFERENCIAIS.map((d) => (
              <div key={d.titulo} data-revelar className="rounded-2xl bg-white/[0.04] p-8 ring-1 ring-white/10">
                <h3 className="text-2xl font-semibold tracking-tight">{d.titulo}</h3>
                <p className="mt-4 leading-relaxed font-light text-white/60">{semViuva(d.texto)}</p>
              </div>
            ))}
          </Revelar>
        </section>

        {/* Etapas da operação */}
        <Revelar className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-32">
          <div data-revelar className="flex flex-wrap items-end justify-between gap-8">
            <h2 className="titulo-lg max-w-[16ch] text-grafite">
              Como funciona a parceria. <span className="font-light text-texto-suave">Sem sobrecarga para a obra.</span>
            </h2>
            <p className="max-w-md text-lg leading-relaxed font-light text-texto-suave">
              {semViuva(
                "Assumimos toda a frente técnica e comercial da ambientação, integrados ao ciclo da obra e sem mobilizar a sua equipe.",
              )}
            </p>
          </div>
          <ol className="mt-16 grid gap-x-10 gap-y-12 border-t border-linha pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {ETAPAS.map((e) => (
              <li key={e.titulo} data-revelar>
                <h3 className="text-2xl font-semibold tracking-tight text-grafite">{e.titulo}</h3>
                <p className="mt-3 max-w-sm leading-relaxed font-light text-texto-suave">{semViuva(e.texto)}</p>
              </li>
            ))}
          </ol>
        </Revelar>

        {/* Walk'a */}
        <section className="bg-nevoa py-24 md:py-32">
          <Revelar className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 md:px-10 lg:grid-cols-2">
            <div data-revelar className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
              <Image src="/img/sala-estante.jpg" alt="Sala ambientada pela Lofteria" fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
            </div>
            <div data-revelar>
              <p className="rotulo text-grafite">Walk’a</p>
              <h2 className="titulo-lg mt-6 max-w-[14ch] text-grafite">
                Tour virtual <span className="font-light text-texto-suave">com foco em conversão.</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed font-light text-texto-suave">
                {semViuva(
                  "Plataforma criada pela Lofteria que funciona como uma landing page imersiva do imóvel: metragem, localização, plantas, acabamentos e diferenciais em um só lugar. Acessível por link ou QR Code, em atendimentos presenciais ou remotos, e reduz a necessidade de decorados físicos.",
                )}
              </p>
            </div>
          </Revelar>
        </section>

        {/* Estudo de caso */}
        <Revelar className="mx-auto grid max-w-[90rem] gap-12 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div data-revelar>
            <p className="rotulo text-grafite">Estudo de caso · Venda</p>
            <h2 className="titulo-lg mt-6 max-w-[16ch] text-grafite">
              Apartamento 2 dormitórios <span className="font-light text-texto-suave">no Campeche.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed font-light text-texto-suave">
              {semViuva(
                "A unidade padrão estava no mercado havia 4 meses sem gerar visitas qualificadas. A Lofteria desenvolveu um projeto de ambientação alinhado à persona da incorporadora e entregou em 60 dias, sem impacto no cronograma da obra.",
              )}
            </p>
          </div>
          <dl data-revelar className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-grafite-profundo p-8 text-white">
              <dt className="text-sm text-white/55">Valorização percebida acima da média da torre</dt>
              <dd className="mt-6 text-5xl font-semibold tracking-tight">R$ 120 mil</dd>
            </div>
            <div className="rounded-2xl bg-grafite-profundo p-8 text-white">
              <dt className="text-sm text-white/55">Para concluir a venda depois da entrega</dt>
              <dd className="mt-6 text-5xl font-semibold tracking-tight">&lt; 20 dias</dd>
            </div>
          </dl>
        </Revelar>

        {/* Modelos de parceria */}
        <Revelar className="mx-auto max-w-[90rem] px-5 pb-24 md:px-10 md:pb-32">
          <h2 data-revelar className="titulo-md max-w-[24ch] text-grafite">
            Por onde começar. <span className="font-light text-texto-suave">Avançamos no momento em que fizer sentido.</span>
          </h2>
          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {MODELOS.map((m) => (
              <div key={m.titulo} data-revelar className="rounded-2xl bg-nevoa p-8">
                <h3 className="text-2xl font-semibold tracking-tight text-grafite">{m.titulo}</h3>
                <p className="mt-4 leading-relaxed font-light text-texto-suave">{semViuva(m.texto)}</p>
              </div>
            ))}
          </div>
          <div data-revelar className="mt-10">
            <Link href="/contato" className="botao botao-salmao">
              Agendar conversa
            </Link>
          </div>
        </Revelar>

        <ChamadaFinal
          rotulo="Construtoras e incorporadoras"
          titulo="Seu estoque pronto para performar"
          foto="jantar-quadro"
          acao={{ href: "/contato", texto: "Falar com um consultor" }}
        />
      </main>
    </>
  );
}
