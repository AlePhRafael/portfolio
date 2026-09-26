"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Observe a stationary shell so the entrance transform cannot retrigger itself. */
export function ScrollReveal({ children }: { children: ReactNode }) {
  const shell = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = shell.current;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!element || !window.IntersectionObserver) return;
    let observer: IntersectionObserver | undefined;

    function configure() {
      observer?.disconnect();
      element!.removeAttribute("data-reveal");
      if (media?.matches) return;

      const prepare = (rect: DOMRectReadOnly, top: number, bottom: number) => {
        if (element!.contains(document.activeElement)) return;
        if (rect.bottom <= top || rect.top >= bottom) {
          element!.dataset.reveal = rect.bottom <= top ? "above" : "below";
        }
      };
      prepare(element!.getBoundingClientRect(), 0, window.innerHeight);
      observer = new window.IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRect.height > 0) {
            element!.dataset.reveal = "visible";
          } else {
            prepare(entry.boundingClientRect, entry.rootBounds?.top ?? 0, entry.rootBounds?.bottom ?? window.innerHeight);
          }
        }
      }, { threshold: [0, 0.01] });
      observer.observe(element!);
    }

    configure();
    media?.addEventListener("change", configure);
    return () => {
      observer?.disconnect();
      media?.removeEventListener("change", configure);
      element.removeAttribute("data-reveal");
    };
  }, []);

  return <div ref={shell} className="scroll-reveal" onFocusCapture={() => {
    if (shell.current) shell.current.dataset.reveal = "visible";
  }}><div className="scroll-reveal-content">{children}</div></div>;
}
