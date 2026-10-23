import type { Metadata } from "next";
import Menu from "@/components/Menu";
import Contato from "@/components/Contato";

export const metadata: Metadata = {
  title: "Contato · Lofteria",
  description: "Conte sobre o seu imóvel. Respondemos em até 1 dia útil com os próximos passos e uma estimativa inicial.",
};

export default function PaginaContato() {
  return (
    <>
      <Menu />
      <main className="bg-white pt-24 md:pt-28">
        <Contato origem="contato" />
      </main>
    </>
  );
}
