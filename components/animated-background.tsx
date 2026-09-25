"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { createNetworkRenderer, type NetworkRenderer } from "./network-renderer";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<NetworkRenderer | null>(null);
  const [paused, setPaused] = useState(false);
  const [state, setState] = useState({ supported: false, reducedMotion: true });

  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = createNetworkRenderer(canvasRef.current, setState);
    rendererRef.current = renderer;
    return () => { renderer.dispose(); rendererRef.current = null; };
  }, []);

  function togglePause() {
    const nextPaused = !paused;
    rendererRef.current?.setPaused(nextPaused);
    setPaused(nextPaused);
  }

  return <>
    <div className="network-background" aria-hidden="true"><canvas ref={canvasRef} className="network-canvas" /></div>
    {state.supported && !state.reducedMotion && <button type="button" className="background-toggle" onClick={togglePause}>{paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}<span>{paused ? "Animar fundo" : "Pausar fundo"}</span></button>}
  </>;
}
