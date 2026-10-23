"use client";

import { useState } from "react";
import Image from "next/image";

// Fotos escolhidas pelo clima de cada linguagem; confirmar com o time qual projeto é de qual estilo
const ESTILOS = [
  {
    nome: "Urban",
    subtitulo: "Design atemporal",
    texto: "A vida nas grandes cidades: cores neutras com toques de cor e acessórios de decoração arrojados.",
    foto: "/img/projetos/life-residence-606.jpg",
  },
  {
    nome: "Eco",
    subtitulo: "Conforto e sofisticação",
    texto: "Inspirado no encontro com a natureza, com a tranquilidade das cores e dos materiais naturais.",
    foto: "/img/projetos/esquina-copenhagen-206.jpg",
  },
  {
    nome: "Slim",
    subtitulo: "Tecnologia e inovação",
    texto: "Clean e sofisticado, funcional e sem cores vivas. As peças de design ganham o protagonismo.",
    foto: "/img/projetos/penha-spot.jpg",
  },
];

// Painéis que se expandem: o estilo ativo ocupa mais espaço
export function PaineisEstilos({ inicial = 0 }: { inicial?: number }) {
  const [ativo, setAtivo] = useState(inicial);

  return (
    <div className="flex h-[64svh] min-h-[440px] flex-col gap-3 md:flex-row">
      {ESTILOS.map((e, i) => {
        const aberto = ativo === i;
        return (
          <button
            key={e.nome}
            type="button"
            onMouseEnter={() => setAtivo(i)}
            onFocus={() => setAtivo(i)}
            onClick={() => setAtivo(i)}
            aria-pressed={aberto}
            className="group relative overflow-hidden rounded-[28px] text-left text-white transition-[flex-grow] duration-700 ease-[cubic-bezier(.7,0,.2,1)]"
            style={{ flexGrow: aberto ? 3.2 : 1, flexBasis: 0 }}
          >
            <Image
              src={e.foto}
              alt={`Projeto no estilo ${e.nome}`}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className={`object-cover transition-transform duration-1000 ${aberto ? "scale-100" : "scale-110"}`}
            />
            <div
              className={`absolute inset-0 transition-colors duration-700 ${
                aberto ? "bg-gradient-to-t from-black/75 via-black/10 to-transparent" : "bg-grafite-profundo/55"
              }`}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-9">
              <h3 className="text-3xl font-semibold tracking-tight md:text-5xl">{e.nome}</h3>
              <div className={`grid transition-all duration-700 ${aberto ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="text-sm tracking-[0.14em] text-white/70 uppercase">{e.subtitulo}</p>
                  <p className="mt-3 max-w-md font-light text-white/85">{e.texto}</p>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Seção clara com os painéis, usada nas páginas internas
export default function Estilos() {
  return (
    <section id="estilos" className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <div className="mb-14">
        <p className="rotulo mb-6 text-grafite">Descubra seu estilo</p>
        <h2 className="titulo-lg max-w-[14ch] text-grafite">
          Três linguagens. <span className="font-light text-salmao">Um mesmo padrão.</span>
        </h2>
      </div>
      <PaineisEstilos />
    </section>
  );
}
