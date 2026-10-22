"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Depoimentos reais do site atual
const DEPOIMENTOS = [
  {
    texto:
      "Meu apartamento foi o primeiro a ficar pronto no prédio e com isso consegui colocar para alugar mais rápido e já rentabilizar o final do ano de Jurerê. Depois fechei mais três apartamentos e estamos caminhando para o quinto.",
    nome: "Ciro Gabola",
    papel: "Investidor",
  },
  {
    texto:
      "Nós já temos seis imóveis feitos pela Lofteria, uma experiência maravilhosa, de encher os olhos. É um serviço realmente diferenciado para nós que somos investidores e buscamos rentabilizar com aluguel.",
    nome: "Liciamara Faria",
    papel: "Investidora",
  },
  {
    texto:
      "O tempo é muito valioso pra mim e a Lofteria me caiu como uma luva. Resolvemos tudo online e cumpriram à risca o prazo e o orçamento.",
    nome: "Genocir Franke",
    papel: "Médico",
  },
  {
    texto:
      "Entregue antes do prazo e exatamente conforme os orçamentos, o apartamento ficou lindo e funcional. Temos a certeza de termos feito a escolha certa!",
    nome: "Leticia Giovanaz",
    papel: "Moradora",
  },
];

const iniciais = (nome: string) =>
  nome
    .split(" ")
    .map((p) => p[0])
    .join("");

export default function Depoimentos() {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to("[data-trilho]", { xPercent: -50, ease: "none", duration: 60, repeat: -1 });
        const trilho = raiz.current!.querySelector("[data-trilho]")!;
        const pausar = () => tween.timeScale(0.15);
        const seguir = () => tween.timeScale(1);
        trilho.addEventListener("mouseenter", pausar);
        trilho.addEventListener("mouseleave", seguir);
        return () => {
          trilho.removeEventListener("mouseenter", pausar);
          trilho.removeEventListener("mouseleave", seguir);
        };
      });
    },
    { scope: raiz },
  );

  return (
    <section id="depoimentos" ref={raiz} className="overflow-hidden bg-white py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 text-center md:px-10">
        <p className="rotulo mb-6 justify-center text-grafite">O que dizem nossos clientes</p>
        <h2 className="titulo-lg mx-auto max-w-[16ch] text-grafite">
          Julgados pelo resultado, <span className="font-light text-texto-suave">não pela promessa.</span>
        </h2>
      </div>

      <div className="mt-16 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div data-trilho className="flex w-max gap-4 px-2">
          {[...DEPOIMENTOS, ...DEPOIMENTOS].map((d, i) => (
            <figure
              key={i}
              aria-hidden={i >= DEPOIMENTOS.length}
              className="flex w-[82vw] max-w-[420px] flex-col justify-between rounded-[24px] bg-nevoa p-8"
            >
              <blockquote className="leading-relaxed text-grafite">
                <span className="mb-4 block text-4xl leading-none text-salmao">“</span>
                {d.texto}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-grafite text-xs font-semibold text-white">
                  {iniciais(d.nome)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-grafite">{d.nome}</span>
                  <span className="block text-xs text-texto-suave">{d.papel}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
