// Camadas que dão vida ao isométrico: luminárias que acendem "por voz", luz do sol passando,
// vapor do café e o brilho do notebook. Tudo em % da imagem, então acompanha o zoom da abertura.
// As animações ficam no globals.css e só rodam com prefers-reduced-motion: no-preference.

const luz = (x: number, y: number, w: number, h: number) => ({
  left: `${x - w / 2}%`,
  top: `${y}%`,
  width: `${w}%`,
  height: `${h}%`,
});

export default function IsoVida() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Sol atravessando o living, recortado no piso */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: "polygon(8.3% 84.3%, 41.9% 98.6%, 75% 86.2%, 70.9% 79.7%, 49% 73.3%, 22.2% 76%)" }}
      >
        <div className="iso-sol absolute inset-y-0 -left-1/2 w-[200%]" />
      </div>

      {/* Luminária de arco do mezanino (canto de leitura) */}
      <div className="iso-luz-mezanino">
        <div className="absolute rounded-[50%] iso-cone" style={luz(47.6, 33.2, 13, 15)} />
        <div className="absolute rounded-full iso-lampada" style={luz(49.7, 32.6, 2.2, 1.6)} />
      </div>

      {/* Arandela do home office */}
      <div className="iso-luz-escritorio">
        <div className="absolute rounded-[50%] iso-cone" style={luz(59.6, 55.9, 9, 9)} />
        <div className="absolute rounded-full iso-lampada" style={luz(60.4, 55.6, 1.6, 1.2)} />
      </div>

      {/* Reflexo do notebook no rosto */}
      <div className="iso-tela absolute rounded-full" style={luz(64.5, 65.6, 3, 3.4)} />

      {/* Vapor do café */}
      <div className="absolute" style={{ left: "63%", top: "63%", width: "1.6%", height: "5%" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="iso-vapor absolute bottom-0 left-1/2 h-1/2 w-full rounded-full" style={{ animationDelay: `${i * 1.2}s` }} />
        ))}
      </div>
    </div>
  );
}
