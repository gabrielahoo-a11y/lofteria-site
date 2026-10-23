"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Logo } from "./Logo";
import VideoPlay from "./VideoPlay";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const PROPORCAO = 3288 / 3600;

// Ambientes do loft Lago di Garda, em % da imagem. `em` é o ponto da rolagem (0 a 1) em que o nome aparece.
const AMBIENTES = [
  { nome: "Quarto no mezanino", detalhe: "Enxoval e marcenaria sob medida", x: 19, y: 44, em: 0.5 },
  { nome: "Canto de leitura", detalhe: "Iluminação por voz", x: 44, y: 41, em: 0.56 },
  { nome: "Cozinha completa", detalhe: "Eletros inclusos", x: 19, y: 68, em: 0.68 },
  { nome: "Home office", detalhe: "Sob a escada", x: 62, y: 61, em: 0.72 },
  { nome: "Living e jantar", detalhe: "Sofá com chaise e mesa para 6", x: 45, y: 80, em: 0.78 },
];

export default function Abertura() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { movimento: "(prefers-reduced-motion: no-preference)", celular: "(max-width: 1023px)" },
        (ctx) => {
          const { movimento, celular } = ctx.conditions as { movimento: boolean; celular: boolean };
          if (!movimento) return;

          const palco = raiz.current!.querySelector<HTMLElement>("[data-palco]")!;
          const iso = raiz.current!.querySelector<HTMLElement>("[data-iso]")!;
          const titulo = SplitText.create("[data-titulo]", { type: "lines,words", mask: "lines" });

          // Entrada
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(titulo.words, { yPercent: 110, duration: 1.3, stagger: 0.05 })
            .from(iso, { opacity: 0, y: 60, scale: 0.94, duration: 1.6 }, 0.2)
            .from("[data-surge]", { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.5);

          // Posição do isométrico em relação ao palco, sem transformações
          const medida = () => {
            const p = palco.getBoundingClientRect();
            const pai = iso.parentElement!.getBoundingClientRect();
            return { left: pai.left - p.left + iso.offsetLeft, top: pai.top - p.top + iso.offsetTop, w: iso.offsetWidth };
          };
          const largura = () => window.innerWidth * (celular ? 1.5 : 1);
          const escala = () => largura() / medida().w;
          const xFinal = () => (window.innerWidth - largura()) / 2 - medida().left;
          const yInicio = () => window.innerHeight * (celular ? 0.1 : 0.06) - medida().top;
          const yFim = () => {
            const altura = largura() * PROPORCAO;
            return Math.min(yInicio(), window.innerHeight - altura - window.innerHeight * 0.04 - medida().top);
          };

          gsap.set(iso, { transformOrigin: "0 0" });
          const inversa = () => iso.style.setProperty("--inv", String(1 / (gsap.getProperty(iso, "scaleX") as number)));

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: palco,
              start: "top top",
              end: "+=260%",
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
            onUpdate: inversa,
          });

          tl.to("[data-texto]", { opacity: 0, y: -90, duration: 0.14, ease: "power2.in" }, 0)
            .to("[data-video-bloco]", { opacity: 0, y: 40, duration: 0.12 }, 0)
            .to(iso, { x: xFinal, y: yInicio, scale: escala, duration: 0.38, ease: "power2.inOut" }, 0.06)
            .to(iso, { y: yFim, duration: 0.55 }, 0.42)
            .fromTo("[data-letreiro]", { xPercent: 4, opacity: 0 }, { xPercent: -38, opacity: 1, duration: 1 }, 0)
            .to("[data-letreiro]", { opacity: 1, duration: 0.15 }, 0.12);

          AMBIENTES.forEach((_, i) => {
            const el = `[data-ambiente="${i}"]`;
            tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.04 }, AMBIENTES[i].em - 0.04);
          });
          tl.to("[data-ambiente]", { opacity: 0, duration: 0.04 }, 0.95);

          return () => titulo.revert();
        },
      );
    },
    { scope: raiz },
  );

  return (
    <section id="topo" ref={raiz} className="relative bg-white">
      <div data-palco className="relative overflow-hidden lg:h-svh lg:min-h-[680px]">
        {/* Letreiro gigante que passa por trás do apartamento */}
        <div
          data-letreiro
          aria-hidden
          className="pointer-events-none absolute top-[8%] left-0 w-[170vw] text-grafite/[0.08] opacity-0 lg:w-[130vw]"
        >
          <Logo className="h-auto w-full" />
        </div>

        <div className="relative mx-auto grid h-full max-w-[1440px] items-center gap-10 px-5 pt-28 pb-14 md:px-10 lg:grid-cols-[1fr_1.1fr] lg:pt-20 lg:pb-10">
          <div data-texto className="relative z-20">
            <h1 data-titulo className="text-[clamp(2.7rem,5.6vw,5.6rem)] leading-[0.98] tracking-[-0.035em] text-grafite">
              <strong className="font-semibold">Seu imóvel decorado</strong>{" "}
              <span className="font-light">e pronto para</span> <strong className="font-semibold">performar.</strong>
            </h1>
            <p data-surge className="mt-8 max-w-[33rem] text-lg leading-relaxed font-light text-texto-suave">
              Projetamos, executamos e entregamos apartamentos completos. Prontos para render em{" "}
              <strong className="font-semibold text-grafite/80">short-stay, locação anual ou venda,</strong> em 60 dias
              e sem dor de cabeça.
            </p>
            <div data-surge className="mt-10 flex flex-wrap items-center gap-6">
              <a href="#calculadora" className="botao botao-salmao">
                Para investidor
              </a>
              <a href="#solucao" className="botao text-grafite">
                Como funciona
              </a>
            </div>
            <div data-surge className="mt-14 flex items-center gap-4 lg:mt-24">
              <div className="flex shrink-0 -space-x-3">
                {["sunset-lagoa", "plenty-sea", "swami-beach"].map((f) => (
                  <Image key={f} src={`/img/${f}.jpg`} alt="" width={48} height={48} className="size-12 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <p className="leading-tight text-texto-suave">
                <strong className="block text-2xl font-semibold text-grafite">+350</strong>
                apartamentos <strong className="font-semibold text-grafite/80">entregues</strong>
              </p>
            </div>
          </div>

          <div className="relative z-10 lg:h-full">
            <div
              data-iso
              className="relative mx-auto w-full max-w-[560px] lg:absolute lg:top-[6%] lg:right-0 lg:w-[96%] lg:max-w-none"
              style={{ aspectRatio: `${3600} / ${3288}` }}
            >
              <Image
                src="/img/apartamento-isometrico.webp"
                alt="Isométrico do loft Lago di Garda montado pela Lofteria: mezanino com quarto, cozinha, living, jantar e home office"
                fill
                sizes="100vw"
                preload
                className="object-contain"
              />
              {AMBIENTES.map((a, i) => (
                <div
                  key={a.nome}
                  data-ambiente={i}
                  className="pointer-events-none absolute flex origin-left items-center gap-2.5 opacity-0"
                  style={{ left: `${a.x}%`, top: `${a.y}%`, transform: "translate(-7px, -50%) scale(var(--inv, 1))" }}
                >
                  <span className="relative size-3.5 shrink-0 rounded-full bg-salmao shadow-[0_0_0_4px_rgba(255,255,255,.9)]">
                    <span className="absolute -inset-2 animate-ping rounded-full border border-salmao" />
                  </span>
                  <span className="rounded-full bg-grafite-profundo/85 px-3.5 py-2 text-[13px] whitespace-nowrap text-white backdrop-blur">
                    <strong className="font-semibold">{a.nome}</strong>
                    <span className="hidden text-white/60 sm:inline"> · {a.detalhe}</span>
                  </span>
                </div>
              ))}
            </div>

            <div data-video-bloco className="relative z-20 mt-10 flex justify-end lg:absolute lg:right-0 lg:bottom-10 lg:mt-0">
              <VideoPlay texto="Integramos design estratégico, tecnologia e inteligência de mercado para transformar unidades em produtos de alta performance." />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
