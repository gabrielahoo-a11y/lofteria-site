import type { Metadata } from "next";
import Menu from "@/components/Menu";
import PaginaTopo from "@/components/PaginaTopo";
import Revelar from "@/components/Revelar";
import Comparativo from "@/components/Comparativo";
import Calculadora from "@/components/Calculadora";
import Numeros from "@/components/Numeros";
import Depoimentos from "@/components/Depoimentos";

export const metadata: Metadata = {
  title: "Para investidor · Lofteria",
  description:
    "Um ecossistema completo para maximizar a rentabilidade do seu imóvel em short-stay, locação anual ou venda. Simule seu retorno.",
};

const PILARES = [
  {
    titulo: "Projeto",
    texto: "Criamos ambientes funcionais que valorizam o imóvel e aceleram o retorno do investimento.",
  },
  {
    titulo: "Gestão",
    texto: "Fazemos todo o gerenciamento de compras e insumos, para que o orçamento seja seguido à risca.",
  },
  {
    titulo: "Execução",
    texto: "Cuidamos de toda a montagem, para o imóvel ficar pronto para render com agilidade e padrão profissional.",
  },
];

export default function Investidor() {
  return (
    <>
      <Menu />
      <main>
        <PaginaTopo
          rotulo="Para quem investe"
          titulo={
            <>
              <strong className="font-semibold">Mais rentabilidade,</strong>{" "}
              <span className="font-light">menos complicação.</span>
            </>
          }
          texto={
            <>
              Um ecossistema completo para maximizar a rentabilidade do seu imóvel. Seja para{" "}
              <strong className="font-semibold text-grafite/80">short-stay, locação anual ou venda</strong>, cada
              detalhe é planejado para aumentar seus ganhos, com orçamento controlado e entrega no prazo.
            </>
          }
          foto="plenty-sea"
          fotoAlt="Living do Plenty Sea 401, apartamento montado pela Lofteria para short-stay"
          acao={{ href: "#simulador", rotulo: "Simular meu retorno" }}
        />

        <Revelar className="mx-auto grid max-w-[1440px] gap-10 px-5 py-24 md:grid-cols-3 md:px-10 md:py-32">
          {PILARES.map((p, i) => (
            <div key={p.titulo} data-revelar className="border-t border-linha pt-8">
              <span className="text-xs text-salmao tabular-nums">0{i + 1}</span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-grafite">{p.titulo}</h2>
              <p className="mt-4 max-w-sm leading-relaxed font-light text-texto-suave">{p.texto}</p>
            </div>
          ))}
        </Revelar>

        <Comparativo />
        <Calculadora />
        <Numeros />
        <Depoimentos />
      </main>
    </>
  );
}
