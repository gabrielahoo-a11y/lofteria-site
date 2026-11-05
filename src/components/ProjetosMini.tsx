"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { gsap } from "gsap";
import { DESTAQUES, foto } from "@/lib/projetos";

// Projetos entregues; as três primeiras fotos são as bolinhas visíveis
const PROJETOS = DESTAQUES.map((p) => ({ nome: p.nome, local: `${p.tipologia} · ${p.local}`, foto: foto(p) }));

// "+350 apartamentos entregues": ao passar o mouse, uma miniatura segue o cursor
// passando fotos dos projetos. Por enquanto o clique não leva a lugar nenhum.
export default function ProjetosMini() {
  const area = useRef<HTMLDivElement>(null);
  const cartao = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [atual, setAtual] = useState(0);
  const [fixo, setFixo] = useState<number | null>(null);
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Passa as fotos sozinho enquanto o mouse não está sobre uma bolinha específica
  useEffect(() => {
    if (!visivel || fixo !== null) return;
    const id = window.setInterval(() => setAtual((i) => (i + 1) % PROJETOS.length), 1300);
    return () => window.clearInterval(id);
  }, [visivel, fixo]);

  useEffect(() => {
    const el = cartao.current;
    const zona = area.current;
    if (!el || !zona || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const irX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const irY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const alvo = (e: PointerEvent) => [e.clientX + 28, e.clientY - el.offsetHeight - 20] as const;
    const mover = (e: PointerEvent) => {
      const [x, y] = alvo(e);
      irX(x);
      irY(y);
    };
    const entrar = (e: PointerEvent) => {
      const [x, y] = alvo(e);
      gsap.set(el, { x, y });
      setVisivel(true);
    };
    const sair = () => {
      setVisivel(false);
      setFixo(null);
    };
    zona.addEventListener("pointerenter", entrar);
    zona.addEventListener("pointermove", mover);
    zona.addEventListener("pointerleave", sair);
    return () => {
      zona.removeEventListener("pointerenter", entrar);
      zona.removeEventListener("pointermove", mover);
      zona.removeEventListener("pointerleave", sair);
    };
  }, [montado]);

  const mostrado = fixo ?? atual;

  return (
    <>
      <div ref={area} className="flex w-fit cursor-default items-center gap-4">
        <div className="flex shrink-0 -space-x-3">
          {PROJETOS.slice(0, 3).map((p, i) => (
            <Image
              key={p.foto}
              src={p.foto}
              alt=""
              width={48}
              height={48}
              onPointerEnter={() => setFixo(i)}
              onPointerLeave={() => setFixo(null)}
              className={`relative size-12 rounded-full border-2 border-white object-cover transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] ${
                visivel && mostrado === i ? "z-10 scale-[1.35] shadow-lg shadow-grafite/20" : ""
              }`}
            />
          ))}
        </div>
        <p className="leading-tight text-texto-suave">
          <strong className="block text-2xl font-semibold text-grafite">+350</strong>
          apartamentos <strong className="font-semibold text-grafite/80">entregues</strong>
        </p>
      </div>

      {montado &&
        createPortal(
          <div
            ref={cartao}
            aria-hidden
            className={`pointer-events-none fixed top-0 left-0 z-[70] w-64 overflow-hidden rounded-[18px] bg-white shadow-2xl shadow-grafite/25 transition-[opacity,scale] duration-300 ${
              visivel ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <div className="relative aspect-[4/3]">
              {PROJETOS.map((p, i) => (
                <Image
                  key={p.foto}
                  src={p.foto}
                  alt=""
                  fill
                  sizes="256px"
                  className={`object-cover transition-[opacity,scale] duration-700 ${
                    mostrado === i ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                />
              ))}
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-grafite">{PROJETOS[mostrado].nome}</p>
              <p className="text-xs text-texto-suave">{PROJETOS[mostrado].local}</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
