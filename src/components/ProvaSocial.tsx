"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Simbolo } from "./Logo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Trechos dos depoimentos reais do site atual
const FALAS = [
  { texto: "Meu apartamento foi o primeiro a ficar pronto no prédio. Já fechei mais três.", nome: "Ciro Gabola", papel: "Investidor" },
  { texto: "Já temos seis imóveis feitos pela Lofteria. Um serviço realmente diferenciado.", nome: "Liciamara Faria", papel: "Investidora" },
  { texto: "Resolvemos tudo online e cumpriram à risca o prazo e o orçamento.", nome: "Genocir Franke", papel: "Médico" },
];

const RENTABILIDADE = 30; // % (número do site atual)

export default function ProvaSocial() {
  const raiz = useRef<HTMLElement>(null);
  const [fala, setFala] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setFala((i) => (i + 1) % FALAS.length), 4500);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const arco = raiz.current!.querySelector<SVGPathElement>("[data-arco]")!;
      const numero = raiz.current!.querySelector<HTMLElement>("[data-numero]")!;
      const total = arco.getTotalLength();
      const alvo = total * (1 - RENTABILIDADE / 100);
      gsap.set(arco, { strokeDasharray: total, strokeDashoffset: total });
      const obj = { n: 0 };
      gsap
        .timeline({ scrollTrigger: { trigger: arco, start: "top 85%", once: true } })
        .to(arco, { strokeDashoffset: alvo, duration: 1.8, ease: "power3.out" })
        .to(obj, { n: RENTABILIDADE, duration: 1.8, ease: "power3.out", onUpdate: () => (numero.textContent = `+${Math.round(obj.n)}%`) }, 0);

      ScrollTrigger.batch(raiz.current!.querySelectorAll("[data-cartao]"), {
        start: "top 88%",
        once: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: "expo.out" }),
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="mx-auto grid max-w-[1440px] gap-4 px-5 pb-24 md:grid-cols-3 md:px-10 md:pb-32">
      {/* Depoimento rotativo */}
      <div data-cartao className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[22px] bg-grafite-profundo p-7 text-white">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Simbolo className="size-5 text-salmao" /> Lofteria
          </span>
          <span className="flex gap-1.5">
            {FALAS.map((_, i) => (
              <span key={i} className={`size-1.5 rounded-full transition-colors duration-500 ${i === fala ? "bg-white" : "bg-white/25"}`} />
            ))}
          </span>
        </div>
        <div className="relative min-h-[150px]">
          {FALAS.map((f, i) => (
            <figure
              key={f.nome}
              aria-hidden={i !== fala}
              className={`absolute inset-x-0 bottom-0 transition-all duration-700 ${i === fala ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              <blockquote className="text-xl leading-snug">“{f.texto}”</blockquote>
              <figcaption className="mt-5 text-xs tracking-[0.12em] text-white/50 uppercase">
                {f.nome} · {f.papel}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Foto com resultado */}
      <div data-cartao className="group relative min-h-[340px] overflow-hidden rounded-[22px]">
        <Image
          src="/img/quarto-janela.jpg"
          alt="Quarto com janela ampla, montado pela Lofteria"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
        />
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-2xl bg-grafite-profundo/80 p-4 text-white backdrop-blur-md">
          <div>
            <div className="flex -space-x-2">
              {["sunset-lagoa", "plenty-sea", "swami-beach"].map((f) => (
                <Image key={f} src={`/img/${f}.jpg`} alt="" width={32} height={32} className="size-8 rounded-full border-2 border-grafite-profundo object-cover" />
              ))}
            </div>
            <p className="mt-3 max-w-[16ch] text-sm leading-snug text-white/85">Do imóvel cru ao primeiro hóspede.</p>
          </div>
          <p className="text-3xl font-semibold tracking-tight">
            60<span className="ml-1 text-xs font-normal text-white/60">dias</span>
          </p>
        </div>
      </div>

      {/* Medidor */}
      <div
        data-cartao
        className="relative grid min-h-[340px] place-items-center overflow-hidden rounded-[22px] bg-nevoa bg-[repeating-linear-gradient(0deg,transparent_0_9px,rgba(50,60,68,.06)_9px_10px)]"
      >
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-xs text-texto-suave">Rentabilidade nos imóveis entregues</p>
          <div className="relative mx-auto mt-3 w-44">
            <svg viewBox="0 0 120 66" className="w-full" aria-hidden>
              <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="var(--color-linha)" strokeWidth="8" strokeLinecap="round" />
              <path data-arco d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="var(--color-salmao)" strokeWidth="8" strokeLinecap="round" />
            </svg>
            <p data-numero className="absolute inset-x-0 bottom-0 text-3xl font-semibold tracking-tight text-grafite tabular-nums">
              +{RENTABILIDADE}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
