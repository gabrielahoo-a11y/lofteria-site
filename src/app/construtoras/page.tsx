import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Menu from "@/components/Menu";
import PaginaTopo from "@/components/PaginaTopo";
import Revelar from "@/components/Revelar";
import ChamadaFinal from "@/components/ChamadaFinal";
import IcebergEtapas from "@/components/IcebergEtapas";
import Tour360 from "@/components/Tour360";
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

        <IcebergEtapas />

        {/* Walk'a e tours 360º */}
        <section className="bg-nevoa py-24 md:py-32">
          <Revelar className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 md:px-10 lg:grid-cols-[1fr_1.25fr]">
            <div data-revelar>
              <p className="rotulo text-grafite">Walk’a</p>
              <h2 className="titulo-lg mt-6 text-grafite">
                Tour virtual <br className="hidden sm:inline" />
                <span className="font-light text-texto-suave">com foco em&nbsp;conversão.</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed font-light text-texto-suave">
                {semViuva(
                  "Plataforma criada pela Lofteria que funciona como uma landing page imersiva do imóvel: metragem, localização, plantas, acabamentos e diferenciais em um só lugar. Acessível por link ou QR Code, em atendimentos presenciais ou remotos, e reduz a necessidade de decorados físicos.",
                )}
              </p>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-texto-suave">
                {semViuva("Experimente ao lado os tours 360º dos três estilos da Lofteria, os mesmos apresentados aos investidores do Alma Lusa.")}
              </p>
            </div>
            <div data-revelar>
              <Tour360 />
            </div>
          </Revelar>
        </section>

        {/* Parceria com a FAZ */}
        <section className="py-24 md:py-32">
          <Revelar className="mx-auto max-w-[90rem] px-5 md:px-10">
            <div data-revelar className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
              <div>
                <p className="rotulo text-grafite">Parceria</p>
                <h2 className="titulo-lg mt-6 max-w-[16ch] text-grafite">
                  Lado a lado <span className="font-light text-texto-suave">com quem constrói.</span>
                </h2>
              </div>
              <div>
                <Image src="/img/parceiros/faz.webp" alt="FAZ Construções e Incorporações" width={600} height={215} className="h-12 w-auto" />
                <p className="mt-6 max-w-xl text-lg leading-relaxed font-light text-texto-suave">
                  {semViuva(
                    "Desde 2008 em Florianópolis, a FAZ Construções e Incorporações estrutura e administra as obras dos empreendimentos em que a Lofteria assina as unidades decoradas. Mais de 200 investidores já escolheram a FAZ e a Lofteria para proteger e valorizar o seu patrimônio.",
                  )}
                </p>
              </div>
            </div>
            <dl className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["+17", "anos de experiência"],
                ["+700", "unidades entregues"],
                ["+200 mil", "m² construídos"],
                ["R$ 1,3 bi", "administrados em obras"],
              ].map(([v, r]) => (
                <div key={r} data-revelar className="rounded-2xl bg-nevoa p-8">
                  <dd className="text-5xl font-semibold tracking-tight text-grafite">{v}</dd>
                  <dt className="mt-3 text-sm text-texto-suave">{r}</dt>
                </div>
              ))}
            </dl>
            <p data-revelar className="mt-8 text-sm leading-relaxed text-texto-suave">
              {semViuva(
                "Obras sob administração da FAZ: Pátio Milano, Corpore 8 (Hospital Baía Sul Mulher), Softplan (Passeio Sapiens), Brunello di Montalcino, Catena Alta, Loyola e Villamare.",
              )}
            </p>
          </Revelar>
        </section>

        {/* Empreendimentos com unidades decoradas pela Lofteria */}
        <section className="bg-grafite-profundo py-24 text-white md:py-32">
          <Revelar className="mx-auto max-w-[90rem] px-5 md:px-10">
            <div data-revelar className="flex flex-wrap items-end justify-between gap-8">
              <h2 className="titulo-lg max-w-[18ch]">
                Unidades decoradas <span className="font-light text-white/45">by Lofteria.</span>
              </h2>
              <p className="max-w-md text-lg leading-relaxed font-light text-white/65">
                {semViuva(
                  "Nos empreendimentos parceiros, o investidor pode estruturar a sua unidade com pacotes turnkey de decoração e mobiliário, com projeto, compra e execução conduzidos de forma integrada. A contratação é opcional.",
                )}
              </p>
            </div>

            <article data-revelar className="mt-16 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
              <div className="group relative min-h-[26rem] overflow-hidden rounded-[28px] bg-white">
                <Image
                  src="/img/parceiros/alma-lusa-isometrico.webp"
                  alt="Isométrico de um studio do Alma Lusa decorado pela Lofteria"
                  fill
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className="object-contain p-6 transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="relative min-h-[14rem] flex-1 overflow-hidden rounded-[28px]">
                  <Image src="/img/parceiros/alma-lusa-studio.webp" alt="Studio do Alma Lusa decorado pela Lofteria" fill sizes="(max-width: 1023px) 100vw, 40vw" className="object-cover" />
                </div>
                <div className="rounded-[28px] bg-white/[0.04] p-8 ring-1 ring-white/10">
                  <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-salmao uppercase">Santo Antônio de Lisboa ·&nbsp;Florianópolis</p>
                  <h3 className="mt-3 text-4xl font-semibold tracking-tight">Alma Lusa</h3>
                  <p className="mt-4 leading-relaxed font-light text-white/65">
                    {semViuva(
                      "Empreendimento boutique de 8 pavimentos, com 46 studios, 11 lofts e uma cobertura, em construção a preço de custo pela FAZ. As cotas decoradas são desenvolvidas pela Lofteria.",
                    )}
                  </p>
                  <a href="https://almalusafloripa.com.br/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-white uppercase hover:text-salmao">
                    Conhecer o Alma Lusa <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </div>
              </div>
            </article>

            <article data-revelar className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
              <div className="flex min-h-[16rem] items-center justify-center rounded-[28px] bg-[#eee8d8] p-12">
                <Image src="/img/parceiros/lagoa-brick.svg" alt="Lagoa Brick" width={900} height={98} className="h-auto w-full max-w-[24rem]" />
              </div>
              <div className="rounded-[28px] bg-white/[0.04] p-8 ring-1 ring-white/10 md:p-10">
                <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-salmao uppercase">Lagoa da Conceição ·&nbsp;Florianópolis</p>
                <h3 className="mt-3 text-4xl font-semibold tracking-tight">Lagoa Brick</h3>
                <p className="mt-4 max-w-xl leading-relaxed font-light text-white/65">
                  {semViuva(
                    "Studios compactos, com garden e com terraço, a poucos minutos das praias Mole e da Joaquina. Estruturação e administração de obra pela FAZ; unidades decoradas pela Lofteria, com o investimento organizado conforme o fluxo da SPE.",
                  )}
                </p>
              </div>
            </article>
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
