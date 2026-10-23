import type { Metadata } from "next";
import Menu from "@/components/Menu";
import PaginaTopo from "@/components/PaginaTopo";
import Revelar from "@/components/Revelar";
import Solucao from "@/components/Solucao";
import Depoimentos from "@/components/Depoimentos";
import Contato from "@/components/Contato";

export const metadata: Metadata = {
  title: "Para morador · Lofteria",
  description:
    "Projetos personalizados para o seu estilo de vida. Cuidamos de tudo, do orçamento às vistorias, e você recebe o apartamento pronto para viver.",
};

const CUIDAMOS = [
  "Orçamentos",
  "Contratação de mão de obra",
  "Gestão da obra",
  "Compras",
  "Logística",
  "Recebimento",
  "Instalações",
  "Vistorias",
];

export default function Morador() {
  return (
    <>
      <Menu />
      <main>
        <PaginaTopo
          rotulo="Para o morador"
          titulo={
            <>
              <strong className="font-semibold">Seu lar,</strong> <span className="font-light">do seu jeito.</span>
            </>
          }
          texto="Transforme seu apartamento em um lar que reflete a sua personalidade. Criamos projetos personalizados para aproveitar cada espaço de acordo com o seu estilo de vida."
          foto="jantar-quadro"
          fotoAlt="Sala de jantar com mesa de vidro e quadro abstrato, projeto da Lofteria"
          acao={{ href: "/contato", rotulo: "Quero um projeto" }}
        />

        <Revelar className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_1.2fr]">
          <div data-revelar>
            <p className="rotulo mb-6 text-grafite">Cuidamos de tudo</p>
            <h2 className="titulo-lg max-w-[12ch] text-grafite">
              Sem dor de cabeça, <span className="font-light text-salmao">sem imprevistos.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed font-light text-texto-suave">
              Com um processo ágil e prático, você recebe um ambiente sofisticado e pronto para viver, sem atrasos.
            </p>
          </div>
          <ul className="grid gap-3 self-end sm:grid-cols-2">
            {CUIDAMOS.map((c, i) => (
              <li
                key={c}
                data-revelar
                className="group flex items-center gap-4 rounded-2xl bg-nevoa px-5 py-4 transition-colors duration-500 hover:bg-grafite hover:text-white"
              >
                <span className="text-xs text-salmao tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-semibold text-grafite transition-colors duration-500 group-hover:text-white">{c}</span>
              </li>
            ))}
          </ul>
        </Revelar>

        <Solucao />
        <Depoimentos />
      </main>
      <Contato origem="morador" />
    </>
  );
}
