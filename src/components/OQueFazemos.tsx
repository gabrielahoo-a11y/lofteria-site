"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Serviços do site atual; o ativo mostra a descrição e troca a foto
const SERVICOS = [
  { nome: "Projeto", texto: "Planejamos e projetamos todos os espaços com funcionalidade, criatividade e estética.", foto: "jantar-quadro" },
  { nome: "Gestão e compras", texto: "Pedidos, logística e conferência das entregas, com o orçamento sob controle.", foto: "cozinha-grafite" },
  { nome: "Mão de obra", texto: "Selecionamos e contratamos pintura, elétrica, montagem e instalações no ritmo do cronograma.", foto: "studio-integrado" },
  { nome: "Execução", texto: "Supervisores acompanham cada etapa da obra com cronograma rigoroso.", foto: "sala-azul" },
  { nome: "Instalações", texto: "Pedras, móveis, eletrodomésticos e utensílios: o apartamento completo para morar.", foto: "sala-estante" },
  { nome: "Automação", texto: "Com um comando, o morador regula o ar, liga a TV e o som e programa timers.", foto: "quarto-janela" },
];

export default function OQueFazemos() {
  const raiz = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [naTela, setNaTela] = useState(false);

  // Avança sozinho enquanto a seção está na tela e o mouse não está sobre a lista
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { threshold: 0.4 });
    obs.observe(raiz.current!);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!naTela || pausado || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setAtivo((i) => (i + 1) % SERVICOS.length), 3200);
    return () => window.clearInterval(id);
  }, [naTela, pausado]);

  return (
    <section ref={raiz} className="grid bg-grafite-profundo text-white lg:min-h-svh lg:grid-cols-2">
      <div className="relative min-h-[50svh] overflow-hidden">
        {SERVICOS.map((s, i) => (
          <Image
            key={s.foto}
            src={`/img/${s.foto}.jpg`}
            alt={i === ativo ? `${s.nome}: ${s.texto}` : ""}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={`object-cover transition-[opacity,scale] duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)] ${
              i === ativo ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-col justify-center px-5 py-20 md:px-16">
        <p className="rotulo mb-8 text-white/60">O que fazemos</p>
        <ul onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)}>
          {SERVICOS.map((s, i) => (
            <li key={s.nome}>
              <button
                type="button"
                onClick={() => setAtivo(i)}
                onMouseEnter={() => setAtivo(i)}
                onFocus={() => setAtivo(i)}
                aria-pressed={i === ativo}
                className={`text-left text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.15] font-semibold tracking-tight transition-colors duration-500 ${
                  i === ativo ? "text-white" : "text-white/25 hover:text-white/50"
                }`}
              >
                {s.nome}
              </button>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${
                  i === ativo ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <p className="overflow-hidden">
                  <span className="block max-w-md pt-1 pb-4 font-light text-white/65">{s.texto}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
