"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { semViuva } from "@/lib/texto";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// "Uma parceria, três ganhos" como continuação do fundo do mar, logo abaixo do iceberg:
// o azul da água escurece até o preto, um feixe de luz desce da superfície e partículas
// em suspensão sobem devagar. Os cartões são de vidro escuro azulado, para não quebrar
// a imersão, e acendem ao passar o mouse.

const PAPEIS = [
  { quem: "Construtora", titulo: "Vende a unidade pronta", texto: "Mais valor percebido no empreendimento, sem mobilizar a equipe e sem impacto no cronograma da obra." },
  {
    quem: "Investidor",
    titulo: "Recebe o imóvel pronto para render",
    texto: "Contrata a unidade decorada junto com a compra, com o pagamento acompanhando o fluxo do empreendimento. A contratação é opcional.",
  },
  { quem: "Lofteria", titulo: "Assume a ambientação de ponta a ponta", texto: "Projeto, compras, execução e material de venda, com fornecedores homologados, prazo e orçamento definidos." },
];

const CONSTRUTORAS = [
  {
    nome: "FAZ Construções e Incorporações",
    logo: { src: "/img/parceiros/faz-logo.png", classe: "aspect-[387/144] w-20" },
    obras: [
      { nome: "Lagoa Brick", src: "/img/parceiros/lagoa-brick.svg", classe: "aspect-[900/98] w-36" },
      { nome: "Alma Lusa", src: "/img/parceiros/alma-lusa.svg", classe: "aspect-[130/20] w-32" },
    ],
  },
  {
    nome: "Adore Incorporações Imobiliárias",
    logo: { src: "/img/parceiros/adore-logo.png", classe: "aspect-[647/256] w-24" },
    obras: [{ nome: "Level Up" }],
  },
];

// Partículas em posições fixas (as mesmas no servidor e no navegador)
const PARTICULAS = Array.from({ length: 34 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1) * 100, y: r(2) * 100, t: 1 + r(3) * 2.5, d: 14 + r(4) * 18, a: -r(5) * 30, o: 0.15 + r(6) * 0.35 };
});

function Marca({ src, classe, nome }: { src: string; classe: string; nome: string }) {
  return (
    <div
      role="img"
      aria-label={nome}
      className={`${classe} bg-current`}
      style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }}
    />
  );
}

export default function ParceriaFundo() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-surge]", {
          opacity: 0,
          y: 50,
          duration: 1.2,
          stagger: 0.08,
          ease: "expo.out",
          clearProps: "transform",
          scrollTrigger: { trigger: raiz.current, start: "top 70%" },
        });
        // O feixe de luz desce um pouco com a rolagem, como se a câmera afundasse
        gsap.fromTo("[data-feixe]", { yPercent: -10, opacity: 0.6 }, { yPercent: 10, opacity: 1, ease: "none", scrollTrigger: { trigger: raiz.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: raiz },
  );

  return (
    <section ref={raiz} className="relative overflow-hidden bg-[linear-gradient(180deg,#02070d_0%,#020b16_30%,#010812_65%,#000004_100%)] xl:bg-[linear-gradient(180deg,#010005_0%,#020b16_30%,#010812_65%,#000004_100%)] py-24 text-white md:py-32">
      {/* Feixe de luz vindo da superfície e brilho azul no topo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          data-feixe
          className="absolute top-[12%] left-1/2 h-[85%] w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_20%,rgba(70,160,220,0.16),rgba(40,110,170,0.05)_45%,transparent_70%)] blur-2xl"
        />
        {PARTICULAS.map((p, i) => (
          <span
            key={i}
            className="particula absolute rounded-full bg-[#bfe3ff]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.t,
              height: p.t,
              ["--o" as string]: p.o,
              animationDuration: `${p.d}s`,
              animationDelay: `${p.a}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[90rem] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 data-surge className="titulo-lg">
            Uma parceria, <span className="font-light text-white/70">três ganhos.</span>
          </h2>
          <p data-surge className="max-w-md text-lg leading-relaxed font-light text-white/55">
            {semViuva("Construtora, investidor e Lofteria trabalham no mesmo cronograma. Cada um com um papel claro, e a unidade sai pronta para performar.")}
          </p>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-[331fr_639fr_366fr]">
          {PAPEIS.map((c) => (
            <div
              key={c.quem}
              data-surge
              className="group flex flex-col rounded-2xl bg-[#0b1824]/70 p-8 ring-1 ring-white/[0.07] backdrop-blur-md transition-[background-color,box-shadow,translate] duration-500 hover:-translate-y-1 hover:bg-[#0f2233]/80 hover:ring-[#5fb4e6]/30"
            >
              <span className="text-[0.6875rem] font-semibold tracking-[0.22em] text-salmao uppercase">{c.quem}</span>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight">{c.titulo}</h3>
              <p className="mt-3 leading-relaxed font-light text-white/65">{semViuva(c.texto)}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div data-surge className="flex flex-col justify-end rounded-2xl bg-[#0b1824]/70 p-8 ring-1 ring-white/[0.07] backdrop-blur-md">
            <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-salmao uppercase">Caso · 2 dormitórios no Campeche</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight">Vendido em menos de 20 dias</p>
            <p className="mt-2 text-sm font-light text-white/60">{semViuva("Depois de 4 meses parado, com valorização percebida de R$ 120 mil acima da média da torre.")}</p>
          </div>
          <div data-surge className="rounded-2xl bg-white/[0.04] p-8 ring-1 ring-white/10 backdrop-blur-md">
            <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-white/50 uppercase">Modelo já aplicado com construtoras parceiras</p>
            <ul className="mt-2 divide-y divide-white/10">
              {CONSTRUTORAS.map((c) => (
                <li key={c.nome} className="grid grid-cols-[6.5rem_1fr] items-center gap-6 py-5 last:pb-0">
                  <span className="text-white/80">
                    <Marca src={c.logo.src} classe={c.logo.classe} nome={c.nome} />
                  </span>
                  <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-white/60">
                    {c.obras.map((o) =>
                      "src" in o && o.src ? (
                        <Marca key={o.nome} src={o.src} classe={o.classe!} nome={o.nome} />
                      ) : (
                        <span key={o.nome} className="text-lg font-semibold tracking-[0.18em] uppercase">
                          {o.nome}
                        </span>
                      ),
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
