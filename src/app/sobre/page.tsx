import type { Metadata } from "next";
import Menu from "@/components/Menu";
import SobreTopo from "@/components/SobreTopo";
import Manifesto from "@/components/Manifesto";
import ProvaSocial from "@/components/ProvaSocial";
import Jornada from "@/components/Jornada";
import OQueFazemos from "@/components/OQueFazemos";
import ValoresCarrossel from "@/components/ValoresCarrossel";
import Depoimentos from "@/components/Depoimentos";
import ChamadaFinal from "@/components/ChamadaFinal";

export const metadata: Metadata = {
  title: "Sobre · Lofteria",
  description:
    "Tecnologia, design e inteligência imobiliária para entregar moradias prontas para performar, com eficiência para o investidor e experiência para o morador.",
};

// Mesma estrutura da página About da referência (Avenlo), com o conteúdo da Lofteria
export default function Sobre() {
  return (
    <>
      <Menu />
      <main>
        <SobreTopo />
        <Manifesto />
        <ProvaSocial />
        <Jornada />
        <OQueFazemos />
        <ValoresCarrossel />
        <Depoimentos />
        <ChamadaFinal />
      </main>
    </>
  );
}
