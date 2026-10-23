import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import Revelar from "./Revelar";

const VANTAGENS = [
  "Short-stay, locação anual ou venda",
  "Orçamento fechado antes da obra",
  "Entrega em 60 dias",
  "Diárias até 17% maiores",
];

// Na home, apresenta a solução para investidores e leva à página com o simulador
export default function ChamadaInvestidor() {
  return (
    <section className="bg-white py-24 md:py-32">
      <Revelar className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid overflow-hidden rounded-[32px] bg-petroleo-profundo text-white lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-14">
            <p data-revelar className="rotulo mb-6 text-white/70">
              Para investidores
            </p>
            <h2 data-revelar className="titulo-lg max-w-[13ch]">
              Seu imóvel rendendo, <span className="font-light text-white/55">sem você gerenciar nada.</span>
            </h2>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {VANTAGENS.map((v) => (
                <li key={v} data-revelar className="flex items-center gap-3 text-white/85">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-salmao">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  {v}
                </li>
              ))}
            </ul>
            <div data-revelar className="mt-12 flex flex-wrap gap-5">
              <Link href="/investidor#simulador" className="botao botao-salmao">
                Simular meu retorno
              </Link>
              <Link href="/investidor" className="botao text-white">
                Conhecer a solução
              </Link>
            </div>
          </div>
          <Link href="/investidor" aria-label="Conhecer a solução para investidores" className="group relative min-h-[320px] overflow-hidden">
            <Image
              src="/img/plenty-sea.jpg"
              alt="Plenty Sea 401, apartamento para short-stay montado pela Lofteria"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
            />
            <span className="absolute right-6 bottom-6 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-grafite uppercase backdrop-blur transition-transform duration-500 group-hover:-translate-y-1">
              +30% de rentabilidade
            </span>
          </Link>
        </div>
      </Revelar>
    </section>
  );
}
