import { ONDAS_PATHS } from "@/lib/ondas";

// Grafismo de ondas (linhas finas) usado no fundo de títulos e do manifesto.
// Cada linha ondula devagar, com um pequeno atraso em relação à vizinha, e o conjunto
// parece uma superfície em movimento. A animação é só CSS (transform), leve e sem JS.
// Posição e tamanho seguem o Figma: largura de ~114% da seção, sangrando pelas laterais.
// As bordas do desenho somem num degradê (máscara), para nenhuma linha aparecer cortada,
// e um contorno branco de 1,2 px "come" a borda de cada linha, deixando o traço mais fino.
export default function Ondas({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1638.52 414.78"
      preserveAspectRatio="none"
      className={`ondas pointer-events-none absolute -left-[5.6%] w-[113.8%] max-md:-left-[60%] max-md:w-[230%] max-md:mt-14 fill-[#b0b0b0] stroke-white opacity-30 ${className}`}
    >
      {ONDAS_PATHS.map((d, i) => (
        <path key={i} d={d} strokeWidth={1.2} vectorEffect="non-scaling-stroke" style={{ animationDelay: `${-i * 0.45}s` }} />
      ))}
    </svg>
  );
}
