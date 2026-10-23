import Menu from "@/components/Menu";
import Abertura from "@/components/Abertura";
import Manifesto from "@/components/Manifesto";
import Solucao from "@/components/Solucao";
import Numeros from "@/components/Numeros";
import ChamadaInvestidor from "@/components/ChamadaInvestidor";
import Parceiros from "@/components/Parceiros";
import Projetos from "@/components/Projetos";
import Estilos from "@/components/Estilos";
import Depoimentos from "@/components/Depoimentos";
import Contato from "@/components/Contato";

export default function Home() {
  return (
    <>
      <Menu />
      <main>
        <Abertura />
        <Manifesto />
        <Solucao />
        <Numeros />
        <ChamadaInvestidor />
        <Projetos />
        <Estilos />
        <Depoimentos />
        <Parceiros />
      </main>
      <Contato origem="home" />
    </>
  );
}
