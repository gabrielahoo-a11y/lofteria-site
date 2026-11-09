import type { Metadata } from "next";
import Image from "next/image";
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

export const metadata: Metadata = {
  title: "Construtoras e incorporadoras · Lofteria",
  description:
    "Transformamos unidades prontas em produtos ambientados e prontos para vender: projeto, execução e materiais de venda em até 60 dias, sem sobrecarregar a obra.",
};

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
            <h2 data-revelar className="titulo-lg max-w-[20ch]">
              Não somos uma empresa de decoração. <span className="font-light text-white/45">Somos uma operação técnica que gera valor no&nbsp;VGV.</span>
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

        {/* Quem já confia: FAZ, empreendimentos e caso */}
        <section className="py-24 md:py-32">
          <Revelar className="mx-auto max-w-[90rem] px-5 md:px-10">
            <div data-revelar className="flex flex-wrap items-end justify-between gap-8">
              <h2 className="titulo-lg max-w-[16ch] text-grafite">
                Lado a lado <span className="font-light text-texto-suave">com quem constrói.</span>
              </h2>
              <p className="max-w-md text-lg leading-relaxed font-light text-texto-suave">
                {semViuva(
                  "Com a FAZ Construções e Incorporações, desde 2008 em Florianópolis, assinamos as unidades decoradas dos empreendimentos parceiros.",
                )}
              </p>
            </div>

            {/* FAZ: faixa larga com a obra ao fundo e o engenheiro saindo do quadro */}
            <div data-revelar className="relative isolate mt-24 text-white">
              <div className="absolute inset-0 -z-10 overflow-hidden rounded-[28px] bg-[#0b0b0c]">
                <Image src="/img/parceiros/faz-obras.webp" alt="" fill sizes="100vw" className="object-cover object-[50%_35%] opacity-75" />
                <span className="absolute inset-0 bg-gradient-to-r from-[#0b0b0c] via-[#0b0b0c]/75 to-[#0b0b0c]/10" />
              </div>
              <div className="pointer-events-none absolute right-[2%] bottom-0 aspect-[857/960] h-[40%] max-sm:right-[-4%] sm:h-[104%] lg:right-[6%] lg:h-[118%]">
                <Image src="/img/parceiros/faz-pessoa.webp" alt="" fill sizes="(max-width: 1023px) 50vw, 30vw" className="object-contain object-bottom drop-shadow-2xl" />
              </div>
              <div className="relative flex min-h-[34rem] flex-col justify-between gap-10 p-8 sm:min-h-[24rem] md:p-12">
                <div>
                  <div
                    role="img"
                    aria-label="FAZ Construções e Incorporações"
                    className="aspect-[387/144] w-36 bg-white md:w-44"
                    style={{ maskImage: "url(/img/parceiros/faz-logo.png)", WebkitMaskImage: "url(/img/parceiros/faz-logo.png)", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat" }}
                  />
                  <span className="mt-5 block h-1 w-12 bg-[#e1251b]" />
                </div>
                <dl className="grid max-w-[34rem] grid-cols-1 gap-5 max-sm:w-[50%] sm:max-w-[min(34rem,50%)] sm:grid-cols-2 lg:max-w-[58%] lg:grid-cols-4">
                  {[
                    ["+700", "unidades entregues"],
                    ["+17", "anos de mercado"],
                    ["+200 mil", "m² construídos"],
                    ["R$ 1,3 bi", "administrados em obras"],
                  ].map(([v, r]) => (
                    <div key={r} className="border-l-2 border-[#e1251b] pl-4">
                      <dd className="text-[clamp(1.5rem,2.2vw,2rem)] leading-none font-semibold tracking-tight whitespace-nowrap">{v}</dd>
                      <dt className="mt-1.5 text-sm text-white/65">{r}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              {/* Alma Lusa */}
              <a
                data-revelar
                href="https://almalusafloripa.com.br/"
                target="_blank"
                rel="noreferrer"
                className="group relative min-h-[22rem] overflow-hidden rounded-[28px] bg-grafite-profundo text-white"
              >
                <Image
                  src="/img/parceiros/alma-lusa-studio.webp"
                  alt="Studio do Alma Lusa decorado pela Lofteria"
                  fill
                  sizes="(max-width: 1023px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-grafite-profundo/90 via-grafite-profundo/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-8">
                  <span className="block text-[0.6875rem] font-semibold tracking-[0.22em] text-white/70 uppercase">Santo Antônio de Lisboa</span>
                  <span className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight">
                    Alma Lusa <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                  </span>
                  <span className="mt-2 block text-sm font-light text-white/70">46 studios, 11 lofts e cobertura · cotas decoradas by&nbsp;Lofteria</span>
                </span>
              </a>

                <div data-revelar className="flex min-h-[22rem] flex-col justify-between rounded-[28px] bg-[#181413] p-8 text-[#eee8d8]">
                  <div
                    role="img"
                    aria-label="Lagoa Brick"
                    className="aspect-[900/98] w-full max-w-[16rem] bg-[#eee8d8]"
                    style={{ maskImage: "url(/img/parceiros/lagoa-brick.svg)", WebkitMaskImage: "url(/img/parceiros/lagoa-brick.svg)", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat" }}
                  />
                  <p className="mt-8 text-sm leading-relaxed opacity-75">
                    {semViuva("Lagoa da Conceição · studios com garden e terraço, unidades decoradas by Lofteria.")}
                  </p>
                </div>
                <div data-revelar className="flex min-h-[22rem] flex-col justify-end rounded-[28px] bg-grafite-profundo p-8 text-white">
                  <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-salmao uppercase">Caso · 2 dormitórios no Campeche</p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">Vendido em menos de 20 dias</p>
                  <p className="mt-2 text-sm font-light text-white/60">
                    {semViuva("Depois de 4 meses parado, com valorização percebida de R$ 120 mil acima da média da torre.")}
                  </p>
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
