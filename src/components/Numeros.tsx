"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Números do site atual (lofteria.com.br). Conferir antes de publicar.
const NUMEROS = [
  { valor: 350, prefixo: "+", sufixo: "", rotulo: "Apartamentos entregues" },
  { valor: 16, prefixo: "R$ ", sufixo: "M", rotulo: "Gerenciados em obras" },
  { valor: 30, prefixo: "+", sufixo: "%", rotulo: "De rentabilidade nos imóveis entregues" },
  { valor: 17, prefixo: "+", sufixo: "%", rotulo: "De valorização nas diárias" },
  { valor: 9738, prefixo: "", sufixo: " m²", rotulo: "Desenvolvidos" },
  { valor: 10, prefixo: "+", sufixo: "", rotulo: "Países com clientes investidores" },
];

const formatar = (n: number) => Math.round(n).toLocaleString("pt-BR");

export default function Numeros() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        raiz.current!.querySelectorAll<HTMLElement>("[data-contador]").forEach((el) => {
          const alvo = Number(el.dataset.contador);
          const obj = { n: 0 };
          el.textContent = "0";
          gsap.to(obj, {
            n: alvo,
            duration: 2.2,
            ease: "power3.out",
            onUpdate: () => (el.textContent = formatar(obj.n)),
            scrollTrigger: { trigger: el, start: "top 90%" },
          });
        });
        gsap.from("[data-cartao]", {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-cartoes]", start: "top 85%" },
        });
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="bg-grafite-profundo pb-28 text-white md:pb-36">
      <div className="mx-auto max-w-[1440px] px-5 pt-24 md:px-10 md:pt-32">
        <p className="titulo-md max-w-[22ch]">
          Mais lucro em menos tempo.{" "}
          <span className="font-light text-white/45">De forma desburocratizada, eficiente e sem dor de cabeça.</span>
        </p>
        <div data-cartoes className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NUMEROS.map((n) => (
            <div
              key={n.rotulo}
              data-cartao
              className="flex min-h-40 flex-col justify-between rounded-2xl bg-white/[0.04] p-7 ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]"
            >
              <p className="text-5xl font-semibold tracking-tight tabular-nums md:text-6xl">
                <span className="text-salmao">{n.prefixo}</span>
                <span data-contador={n.valor}>{formatar(n.valor)}</span>
                <span className="text-salmao">{n.sufixo}</span>
              </p>
              <p className="mt-6 max-w-[22ch] text-sm text-white/55">{n.rotulo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
