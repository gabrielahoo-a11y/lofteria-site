"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

// Tours 360º dos três estilos da Lofteria (os mesmos usados no site do Alma Lusa).
// O tour só carrega quando a pessoa clica, para não pesar a página.
const TOURS = [
  { id: "urban", nome: "Urban", url: "https://meutour360.com/tour-360/sepag-ekos-jardins-jurere-urban-design", foto: "/img/projetos/life-residence-606.jpg" },
  { id: "eco", nome: "Eco", url: "https://meutour360.com/tour-360/sepag-ekos-jardins-jurere-eco-design", foto: "/img/projetos/esquina-copenhagen-206.jpg" },
  { id: "slim", nome: "Slim", url: "https://meutour360.com/tour-360/sepag-ekos-jardins-jurere-slim-design", foto: "/img/projetos/penha-spot.jpg" },
];

export default function Tour360() {
  const [atual, setAtual] = useState(TOURS[1].id);
  const [aberto, setAberto] = useState<string | null>(null);
  const tour = TOURS.find((t) => t.id === atual)!;

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
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.16em] uppercase transition-colors duration-300 ${
              t.id === atual ? "bg-grafite text-white" : "bg-white text-grafite ring-1 ring-linha hover:ring-grafite/40"
            }`}
          >
            {t.nome}
          </button>
        ))}
      </div>

      <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[28px] bg-grafite-profundo">
        {aberto === tour.id ? (
          <iframe
            key={tour.id}
            src={tour.url}
            title={`Tour 360º do estilo ${tour.nome}`}
            className="absolute inset-0 h-full w-full"
            allow="fullscreen; accelerometer; gyroscope"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setAberto(tour.id)} className="group absolute inset-0 text-left text-white">
            <Image
              key={tour.foto}
              src={tour.foto}
              alt={`Ambiente no estilo ${tour.nome}`}
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-grafite-profundo/80 via-grafite-profundo/20 to-transparent" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-20 place-items-center rounded-full bg-white/90 text-grafite shadow-2xl transition-transform duration-500 group-hover:scale-110">
                <Play className="ml-1 size-6 fill-current" aria-hidden />
              </span>
            </span>
            <span className="absolute bottom-6 left-6">
              <span className="block text-[0.6875rem] font-semibold tracking-[0.22em] text-white/70 uppercase">Tour 360º</span>
              <span className="mt-1 block text-3xl font-semibold tracking-tight">Estilo {tour.nome}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
