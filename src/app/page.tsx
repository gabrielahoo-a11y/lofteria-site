import Menu from "@/components/Menu";
import Abertura from "@/components/Abertura";
import Manifesto from "@/components/Manifesto";
import Solucao from "@/components/Solucao";
import Numeros from "@/components/Numeros";
import Calculadora from "@/components/Calculadora";
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
        <Calculadora />
        <Projetos />
        <Estilos />
        <Depoimentos />
      </main>
      <Contato />
    </>
  );
}
