import type { Metadata } from "next";
import Menu from "@/components/Menu";
import PaginaTopo from "@/components/PaginaTopo";
import Revelar from "@/components/Revelar";
import Solucao from "@/components/Solucao";
import Numeros from "@/components/Numeros";
import Contato from "@/components/Contato";

export const metadata: Metadata = {
  title: "Construtoras e incorporadoras · Lofteria",
  description:
    "Tecnologia, design e processos em uma solução que transforma apartamentos em prontos para morar de verdade.",
};

const PILARES = [
  {
    titulo: "Tecnologia",
    texto: "Automação de série: com um comando, o morador regula o ar-condicionado, liga a TV e o som e programa timers.",
  },
  {
    titulo: "Design",
    texto: "Três linguagens de projeto, Urban, Eco e Slim, com o mesmo padrão de acabamento em todas as unidades.",
  },
  {
    titulo: "Processos",
    texto: "Compras, logística, mão de obra e cronograma geridos por um único time, com orçamento controlado.",
  },
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
              <strong className="font-semibold">Pronto para morar</strong> <span className="font-light">de verdade.</span>
            </>
          }
          texto="Integramos tecnologia, design e processos em uma solução que transforma apartamentos em prontos para morar de verdade."
          foto="studio-integrado"
          fotoAlt="Studio integrado com cozinha e quarto, montado pela Lofteria"
          acao={{ href: "/contato", rotulo: "Fale com um consultor" }}
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

        <Solucao />
        <Numeros />

        <Revelar className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
          <p data-revelar className="titulo-md max-w-[24ch] text-grafite">
            Especializados em decorar apartamentos{" "}
            <span className="font-light text-texto-suave">
              com alta taxa de ocupação e ótima média de diárias no Airbnb e no Booking.com.
            </span>
          </p>
        </Revelar>
      </main>
      <Contato origem="construtoras" />
    </>
  );
}
