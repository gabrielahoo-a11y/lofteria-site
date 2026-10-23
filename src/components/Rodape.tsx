"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUp } from "lucide-react";
import { Logo } from "./Logo";
import { PAGINAS, REDES } from "@/lib/navegacao";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SOLUCOES = ["Projeto", "Gestão e compras", "Execução", "Instalação e automação"];

// Rodapé de todas as páginas: newsletter, colunas de links e a marca gigante
export default function Rodape() {
  const raiz = useRef<HTMLElement>(null);
  const [estado, setEstado] = useState<"editando" | "enviando" | "enviado" | "erro">("editando");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-marca]",
          { yPercent: 35 },
          { yPercent: 0, ease: "none", scrollTrigger: { trigger: raiz.current, start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });
    },
    { scope: raiz },
  );

  async function assinar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setEstado("enviando");
    const email = new FormData(ev.currentTarget).get("email");
    const resp = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, origem: "newsletter" }),
    }).catch(() => null);
    setEstado(resp?.ok ? "enviado" : "erro");
  }

  const topo = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer ref={raiz} className="overflow-hidden bg-grafite-profundo text-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-20 md:px-10 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="rounded-[20px] bg-white/[0.05] p-6 ring-1 ring-white/10">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">Newsletter</p>
          <p className="mt-3 font-semibold">Novidades e oportunidades, uma vez por mês.</p>
          {estado === "enviado" ? (
            <p className="mt-5 text-sm text-salmao">Inscrição feita. Até a próxima edição!</p>
          ) : (
            <form onSubmit={assinar} className="mt-5 space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Seu e-mail
              </label>
              <input
                id="newsletter-email"
                required
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Seu e-mail"
                className="w-full rounded-lg bg-black/25 px-4 py-3 text-sm ring-1 ring-white/10 outline-none placeholder:text-white/40 focus:ring-salmao"
              />
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="w-full rounded-lg bg-white py-3 text-xs font-semibold tracking-[0.16em] text-grafite uppercase transition-colors hover:bg-salmao hover:text-white disabled:opacity-60"
              >
                {estado === "enviando" ? "Enviando…" : "Assinar"}
              </button>
              {estado === "erro" && <p className="text-xs text-salmao">Não deu certo agora. Tente de novo em instantes.</p>}
            </form>
          )}
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          <nav aria-label="Páginas">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">Páginas</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {[{ href: "/", rotulo: "Início" }, ...PAGINAS, { href: "/contato", rotulo: "Contato" }].map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="text-white/80 transition-colors hover:text-salmao">
                    {p.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">Solução</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {SOLUCOES.map((s) => (
                <li key={s}>
                  <Link href="/#solucao" className="text-white/80 transition-colors hover:text-salmao">
                    {s}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/investidor#simulador" className="text-white/80 transition-colors hover:text-salmao">
                  Simulador de investimento
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">Contato</p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/80">
              <li>Florianópolis · SC</li>
              <li className="select-all">marketing@lofteria.com</li>
              {REDES.map((r) => (
                <li key={r.nome}>
                  <a href={r.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-salmao">
                    {r.nome}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-[1440px] px-5 md:px-10">
        <div data-marca className="text-white/[0.06]">
          <Logo className="h-auto w-full" />
        </div>
        <div className="absolute inset-x-5 bottom-6 flex flex-wrap items-center justify-between gap-3 text-xs md:inset-x-10">
          <span className="rounded-full bg-white/[0.06] px-3.5 py-2 text-white/60">
            © {new Date().getFullYear()} Lofteria. Todos os direitos reservados.
          </span>
          <button
            type="button"
            onClick={topo}
            className="flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 font-semibold tracking-[0.14em] text-white/80 uppercase transition-colors hover:bg-salmao hover:text-white"
          >
            Voltar ao topo <ArrowUp className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
      <div className="h-24" />
    </footer>
  );
}
