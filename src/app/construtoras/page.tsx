import type { Metadata } from "next";
import { metadados } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Menu from "@/components/Menu";
import Revelar from "@/components/Revelar";
import ChamadaFinal from "@/components/ChamadaFinal";
import ConstrutorasTopo from "@/components/ConstrutorasTopo";
import IcebergEtapas from "@/components/IcebergEtapas";
import Tour360 from "@/components/Tour360";
import { semViuva } from "@/lib/texto";

// Página curta e direta para incorporadoras, com base na apresentação
// "Soluções em Design de Interiores para Incorporadoras" e nos materiais do Alma Lusa e do Lagoa Brick.

export const metadata: Metadata = metadados({
  titulo: "Construtoras e incorporadoras",
  descricao:
    "Transformamos unidades prontas em produtos ambientados e prontos para vender: projeto, execução e materiais de venda em até 60 dias, sem sobrecarregar a obra.",
  caminho: "/construtoras",
});

const DIFERENCIAIS = [
  { titulo: "Até 60 dias", texto: "Do projeto à ambientação final, integrados ao cronograma da obra." },
  { titulo: "Todas as plantas", texto: "Modelo padronizado e replicável para cada tipologia do empreendimento." },
  { titulo: "Material de venda", texto: "Renders, memorial e tour virtual Walk’a entregues junto com a unidade." },
];

