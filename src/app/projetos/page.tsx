import type { Metadata } from "next";
import { metadados } from "@/lib/seo";
import Menu from "@/components/Menu";
import PaginaTopo from "@/components/PaginaTopo";
import ListaProjetos from "@/components/ListaProjetos";
import Projetos from "@/components/Projetos";

export const metadata: Metadata = metadados({
  titulo: "Projetos",
  descricao:
    "Mais de 400 apartamentos transformados em Florianópolis e no litoral catarinense. Conheça alguns deles.",
  caminho: "/projetos",
});

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
          texto="Mais de 400 apartamentos já foram transformados com a nossa expertise. Transformamos imóveis e agregamos exclusividade e valor. Conheça alguns deles."
          foto="sunset-lagoa"
          fotoAlt="Sunset 213, apartamento montado pela Lofteria em Florianópolis"
        />
        <ListaProjetos />
        <Projetos />
      </main>
    </>
  );
}
