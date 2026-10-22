"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "#solucao", rotulo: "Solução" },
  { href: "#calculadora", rotulo: "Simulador" },
  { href: "#projetos", rotulo: "Projetos" },
  { href: "#estilos", rotulo: "Estilos" },
  { href: "#depoimentos", rotulo: "Clientes" },
];

// Topo transparente sobre a abertura; depois de rolar vira uma pílula
// flutuante e compacta no rodapé da tela.
export default function Menu() {
  const [compacto, setCompacto] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompacto(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          compacto ? "pointer-events-none -translate-y-full opacity-0" : "opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10">
          <a href="#topo" aria-label="Lofteria, início" className="text-grafite">
            <Logo className="h-6 w-auto md:h-7" simboloSalmao />
          </a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] text-grafite uppercase"
              >
                <span className="text-salmao transition-transform duration-300 group-hover:rotate-90">+</span>
                {l.rotulo}
              </a>
            ))}
          </nav>
          <a href="#contato" className="botao botao-escuro hidden sm:inline-flex">
            Agendar conversa
          </a>
          <button
            type="button"
            onClick={() => setAberto(true)}
            className="text-[11px] font-semibold tracking-[0.18em] text-grafite uppercase sm:hidden"
          >
            Menu
          </button>
        </div>
      </header>

      {/* Pílula flutuante */}
      <div
        className={`fixed bottom-5 left-1/2 z-40 -translate-x-1/2 transition-all duration-500 ${
          compacto ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
        }`}
      >
        <div className="flex items-center gap-6 rounded-full bg-grafite-profundo/90 py-2.5 pr-2.5 pl-5 text-white shadow-2xl shadow-black/20 backdrop-blur-md">
          <a href="#topo" aria-label="Voltar ao início">
            <Logo className="h-4 w-auto" simboloSalmao />
          </a>
          <button
            type="button"
            onClick={() => setAberto(true)}
            aria-expanded={aberto}
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors hover:bg-white/20"
          >
            Menu
            <span className="flex flex-col gap-[3px]">
              <span className="block h-px w-3.5 bg-current" />
              <span className="block h-px w-3.5 bg-current" />
            </span>
          </button>
        </div>
      </div>

      {/* Menu aberto em tela cheia */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-50 flex flex-col bg-grafite-profundo text-white transition-[clip-path] duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${
          aberto ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 md:px-10">
          <Logo className="h-6 w-auto" simboloSalmao />
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Fechar ✕
          </button>
        </div>
        <nav className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center gap-2 px-5 md:px-10">
          {[...LINKS, { href: "#contato", rotulo: "Contato" }].map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className="group flex items-baseline gap-5 border-b border-white/10 py-3 md:py-4"
            >
              <span className="text-xs text-salmao tabular-nums">0{i + 1}</span>
              <span className="titulo-lg transition-colors group-hover:text-salmao">{l.rotulo}</span>
            </a>
          ))}
        </nav>
        <p className="mx-auto w-full max-w-[1440px] px-5 pb-8 text-sm text-white/50 md:px-10">
          Seu imóvel pronto para performar.
        </p>
      </div>
    </>
  );
}
