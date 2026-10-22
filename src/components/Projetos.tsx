"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Projetos listados em "Onde Atuamos" no site atual
const PROJETOS = [
  { nome: "Sunset Lagoa", detalhe: "Florianópolis · Lagoa da Conceição", foto: "sunset-lagoa", tag: "Short-stay" },
  { nome: "Plenty Sea 401", detalhe: "Florianópolis · 2 dormitórios", foto: "plenty-sea", tag: "Short-stay" },
  { nome: "Swami Beach 316", detalhe: "Santa Catarina", foto: "swami-beach", tag: "Short-stay" },
  { nome: "Lago di Garda", detalhe: "Florianópolis · Loft", foto: "lago-di-garda", tag: "Short-stay" },
  { nome: "Villa de Algarve 301", detalhe: "Santa Catarina", foto: "vila-algarve", tag: "Short-stay" },
];

// Cartões empilhados: cada projeto cobre o anterior, que encolhe e escurece ao fundo
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
            scale: 0.93,
            filter: "brightness(0.6)",
            ease: "none",
            scrollTrigger: { trigger: cartoes[i + 1], start: "top 60%", end: "top top+=32", scrub: true },
          });
        });
        cartoes.forEach((cartao) => {
          gsap.fromTo(
            cartao.querySelector("img"),
            { scale: 1.15 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: cartao, start: "top bottom", end: "top top", scrub: true } },
          );
        });
      });
    },
    { scope: raiz },
  );

  return (
    <section id="projetos" ref={raiz} className="bg-nevoa pb-24">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-8 px-5 pt-28 pb-14 md:px-10 md:pt-40">
        <div>
          <p className="rotulo mb-6 text-grafite">Projetos entregues</p>
          <h2 className="titulo-lg max-w-[13ch] text-grafite">
            Apartamentos que <span className="font-light text-salmao">já estão performando.</span>
          </h2>
        </div>
        <p className="max-w-sm font-light text-texto-suave">
          Mais de 350 imóveis transformados em Florianópolis e no litoral catarinense, com alta ocupação e diárias acima
          da média no Airbnb e no Booking.
        </p>
      </div>

      <div className="mx-auto max-w-[1440px] px-3 md:px-6">
        {PROJETOS.map((p, i) => (
          <article key={p.nome} data-projeto className="sticky top-4 h-[88svh] pb-4 md:top-8">
            <div
              data-conteudo
              className="relative grid h-full origin-top overflow-hidden rounded-[28px] bg-grafite-profundo text-white md:grid-cols-[0.8fr_1.2fr] md:rounded-[40px]"
            >
              <div className="relative z-10 flex flex-col gap-8 bg-gradient-to-b from-grafite-profundo/80 to-transparent p-7 md:justify-between md:bg-none md:p-12">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-salmao tabular-nums">
                    0{i + 1} / 0{PROJETOS.length}
                  </span>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] tracking-[0.16em] uppercase">
                    {p.tag}
                  </span>
                </div>
                <div>
                  <h3 className="titulo-md">{p.nome}</h3>
                  <p className="mt-3 text-sm tracking-[0.12em] text-white/60 uppercase">{p.detalhe}</p>
                </div>
              </div>
              <div className="absolute inset-0 overflow-hidden md:relative">
                <Image src={`/img/${p.foto}.jpg`} alt={`Apartamento ${p.nome} montado pela Lofteria`} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
