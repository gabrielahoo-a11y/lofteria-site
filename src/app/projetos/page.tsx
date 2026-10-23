import type { Metadata } from "next";
import Menu from "@/components/Menu";
import PaginaTopo from "@/components/PaginaTopo";
import ListaProjetos from "@/components/ListaProjetos";
import Projetos from "@/components/Projetos";
import Contato from "@/components/Contato";

export const metadata: Metadata = {
  title: "Projetos · Lofteria",
  description: "Mais de 350 apartamentos transformados em Florianópolis e no litoral catarinense. Conheça alguns deles.",
};

export default function PaginaProjetos() {
  return (
    <>
      <Menu />
      <main>
        <PaginaTopo
          rotulo="Onde atuamos"
          titulo={
            <>
              <strong className="font-semibold">Encontre</strong> <span className="font-light">a Lofteria.</span>
            </>
          }
          texto="Mais de 350 apartamentos já foram transformados com a nossa expertise. Transformamos imóveis e agregamos exclusividade e valor. Conheça alguns deles."
          foto="sunset-lagoa"
          fotoAlt="Sunset 213, apartamento montado pela Lofteria em Florianópolis"
        />
        <ListaProjetos />
        <Projetos />
      </main>
      <Contato origem="projetos" />
    </>
  );
}
