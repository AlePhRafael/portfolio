import { ArrowDown, ArrowRight, ArrowUpRight, Cloud, ShieldCheck, Terminal, Check } from "lucide-react";
import { Github, Linkedin } from "@/components/social-icons";
import { CloudVisual } from "@/components/cloud-visual";
import { portfolio as p, projects } from "@/content/portfolio";
import { BrandAvatar } from "@/components/brand-avatar";
import { ProjectCarousel } from "@/components/project-carousel";

import { TechnologyIcon } from "@/components/technology-icon";
import { ScrollReveal } from "@/components/scroll-reveal";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "social-links compact" : "social-links"}>
    <a className={compact ? "social-text" : "button button-primary"} href={p.social.linkedin} {...external} aria-label="LinkedIn de Aleph Rafael (abre em nova aba)"><Linkedin size={17} />{compact ? "LinkedIn" : "Vamos nos conectar"}<ArrowUpRight size={16} /></a>
    <a className={compact ? "social-text" : "button button-secondary"} href={p.social.github} {...external} aria-label="GitHub de Aleph Rafael (abre em nova aba)"><Github size={18} />GitHub<ArrowUpRight size={16} /></a>
  </div>;
}

export default function Home() {
  const realProjects = projects.filter(project => project.status === "real");
  const plannedProjects = projects.filter(project => project.status === "illustrative");
  return <>
    <header className="site-header">
      <div className="container header-inner">
        <a href="#inicio" className="brand" aria-label="Aleph Rafael — início"><BrandAvatar /><span className="brand-name">{p.name}</span></a>
        <nav aria-label="Navegação principal"><a href="#projetos">Projetos</a><a href="#conhecimentos">Conhecimentos</a><a href="#sobre">Sobre mim</a><a href="#contato" className="nav-contact">Contato <ArrowUpRight size={15} aria-hidden="true" /></a></nav>
      </div>
    </header>
    <main id="conteudo" tabIndex={-1}>
      <section id="inicio" className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="availability"><span />{p.availability}</div>
          <p className="eyebrow hero-eyebrow">{p.eyebrow}</p>
          <p className="hero-intro">{p.intro}<span className="intro-line" /></p>
          <h1 id="hero-title">{p.headline[0]}<br /><span>{p.headline[1]}</span></h1>
          <p className="hero-description">{p.description}</p>
          <div className="social-links">
            <a className="button button-primary" href="#projetos">Ver meu projeto<ArrowDown size={17} aria-hidden="true" /></a>
            <a className="button button-secondary" href={p.social.linkedin} {...external} aria-label="LinkedIn de Aleph Rafael (abre em nova aba)"><Linkedin size={17} aria-hidden="true" />LinkedIn<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <CloudVisual />
        <div className="hero-bottom"><a href="#projetos"><span className="scroll-icon"><ArrowDown size={14} /></span>Conheça meu primeiro projeto</a><span className="hero-footnote">APRENDER, CONSTRUIR E DOCUMENTAR.</span></div>
      </section>

      <section id="projetos" className="container projects section-space" aria-labelledby="projects-title">
        <ScrollReveal><div className="section-heading"><div><p className="eyebrow"><span>01 /</span> PROJETOS</p><h2 id="projects-title">O que já construí.</h2></div><p>Meu primeiro projeto, da interface<br className="desktop-break" /> aos testes de interação.</p></div></ScrollReveal>
        <ScrollReveal><ProjectCarousel projects={realProjects} /></ScrollReveal>
        {plannedProjects.length > 0 && <section className="planned-studies" aria-labelledby="studies-title">
          <ScrollReveal><div className="studies-heading"><h3 id="studies-title">Próximos estudos</h3><p>Ideias planejadas para praticar. Estes laboratórios ainda não foram realizados.</p></div></ScrollReveal>
          <div className="study-grid">{plannedProjects.map(project => <ScrollReveal key={project.id}><article className="study-card">
            <p className="study-status">Planejado</p><h4>{project.title}</h4><p>{project.description}</p>
            <div className="tags">{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</div>
          </article></ScrollReveal>)}</div>
        </section>}
      </section>

      <section id="conhecimentos" className="knowledge section-border" aria-labelledby="knowledge-title">
        <div className="container section-space">
          <ScrollReveal><div className="section-heading"><div><p className="eyebrow"><span>02 /</span> CONHECIMENTOS</p><h2 id="knowledge-title">Minha base e meus próximos passos.</h2></div><p>Tecnologias que domino<br className="desktop-break" /> e temas que quero estudar.</p></div></ScrollReveal>
          <ScrollReveal><div className="toolbox"><div className="toolbox-label"><Terminal size={17} /><span>Tecnologias<br />que domino</span></div><div className="tools-grid">{p.tools.map(tool => <div className="tool" key={tool.name}><span className="tool-mark"><TechnologyIcon name={tool.icon} /></span><div><h3>{tool.name}</h3><p>{tool.description}</p></div></div>)}</div></div></ScrollReveal>
          <ScrollReveal><h3 className="interests-title">Interesses de estudo</h3></ScrollReveal>
          <div className="grid gap-5 md:grid-cols-2">
            {p.skills.map((skill) => { const Icon = skill.icon === "cloud" ? Cloud : ShieldCheck; return <ScrollReveal key={skill.name}><article className="skill-card">
              <div className="flex items-start justify-between"><span className="skill-icon"><Icon size={27} strokeWidth={1.5} /></span><span className="card-number">{skill.number}</span></div>
              <p className="card-category">{skill.category}</p><h3>{skill.name}</h3><p className="card-description">{skill.description}</p>
              <div className="tags">{skill.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            </article></ScrollReveal>; })}
          </div>

        </div>
      </section>

      <section id="sobre" className="container about section-space" aria-labelledby="about-title">
        <ScrollReveal><div><p className="eyebrow"><span>03 /</span> SOBRE MIM</p><h2 id="about-title">{p.about.title}</h2><div className="about-signature"><span className="signature-line" /><span>{p.name}<small>EM CONSTANTE EVOLUÇÃO</small></span></div></div></ScrollReveal>
        <ScrollReveal><div className="about-copy">{p.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="about-note"><span><Check size={17} /></span><p>{p.about.note}</p></div></div></ScrollReveal>
      </section>

      <section id="contato" className="container contact-wrap" aria-labelledby="contact-title">
        <ScrollReveal><div className="contact-panel"><svg className="contact-network" viewBox="0 0 360 320" fill="none" aria-hidden="true"><path d="M36 160H132L212 80H324M132 160L212 240H324M212 80V240M212 160H324" /><circle cx="36" cy="160" r="6" /><circle cx="132" cy="160" r="9" /><circle cx="212" cy="80" r="6" /><circle cx="212" cy="240" r="6" /><circle cx="324" cy="80" r="4" /><circle cx="324" cy="160" r="4" /><circle cx="324" cy="240" r="4" /></svg><div className="contact-content"><p className="eyebrow"><span>04 /</span> VAMOS CONVERSAR</p><h2 id="contact-title">{p.contact.title}</h2><p className="contact-description">{p.contact.description}</p><SocialLinks /></div></div></ScrollReveal>
      </section>
    </main>
    <footer className="container site-footer"><div className="footer-main"><a className="brand" href="#inicio" aria-label="Voltar ao início"><BrandAvatar /><span className="footer-name">{p.name}<small>Cloud e infraestrutura · Em formação.</small></span></a><SocialLinks compact /></div><div className="footer-bottom"><p>{p.footerNote}</p><a href="#inicio">Voltar ao topo <ArrowRight size={13} className="-rotate-90" /></a></div></footer>
  </>;
}
