import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Menu from "@/components/Menu";
import Revelar from "@/components/Revelar";
import GaleriaProjeto from "@/components/GaleriaProjeto";
import ChamadaFinal from "@/components/ChamadaFinal";
import { PROJETOS, foto } from "@/lib/projetos";
import { GALERIAS } from "@/lib/galerias";
import { metadados } from "@/lib/seo";

// Página interna de cada projeto: capa grande, ficha, o que a Lofteria entregou,
// galeria com todas as fotos e navegação para o projeto anterior e o próximo.

export function generateStaticParams() {
  return PROJETOS.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJETOS.find((x) => x.slug === slug);
  if (!p) return {};
  return metadados({
    titulo: `${p.nome} · Projetos`,
    descricao: `${p.nome}: ${p.tipologia.toLowerCase()} em ${p.local.replace(" · ", ", ")}, projetado, executado e entregue pronto pela Lofteria.`,
    caminho: `/projetos/${p.slug}`,
  });
}

const ENTREGAS = ["Projeto de interiores", "Marcenaria sob medida", "Mobiliário e decoração", "Enxoval e utensílios", "Eletrodomésticos", "Automação"];

export default async function PaginaProjeto({ params }: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const i = PROJETOS.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = PROJETOS[i];
  const anterior = PROJETOS[(i - 1 + PROJETOS.length) % PROJETOS.length];
  const proximo = PROJETOS[(i + 1) % PROJETOS.length];
  const fotos = (GALERIAS[p.slug] ?? []).map(([arquivo, largura, altura]) => ({ src: `/img/projetos/${p.slug}/${arquivo}.jpg`, largura, altura }));

  return (
    <>
      <Menu />
      <main>
        {/* Capa */}
        <section className="bg-white pt-32 md:pt-40">
          <Revelar className="mx-auto max-w-[90rem] px-5 md:px-10">
            <Link data-revelar href="/projetos" className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.22em] text-texto-suave uppercase hover:text-salmao">
              <ArrowLeft className="size-3.5" aria-hidden /> Todos os projetos
            </Link>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div data-revelar>
                <p className="rotulo text-grafite">{p.tipologia}</p>
                <h1 className="mt-6 text-[clamp(2.4rem,4.2vw,3.75rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-grafite">{p.nome}</h1>
              </div>
              <dl data-revelar className="grid grid-cols-3 gap-6 border-t border-linha pt-6 text-grafite">
                <div>
                  <dt className="text-[0.6875rem] font-semibold tracking-[0.18em] text-texto-suave uppercase">Tipologia</dt>
                  <dd className="mt-2 font-semibold">{p.tipologia}</dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] font-semibold tracking-[0.18em] text-texto-suave uppercase">Local</dt>
                  <dd className="mt-2 font-semibold">{p.local.split(" · ").pop()}</dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] font-semibold tracking-[0.18em] text-texto-suave uppercase">Fotos</dt>
                  <dd className="mt-2 font-semibold">{fotos.length}</dd>
                </div>
              </dl>
            </div>
          </Revelar>
          <div className="mx-auto mt-12 max-w-[90rem] px-3 md:mt-16 md:px-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-[16/9]">
              <Image src={foto(p)} alt={`${p.nome}, apartamento montado pela Lofteria`} fill preload quality={85} sizes="100vw" className="object-cover" />
            </div>
          </div>
        </section>

        {/* O que foi entregue */}
        <section className="py-20 md:py-28">
          <Revelar className="mx-auto grid max-w-[90rem] gap-10 px-5 md:px-10 lg:grid-cols-[1fr_1.2fr]">
            <h2 data-revelar className="titulo-md text-grafite">
              Do projeto às chaves, <span className="font-light text-texto-suave">pronto para usar.</span>
            </h2>
            <div data-revelar>
              <p className="max-w-xl text-lg leading-relaxed font-light text-texto-suave">
                A Lofteria cuidou de todas as etapas do {p.nome}: projeto, compras, obra, montagem e entrega do apartamento completo e equipado.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {ENTREGAS.map((e) => (
                  <li key={e} className="rounded-full bg-nevoa px-4 py-2 text-sm font-semibold text-grafite">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </Revelar>
        </section>

        {/* Galeria */}
        <section className="pb-24 md:pb-32">
          <div className="mx-auto max-w-[90rem] px-3 md:px-5">
            <GaleriaProjeto fotos={fotos} nome={p.nome} />
          </div>
        </section>

        {/* Anterior e próximo */}
        <nav aria-label="Outros projetos" className="border-t border-linha">
          <div className="mx-auto grid max-w-[90rem] sm:grid-cols-2">
            {[
              { p: anterior, rotulo: "Projeto anterior", Icone: ArrowLeft, alinha: "" },
              { p: proximo, rotulo: "Próximo projeto", Icone: ArrowRight, alinha: "sm:text-right sm:flex-row-reverse" },
            ].map(({ p: q, rotulo, Icone, alinha }) => (
              <Link key={rotulo} href={`/projetos/${q.slug}`} className={`group flex items-center gap-5 px-5 py-8 transition-colors hover:bg-nevoa md:px-10 ${alinha}`}>
                <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={foto(q)} alt="" fill sizes="80px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-texto-suave uppercase">
                    {rotulo}
                  </span>
                  <span className="mt-1 block text-2xl font-semibold tracking-tight text-grafite group-hover:text-salmao">{q.nome}</span>
                </span>
                <Icone className="size-5 text-grafite transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            ))}
          </div>
        </nav>

        <ChamadaFinal rotulo="Seu projeto" titulo="Quer um apartamento assim?" foto="sala-estante" acao={{ href: "/contato", texto: "Agendar conversa" }} />
      </main>
    </>
  );
}
