"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { SIMBOLO_PATH } from "./Logo";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function Abertura() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const linhas = SplitText.create("[data-titulo]", { type: "lines,chars", mask: "lines" });
        const contorno = raiz.current!.querySelector<SVGPathElement>("[data-contorno]")!;
        const comprimento = contorno.getTotalLength();

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.set(contorno, { strokeDasharray: comprimento, strokeDashoffset: comprimento })
          .from(linhas.chars, { yPercent: 110, duration: 1.3, stagger: 0.018 })
          .to(contorno, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0.2)
          .from("[data-preenchimento]", { opacity: 0, scale: 0.94, transformOrigin: "50% 50%", duration: 1.4 }, 1.6)
          .from("[data-surge]", { y: 30, opacity: 0, duration: 1.1, stagger: 0.1 }, 0.7);

        // A foto sai de uma janela estreita e ocupa a tela toda
        gsap.fromTo(
          "[data-janela]",
          { clipPath: "inset(18% 22% 18% 22% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: "[data-janela-area]", start: "top top", end: "+=110%", scrub: true, pin: true },
          },
        );
        gsap.fromTo(
          "[data-janela] img",
          { scale: 1.25 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-janela-area]", start: "top top", end: "+=110%", scrub: true },
          },
        );
        gsap.to("[data-legenda-janela]", {
          opacity: 1,
          y: 0,
          scrollTrigger: { trigger: "[data-janela-area]", start: "top top-=60%", end: "+=30%", scrub: true },
        });

        return () => linhas.revert();
      });
    },
    { scope: raiz },
  );

  return (
    <section id="topo" ref={raiz} className="relative">
      <div className="relative mx-auto flex min-h-svh max-w-[1440px] flex-col justify-center px-5 pt-28 pb-16 md:px-10">
        {/* Símbolo grande ao fundo, desenhado traço a traço */}
        <svg
          viewBox="-2 -2 110 125"
          aria-hidden
          className="pointer-events-none absolute top-[44%] right-[4%] hidden h-[62vh] max-h-[640px] -translate-y-1/2 opacity-90 lg:block"
        >
          <path data-contorno d={SIMBOLO_PATH} fill="none" stroke="var(--color-salmao)" strokeWidth="0.35" />
          <path data-preenchimento d={SIMBOLO_PATH} fill="url(#grad-simbolo)" />
          <defs>
            <linearGradient id="grad-simbolo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e46f6b" stopOpacity="0.16" />
              <stop offset="1" stopColor="#0f6073" stopOpacity="0.06" />
            </linearGradient>
          </defs>
        </svg>

        <p data-surge className="rotulo mb-8 text-grafite">
          Montagem de apartamentos inteligentes
        </p>
        <h1 data-titulo className="titulo-xl relative max-w-[11ch] text-grafite">
          Seu imóvel <span className="font-light text-salmao">pronto para</span> performar.
        </h1>

        <div className="relative mt-10 flex flex-col gap-8 md:mt-12">
          <p data-surge className="max-w-md text-lg leading-relaxed font-light text-texto-suave">
            Projetamos, executamos e entregamos apartamentos completos. Prontos para render em{" "}
            <strong className="font-semibold text-grafite">short-stay, locação anual ou venda</strong> — em 60 dias e
            sem dor de cabeça.
          </p>
          <div data-surge className="flex flex-wrap items-center gap-5">
            <a href="#calculadora" className="botao botao-salmao">
              Simular meu retorno
            </a>
            <a href="#solucao" className="botao text-grafite">
              Como funciona
            </a>
          </div>
        </div>

        <div data-surge className="relative mt-14 flex items-center gap-4 border-t border-linha pt-6">
          <div className="flex shrink-0 -space-x-3">
            {["sunset-lagoa", "plenty-sea", "swami-beach"].map((f) => (
              <Image
                key={f}
                src={`/img/${f}.jpg`}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-full border-2 border-nevoa object-cover"
              />
            ))}
          </div>
          <p className="text-sm text-texto-suave">
            <strong className="text-2xl font-semibold text-grafite">+350</strong> apartamentos entregues em Santa
            Catarina
          </p>
        </div>
      </div>

      <div data-janela-area className="relative h-svh overflow-hidden">
        <div data-janela className="absolute inset-0" style={{ clipPath: "inset(18% 22% 18% 22% round 28px)" }}>
          <Image
            src="/img/sala-estante.jpg"
            alt="Sala de estar montada pela Lofteria, com sofá cinza e estante metálica"
            fill
            sizes="100vw"
            className="object-cover"
            preload
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
        </div>
        <div
          data-legenda-janela
          className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1440px] translate-y-6 items-end justify-between gap-6 px-5 pb-10 text-white opacity-0 md:px-10"
        >
          <p className="titulo-md max-w-[16ch]">Do imóvel cru ao primeiro hóspede.</p>
          <p className="hidden max-w-xs text-sm text-white/80 md:block">
            Projeto, compras, obra, instalação e automação. Um único time, um único prazo.
          </p>
        </div>
      </div>
    </section>
  );
}
