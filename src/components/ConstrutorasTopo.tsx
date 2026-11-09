"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Topo da página de Construtoras: a "caixa vazia" muda de perspectiva com a rolagem,
// os pontos mostram o problema e, no fim, a sala vira uma unidade ambientada pela Lofteria.

const PONTOS = [
  { x: 42, y: 42, titulo: "81% dos compradores", texto: "não conseguem entender um imóvel vazio", em: 0.2 },
  { x: 6, y: 38, titulo: "Unidade pronta", texto: "e sem visitas qualificadas", em: 0.32 },
  { x: 64, y: 84, titulo: "Estoque parado", texto: "é custo para a incorporadora", em: 0.44 },
];

const Ponto = ({ titulo, texto }: { titulo: string; texto: string }) => (
  <span className="flex items-center gap-2.5">
    <span className="relative size-3.5 shrink-0 rounded-full bg-salmao shadow-[0_0_0_4px_rgba(255,255,255,.9)]">
      <span className="absolute -inset-2 animate-ping rounded-full border border-salmao" />
    </span>
    <span data-pilula className="origin-left rounded-full bg-grafite-profundo/90 px-3.5 py-2 text-[0.8125rem] whitespace-nowrap text-white">
      <strong className="font-semibold">{titulo}</strong>
      <span className="text-white/65"> · {texto}</span>
    </span>
  </span>
);

export default function ConstrutorasTopo() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const titulo = SplitText.create("[data-titulo]", { type: "lines,words", mask: "lines" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(titulo.words, { yPercent: 110, duration: 1.3, stagger: 0.05 })
          .from("[data-surge]", { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.3);
        return () => titulo.revert();
      });

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: "[data-palco]", start: "top top", end: "+=220%", pin: true, scrub: 1.2 },
        });
        tl.fromTo("[data-janela]", { clipPath: "inset(10% 8% 10% 8% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.3 }, 0)
          .fromTo(
            "[data-vazio]",
            { scale: 1.18, rotationY: -9, xPercent: 3, transformPerspective: 1600 },
            { scale: 1.02, rotationY: 4, xPercent: -2, duration: 0.75 },
            0,
          )
          .fromTo("[data-decorado]", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.18 }, 0.62)
          .fromTo("[data-final]", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.78);
        PONTOS.forEach((p, i) => {
          tl.fromTo(`[data-ponto="${i}"]`, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.05, immediateRender: false }, p.em);
        });
        tl.to("[data-ponto]", { opacity: 0, duration: 0.05 }, 0.6);
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="bg-white">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 pt-32 pb-12 md:px-10 md:pt-40 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p data-surge className="rotulo text-grafite">
            Construtoras e incorporadoras
          </p>
          <h1 data-titulo className="mt-8 text-[clamp(2.6rem,6vw,6rem)] leading-[0.98] font-thin tracking-[-0.03em] text-grafite">
            Estoque pronto, <br className="hidden sm:inline" />
            produto que vende.
          </h1>
        </div>
        <div className="lg:pb-3">
          <p data-surge className="max-w-md text-lg leading-relaxed font-light text-texto-suave">
            Transformamos unidades prontas em produtos completos, ambientados e prontos para vender, sem sobrecarregar a sua&nbsp;operação.
          </p>
          <Link data-surge href="/contato" className="botao botao-salmao mt-8">
            Agendar conversa
          </Link>
        </div>
      </div>

      <div data-palco className="relative lg:h-svh">
        <div data-janela className="relative aspect-[1916/1209] overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
          <div data-vazio className="absolute inset-0">
            <Image src="/img/construtoras-vazio.webp" alt="Apartamento vazio, sem ambientação" fill sizes="100vw" className="object-cover" />
          </div>
          <div data-decorado className="absolute inset-0 opacity-0 max-lg:hidden">
            <Image src="/img/lago-di-garda.jpg" alt="O mesmo tipo de unidade ambientada pela Lofteria" fill sizes="100vw" className="object-cover" />
          </div>

          {PONTOS.map((p, i) => (
            <div
              key={p.titulo}
              data-ponto={i}
              className="absolute max-lg:hidden lg:opacity-0"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <Ponto titulo={p.titulo} texto={p.texto} />
            </div>
          ))}

          <div data-final className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-grafite-profundo/85 to-transparent px-10 pt-40 pb-14 text-white opacity-0 max-lg:hidden">
            <div className="mx-auto flex max-w-[90rem] flex-wrap items-end justify-between gap-8">
              <p className="titulo-lg max-w-[16ch]">
                A mesma unidade, <span className="font-light text-white/70">pronta para performar.</span>
              </p>
              <Link href="/contato" className="botao botao-claro">
                Quero uma unidade-piloto
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* No celular, os pontos viram uma lista e o "depois" aparece abaixo */}
      <div className="grid gap-3 px-5 pt-6 pb-16 lg:hidden">
        {PONTOS.map((p) => (
          <p key={p.titulo} className="rounded-2xl bg-nevoa px-5 py-4 text-grafite">
            <strong className="font-semibold">{p.titulo}</strong> <span className="font-light text-texto-suave">{p.texto}</span>
          </p>
        ))}
        <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-[28px]">
          <Image src="/img/lago-di-garda.jpg" alt="Unidade ambientada pela Lofteria" fill sizes="100vw" className="object-cover" />
          <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-grafite-profundo/85 to-transparent px-5 pt-16 pb-5 text-lg font-semibold text-white">
            A mesma unidade, pronta para performar.
          </p>
        </div>
      </div>
    </section>
  );
}
