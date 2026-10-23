"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { Play, X } from "lucide-react";

const VIDEO = "GXy9M6vSznQ"; // Transforme seu imóvel em uma fonte de renda em 60 dias
const BASE = `https://www.youtube-nocookie.com/embed/${VIDEO}`;
const MINI = `${BASE}?autoplay=1&mute=1&controls=0&loop=1&playlist=${VIDEO}&playsinline=1&rel=0&modestbranding=1`;
const CHEIO = `${BASE}?autoplay=1&controls=1&playsinline=1&rel=0&modestbranding=1`;

// Botão de play: ao passar o mouse, uma miniatura sem som segue o cursor;
// ao clicar, ela cresce até o centro da tela e o vídeo toca com som.
export default function VideoPlay({ texto }: { texto: string }) {
  const area = useRef<HTMLDivElement>(null);
  const mini = useRef<HTMLDivElement>(null);
  const modal = useRef<HTMLDivElement>(null);
  const [miniVisivel, setMiniVisivel] = useState(false);
  const [aberto, setAberto] = useState(false);
  // Só no navegador: o portal precisa do document.body
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const fechar = () => {
    setAberto(false);
    setMiniVisivel(false);
  };

  // A miniatura acompanha o cursor com um leve atraso
  useEffect(() => {
    const el = mini.current;
    const zona = area.current;
    if (!el || !zona || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const irX = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const irY = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const mover = (e: PointerEvent) => {
      irX(e.clientX - el.offsetWidth - 24);
      irY(e.clientY - el.offsetHeight / 2);
    };
    const entrar = (e: PointerEvent) => {
      gsap.set(el, { x: e.clientX - el.offsetWidth - 24, y: e.clientY - el.offsetHeight / 2 });
      setMiniVisivel(true);
    };
    const sair = () => setMiniVisivel(false);
    zona.addEventListener("pointerenter", entrar);
    zona.addEventListener("pointermove", mover);
    zona.addEventListener("pointerleave", sair);
    return () => {
      zona.removeEventListener("pointerenter", entrar);
      zona.removeEventListener("pointermove", mover);
      zona.removeEventListener("pointerleave", sair);
    };
  }, [montado]);

  // Abre crescendo a partir da miniatura (ou do botão, no celular)
  useEffect(() => {
    if (!aberto || !modal.current) return;
    const origem = (miniVisivel ? mini.current : area.current)?.getBoundingClientRect();
    const destino = modal.current.getBoundingClientRect();
    if (origem) {
      gsap.fromTo(
        modal.current,
        {
          x: origem.left + origem.width / 2 - (destino.left + destino.width / 2),
          y: origem.top + origem.height / 2 - (destino.top + destino.height / 2),
          scale: origem.width / destino.width,
          borderRadius: 18,
        },
        { x: 0, y: 0, scale: 1, borderRadius: 24, duration: 0.8, ease: "expo.inOut" },
      );
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  return (
    <>
      <div ref={area} data-video className="flex flex-col items-end gap-5 text-right">
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Assistir ao vídeo da Lofteria"
          className="grid size-14 place-items-center rounded-full border border-grafite/20 bg-white text-grafite transition-colors hover:bg-grafite hover:text-white md:size-16"
        >
          <Play className="size-5 translate-x-px fill-current" />
        </button>
        <p className="max-w-[17rem] text-sm leading-relaxed font-light text-texto-suave md:text-[15px]">{texto}</p>
      </div>

      {montado &&
        createPortal(
          <>
            <div
              ref={mini}
              aria-hidden
              className={`pointer-events-none fixed top-0 left-0 z-[70] aspect-video w-72 overflow-hidden rounded-[18px] bg-grafite-profundo shadow-2xl shadow-black/30 transition-[opacity,scale] duration-300 ${
                miniVisivel && !aberto ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            >
              {miniVisivel && !aberto && (
                <iframe src={MINI} title="Prévia do vídeo" allow="autoplay; encrypted-media" className="pointer-events-none absolute inset-0 size-full scale-[1.02]" tabIndex={-1} />
              )}
              <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur">
                Clique para assistir
              </span>
            </div>

            {aberto && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Vídeo da Lofteria"
                className="fixed inset-0 z-[80] grid place-items-center bg-grafite-profundo/80 p-4 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && fechar()}
              >
                <div ref={modal} className="relative aspect-video w-full max-w-[1100px] overflow-hidden rounded-3xl bg-black shadow-2xl">
                  <iframe
                    src={CHEIO}
                    title="Transforme seu imóvel em uma fonte de renda em 60 dias"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 size-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={fechar}
                  className="absolute top-5 right-5 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-white uppercase hover:bg-white/20"
                >
                  Fechar <X className="size-4" />
                </button>
              </div>
            )}
          </>,
          document.body,
        )}
    </>
  );
}
