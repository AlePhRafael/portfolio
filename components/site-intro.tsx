"use client";

/* The small local PNG is pre-sized; native load/error events control the intro timer. */
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export function SiteIntro({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  const content = useRef<HTMLDivElement>(null);
  const picture = useRef<HTMLImageElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);
  const restoreFocus = useRef(false);
  const active = phase !== "done";
  const finish = useCallback(() => {
    restoreFocus.current = dialog.current?.contains(document.activeElement) ?? false;
    setPhase("done");
  }, []);

  const imageReady = useCallback(() => {
    if (started.current) return;
    started.current = true;
    timers.current.push(setTimeout(() => {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) finish();
      else {
        setPhase("leaving");
        timers.current.push(setTimeout(finish, 300));
      }
    }, 2000));
  }, [finish]);

  useEffect(() => {
    if (!active) return;
    const page = content.current;
    page?.setAttribute("inert", "");
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const overlay = dialog.current;
    document.body.style.overflow = "hidden";
    dialog.current?.focus({ preventScroll: true });
    timers.current.push(setTimeout(finish, 5000));
    if (picture.current?.complete) {
      if (picture.current.naturalWidth > 0) imageReady();
      else finish();
    }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      started.current = false;
      document.body.style.overflow = previousOverflow;
      page?.removeAttribute("inert");
      if (restoreFocus.current || overlay?.contains(document.activeElement)) {
        const target = previousFocus instanceof HTMLElement && previousFocus !== document.body && previousFocus.isConnected
          ? previousFocus : document.querySelector<HTMLElement>("#conteudo");
        target?.focus({ preventScroll: true });
        restoreFocus.current = false;
      }
    };
  }, [active, finish, imageReady]);

  return <>
    <div ref={content} className="site-content">{children}</div>
    {active && <div ref={dialog} className={`site-intro ${phase === "leaving" ? "is-leaving" : ""}`} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="intro-title" onKeyDown={event => {
      if (event.key === "Tab") { event.preventDefault(); dialog.current?.focus(); }
    }}>
      <div className="intro-identity">
        <img ref={picture} className="intro-avatar" src="/brand/hooded-avatar.png" alt="Homem de capuz usando um notebook, em pixel art azul" width={180} height={180} fetchPriority="high" loading="eager" onLoad={imageReady} onError={finish} />
        <p id="intro-title">Aleph Rafael</p>
        <p className="intro-subtitle">Cloud & infraestrutura</p>
        <span className="intro-loader" aria-hidden="true"><i /><i /><i /></span>
      </div>
    </div>}
    <noscript><style>{".site-intro { display: none !important; }"}</style></noscript>
  </>;
}
