"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const INTERESSES = [
  "Investir em short-stay",
  "Investir em locação anual",
  "Montar o apartamento para morar",
  "Sou construtora ou incorporadora",
  "Outro assunto",
];

const campo =
  "mt-2 w-full rounded-xl bg-white px-4 py-3.5 text-grafite ring-1 ring-linha outline-none transition-shadow placeholder:text-texto-suave/60 focus:ring-2 focus:ring-salmao";

export default function FormularioContato() {
  const [estado, setEstado] = useState<"editando" | "enviando" | "enviado" | "erro">("editando");

  async function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setEstado("enviando");
    const dados = Object.fromEntries(new FormData(ev.currentTarget));
    const resp = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dados, origem: "contato" }),
    }).catch(() => null);
    setEstado(resp?.ok ? "enviado" : "erro");
  }

  if (estado === "enviado") {
    return (
      <div className="flex min-h-[420px] flex-col justify-center rounded-[24px] bg-nevoa p-10">
        <span className="grid size-12 place-items-center rounded-full bg-salmao text-xl text-white">✓</span>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-grafite">Mensagem enviada.</h2>
        <p className="mt-3 max-w-md font-light text-texto-suave">
          Obrigado pelo contato. Um consultor da Lofteria vai ler sua mensagem e responder em até 1 dia útil.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="grid gap-5 sm:grid-cols-2">
      <h2 className="text-3xl font-semibold tracking-tight text-grafite sm:col-span-2">Envie sua mensagem</h2>
      <label className="block text-sm font-semibold text-grafite" htmlFor="contato-nome">
        Nome completo
        <input id="contato-nome" required name="nome" autoComplete="name" placeholder="Maria Souza" className={campo} />
      </label>
      <label className="block text-sm font-semibold text-grafite" htmlFor="contato-whatsapp">
        WhatsApp
        <input id="contato-whatsapp" required name="whatsapp" type="tel" autoComplete="tel" placeholder="(48) 99999-0000" className={campo} />
      </label>
      <label className="block text-sm font-semibold text-grafite sm:col-span-2" htmlFor="contato-email">
        E-mail
        <input id="contato-email" required name="email" type="email" autoComplete="email" placeholder="maria@exemplo.com" className={campo} />
      </label>
      <label className="block text-sm font-semibold text-grafite sm:col-span-2" htmlFor="contato-interesse">
        Como podemos ajudar?
        <span className="relative block">
          <select id="contato-interesse" required name="interesse" defaultValue="" className={`${campo} appearance-none pr-10`}>
            <option value="" disabled>
              Escolha uma opção
            </option>
            {INTERESSES.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 mt-1 size-4 text-texto-suave" aria-hidden />
        </span>
      </label>
      <label className="block text-sm font-semibold text-grafite sm:col-span-2" htmlFor="contato-mensagem">
        Mensagem
        <textarea
          id="contato-mensagem"
          name="mensagem"
          rows={5}
          placeholder="O imóvel, a cidade, a metragem ou só a dúvida."
          className={`${campo} resize-y`}
        />
      </label>
      {estado === "erro" && (
        <p className="text-sm text-salmao-escuro sm:col-span-2">
          A mensagem não foi enviada. Confira os dados e tente de novo, ou escreva para marketing@lofteria.com.
        </p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" disabled={estado === "enviando"} className="botao botao-salmao disabled:opacity-60">
          {estado === "enviando" ? "Enviando…" : "Enviar mensagem"}
        </button>
      </div>
    </form>
  );
}
