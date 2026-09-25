import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { SiteIntro } from "../components/site-intro";

afterEach(cleanup);

function renderIntro() {
  return render(<SiteIntro><main id="conteudo" tabIndex={-1}>Portfólio</main></SiteIntro>);
}

test("intro waits for the image, displays for two seconds and restores interaction", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const view = renderIntro();
  assert.equal(document.body.style.overflow, "hidden");
  assert.equal(view.container.querySelector(".site-content")?.hasAttribute("inert"), true);
  assert.equal(document.activeElement, view.getByRole("dialog"));
  act(() => t.mock.timers.tick(500));
  fireEvent.load(view.getByRole("img"));
  act(() => t.mock.timers.tick(1999));
  assert.equal(view.getByRole("dialog").classList.contains("is-leaving"), false);
  act(() => t.mock.timers.tick(1));
  assert.equal(view.getByRole("dialog").classList.contains("is-leaving"), true);
  act(() => t.mock.timers.tick(300));
  assert.equal(view.queryByRole("dialog"), null);
  assert.equal(document.body.style.overflow, "");
  assert.equal(view.container.querySelector(".site-content")?.hasAttribute("inert"), false);
  assert.equal(document.activeElement, view.getByRole("main"));
});

test("image error releases the site immediately; a new mount repeats intro", () => {
  for (let attempt = 0; attempt < 2; attempt++) {
    const view = renderIntro();
    assert.equal(view.queryByRole("button"), null);
    fireEvent.error(view.getByRole("img"));
    assert.equal(view.queryByRole("dialog"), null);
    assert.equal(document.body.style.overflow, "");
    view.unmount();
  }
});

test("intro has a five-second ceiling and cleans up on unmount", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const view = renderIntro();
  act(() => t.mock.timers.tick(5000));
  assert.equal(view.queryByRole("dialog"), null);
  view.unmount();
  const second = renderIntro();
  fireEvent.load(second.getByRole("img"));
  second.unmount();
  assert.equal(document.body.style.overflow, "");
  act(() => t.mock.timers.tick(10000));
});

test("reduced motion removes the exit delay and Tab remains on the opening screen", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const original = Object.getOwnPropertyDescriptor(window, "matchMedia");
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: true }) });
  t.after(() => { if (original) Object.defineProperty(window, "matchMedia", original); else Reflect.deleteProperty(window, "matchMedia"); });
  const view = renderIntro();
  fireEvent.keyDown(view.getByRole("dialog"), { key: "Tab", shiftKey: true });
  assert.equal(document.activeElement, view.getByRole("dialog"));
  fireEvent.load(view.getByRole("img"));
  act(() => t.mock.timers.tick(2000));
  assert.equal(view.queryByRole("dialog"), null);
});
