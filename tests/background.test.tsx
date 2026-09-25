import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { StrictMode } from "react";
import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { AnimatedBackground } from "../components/animated-background";
import { createNetworkRenderer, networkSettings } from "../components/network-renderer";
import Home from "../app/page";

let restoreEnvironment: (() => void) | undefined;
afterEach(() => { cleanup(); restoreEnvironment?.(); restoreEnvironment = undefined; });

function browserEnvironment({ reduced = false, supported = true, throws = false, width = 1440, height = 900, pixelRatio = 2 } = {}) {
  const originals: { target: object; key: string; descriptor?: PropertyDescriptor }[] = [];
  function define(target: object, key: string, value: unknown) {
    originals.push({ target, key, descriptor: Object.getOwnPropertyDescriptor(target, key) });
    Object.defineProperty(target, key, { value, configurable: true, writable: true });
  }
  let requestId = 0;
  const frames = new Map<number, FrameRequestCallback>();
  const motionListeners = new Set<() => void>();
  const media = {
    matches: reduced,
    addEventListener(_event: string, callback: () => void) { motionListeners.add(callback); },
    removeEventListener(_event: string, callback: () => void) { motionListeners.delete(callback); },
  };
  const drawing = { clears: 0, arcs: [] as number[][], edges: [] as number[][], start: [] as number[] };
  const context = {
    clearRect() { drawing.clears++; drawing.arcs = []; drawing.edges = []; },
    beginPath() {},
    moveTo(x: number, y: number) { drawing.start = [x, y]; },
    lineTo(x: number, y: number) { drawing.edges.push([...drawing.start, x, y]); },
    stroke() {},
    arc(...args: number[]) { drawing.arcs.push(args); },
    fill() {},
    setTransform() {},
  };
  define(window, "matchMedia", () => media);
  define(window, "requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++requestId, callback); return requestId; });
  define(window, "cancelAnimationFrame", (id: number) => { frames.delete(id); });
  define(window, "innerWidth", width);
  define(window, "innerHeight", height);
  define(window, "devicePixelRatio", pixelRatio);
  define(document, "hidden", false);
  define(window.HTMLCanvasElement.prototype, "getContext", () => {
    if (throws) throw new Error("Canvas unavailable");
    return supported ? context : null;
  });
  restoreEnvironment = () => {
    for (const original of originals.reverse()) {
      if (original.descriptor) Object.defineProperty(original.target, original.key, original.descriptor);
      else Reflect.deleteProperty(original.target, original.key);
    }
  };

  return {
    frames, drawing, motionListeners,
    tick(timestamp: number) { const scheduled = [...frames.values()]; frames.clear(); scheduled.forEach(callback => callback(timestamp)); },
    setReduced(value: boolean) { media.matches = value; motionListeners.forEach(callback => callback()); },
    setHidden(value: boolean) { Object.defineProperty(document, "hidden", { value, configurable: true }); document.dispatchEvent(new window.Event("visibilitychange")); },
    resize(newWidth: number, newHeight: number) { window.innerWidth = newWidth; window.innerHeight = newHeight; window.dispatchEvent(new window.Event("resize")); },
  };
}

test("pausa congela o fundo, mantém foco no controle e retoma sem persistência", () => {
  const env = browserEnvironment();
  const view = render(<AnimatedBackground />);
  assert.equal(env.frames.size, 1);
  const pause = view.getByRole("button", { name: "Pausar fundo" });
  pause.focus();
  fireEvent.click(pause);
  assert.equal(env.frames.size, 0);
  const resume = view.getByRole("button", { name: "Animar fundo" });
  assert.equal(document.activeElement, resume);
  const clears = env.drawing.clears;
  env.tick(1000);
  assert.equal(env.drawing.clears, clears);
  fireEvent.click(resume);
  assert.equal(env.frames.size, 1);
  view.unmount();
  assert.equal(env.frames.size, 0);
  render(<AnimatedBackground />);
  assert.ok(document.querySelector("button")?.textContent?.includes("Pausar fundo"));
});

test("movimento reduzido desenha uma rede estática e responde à preferência do sistema", () => {
  const env = browserEnvironment({ reduced: true });
  const view = render(<AnimatedBackground />);
  assert.equal(env.frames.size, 0);
  assert.equal(view.queryByRole("button"), null);
  assert.equal(env.drawing.arcs.length, networkSettings.desktopPoints);
  assert.equal(view.container.querySelector("canvas")?.parentElement?.getAttribute("aria-hidden"), "true");
  act(() => env.setReduced(false));
  assert.ok(view.getByRole("button", { name: "Pausar fundo" }));
  assert.equal(env.frames.size, 1);
  act(() => env.setReduced(true));
  assert.equal(view.queryByRole("button"), null);
  assert.equal(env.frames.size, 0);
});

test("aba oculta suspende desenho e não desfaz a escolha de pausa ao voltar", () => {
  const env = browserEnvironment();
  const view = render(<AnimatedBackground />);
  env.tick(0);
  env.tick(40);
  const clears = env.drawing.clears;
  env.setHidden(true);
  assert.equal(env.frames.size, 0);
  env.resize(390, 844);
  env.tick(9000);
  assert.equal(env.drawing.clears, clears);
  env.setHidden(false);
  assert.equal(env.frames.size, 1);
  assert.equal(env.drawing.arcs.length, networkSettings.mobilePoints);
  fireEvent.click(view.getByRole("button", { name: "Pausar fundo" }));
  env.setHidden(true);
  env.setHidden(false);
  assert.equal(env.frames.size, 0);
  assert.ok(view.getByRole("button", { name: "Animar fundo" }));
});

test("Canvas indisponível ou com erro mantém o gradiente e não oferece um controle sem função", () => {
  browserEnvironment({ supported: false });
  const view = render(<AnimatedBackground />);
  assert.ok(view.container.querySelector(".network-background"));
  assert.equal(view.queryByRole("button"), null);
  view.unmount();
  restoreEnvironment?.();
  const env = browserEnvironment({ throws: true });
  render(<AnimatedBackground />);
  assert.equal(document.querySelector("button"), null);
  assert.equal(env.frames.size, 0);
});

test("resolução e quantidade de pontos acompanham as quatro larguras previstas", () => {
  const env = browserEnvironment();
  const canvas = document.createElement("canvas");
  const renderer = createNetworkRenderer(canvas, () => {});
  renderer.setPaused(true);
  for (const width of [320, 390, 768, 1440]) {
    env.resize(width, 900);
    assert.equal(canvas.width, width * networkSettings.maxPixelRatio);
    assert.equal(canvas.height, 900 * networkSettings.maxPixelRatio);
    assert.equal(env.drawing.arcs.length, width < networkSettings.mobileBreakpoint ? 22 : 45);
    assert.ok(env.drawing.arcs.every(([x, y]) => x >= 0 && x <= width && y >= 0 && y <= 900));
    const degree = new Map<string, number>();
    for (const [x1, y1, x2, y2] of env.drawing.edges) {
      for (const point of [`${x1},${y1}`, `${x2},${y2}`]) degree.set(point, (degree.get(point) ?? 0) + 1);
    }
    assert.ok([...degree.values()].every(count => count <= 3));
    assert.equal(env.frames.size, 0);
  }
  renderer.dispose();
});

test("limita desenhos a 30 fps e remove callbacks e eventos no cleanup", () => {
  const env = browserEnvironment();
  const canvas = document.createElement("canvas");
  const renderer = createNetworkRenderer(canvas, () => {});
  const initialClears = env.drawing.clears;
  for (let time = 0; time <= 1000; time++) env.tick(time);
  const renderedFrames = env.drawing.clears - initialClears;
  assert.ok(renderedFrames >= 29 && renderedFrames <= 30);
  renderer.dispose();
  const clears = env.drawing.clears;
  assert.equal(env.frames.size, 0);
  assert.equal(env.motionListeners.size, 0);
  env.resize(320, 800);
  env.setHidden(true);
  env.setHidden(false);
  env.setReduced(true);
  env.tick(5000);
  assert.equal(env.drawing.clears, clears);
});

test("Strict Mode não duplica ciclos de animação", () => {
  const env = browserEnvironment();
  const view = render(<StrictMode><AnimatedBackground /></StrictMode>);
  assert.equal(env.frames.size, 1);
  assert.equal(env.motionListeners.size, 1);
  view.unmount();
  assert.equal(env.frames.size, 0);
  assert.equal(env.motionListeners.size, 0);
});

test("fundo coexiste com carrossel, diagrama e links sociais", () => {
  browserEnvironment();
  const view = render(<><AnimatedBackground /><Home /></>);
  fireEvent.click(view.getByRole("button", { name: "Pausar fundo" }));
  const carousel = view.getByRole("region", { name: "Projetos em destaque" });
  fireEvent.click(within(carousel).getByRole("button", { name: "Próximo projeto" }));
  assert.ok(within(carousel).getByRole("heading", { name: "Infraestrutura cloud" }));
  fireEvent.click(view.getByRole("button", { name: "Monitoramento" }));
  assert.equal(view.getByRole("button", { name: "Monitoramento" }).getAttribute("aria-pressed"), "true");
  for (const link of view.getAllByRole("link", { name: /GitHub de Aleph Rafael/ })) assert.equal(link.getAttribute("href"), "https://github.com/AlePhRafael");
  assert.equal(view.getByRole("link", { name: "Projetos" }).getAttribute("href"), "#projetos");
});
