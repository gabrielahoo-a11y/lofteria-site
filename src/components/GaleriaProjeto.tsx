"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Foto = { src: string; largura: number; altura: number };

// Galeria da página interna do projeto: fotos em colunas (mantendo a proporção de cada uma)
// e, ao clicar, a foto abre em tela cheia com setas, teclado e contador.
export default function GaleriaProjeto({ fotos, nome }: { fotos: Foto[]; nome: string }) {
  const raiz = useRef<HTMLDivElement>(null);
  const [aberta, setAberta] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-foto]").forEach((el) => {
          gsap.from(el, { opacity: 0, y: 40, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%" } });
        });
      });
    },
    { scope: raiz },
  );

  const mover = useCallback((d: number) => setAberta((a) => (a === null ? a : (a + d + fotos.length) % fotos.length)), [fotos.length]);

  useEffect(() => {
    if (aberta === null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberta(null);
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", tecla);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", tecla);
    };
  }, [aberta, mover]);

  return (
    <div ref={raiz}>
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 [&>*]:mb-3">
        {fotos.map((f, i) => (
          <button
            key={f.src}
            type="button"
            data-foto
            onClick={() => setAberta(i)}
            aria-label={`Ampliar foto ${i + 1} de ${fotos.length}`}
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-nevoa"
            style={{ aspectRatio: `${f.largura} / ${f.altura}` }}
          >
            <Image
              src={f.src}
              alt={`${nome}: foto ${i + 1} do apartamento montado pela Lofteria`}
              fill
              quality={85}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {aberta !== null && (
        <div role="dialog" aria-modal="true" aria-label={`Fotos do ${nome}`} className="fixed inset-0 z-[80] flex flex-col bg-grafite-profundo/95 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 text-white md:px-10">
            <span className="text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
              {nome} · {aberta + 1} / {fotos.length}
            </span>
            <button
              type="button"
              onClick={() => setAberta(null)}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.18em] uppercase hover:bg-white/20"
            >
              Fechar <X className="size-4" aria-hidden />
            </button>
          </div>
          <div className="relative flex-1" onClick={() => setAberta(null)}>
            <Image
              key={fotos[aberta].src}
              src={fotos[aberta].src}
              alt={`${nome}: foto ${aberta + 1}`}
              fill
              quality={85}
              sizes="100vw"
              className="object-contain p-3 md:p-8"
            />
          </div>
          <div className="flex items-center justify-center gap-3 pb-6">
            <button type="button" onClick={() => mover(-1)} aria-label="Foto anterior" className="grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => mover(1)} aria-label="Próxima foto" className="grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <ArrowRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
