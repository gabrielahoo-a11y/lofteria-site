"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { PAGINAS, REDES } from "@/lib/navegacao";

// Formulário de contato + rodapé, no fim de todas as páginas.
// `origem` diz de qual página veio o lead.
export default function Contato({ origem = "contato" }: { origem?: string }) {
  const [estado, setEstado] = useState<"editando" | "enviando" | "enviado" | "erro">("editando");

  async function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setEstado("enviando");
    const dados = Object.fromEntries(new FormData(ev.currentTarget));
    const resp = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dados, origem }),
    }).catch(() => null);
    setEstado(resp?.ok ? "enviado" : "erro");
  }

  return (
    <footer id="contato" className="rounded-t-[32px] bg-petroleo-profundo text-white md:rounded-t-[48px]">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 pt-24 pb-16 md:px-10 md:pt-32 lg:grid-cols-2">
        <div>
          <p className="rotulo mb-6 text-white/70">Fale com um consultor</p>
          <h2 className="titulo-lg max-w-[12ch]">
            Vamos fazer seu imóvel <span className="text-salmao">performar?</span>
          </h2>
          <p className="mt-6 max-w-md font-light text-white/70">
            Conte sobre o seu imóvel. Respondemos em até 1 dia útil com os próximos passos e uma estimativa inicial.
          </p>
        </div>

        {estado === "enviado" ? (
          <div className="flex flex-col justify-center rounded-[28px] bg-white/[0.06] p-10 ring-1 ring-white/10">
            <p className="text-4xl text-salmao">✓</p>
            <p className="mt-4 text-2xl font-semibold">Mensagem recebida.</p>
            <p className="mt-2 font-light text-white/70">Em breve um consultor fala com você.</p>
          </div>
        ) : (
          <form onSubmit={enviar} className="grid gap-6 sm:grid-cols-2">
            {[
              { name: "nome", rotulo: "Nome", type: "text", autoComplete: "name" },
              { name: "email", rotulo: "E-mail", type: "email", autoComplete: "email" },
              { name: "whatsapp", rotulo: "WhatsApp", type: "tel", autoComplete: "tel" },
            ].map((c) => (
              <label key={c.name} className="block">
                <span className="text-[11px] font-semibold tracking-[0.16em] text-white/55 uppercase">{c.rotulo}</span>
                <input
                  required
                  name={c.name}
                  type={c.type}
                  autoComplete={c.autoComplete}
                  className="mt-2 w-full border-b border-white/20 bg-transparent py-2 outline-none focus:border-salmao"
                />
              </label>
            ))}
            <label className="block sm:col-span-2">
              <span className="text-[11px] font-semibold tracking-[0.16em] text-white/55 uppercase">
                Sobre o imóvel (opcional)
              </span>
              <textarea
                name="mensagem"
                rows={3}
                className="mt-2 w-full resize-none border-b border-white/20 bg-transparent py-2 outline-none focus:border-salmao"
              />
            </label>
            {estado === "erro" && (
              <p className="text-sm text-salmao sm:col-span-2">Não conseguimos enviar agora. Tente de novo em instantes.</p>
            )}
            <div className="sm:col-span-2">
              <button type="submit" disabled={estado === "enviando"} className="botao botao-salmao disabled:opacity-60">
                {estado === "enviando" ? "Enviando…" : "Agendar conversa"}
              </button>
            </div>
          </form>
        )}
      </div>

      <nav aria-label="Páginas" className="mx-auto flex max-w-[1440px] flex-wrap gap-x-8 gap-y-3 border-t border-white/10 px-5 py-8 md:px-10">
        {[{ href: "/", rotulo: "Início" }, ...PAGINAS, { href: "/contato", rotulo: "Contato" }].map((p) => (
          <Link key={p.href} href={p.href} className="text-[11px] font-semibold tracking-[0.18em] text-white/70 uppercase hover:text-salmao">
            {p.rotulo}
          </Link>
        ))}
      </nav>

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Logo className="w-full text-white/[0.07]" />
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 px-5 py-8 pb-28 text-sm text-white/55 md:px-10">
        <p>© {new Date().getFullYear()} Lofteria · Seu imóvel pronto para performar.</p>
        <nav className="flex gap-6" aria-label="Redes sociais">
          {REDES.map((r) => (
            <a key={r.nome} href={r.href} target="_blank" rel="noreferrer" className="hover:text-salmao">
              {r.nome}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
