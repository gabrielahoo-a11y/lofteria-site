"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Topo da página de Construtoras: título e, abaixo, a sala vazia com o dado dos 81%
// escrito na parede (como no slide da apresentação). A imagem abre da moldura para a
// largura toda com a rolagem, no mesmo padrão das outras páginas.
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
          .from("[data-surge]", { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.3)
          .from("[data-janela]", { clipPath: "inset(30% 30% 30% 30% round 0px)", duration: 1.6, ease: "expo.inOut" }, 0.2);

        gsap.fromTo(
          "[data-janela]",
          { clipPath: "inset(0% 6% 0% 6% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: "[data-janela]", start: "top 80%", end: "top 10%", scrub: true },
          },
        );
        gsap.fromTo(
          "[data-parede]",
          { yPercent: -4 },
          { yPercent: 4, ease: "none", scrollTrigger: { trigger: "[data-janela]", start: "top bottom", end: "bottom top", scrub: true } },
        );
        // O texto da parede entra quando a imagem chega ao centro da tela
        gsap.from("[data-dado] > *", {
          y: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-janela]", start: "top 45%" },
        });
        gsap.from("[data-arco]", {
          scale: 0.4,
          opacity: 0,
          rotate: -40,
          duration: 1.4,
          stagger: 0.15,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-janela]", start: "top 45%" },
        });
        return () => titulo.revert();
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="bg-white pt-32 md:pt-40">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 md:px-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
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

      <div
        data-janela
        className="@container relative mt-16 overflow-hidden md:mt-20"
        style={{ clipPath: "inset(0% 6% 0% 6% round 28px)" }}
      >
        <div data-parede className="relative aspect-[1916/1209] w-full">
          <Image src="/img/construtoras-vazio.webp" alt="Apartamento vazio, sem ambientação" fill sizes="100vw" preload className="object-cover" />

          {/* Arcos decorativos, como no slide */}
          <span
            data-arco
            aria-hidden
            className="absolute top-[19%] left-[57%] block aspect-square w-[7.5%] rounded-full border-[1.1cqw] border-white border-r-transparent border-b-transparent border-l-transparent"
            style={{ transform: "rotate(-30deg)" }}
          />
          <span
            data-arco
            aria-hidden
            className="absolute top-[74%] left-[16%] block aspect-square w-[7.5%] rounded-full border-[1.1cqw] border-white border-r-transparent border-b-transparent border-l-transparent"
            style={{ transform: "rotate(-120deg)" }}
          />

          {/* Texto na parede */}
          <div data-dado className="absolute top-[27%] left-[22%] w-[40%]">
            <p className="text-[5.2cqw] leading-[1.02] font-semibold tracking-[-0.02em] text-grafite">
              81% dos compradores não conseguem entender um imóvel se ele estiver vazio
            </p>
            <p className="mt-[1.6cqw] text-[1.05cqw] text-grafite/70">
              <strong className="font-semibold text-grafite">Fonte:</strong> Associação Americana de Corretores
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
