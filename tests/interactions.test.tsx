import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { ProjectCarousel } from "../components/project-carousel";
import { CloudVisual } from "../components/cloud-visual";
import { cloudDiagram, projects } from "../content/portfolio";

afterEach(cleanup);

test("carrossel mostra um projeto, navega pelos controles e respeita os extremos", () => {
  const view = render(<ProjectCarousel projects={projects} />);
  const previous = view.getByRole("button", { name: "Projeto anterior" }) as HTMLButtonElement;
  const next = view.getByRole("button", { name: "Próximo projeto" }) as HTMLButtonElement;
  assert.equal(previous.disabled, true);
  assert.equal(next.disabled, false);
  assert.ok(view.getByRole("heading", { name: "Portfólio pessoal" }));
  assert.equal(view.queryByRole("heading", { name: "Infraestrutura cloud" }), null);
  assert.equal(view.queryAllByRole("link").length, 0);

  fireEvent.click(next);
  assert.ok(view.getByRole("heading", { name: "Infraestrutura cloud" }));
  assert.match(view.getByRole("status").textContent ?? "", /Projeto 2 de 4/);
  assert.equal(previous.disabled, false);
  const slide = view.getByRole("group", { name: "2 de 4: Infraestrutura cloud" });
  assert.ok(within(slide).getByText("Ilustrativo — espaço para projeto futuro"));

  const last = view.getByRole("button", { name: "Mostrar projeto 4: Segurança e monitoramento" });
  fireEvent.click(last);
  assert.equal(next.disabled, true);
  assert.equal(last.getAttribute("aria-current"), "true");
  fireEvent.click(next);
  assert.match(view.getByRole("status").textContent ?? "", /Projeto 4 de 4/);
  fireEvent.click(previous);
  assert.ok(view.getByRole("heading", { name: "Automação com Python" }));
});

test("teclas direcionais preservam foco e não capturam atalhos modificados", () => {
  const view = render(<ProjectCarousel projects={projects} />);
  const carousel = view.getByRole("region", { name: "Projetos em destaque" });
  carousel.focus();
  fireEvent.keyDown(carousel, { key: "ArrowRight" });
  assert.ok(view.getByRole("heading", { name: "Infraestrutura cloud" }));
  assert.equal(document.activeElement, carousel);
  fireEvent.keyDown(carousel, { key: "ArrowRight", altKey: true });
  assert.ok(view.getByRole("heading", { name: "Infraestrutura cloud" }));
  fireEvent.keyDown(carousel, { key: "ArrowLeft" });
  fireEvent.keyDown(carousel, { key: "ArrowLeft" });
  assert.ok(view.getByRole("heading", { name: "Portfólio pessoal" }));
});

test("deslize horizontal navega; gesto vertical, cancelado e multitoque não navegam", () => {
  const view = render(<ProjectCarousel projects={projects} />);
  const slides = view.container.querySelector(".project-slides")!;
  const start = { clientX: 220, clientY: 100 };
  fireEvent.touchStart(slides, { touches: [start] });
  fireEvent.touchEnd(slides, { changedTouches: [{ clientX: 150, clientY: 230 }] });
  assert.ok(view.getByRole("heading", { name: "Portfólio pessoal" }));

  fireEvent.touchStart(slides, { touches: [start] });
  fireEvent.touchEnd(slides, { changedTouches: [{ clientX: 80, clientY: 110 }] });
  assert.ok(view.getByRole("heading", { name: "Infraestrutura cloud" }));

  fireEvent.touchStart(slides, { touches: [start] });
  fireEvent.touchCancel(slides);
  fireEvent.touchEnd(slides, { changedTouches: [{ clientX: 80, clientY: 110 }] });
  assert.ok(view.getByRole("heading", { name: "Infraestrutura cloud" }));

  fireEvent.touchStart(slides, { touches: [start] });
  fireEvent.touchMove(slides, { touches: [start, { clientX: 300, clientY: 110 }] });
  fireEvent.touchEnd(slides, { changedTouches: [{ clientX: 80, clientY: 110 }] });
  assert.ok(view.getByRole("heading", { name: "Infraestrutura cloud" }));

  fireEvent.touchStart(slides, { touches: [{ clientX: 80, clientY: 100 }] });
  fireEvent.touchEnd(slides, { changedTouches: [{ clientX: 220, clientY: 110 }] });
  assert.ok(view.getByRole("heading", { name: "Portfólio pessoal" }));
});

test("zero ou um projeto não oferecem controles de navegação sem função", () => {
  const view = render(<ProjectCarousel projects={[]} />);
  assert.match(view.container.textContent ?? "", /Novos projetos vão aparecer/);
  assert.equal(view.queryAllByRole("button").length, 0);

  view.rerender(<ProjectCarousel projects={[projects[0]]} />);
  assert.ok(view.getByRole("heading", { name: "Portfólio pessoal" }));
  assert.equal(view.queryAllByRole("button").length, 0);
  assert.equal(view.getByRole("region").hasAttribute("tabindex"), false);
});

test("reduzir a lista após navegar mantém um item válido e aceita lista vazia", () => {
  const view = render(<ProjectCarousel projects={projects} />);
  fireEvent.click(view.getByRole("button", { name: "Mostrar projeto 4: Segurança e monitoramento" }));
  view.rerender(<ProjectCarousel projects={[projects[0]]} />);
  assert.ok(view.getByRole("heading", { name: "Portfólio pessoal" }));
  view.rerender(<ProjectCarousel projects={[]} />);
  assert.match(view.container.textContent ?? "", /Novos projetos vão aparecer/);
});

test("links só aparecem quando cadastrados e imagens reais substituem a ilustração", () => {
  const project = { ...projects[0], repositoryUrl: "https://github.com/example/project", demoUrl: "https://example.com", cover: { ...projects[0].cover, image: "/projects/example.png", alt: "Captura do projeto" } };
  const view = render(<ProjectCarousel projects={[project, projects[1]]} />);
  const links = view.getAllByRole("link");
  assert.equal(links.length, 2);
  for (const link of links) {
    assert.equal(link.getAttribute("target"), "_blank");
    assert.equal(link.getAttribute("rel"), "noopener noreferrer");
  }
  assert.equal(links[0].getAttribute("href"), project.repositoryUrl);
  assert.equal(links[1].getAttribute("href"), project.demoUrl);
  assert.ok(view.getByRole("img", { name: "Captura do projeto" }));
  fireEvent.keyDown(links[0], { key: "ArrowRight" });
  assert.ok(view.getByRole("heading", { name: "Portfólio pessoal" }));
  fireEvent.click(view.getByRole("button", { name: "Próximo projeto" }));
  assert.equal(view.queryAllByRole("link").length, 0);
});

test("diagrama inicia em Infraestrutura e cada camada troca o texto e a seleção", () => {
  const view = render(<CloudVisual />);
  assert.equal(view.getByRole("button", { name: "Infraestrutura" }).getAttribute("aria-pressed"), "true");
  assert.ok(view.getByText(cloudDiagram.notice));
  for (const node of cloudDiagram.nodes) {
    const button = view.getByRole("button", { name: node.label });
    button.focus();
    fireEvent.click(button);
    assert.equal(document.activeElement, button);
    assert.equal(view.getAllByRole("button", { pressed: true }).length, 1);
    assert.equal(button.getAttribute("aria-pressed"), "true");
    const status = view.getByRole("status");
    assert.ok(status.textContent?.includes(node.description));
    assert.ok(status.textContent?.includes(node.security));
    assert.equal(button.getAttribute("aria-controls"), status.id);
  }
});
