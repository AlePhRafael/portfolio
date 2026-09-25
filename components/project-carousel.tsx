"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Pause, Play } from "lucide-react";
import type { Project } from "@/content/portfolio";
import { ProjectCover } from "./project-cover";

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [motionOverride, setMotionOverride] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const carouselId = useId();
  const current = Math.min(selected, Math.max(0, projects.length - 1));
  const multiple = projects.length > 1;

  const playbackEnabled = !paused && (!reducedMotion || motionOverride);
  const playing = multiple && playbackEnabled && !hovered && !focused && !touching && !hidden;

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const updateMotion = () => { setReducedMotion(media?.matches ?? false); setMotionOverride(false); };
    const updateVisibility = () => setHidden(document.hidden);
    updateMotion();
    updateVisibility();
    media?.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media?.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setSelected((current + 1) % projects.length), 6000);
    return () => window.clearTimeout(timer);
  }, [playing, current, projects.length]);

  function togglePlayback() {
    if (playbackEnabled) setPaused(true);
    else { setPaused(false); setMotionOverride(true); }
  }

  function move(direction: number) {
    setSelected(Math.max(0, Math.min(projects.length - 1, current + direction)));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!multiple || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if ((event.target as HTMLElement).closest("a, input, textarea, select")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    touchStart.current = multiple && event.touches.length === 1 && !(event.target as HTMLElement).closest("a, button")
      ? { x: touch.clientX, y: touch.clientY } : null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
  }

  if (!projects.length) return <p className="projects-empty">Novos projetos vão aparecer por aqui. Enquanto isso, conheça minhas áreas de interesse acima.</p>;

  return (
    <div className="project-carousel" role="region" aria-roledescription="carrossel" aria-label="Projetos em destaque" aria-describedby={multiple ? `${carouselId}-hint` : undefined} tabIndex={multiple ? 0 : undefined} onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onTouchStartCapture={() => setTouching(true)} onTouchEndCapture={() => setTouching(false)} onTouchCancelCapture={() => setTouching(false)}>
      <div className="project-slides" id={`${carouselId}-slides`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { touchStart.current = null; }} onTouchMove={(event) => { if (event.touches.length > 1) touchStart.current = null; }}>
        {projects.map((project, index) => (
          <div key={project.id} className="project-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${projects.length}: ${project.title}`} hidden={index !== current}>
            <ProjectCover cover={project.cover} />
            <div className="project-copy">
              <p className={`project-status ${project.status === "real" ? "status-real" : "status-illustrative"}`}><span />{project.status === "real" ? "Projeto real" : "Ilustrativo — espaço para projeto futuro"}</p>
              <p className="eyebrow project-category">{project.category}</p>
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="tags project-tags" aria-label="Tecnologias">{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</div>
              {project.details?.length ? <div className="project-details"><h4>Por dentro do projeto</h4><ul>{project.details.map(detail => <li key={detail}><Check size={15} aria-hidden="true" /><span>{detail}</span></li>)}</ul></div> : null}
              {(project.repositoryUrl || project.demoUrl) && <div className="project-links">{project.repositoryUrl && <a className="button button-secondary" href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">Repositório<span className="sr-only"> (abre em nova aba)</span><ArrowUpRight size={16} aria-hidden="true" /></a>}{project.demoUrl && <a className="button button-primary" href={project.demoUrl} target="_blank" rel="noopener noreferrer">Ver demonstração<span className="sr-only"> (abre em nova aba)</span><ArrowUpRight size={16} aria-hidden="true" /></a>}</div>}
            </div>
          </div>
        ))}
      </div>
      {multiple && <>
        <div className="carousel-controls">
          <p className="carousel-counter" aria-hidden="true"><span>{String(current + 1).padStart(2, "0")}</span> / {String(projects.length).padStart(2, "0")}</p>
          <div className="carousel-dots" role="group" aria-label="Escolher projeto">{projects.map((project, index) => <button key={project.id} type="button" aria-label={`Mostrar projeto ${index + 1}: ${project.title}`} aria-current={index === current ? "true" : undefined} aria-controls={`${carouselId}-slides`} onClick={() => setSelected(index)}><span /></button>)}</div>
          <div className="carousel-arrows"><button type="button" className="icon-button" aria-label={playbackEnabled ? "Pausar projetos" : "Retomar projetos"} onClick={togglePlayback}>{playbackEnabled ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}</button><button type="button" className="icon-button" aria-label="Projeto anterior" aria-controls={`${carouselId}-slides`} disabled={current === 0} onClick={() => move(-1)}><ArrowLeft size={20} aria-hidden="true" /></button><button type="button" className="icon-button" aria-label="Próximo projeto" aria-controls={`${carouselId}-slides`} disabled={current === projects.length - 1} onClick={() => move(1)}><ArrowRight size={20} aria-hidden="true" /></button></div>
        </div>
        <p className="carousel-hint" id={`${carouselId}-hint`}>Explore pelas setas, pelo teclado ou deslize no celular.</p>
        <p className="sr-only" role="status" aria-live={playing ? "off" : "polite"} aria-atomic="true">Projeto {current + 1} de {projects.length}: {projects[current].title}.</p>
      </>}
    </div>
  );
}
