"use client";

import { useEffect, useState } from "react";
import { Move3d } from "lucide-react";

// Tours 360º dos três estilos da Lofteria (os mesmos do site do Alma Lusa).
// O tour já abre navegável, sem botão de play: um aviso convida a arrastar e some
// quando a pessoa interage.
const TOURS = [
  { id: "urban", nome: "Urban", url: "https://meutour360.com/tour-360/sepag-ekos-jardins-jurere-urban-design" },
  { id: "eco", nome: "Eco", url: "https://meutour360.com/tour-360/sepag-ekos-jardins-jurere-eco-design" },
  { id: "slim", nome: "Slim", url: "https://meutour360.com/tour-360/sepag-ekos-jardins-jurere-slim-design" },
];

export default function Tour360() {
  const [atual, setAtual] = useState(TOURS[1].id);
  const [dica, setDica] = useState(true);
  const tour = TOURS.find((t) => t.id === atual)!;

  // Quando o foco vai para o tour (a pessoa clicou ou arrastou dentro dele), o aviso some
  useEffect(() => {
    const aoSair = () => {
      if (document.activeElement?.tagName === "IFRAME") setDica(false);
    };
    window.addEventListener("blur", aoSair);
    return () => window.removeEventListener("blur", aoSair);
  }, []);

  return (
    <div>
      <div role="tablist" aria-label="Estilo do tour" className="flex flex-wrap gap-2">
        {TOURS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === atual}
            onClick={() => setAtual(t.id)}
            className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.16em] uppercase transition-colors duration-300 ${
              t.id === atual ? "bg-grafite text-white" : "bg-white text-grafite ring-1 ring-linha hover:ring-grafite/40"
            }`}
          >
            {t.nome}
          </button>
        ))}
      </div>

      <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[28px] bg-grafite-profundo" onPointerEnter={() => setTimeout(() => setDica(false), 2500)}>
        <iframe
          key={tour.id}
          src={tour.url}
          title={`Tour 360º do estilo ${tour.nome}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full"
          allow="fullscreen; accelerometer; gyroscope"
          allowFullScreen
        />
        <span
          aria-hidden
          className={`pointer-events-none absolute top-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-grafite-profundo/80 px-4 py-2.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur transition-opacity duration-700 ${
            dica ? "opacity-100" : "opacity-0"
          }`}
        >
          <Move3d className="size-4" />
          <span className="whitespace-nowrap">Arraste para explorar</span>
          <span className="whitespace-nowrap max-sm:hidden">· Estilo {tour.nome}</span>
        </span>
      </div>
    </div>
  );
}
