"use client";

import { useEffect, useState } from "react";

type Estado = "editando" | "enviando" | "enviado" | "erro";

export default function FormularioLead({
  aberto,
  aoFechar,
  origem,
  simulacao,
}: {
  aberto: boolean;
  aoFechar: () => void;
  origem: string;
  simulacao?: unknown;
}) {
  const [estado, setEstado] = useState<Estado>("editando");

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && aoFechar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto, aoFechar]);

  async function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const dados = Object.fromEntries(new FormData(ev.currentTarget));
    setEstado("enviando");
    const resp = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dados, origem, simulacao }),
    }).catch(() => null);
    setEstado(resp?.ok ? "enviado" : "erro");
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Receber estudo completo"
      className={`fixed inset-0 z-[60] flex items-end justify-center bg-grafite-profundo/60 p-4 backdrop-blur-sm transition-opacity duration-500 sm:items-center ${
        aberto ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={(e) => e.target === e.currentTarget && aoFechar()}
    >
      <div
        className={`w-full max-w-md rounded-[28px] bg-white p-8 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] md:p-10 ${
          aberto ? "translate-y-0" : "translate-y-10"
        }`}
      >
        {estado === "enviado" ? (
          <div className="text-center">
            <p className="text-4xl text-salmao">✓</p>
            <h3 className="mt-4 text-2xl font-semibold text-grafite">Recebemos seu pedido</h3>
            <p className="mt-3 font-light text-texto-suave">
              Um consultor da Lofteria vai preparar o estudo com os dados do seu imóvel e falar com você em até 1 dia
              útil.
            </p>
            <button type="button" onClick={aoFechar} className="botao botao-escuro mt-8">
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-grafite">Seu estudo completo</h3>
                <p className="mt-2 text-sm font-light text-texto-suave">
                  Enviamos a simulação detalhada e um consultor valida os números com você.
                </p>
              </div>
              <button type="button" onClick={aoFechar} aria-label="Fechar" className="text-texto-suave hover:text-grafite">
                ✕
              </button>
            </div>
            {[
              { name: "nome", rotulo: "Nome", type: "text", autoComplete: "name" },
              { name: "email", rotulo: "E-mail", type: "email", autoComplete: "email" },
              { name: "whatsapp", rotulo: "WhatsApp", type: "tel", autoComplete: "tel" },
            ].map((c) => (
              <label key={c.name} className="block">
                <span className="text-[11px] font-semibold tracking-[0.16em] text-texto-suave uppercase">{c.rotulo}</span>
                <input
                  required
                  name={c.name}
                  type={c.type}
                  autoComplete={c.autoComplete}
                  className="mt-2 w-full border-b border-linha bg-transparent py-2 text-grafite outline-none focus:border-salmao"
                />
              </label>
            ))}
            {estado === "erro" && (
              <p className="text-sm text-salmao-escuro">Não conseguimos enviar agora. Tente de novo em instantes.</p>
            )}
            <button type="submit" disabled={estado === "enviando"} className="botao botao-salmao w-full disabled:opacity-60">
              {estado === "enviando" ? "Enviando…" : "Quero receber"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
