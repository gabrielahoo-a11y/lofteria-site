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
// escrito na parede (como no slide da apresentação, sem os arcos). A imagem abre da moldura para a
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
        gsap.from("[data-dado] > p", {
          y: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
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
          <h1 data-titulo className="mt-8 text-[clamp(2.4rem,4.2vw,3.75rem)] leading-[0.98] font-thin tracking-[-0.03em] text-grafite">
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
        {/* No celular a imagem fica mais alta (recorte na parede); no resto, a foto inteira.
            O texto é medido pela largura da imagem (cqw), então mantêm a mesma
            posição e as mesmas quebras em qualquer resolução. */}
        <div data-parede className="relative aspect-[4/5] w-full sm:aspect-[1440/700]">
          <Image
            src="/img/construtoras-vazio.webp"
            alt="Apartamento vazio, sem ambientação"
            fill
            sizes="100vw"
            preload
            className="object-cover object-[22%_50%] sm:object-center"
          />

          {/* Medidas do Figma: caixa de 1268 × 700 dentro da largura de 1440, texto de 60 px */}
          <div data-dado className="absolute top-[24%] left-[12%] text-[8.6cqw] sm:top-[32.4%] sm:left-[25.35%] sm:text-[4.17cqw]">
            <p className="leading-[0.82] font-semibold tracking-[-0.02em] whitespace-nowrap text-grafite">
              81% dos
              <br />
              compradores
              <br />
              não conseguem
              <br />
              entender um
              <br />
              imóvel se ele
              <br />
              estiver vazio
            </p>
            <p className="mt-[0.45em] text-[0.233em] whitespace-nowrap text-grafite/70">
              <strong className="font-semibold text-grafite">Fonte:</strong> Associação Americana de Corretores
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
