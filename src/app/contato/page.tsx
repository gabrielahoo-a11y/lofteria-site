import type { Metadata } from "next";
import Menu from "@/components/Menu";
import TituloCentral from "@/components/TituloCentral";
import Revelar from "@/components/Revelar";
import FormularioContato from "@/components/FormularioContato";
import ChamadaFinal from "@/components/ChamadaFinal";
import { REDES } from "@/lib/navegacao";

export const metadata: Metadata = {
  title: "Contato · Lofteria",
  description: "Conte o que você quer para o seu imóvel. Um consultor da Lofteria responde em até 1 dia útil.",
};

// Mesma estrutura da página de contato da referência: título, cartão com os dados ao lado
// do formulário e chamada final
export default function PaginaContato() {
  return (
    <>
      <Menu />
      <main>
        <TituloCentral rotulo="Fale com a gente">
          <strong className="font-semibold">Conte o que você quer</strong>{" "}
          <span className="font-light">para o seu imóvel.</span>
        </TituloCentral>

        <Revelar className="mx-auto grid max-w-[1200px] gap-10 px-5 pb-28 md:px-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <aside data-revelar className="h-fit rounded-[24px] bg-grafite-profundo p-8 text-white">
            <p className="rotulo text-white/70">Lofteria</p>
            <p className="mt-5 text-lg leading-snug">Seu imóvel pronto para performar.</p>
            <dl className="mt-8 space-y-6 border-t border-white/10 pt-8 text-sm">
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">Onde atuamos</dt>
                <dd className="mt-2 text-white/85">Florianópolis e litoral de Santa Catarina</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">E-mail</dt>
                <dd className="mt-2 text-white/85 select-all">marketing@lofteria.com</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">Resposta</dt>
                <dd className="mt-2 text-white/85">Em até 1 dia útil, com os próximos passos e uma estimativa inicial.</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">Redes</dt>
                <dd className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {REDES.map((r) => (
                    <a key={r.nome} href={r.href} target="_blank" rel="noreferrer" className="text-white/85 hover:text-salmao">
                      {r.nome}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>
          <div data-revelar>
            <FormularioContato />
          </div>
        </Revelar>

        <ChamadaFinal
          rotulo="Para investidores"
          titulo="Quer ver os números antes da conversa?"
          foto="sala-estante"
          acao={{ href: "/investidor#simulador", texto: "Simular meu retorno" }}
        />
      </main>
    </>
  );
}
