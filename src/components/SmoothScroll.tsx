"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Rolagem suave (Lenis) sincronizada com o ScrollTrigger.
// Quem prefere menos movimento fica com a rolagem nativa.
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const caminho = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.2 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Âncoras da própria página também rolam suave
    const onClick = (ev: MouseEvent) => {
      const link = (ev.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const alvo = document.querySelector(link.getAttribute("href")!);
      if (!alvo) return;
      ev.preventDefault();
      lenis.scrollTo(alvo as HTMLElement, { offset: -20 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Ao trocar de página: começa do topo, ou da seção indicada no endereço (ex.: /investidor#simulador)
  useEffect(() => {
    const lenis = lenisRef.current;
    const alvo = window.location.hash ? document.querySelector(window.location.hash) : null;
    if (alvo) {
      const ir = () => (lenis ? lenis.scrollTo(alvo as HTMLElement, { offset: -20, immediate: true }) : alvo.scrollIntoView());
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        ir();
      });
    } else {
      lenis?.scrollTo(0, { immediate: true });
    }
  }, [caminho]);

  return null;
}
