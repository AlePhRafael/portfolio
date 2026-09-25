import Image from "next/image";
import { Cloud, Code2, Database, Globe, LockKeyhole, Server, ShieldCheck } from "lucide-react";
import type { Project } from "@/content/portfolio";

export function ProjectCover({ cover }: { cover: Project["cover"] }) {
  if (cover.image) {
    return <div className="project-cover project-cover-image"><Image src={cover.image} alt={cover.alt} fill sizes="(max-width: 800px) 100vw, 560px" /></div>;
  }

  return (
    <div className={`project-cover cover-${cover.variant}`} role="img" aria-label={cover.alt}>
      <div className="cover-grid" aria-hidden="true" />
      <div className="cover-art" aria-hidden="true">
        {cover.variant === "portfolio" && (
          <div className="browser-art">
            <div className="browser-art-bar"><i /><i /><i /><span>aleph / portfólio</span></div>
            <div className="browser-art-body">
              <span className="art-monogram">ar<span>.</span></span>
              <div className="art-headline">Cloud.<br /><span>Código. Conexões.</span></div>
              <div className="art-text-line" /><div className="art-text-line short" />
              <div className="art-button" />
              <div className="art-mini-cards"><div><Cloud /><span>Cloud</span></div><div><ShieldCheck /><span>Segurança</span></div></div>
            </div>
          </div>
        )}
        {cover.variant === "cloud" && (
          <div className="cloud-art"><div className="art-main-icon"><Cloud size={68} strokeWidth={1.2} /></div><div className="art-connector" /><div className="art-services"><div><Server /><span>Computação</span></div><div><Globe /><span>Redes</span></div><div><Database /><span>Dados</span></div></div></div>
        )}
        {cover.variant === "python" && (
          <div className="terminal-art"><div className="terminal-art-bar"><Code2 size={16} /><span>ideia_de_automacao.py</span></div><pre><code><span className="code-muted"># Exemplo ilustrativo</span>{"\n\n"}<span className="code-blue">def</span>{" organizar(eventos):\n    "}<span className="code-blue">return</span>{" sorted(eventos)\n\n"}<span className="code-muted"># Aprender. Automatizar.</span></code></pre><div className="terminal-art-footer"><span className="terminal-cursor" />Espaço para uma próxima ideia</div></div>
        )}
        {cover.variant === "security" && (
          <div className="security-art"><div className="security-ring"><ShieldCheck size={76} strokeWidth={1.1} /></div><div className="security-layers"><span><LockKeyhole size={15} />Identidade</span><span>Acessos</span><span>Observação</span></div></div>
        )}
      </div>
      <span className="cover-caption" aria-hidden="true">{cover.variant === "portfolio" ? "UMA IDEIA QUE GANHOU FORMA" : "UM ESPAÇO PARA O QUE VEM A SEGUIR"}</span>
    </div>
  );
}
