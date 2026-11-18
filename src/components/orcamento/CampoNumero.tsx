"use client";

import { useState } from "react";

const formatar = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

/** Campo numérico que aceita vírgula (padrão brasileiro) e só aplica valores válidos. */
export function CampoNumero({
  valor,
  onChange,
  min = 0.5,
  max = 500,
  id,
  rotulo,
  className = "",
}: {
  valor: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  id?: string;
  rotulo: string;
  className?: string;
}) {
  const [texto, setTexto] = useState(formatar(valor));
  const [focado, setFocado] = useState(false);
  // Fora do foco o campo mostra o valor atual; durante a digitação, o texto digitado
  const exibido = focado ? texto : formatar(valor);
  const v = parseFloat(exibido.replace(/\./g, "").replace(",", "."));
  const invalido = !(v >= min && v <= max);
  return (
    <input
      id={id}
      aria-label={rotulo}
      aria-invalid={invalido}
      inputMode="decimal"
      value={exibido}
      onFocus={() => {
        setTexto(formatar(valor));
        setFocado(true);
      }}
      onBlur={() => setFocado(false)}
      onChange={(e) => {
        setTexto(e.target.value);
        const n = parseFloat(e.target.value.replace(/\./g, "").replace(",", "."));
        if (n >= min && n <= max) onChange(Math.round(n * 100) / 100);
      }}
      className={`rounded-full border bg-white px-3 py-1.5 text-right tabular-nums outline-none focus:border-petroleo ${invalido ? "border-salmao" : "border-linha"} ${className}`}
    />
  );
}
