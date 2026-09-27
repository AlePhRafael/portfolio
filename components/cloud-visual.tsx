"use client";

import { useId, useState } from "react";
import { Activity, Cloud, Code2, LockKeyhole, ShieldCheck } from "lucide-react";
import { cloudDiagram } from "@/content/portfolio";

const icons = { code: Code2, cloud: Cloud, lock: LockKeyhole, activity: Activity };

export function CloudVisual() {
  const [selected, setSelected] = useState<string>("infrastructure");
  const id = useId();
  const node = cloudDiagram.nodes.find(item => item.id === selected) ?? cloudDiagram.nodes[1];

  return (
    <section className="cloud-explorer" aria-labelledby={`${id}-title`}>
      <div className="explorer-toolbar"><span className="panel-indicator" aria-hidden="true" />Arquitetura conceitual<span className="panel-index" aria-hidden="true">01 — 04</span></div>
      <div className="explorer-heading"><p className="eyebrow">CLOUD & SEGURANÇA</p><h2 id={`${id}-title`}>{cloudDiagram.title}</h2><p>{cloudDiagram.hint}</p></div>
      <div className="cloud-visual">
        <div className="visual-grid" aria-hidden="true" />
        <div className="orbit orbit-outer" aria-hidden="true" />
        <div className="orbit orbit-middle" aria-hidden="true" />
        <div className="core-halo" aria-hidden="true" />
        <div className="explorer-core" aria-hidden="true"><ShieldCheck size={40} strokeWidth={1.2} /></div>
        <div className="cloud-nodes" role="group" aria-label="Camadas da arquitetura">
          {cloudDiagram.nodes.map(item => {
            const Icon = icons[item.icon];
            return <button type="button" className={`cloud-node node-${item.id}`} key={item.id} aria-pressed={selected === item.id} aria-controls={`${id}-description`} onClick={() => setSelected(item.id)}><Icon size={21} strokeWidth={1.5} aria-hidden="true" /><span>{item.label}</span></button>;
          })}
        </div>
      </div>
      <div className="explorer-description" id={`${id}-description`} role="status" aria-live="polite" aria-atomic="true"><h3>{node.label}</h3><p>{node.description}</p><div className="explorer-security"><ShieldCheck size={16} aria-hidden="true" /><p><strong>Olhar de segurança:</strong> {node.security}</p></div></div>
      <p className="explorer-notice">{cloudDiagram.notice}</p>
    </section>
  );
}
