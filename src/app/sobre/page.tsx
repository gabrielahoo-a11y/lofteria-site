import type { Metadata } from "next";
import Menu from "@/components/Menu";
import PaginaTopo from "@/components/PaginaTopo";
import Revelar from "@/components/Revelar";
import Manifesto from "@/components/Manifesto";
import Numeros from "@/components/Numeros";
import Contato from "@/components/Contato";

export const metadata: Metadata = {
  title: "Sobre · Lofteria",
  description:
    "Tecnologia, design e inteligência imobiliária para entregar moradias prontas para performar, com eficiência para o investidor e experiência para o morador.",
};

// Textos do manual de marca (Rebranding 2025)
const ESSENCIA = [
  {
    titulo: "Propósito",
    texto: "Mais do que montar apartamentos, construir experiências inteligentes que unem retorno para o investidor e qualidade de vida para o morador.",
  },
  {
    titulo: "Visão",
    texto: "Ser reconhecida como referência em montagem de apartamentos inteligentes no Brasil, pela experiência única que proporciona através da tecnologia, do design e da inovação.",
  },
  {
    titulo: "Missão",
    texto: "Montar apartamentos inteligentes que tragam retorno para o investidor, de forma simplificada e sem estresse, para quem busca uma experiência de moradia única com design.",
  },
];

const VALORES = [
  { titulo: "Conexão", texto: "Valorizamos pessoas e relações." },
  { titulo: "Comprometimento", texto: "Excelência em cada detalhe." },
  { titulo: "Inovação e evolução", texto: "Aprendizado constante e mentalidade criativa." },
  { titulo: "Experiência única", texto: "Surpreender e encantar em cada entrega." },
  { titulo: "Responsabilidade", texto: "Crescimento sustentável e consciente, social e ambiental." },
];

export default function Sobre() {
  return (
    <>
      <Menu />
      <main>
        <PaginaTopo
          rotulo="Sobre a Lofteria"
          titulo={
            <>
              <span className="font-light">Não queremos ser os maiores ou melhores.</span>{" "}
              <strong className="font-semibold">Queremos ser únicos.</strong>
            </>
          }
          texto="Mais do que transformar imóveis, a Lofteria transforma a experiência de morar e investir. Com tecnologia, design e sensibilidade, criamos moradias que performam e experiências que marcam."
          foto="sala-estante"
          fotoAlt="Sala com sofá cinza e estante metálica, projeto da Lofteria"
          acao={{ href: "/contato", rotulo: "Fale com a gente" }}
        />

        <Revelar className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-3 md:px-10 md:py-32">
          {ESSENCIA.map((e) => (
            <div key={e.titulo} data-revelar>
              <p className="rotulo text-grafite">{e.titulo}</p>
              <p className="mt-6 text-xl leading-snug text-grafite md:text-2xl">{e.texto}</p>
            </div>
          ))}
        </Revelar>

        <Manifesto />

        <section className="bg-nevoa py-24 md:py-32">
          <Revelar className="mx-auto max-w-[1440px] px-5 md:px-10">
            <div data-revelar className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="rotulo mb-6 text-grafite">Valores</p>
                <h2 className="titulo-lg max-w-[14ch] text-grafite">
                  Os pilares do nosso <span className="font-light text-salmao">jeito de trabalhar.</span>
                </h2>
              </div>
            </div>
            <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {VALORES.map((v) => (
                <li
                  key={v.titulo}
                  data-revelar
                  className="group flex min-h-56 flex-col justify-between rounded-[24px] bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-salmao hover:shadow-xl hover:shadow-salmao/25"
                >
                  <span className="size-2 bg-salmao transition-colors duration-500 group-hover:bg-white" />
                  <div>
                    <h3 className="text-xl font-semibold text-grafite transition-colors duration-500 group-hover:text-white">
                      {v.titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed font-light text-texto-suave transition-colors duration-500 group-hover:text-white/85">
                      {v.texto}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Revelar>
        </section>

        <Numeros />
      </main>
      <Contato origem="sobre" />
    </>
  );
}
