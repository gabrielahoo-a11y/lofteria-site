"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import VideoPlay from "./VideoPlay";
import ProjetosMini from "./ProjetosMini";

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
          const palco = raiz.current!.querySelector<HTMLElement>("[data-palco]")!;
          const lugar = raiz.current!.querySelector<HTMLElement>("[data-iso-lugar]")!;
          const iso = raiz.current!.querySelector<HTMLElement>("[data-iso]")!;
          const interno = iso.querySelector<HTMLElement>("[data-iso-interno]")!;

          // O isométrico é desenhado já no tamanho final (largura da tela) e reduzido até o lugar
          // dele na abertura. Assim, ao crescer, continua nítido e não precisa ser redesenhado.
          const largura = () => window.innerWidth * (celular ? 1.5 : 1);
          const caixa = () => {
            const p = palco.getBoundingClientRect();
            const l = lugar.getBoundingClientRect();
            return { left: l.left - p.left, top: l.top - p.top, w: l.width };
          };
          const xInicial = () => caixa().left;
          const yInicial = () => caixa().top;
          const escalaInicial = () => caixa().w / largura();
          const xZoom = () => (window.innerWidth - largura()) / 2;
          const yZoom = () => window.innerHeight * (celular ? 0.1 : 0.06);
          const yFim = () => Math.min(yZoom(), window.innerHeight * 0.96 - largura() * PROPORCAO);

          const posicionar = () => {
            iso.style.width = `${largura()}px`;
            gsap.set(iso, { x: xInicial(), y: yInicial(), scale: escalaInicial(), transformOrigin: "0 0" });
          };
          posicionar();

          if (!movimento) {
            gsap.set(iso, { opacity: 1 });
            return;
          }

          const titulo = SplitText.create("[data-titulo]", { type: "lines,words", mask: "lines" });

          // Entrada
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .from(titulo.words, { yPercent: 110, duration: 1.3, stagger: 0.05 })
            .fromTo(interno, { opacity: 0, y: 70, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 1.8 }, 0.15)
            .set(iso, { opacity: 1 }, 0.15)
            .from("[data-surge]", { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.5);

          // Rótulos dos ambientes mantêm o mesmo tamanho na tela em qualquer zoom
          const inversa = () => iso.style.setProperty("--inv", String(1 / (gsap.getProperty(iso, "scaleX") as number)));
          inversa();

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: palco,
              start: "top top",
              end: "+=260%",
              pin: true,
              scrub: 1.4,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: posicionar,
            },
            onUpdate: inversa,
          });

          // O título sai palavra por palavra; o resto do texto logo depois
          tl.fromTo(
            titulo.words,
            { yPercent: 0 },
            { yPercent: -110, duration: 0.1, stagger: 0.006, ease: "power2.in", immediateRender: false },
            0,
          )
            .fromTo(
              "[data-texto] [data-surge]",
              { opacity: 1, y: 0 },
              { opacity: 0, y: -40, duration: 0.08, stagger: 0.02, immediateRender: false },
              0.02,
            )
            .fromTo("[data-video-bloco]", { opacity: 1, y: 0 }, { opacity: 0, y: 40, duration: 0.1, immediateRender: false }, 0)
            .fromTo(
              iso,
              { x: xInicial, y: yInicial, scale: escalaInicial },
              { x: xZoom, y: yZoom, scale: 1, duration: 0.38, ease: "power3.inOut", immediateRender: false },
              0.05,
            )
            .to(iso, { y: yFim, duration: 0.55 }, 0.43);

          AMBIENTES.forEach((a, i) => {
            const el = `[data-ambiente="${i}"]`;
            tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.04 }, a.em - 0.04).fromTo(
              `${el} [data-pilula]`,
              { x: -14, scale: 0.9 },
              { x: 0, scale: 1, duration: 0.05, ease: "power2.out" },
              a.em - 0.04,
            );
          });
          tl.to("[data-ambiente]", { opacity: 0, duration: 0.04 }, 0.95);

          // Na abertura, o apartamento acompanha o mouse com um leve movimento de profundidade
          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            const irX = gsap.quickTo(interno, "x", { duration: 1.2, ease: "power3.out" });
            const irY = gsap.quickTo(interno, "y", { duration: 1.2, ease: "power3.out" });
            const girar = gsap.quickTo(interno, "rotation", { duration: 1.2, ease: "power3.out" });
            const mover = (e: PointerEvent) => {
              const forca = Math.max(0, 1 - tl.scrollTrigger!.progress * 8);
              const nx = e.clientX / window.innerWidth - 0.5;
              const ny = e.clientY / window.innerHeight - 0.5;
              irX(nx * 90 * forca);
              irY(ny * 60 * forca);
              girar(nx * 1.2 * forca);
            };
            window.addEventListener("pointermove", mover);
            return () => {
              window.removeEventListener("pointermove", mover);
              titulo.revert();
            };
          }

          return () => titulo.revert();
        },
      );
    },
    { scope: raiz },
  );

  return (
    <section id="topo" ref={raiz} className="relative bg-white">
      <div data-palco className="relative overflow-hidden lg:h-svh lg:min-h-[680px]">
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
              <Link href="/investidor" className="botao botao-salmao">
                Para investidor
              </Link>
              <a href="#solucao" className="botao text-grafite">
                Como funciona
              </a>
            </div>
            <div data-surge className="mt-14 lg:mt-24">
              <ProjetosMini />
            </div>
          </div>

          <div className="relative z-10 lg:h-full">
            {/* Reserva o lugar do isométrico na abertura; a imagem em si fica solta no palco */}
            <div
              data-iso-lugar
              aria-hidden
              className="relative mx-auto w-full max-w-[560px] lg:absolute lg:top-[6%] lg:right-0 lg:w-[96%] lg:max-w-none"
              style={{ aspectRatio: `${3600} / ${3288}` }}
            />

            <div data-video-bloco className="relative z-20 mt-10 flex justify-end lg:absolute lg:right-0 lg:bottom-10 lg:mt-0">
              <VideoPlay texto="Integramos design estratégico, tecnologia e inteligência de mercado para transformar unidades em produtos de alta performance." />
            </div>
          </div>
        </div>

        <div data-iso className="pointer-events-none absolute top-0 left-0 z-10 w-screen opacity-0">
          <div data-iso-interno className="relative w-full" style={{ aspectRatio: `${3600} / ${3288}` }}>
            <Image
              src="/img/apartamento-isometrico.webp"
              alt="Isométrico do loft Lago di Garda montado pela Lofteria: mezanino com quarto, cozinha, living, jantar e home office"
              fill
              sizes="(max-width: 1023px) 150vw, 100vw"
              preload
              className="object-contain"
            />
            {AMBIENTES.map((a, i) => (
              <div
                key={a.nome}
                data-ambiente={i}
                className="absolute flex origin-left items-center gap-2.5 opacity-0"
                style={{ left: `${a.x}%`, top: `${a.y}%`, transform: "translate(-7px, -50%) scale(var(--inv, 1))" }}
              >
                <span className="relative size-3.5 shrink-0 rounded-full bg-salmao shadow-[0_0_0_4px_rgba(255,255,255,.9)]">
                  <span className="absolute -inset-2 animate-ping rounded-full border border-salmao" />
                </span>
                <span data-pilula className="origin-left rounded-full bg-grafite-profundo/90 px-3.5 py-2 text-[13px] whitespace-nowrap text-white">
                  <strong className="font-semibold">{a.nome}</strong>
                  <span className="hidden text-white/60 sm:inline"> · {a.detalhe}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
