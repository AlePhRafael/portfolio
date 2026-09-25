import { ArrowDown, ArrowRight, ArrowUpRight, Cloud, ShieldCheck, Terminal, Check } from "lucide-react";
import { Github, Linkedin } from "@/components/social-icons";
import { CloudVisual } from "@/components/cloud-visual";
import { portfolio as p, projects } from "@/content/portfolio";
import { ProjectCarousel } from "@/components/project-carousel";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "social-links compact" : "social-links"}>
    <a className={compact ? "social-text" : "button button-primary"} href={p.social.linkedin} {...external} aria-label="LinkedIn de Aleph Rafael (abre em nova aba)"><Linkedin size={17} />{compact ? "LinkedIn" : "Vamos nos conectar"}<ArrowUpRight size={16} /></a>
    <a className={compact ? "social-text" : "button button-secondary"} href={p.social.github} {...external} aria-label="GitHub de Aleph Rafael (abre em nova aba)"><Github size={18} />GitHub<ArrowUpRight size={16} /></a>
  </div>;
}

export default function Home() {
  return <>
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <header className="site-header">
      <div className="container header-inner">
        <a href="#inicio" className="brand" aria-label="Aleph Rafael — início"><span className="monogram">{p.initials}<span>.</span></span><span className="brand-name">{p.name}</span></a>
        <nav aria-label="Navegação principal"><a href="#sobre">Sobre mim</a><a href="#conhecimentos">Conhecimentos</a><a href="#projetos">Projetos</a><a href="#contato" className="nav-contact">Contato <ArrowUpRight size={15} aria-hidden="true" /></a></nav>
      </div>
    </header>
    <main id="conteudo">
      <section id="inicio" className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="availability"><span />{p.availability}</div>
          <p className="eyebrow hero-eyebrow">{p.eyebrow}</p>
          <p className="hero-intro">{p.intro}<span className="intro-line" /></p>
          <h1 id="hero-title">{p.headline[0]}<br /><span>{p.headline[1]}</span></h1>
          <p className="hero-description">{p.description}</p>
          <SocialLinks />
        </div>
        <CloudVisual />
        <div className="hero-bottom"><a href="#conhecimentos"><span className="scroll-icon"><ArrowDown size={14} /></span>Um pouco do meu universo</a><span className="hero-footnote">CURIOSIDADE COMO PONTO DE PARTIDA.</span></div>
      </section>

      <section id="conhecimentos" className="knowledge section-border" aria-labelledby="knowledge-title">
        <div className="container section-space">
          <div className="section-heading"><div><p className="eyebrow"><span>01 /</span> CONHECIMENTOS</p><h2 id="knowledge-title">Duas áreas. Muitas possibilidades.</h2></div><p>Explorando tecnologias que conectam<br className="desktop-break" /> infraestrutura, proteção e código.</p></div>
          <div className="grid gap-5 md:grid-cols-2">
            {p.skills.map((skill) => { const Icon = skill.icon === "cloud" ? Cloud : ShieldCheck; return <article className="skill-card" key={skill.name}>
              <div className="flex items-start justify-between"><span className="skill-icon"><Icon size={27} strokeWidth={1.5} /></span><span className="card-number">{skill.number}</span></div>
              <p className="card-category">{skill.category}</p><h3>{skill.name}</h3><p className="card-description">{skill.description}</p>
              <div className="tags">{skill.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            </article>; })}
          </div>
          <div className="toolbox"><div className="toolbox-label"><Terminal size={17} /><span>Também na minha<br />caixa de ferramentas</span></div><div className="tools-grid">{p.tools.map(tool => <div className="tool" key={tool.name}><span className={`tool-mark ${tool.name === "Tailwind CSS" ? "tailwind-mark" : ""}`}>{tool.mark}</span><div><h3>{tool.name}</h3><p>{tool.description}</p></div></div>)}</div></div>
        </div>
      </section>

      <section id="projetos" className="container projects section-space" aria-labelledby="projects-title">
        <div className="section-heading"><div><p className="eyebrow"><span>02 /</span> PROJETOS</p><h2 id="projects-title">Ideias que ganham forma.</h2></div><p>Um primeiro projeto real.<br className="desktop-break" /> Espaço aberto para os próximos passos.</p></div>
        <ProjectCarousel projects={projects} />
      </section>

      <section id="sobre" className="container about section-space" aria-labelledby="about-title">
        <div><p className="eyebrow"><span>03 /</span> SOBRE MIM</p><h2 id="about-title">{p.about.title}</h2><div className="about-signature"><span className="signature-line" /><span>{p.name}<small>EM CONSTANTE EVOLUÇÃO</small></span></div></div>
        <div className="about-copy">{p.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="about-note"><span><Check size={17} /></span><p>{p.about.note}</p></div></div>
      </section>

      <section id="contato" className="container contact-wrap" aria-labelledby="contact-title">
        <div className="contact-panel"><div className="contact-decoration" aria-hidden="true" /><div className="contact-content"><p className="eyebrow"><span>04 /</span> VAMOS CONVERSAR</p><h2 id="contact-title">{p.contact.title}</h2><p className="contact-description">{p.contact.description}</p><SocialLinks /></div><ArrowUpRight className="contact-arrow" strokeWidth={0.8} aria-hidden="true" /></div>
      </section>
    </main>
    <footer className="container site-footer"><div className="footer-main"><a className="brand" href="#inicio" aria-label="Voltar ao início"><span className="monogram">ar<span>.</span></span><span className="footer-name">{p.name}<small>Cloud, código e novas possibilidades.</small></span></a><SocialLinks compact /></div><div className="footer-bottom"><p>{p.demoNotice}</p><a href="#inicio">Voltar ao topo <ArrowRight size={13} className="-rotate-90" /></a></div></footer>
  </>;
}
