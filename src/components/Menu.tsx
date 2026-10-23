"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { PAGINAS } from "@/lib/navegacao";

// Topo fixo no começo da página; depois de rolar vira uma pílula
// flutuante e compacta no rodapé da tela.
export default function Menu() {
  const [compacto, setCompacto] = useState(false);
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();

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

  const ativo = (href: string) => caminho === href;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 bg-white/85 backdrop-blur-md transition-all duration-500 ${
          compacto ? "pointer-events-none -translate-y-full opacity-0" : "opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10">
          <Link href="/" aria-label="Lofteria, início" className="text-grafite">
            <Logo className="h-6 w-auto md:h-7" simboloSalmao />
          </Link>
          <nav className="hidden items-center gap-7 xl:flex" aria-label="Principal">
            {PAGINAS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                aria-current={ativo(p.href) ? "page" : undefined}
                className={`group relative flex items-center gap-1.5 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors ${
                  ativo(p.href) ? "text-salmao" : "text-grafite hover:text-salmao"
                }`}
              >
                <p.Icone className="size-3.5 text-salmao transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.6} aria-hidden />
                {p.rotulo}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-salmao transition-transform duration-500 ${
                    ativo(p.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/contato" className="botao botao-escuro hidden sm:inline-flex">
              Agendar conversa
            </Link>
            <button
              type="button"
              onClick={() => setAberto(true)}
              className="text-[11px] font-semibold tracking-[0.18em] text-grafite uppercase xl:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Pílula flutuante */}
      <div
        className={`fixed bottom-5 left-1/2 z-40 -translate-x-1/2 transition-all duration-500 ${
          compacto ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
        }`}
      >
        <div className="flex items-center gap-6 rounded-full bg-grafite-profundo/90 py-2.5 pr-2.5 pl-5 text-white shadow-2xl shadow-black/20 backdrop-blur-md">
          <Link href="/" aria-label="Voltar ao início">
            <Logo className="h-4 w-auto" simboloSalmao />
          </Link>
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
          <Link href="/" onClick={() => setAberto(false)} aria-label="Lofteria, início">
            <Logo className="h-6 w-auto" simboloSalmao />
          </Link>
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="text-[11px] font-semibold tracking-[0.18em] uppercase"
          >
            Fechar ✕
          </button>
        </div>
        <nav className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center gap-1 px-5 md:px-10">
          {[{ href: "/", rotulo: "Início" }, ...PAGINAS, { href: "/contato", rotulo: "Contato" }].map((p, i) => (
            <Link
              key={p.href}
              href={p.href}
              onClick={() => setAberto(false)}
              className="group flex items-baseline gap-5 border-b border-white/10 py-3"
            >
              <span className="text-xs text-salmao tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={`text-[clamp(2rem,5vw,4rem)] leading-none font-semibold tracking-tight transition-colors group-hover:text-salmao ${
                  ativo(p.href) ? "text-salmao" : ""
                }`}
              >
                {p.rotulo}
              </span>
            </Link>
          ))}
        </nav>
        <p className="mx-auto w-full max-w-[1440px] px-5 pb-8 text-sm text-white/50 md:px-10">
          Seu imóvel pronto para performar.
        </p>
      </div>
    </>
  );
}
