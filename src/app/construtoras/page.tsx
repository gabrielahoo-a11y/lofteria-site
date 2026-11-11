import type { Metadata } from "next";
import { metadados } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Menu from "@/components/Menu";
import Revelar from "@/components/Revelar";
import ChamadaFinal from "@/components/ChamadaFinal";
import ConstrutorasTopo from "@/components/ConstrutorasTopo";
import IcebergEtapas from "@/components/IcebergEtapas";
import ParceriaFundo from "@/components/ParceriaFundo";
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

        {/* Como a parceria funciona: continuação do fundo do mar do iceberg */}
        <ParceriaFundo />

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
