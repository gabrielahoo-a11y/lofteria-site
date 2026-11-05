"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DESTAQUES, foto } from "@/lib/projetos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Portfólio em fotos grandes lado a lado. No desktop a seção fica presa e a rolagem
// desliza os projetos na horizontal; no celular, a faixa rola com o dedo.
export default function Projetos() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const faixa = raiz.current!.querySelector<HTMLElement>("[data-faixa]")!;
        const distancia = () => faixa.scrollWidth - faixa.clientWidth;
        faixa.style.overflow = "visible";

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: raiz.current,
            start: "top top",
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(faixa, { x: () => -distancia(), ease: "none" });

        // Cada foto se aproxima levemente enquanto atravessa a tela
        gsap.utils.toArray<HTMLElement>("[data-projeto]").forEach((cartao) => {
          gsap.fromTo(
            cartao.querySelector("img"),
            { scale: 1.12 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: cartao, containerAnimation: tl, start: "left right", end: "center center", scrub: true },
            },
          );
        });

        return () => {
          faixa.style.overflow = "";
        };
      });
    },
    { scope: raiz },
  );

  return (
    <section id="projetos" ref={raiz} aria-label="Projetos entregues" className="overflow-hidden bg-white py-20 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-10">
      <div className="mx-auto max-w-[90rem] px-5 text-center md:px-10">
        <p className="rotulo justify-center text-grafite">Portfólio</p>
        <h2 className="titulo-lg mx-auto mt-5 max-w-[20ch] text-grafite">
          Projetos reais, <span className="font-light text-texto-suave">entregues com padrão Lofteria.</span>
        </h2>
      </div>

      <div
        data-faixa
        className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 [scrollbar-width:none] lg:mt-14 lg:gap-4 lg:px-[max(12px,calc((100vw-90rem)/2+12px))] [&::-webkit-scrollbar]:hidden"
      >
        {DESTAQUES.map((p) => (
          <article
            key={p.slug}
            data-projeto
            className="relative h-[62svh] rounded-[28px] md:rounded-[36px] min-h-[22.5rem] w-[88vw] shrink-0 snap-center overflow-hidden bg-grafite-profundo lg:h-[min(64svh,47.5rem)] lg:w-[min(78vw,74rem)]"
          >
            <Image src={foto(p)} alt={`Apartamento ${p.nome}, ${p.tipologia}, montado pela Lofteria`} fill sizes="(max-width: 1023px) 90vw, 80vw" className="object-cover" />
            <div className="absolute bottom-5 left-5 max-w-[calc(100%-40px)] rounded-2xl border border-white/20 bg-grafite-profundo/25 px-5 py-4 text-white shadow-2xl shadow-black/20 backdrop-blur-xl md:bottom-8 md:left-8 md:px-6 md:py-5">
              <span className="inline-block rounded-full bg-white/20 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.18em] uppercase">{p.tipologia}</span>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{p.nome}</h3>
              <p className="mt-1 text-[0.6875rem] tracking-[0.14em] text-white/75 uppercase">{p.local}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