export default function Construtoras() {
  return (
    <>
      <Menu />
      <main>
        <ConstrutorasTopo />

        {/* Proposta de valor */}
        <section className="bg-grafite-profundo py-24 text-white md:py-32">
          <Revelar className="mx-auto max-w-[90rem] px-5 md:px-10">
            {/* Quebras fixas a partir do tablet: cada ideia na sua linha */}
            <h2 data-revelar className="titulo-lg">
              Não somos uma empresa de&nbsp;decoração. <br className="hidden md:inline" />
              <span className="font-light text-white/45 max-md:block">
                Somos uma operação técnica <br className="hidden md:inline" />
                que gera valor no&nbsp;VGV.
              </span>
            </h2>
            <div className="mt-16 grid gap-3 md:grid-cols-3">
              {DIFERENCIAIS.map((d) => (
                <div key={d.titulo} data-revelar className="rounded-2xl bg-white/[0.04] p-8 ring-1 ring-white/10">
                  <h3 className="text-3xl font-semibold tracking-tight">{d.titulo}</h3>
                  <p className="mt-4 leading-relaxed font-light text-white/60">{semViuva(d.texto)}</p>
                </div>
              ))}
            </div>
          </Revelar>
        </section>

        <IcebergEtapas />

        {/* Como a parceria funciona: foco no modelo e no valor para cada lado, não em um parceiro */}
        <section className="py-24 md:py-32">
          <Revelar className="mx-auto max-w-[90rem] px-5 md:px-10">
            <div data-revelar className="flex flex-wrap items-end justify-between gap-8">
              <h2 className="titulo-lg text-grafite">
                Uma parceria, <br className="hidden sm:inline" />
                <span className="font-light text-texto-suave">três ganhos.</span>
              </h2>
              <p className="max-w-md text-lg leading-relaxed font-light text-texto-suave">
                {semViuva("Construtora, investidor e Lofteria trabalham no mesmo cronograma. Cada um com um papel claro, e a unidade sai pronta para performar.")}
              </p>
            </div>

            <div className="mt-14 grid gap-3 md:grid-cols-3">
              {[
                {
                  quem: "Construtora",
                  titulo: "Vende a unidade pronta",
                  texto: "Mais valor percebido no empreendimento, sem mobilizar a equipe e sem impacto no cronograma da obra.",
                },
                {
                  quem: "Investidor",
                  titulo: "Recebe o imóvel pronto para render",
                  texto: "Contrata a unidade decorada junto com a compra, com o pagamento acompanhando o fluxo do empreendimento. A contratação é opcional.",
                },
                {
                  quem: "Lofteria",
                  titulo: "Assume a ambientação de ponta a ponta",
                  texto: "Projeto, compras, execução e material de venda, com fornecedores homologados, prazo e orçamento definidos.",
                },
              ].map((c) => (
                <div key={c.quem} data-revelar className="flex flex-col rounded-2xl bg-nevoa p-8">
                  <span className="text-[0.6875rem] font-semibold tracking-[0.22em] text-salmao uppercase">{c.quem}</span>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-grafite">{c.titulo}</h3>
                  <p className="mt-3 leading-relaxed font-light text-texto-suave">{semViuva(c.texto)}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
              <div data-revelar className="flex flex-col justify-end rounded-2xl bg-grafite-profundo p-8 text-white">
                <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-salmao uppercase">Caso · 2 dormitórios no Campeche</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight">Vendido em menos de 20 dias</p>
                <p className="mt-2 text-sm font-light text-white/60">
                  {semViuva("Depois de 4 meses parado, com valorização percebida de R$ 120 mil acima da média da torre.")}
                </p>
              </div>
              <div data-revelar className="flex flex-col justify-between gap-8 rounded-2xl p-8 ring-1 ring-linha">
                <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-texto-suave uppercase">Modelo já aplicado em empreendimentos com</p>
                <div className="flex flex-wrap items-center gap-x-9 gap-y-6 opacity-45 grayscale">
                  <div
                    role="img"
                    aria-label="FAZ Construções e Incorporações"
                    className="aspect-[387/144] w-24 bg-grafite"
                    style={{ maskImage: "url(/img/parceiros/faz-logo.png)", WebkitMaskImage: "url(/img/parceiros/faz-logo.png)", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat" }}
                  />
                  <div
                    role="img"
                    aria-label="Lagoa Brick"
                    className="aspect-[900/98] w-40 bg-grafite"
                    style={{ maskImage: "url(/img/parceiros/lagoa-brick.svg)", WebkitMaskImage: "url(/img/parceiros/lagoa-brick.svg)", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat" }}
                  />
                  <span className="text-xl font-semibold tracking-[0.18em] text-grafite uppercase">Alma Lusa</span>
                  <div
                    role="img"
                    aria-label="Adore Incorporações Imobiliárias"
                    className="aspect-[647/256] w-24 bg-grafite"
                    style={{ maskImage: "url(/img/parceiros/adore-logo.png)", WebkitMaskImage: "url(/img/parceiros/adore-logo.png)", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat" }}
                  />
                  <span className="text-xl font-semibold tracking-[0.18em] text-grafite uppercase">Level Up</span>
                </div>
              </div>
            </div>
          </Revelar>
        </section>

        {/* Walk'a e tours 360º */}
        <section className="bg-nevoa py-24 md:py-32">
          <Revelar className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 md:px-10 lg:grid-cols-[1fr_1.3fr]">
            <div data-revelar>
              <p className="rotulo text-grafite">Walk’a · tour virtual</p>
              <h2 className="titulo-lg mt-6 text-grafite">
                Venda antes <br className="hidden sm:inline" />
                <span className="font-light text-texto-suave">do decorado ficar&nbsp;pronto.</span>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed font-light text-texto-suave">
                {semViuva(
                  "Plantas, acabamentos e ambientação em 360º, por link ou QR Code. Experimente os três estilos da Lofteria.",
                )}
              </p>
            </div>
            <div data-revelar>
              <Tour360 />
            </div>
          </Revelar>
        </section>

        {/* Por onde começar */}
        <section className="py-24 md:py-32">
          <Revelar className="mx-auto max-w-[90rem] px-5 md:px-10">
            <h2 data-revelar className="titulo-lg max-w-[18ch] text-grafite">
              Comece por uma unidade. <span className="font-light text-texto-suave">Escale para o empreendimento.</span>
            </h2>
            <div className="mt-12 grid gap-3 md:grid-cols-3">
              {[
                ["Unidade-piloto", "Teste a solução em uma unidade, iniciada em até 7 dias úteis após o recebimento dos materiais."],
                ["Estudo de viabilidade", "Análise aplicada a uma tipologia específica, antes de qualquer compromisso."],
                ["Parceria escalável", "Modelo replicável para todas as unidades do empreendimento e para novos lançamentos."],
              ].map(([t, x]) => (
                <Link key={t} data-revelar href="/contato" className="group rounded-2xl bg-nevoa p-8 transition-colors duration-500 hover:bg-grafite-profundo">
                  <span className="flex items-center justify-between text-2xl font-semibold tracking-tight text-grafite transition-colors duration-500 group-hover:text-white">
                    {t}
                    <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                  </span>
                  <span className="mt-4 block leading-relaxed font-light text-texto-suave transition-colors duration-500 group-hover:text-white/65">
                    {semViuva(x)}
                  </span>
                </Link>
              ))}
            </div>
          </Revelar>
        </section>

        <ChamadaFinal
          rotulo="Construtoras e incorporadoras"
          titulo="Seu estoque pronto para performar"
          foto="jantar-quadro"
          acao={{ href: "/contato", texto: "Agendar conversa" }}
        />
      </main>
    </>
  );
}
