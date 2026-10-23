"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DESTAQUES, foto } from "@/lib/projetos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Portfólio em fotos grandes e empilhadas: cada projeto cobre o anterior, que encolhe e
// escurece ao fundo. Nome, tipologia e local ficam num cartão de vidro.
export default function Projetos() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cartoes = gsap.utils.toArray<HTMLElement>("[data-projeto]");
        cartoes.forEach((cartao, i) => {
          if (i === cartoes.length - 1) return;
          gsap.to(cartao.querySelector("[data-conteudo]"), {
            scale: 0.94,
            filter: "brightness(0.55)",
            ease: "none",
            scrollTrigger: { trigger: cartoes[i + 1], start: "top 60%", end: "top top+=24", scrub: true },
          });
        });
        cartoes.forEach((cartao) => {
          gsap.fromTo(
            cartao.querySelector("img"),
            { scale: 1.12 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: cartao, start: "top bottom", end: "top top", scrub: true } },
          );
          gsap.from(cartao.querySelector("[data-vidro]"), {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: cartao, start: "top 55%" },
          });
        });
      });
    },
    { scope: raiz },
  );

  return (
    <section id="projetos" ref={raiz} aria-label="Projetos entregues" className="bg-white px-3 pt-3 pb-24">
      {DESTAQUES.map((p) => (
        <article key={p.slug} data-projeto className="sticky top-3 h-[calc(100svh-24px)] pb-3">
          <div data-conteudo className="relative h-full origin-top overflow-hidden rounded-[28px] bg-grafite-profundo md:rounded-[36px]">
            <Image src={foto(p)} alt={`Apartamento ${p.nome}, ${p.tipologia}, montado pela Lofteria`} fill sizes="100vw" className="object-cover" />
            <div
              data-vidro
              className="absolute bottom-5 left-5 max-w-[calc(100%-40px)] rounded-2xl border border-white/20 bg-grafite-profundo/25 px-5 py-4 text-white shadow-2xl shadow-black/20 backdrop-blur-xl md:bottom-8 md:left-8 md:px-6 md:py-5"
            >
              <span className="inline-block rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase">
                {p.tipologia}
              </span>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{p.nome}</h3>
              <p className="mt-1 text-[11px] tracking-[0.14em] text-white/75 uppercase">{p.local}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
