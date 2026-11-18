import type { Metadata } from "next";
import { metadados } from "@/lib/seo";
import Menu from "@/components/Menu";
import Ferramenta from "@/components/orcamento/Ferramenta";

export const metadata: Metadata = metadados({
  titulo: "Orçamento pela planta",
  descricao:
    "Envie a planta do seu apartamento e receba em minutos o orçamento para mobiliar, com valores por ambiente e o cronograma da obra.",
  caminho: "/orcamento",
});

export default function PaginaOrcamento() {
  return (
    <>
      <Menu />
      <main>
        <Ferramenta />
      </main>
    </>
  );
}
