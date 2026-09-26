import assert from "node:assert/strict";
import { afterEach, test, type TestContext } from "node:test";
import { act, cleanup, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { ScrollReveal } from "../components/scroll-reveal";

afterEach(cleanup);

function environment(t: TestContext, reduced = false) {
  let callback: IntersectionObserverCallback;
  let disconnects = 0;
  const listeners = new Set<() => void>();
  const media = {
    matches: reduced,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  };
  const rect = (top: number, bottom: number) => ({ top, bottom, height: bottom - top } as DOMRect);
  const originals = ["matchMedia", "IntersectionObserver"].map(key => [key, Object.getOwnPropertyDescriptor(window, key)] as const);
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => media });
  Object.defineProperty(window, "IntersectionObserver", { configurable: true, value: class {
    constructor(cb: IntersectionObserverCallback) { callback = cb; }
    observe() {}
    disconnect() { disconnects++; }
  } });
  t.mock.method(HTMLElement.prototype, "getBoundingClientRect", () => rect(1200, 1600));
  t.after(() => {
    cleanup();
    for (const [key, original] of originals) {
      if (original) Object.defineProperty(window, key, original);
      else Reflect.deleteProperty(window, key);
    }
  });
  return {
    listeners,
    get disconnects() { return disconnects; },
    intersect(top: number, bottom: number, intersecting: boolean, height = 100) {
      act(() => callback([{ isIntersecting: intersecting, boundingClientRect: rect(top, bottom), rootBounds: rect(0, 800), intersectionRect: rect(0, height) } as IntersectionObserverEntry], {} as IntersectionObserver));
    },
    reduce(value: boolean) { act(() => { media.matches = value; listeners.forEach(listener => listener()); }); },
  };
}

test("replays from both edges only after a complete exit, including tall blocks", t => {
  const env = environment(t);
  const view = render(<ScrollReveal><p>Projeto</p></ScrollReveal>);
  const shell = view.container.firstElementChild as HTMLElement;
  assert.equal(shell.dataset.reveal, "below");
  env.intersect(800, 1200, true, 0);
  assert.equal(shell.dataset.reveal, "below");
  env.intersect(780, 1180, true, 20);
  assert.equal(shell.dataset.reveal, "visible");
  env.intersect(-100, 1200, true);
  assert.equal(shell.dataset.reveal, "visible");
  env.intersect(-401, -1, false);
  assert.equal(shell.dataset.reveal, "above");
  env.intersect(-390, 10, true, 10);
  assert.equal(shell.dataset.reveal, "visible");
  env.intersect(801, 1201, false);
  assert.equal(shell.dataset.reveal, "below");
  view.unmount();
  assert.ok(env.disconnects > 0);
  assert.equal(env.listeners.size, 0);
});

test("keyboard focus immediately reveals content and prevents hiding focused controls", t => {
  const env = environment(t);
  const view = render(<ScrollReveal><button>Contato</button></ScrollReveal>);
  const shell = view.container.firstElementChild as HTMLElement;
  act(() => view.getByRole("button").focus());
  assert.equal(shell.dataset.reveal, "visible");
  env.intersect(1200, 1600, false);
  assert.equal(shell.dataset.reveal, "visible");
});

test("reduced motion keeps content visible and responds to preference changes", t => {
  const env = environment(t, true);
  const view = render(<ScrollReveal>Estudos</ScrollReveal>);
  const shell = view.container.firstElementChild as HTMLElement;
  assert.equal(shell.dataset.reveal, undefined);
  env.reduce(false);
  assert.equal(shell.dataset.reveal, "below");
  env.reduce(true);
  assert.equal(shell.dataset.reveal, undefined);
  assert.ok(env.disconnects > 0);
});

test("server rendering and browsers without IntersectionObserver leave content visible", () => {
  assert.doesNotMatch(renderToString(<ScrollReveal>Projeto</ScrollReveal>), /data-reveal/);
  const view = render(<ScrollReveal>Projeto</ScrollReveal>);
  assert.equal(view.container.firstElementChild?.hasAttribute("data-reveal"), false);
});
