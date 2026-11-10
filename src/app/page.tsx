import type { Metadata } from "next";
import { DESCRICAO, metadados } from "@/lib/seo";
import Menu from "@/components/Menu";
import Abertura from "@/components/Abertura";
import Manifesto from "@/components/Manifesto";
import Solucao from "@/components/Solucao";
import Numeros from "@/components/Numeros";
import Parceiros from "@/components/Parceiros";
import Projetos from "@/components/Projetos";
import Depoimentos from "@/components/Depoimentos";

export const metadata: Metadata = metadados({ descricao: DESCRICAO, caminho: "/" });

export default function Home() {
  return (
    <>
      <Menu />
      <main>
        <Abertura />
        <Manifesto ondas />
        <Solucao />
        <Projetos />
        <Numeros />
        <Depoimentos />
        <Parceiros />
      </main>
    </>
  );
}
