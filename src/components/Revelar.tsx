"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Envolve uma seção: cada elemento marcado com data-revelar sobe e aparece
// quando entra na tela, em sequência.
export default function Revelar({ children, className }: { children: React.ReactNode; className?: string }) {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.batch(raiz.current!.querySelectorAll("[data-revelar]"), {
          start: "top 88%",
          once: true,
          onEnter: (els) =>
            gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }),
        });
      });
    },
    { scope: raiz },
  );

  return (
    <div ref={raiz} className={className}>
      {children}
    </div>
  );
}
