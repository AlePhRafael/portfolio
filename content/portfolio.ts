export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  status: "real" | "illustrative";
  cover: {
    variant: "portfolio" | "cloud" | "python" | "security";
    alt: string;
    image?: string;
  };
  details?: string[];
  repositoryUrl?: string;
  demoUrl?: string;
};

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "Portfólio pessoal",
    category: "DESENVOLVIMENTO WEB",
    description: "Meu primeiro projeto: um site para apresentar meu objetivo profissional e reunir o que estou construindo. Desenvolvi uma interface responsiva com componentes reutilizáveis, navegação acessível e testes de interação.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "real",
    cover: { variant: "portfolio", image: "/projects/portfolio.png", alt: "Captura real do portfólio de Aleph Rafael, com apresentação e diagrama conceitual de cloud." },
    details: [
      "Problema: reunir minha apresentação, meu trabalho e meus canais de contato em um único lugar.",
      "Implementação: Next.js, TypeScript e Tailwind CSS, com layout responsivo e componentes interativos.",
      "Prática neste projeto: organização do conteúdo, navegação por teclado e toque, movimento reduzido e testes automatizados.",
    ],
  },
  {
    id: "cloud-futuro",
    title: "Infraestrutura cloud",
    category: "CLOUD & INFRAESTRUTURA",
    description: "Planejo montar um laboratório de redes, computação e armazenamento na nuvem e documentar as decisões da arquitetura.",
    technologies: ["AWS", "Redes", "Infraestrutura"],
    status: "illustrative",
    cover: { variant: "cloud", alt: "Ilustração conceitual de uma nuvem conectada a três serviços de infraestrutura." },
  },
  {
    id: "python-futuro",
    title: "Automação com Python",
    category: "CÓDIGO & AUTOMAÇÃO",
    description: "Quero criar um script para organizar logs fictícios e registrar exemplos de uso e aprendizados com Python.",
    technologies: ["Python", "Scripts", "Análise de logs"],
    status: "illustrative",
    cover: { variant: "python", alt: "Ilustração de um terminal com um pequeno exemplo de organização de eventos em Python." },
  },
  {
    id: "seguranca-futuro",
    title: "Segurança e monitoramento",
    category: "CIBERSEGURANÇA",
    description: "Pretendo estudar identidades, permissões e logs em um laboratório e documentar as medidas de proteção exploradas.",
    technologies: ["Identidade e acesso", "Logs", "Segurança"],
    status: "illustrative",
    cover: { variant: "security", alt: "Ilustração de um escudo com camadas de identidade, acesso e monitoramento." },
  },
];

export const cloudDiagram = {
  title: "Explore as camadas da nuvem",
  notice: "Arquitetura conceitual · Sem implantação real",
  hint: "Selecione uma camada para entender seu papel.",
  nodes: [
    {
      id: "application", label: "Aplicação", icon: "code",
      description: "É a interface e o código que entregam uma função para quem usa o sistema.",
      security: "Validar entradas e manter segredos fora do código enviado ao navegador.",
    },
    {
      id: "infrastructure", label: "Infraestrutura", icon: "cloud",
      description: "Computação, redes e armazenamento formam a base onde a aplicação funciona.",
      security: "Limitar a exposição dos serviços e planejar cópias de segurança.",
    },
    {
      id: "access", label: "Acessos", icon: "lock",
      description: "Identidades e permissões definem quem pode acessar cada recurso e quais ações pode realizar.",
      security: "Conceder apenas as permissões necessárias e proteger as contas com autenticação multifator.",
    },
    {
      id: "monitoring", label: "Monitoramento", icon: "activity",
      description: "Logs, métricas e alertas ajudam a acompanhar o ambiente e investigar comportamentos inesperados.",
      security: "Proteger os registros e evitar incluir senhas ou outros segredos nos logs.",
    },
  ],
} as const;

export const portfolio = {
  name: "Aleph Rafael",
  initials: "ar",
  availability: "Aberto à primeira oportunidade",
  eyebrow: "CLOUD & INFRAESTRUTURA",
  intro: "Olá, eu sou Aleph Rafael",
  headline: ["Meu primeiro passo em", "cloud e infraestrutura."],
  description: "Estou começando minha trajetória em tecnologia e busco minha primeira oportunidade em cloud e infraestrutura. Este site é meu primeiro projeto; redes e segurança fazem parte dos meus próximos estudos.",
  social: {
    github: "https://github.com/AlePhRafael",
    linkedin: "https://www.linkedin.com/in/aleph-rafael-991a46325/",
  },
  skills: [
    {
      name: "Cloud e infraestrutura", icon: "cloud", category: "INTERESSE DE ESTUDO", number: "01",
      description: "Quero entender como aplicações são hospedadas e como computação, redes e armazenamento se conectam. AWS é uma plataforma que pretendo explorar na prática.",
      tags: ["Computação em nuvem", "Redes", "Infraestrutura"],
    },
    {
      name: "Cibersegurança", icon: "shield", category: "INTERESSE COMPLEMENTAR", number: "02",
      description: "Tenho interesse em aprender a proteger ambientes, controlar acessos e acompanhar eventos. Segurança será parte dos meus estudos de infraestrutura.",
      tags: ["Segurança em cloud", "Identidade e acesso", "Boas práticas"],
    },
  ],
  tools: [
    { name: "TypeScript", mark: "TS", description: "Tipos e componentes" },
    { name: "Next.js", mark: "N", description: "Desenvolvimento web" },
    { name: "Tailwind CSS", mark: "~", description: "Interfaces responsivas" },
  ],
  about: {
    title: "Começando por construir.",
    paragraphs: [
      "Estou no início da minha trajetória em tecnologia, com foco em cloud e infraestrutura. Quero entender como uma aplicação funciona além da interface: onde ela roda, como se conecta e como é protegida.",
      "Comecei por este portfólio, usando Next.js, TypeScript e Tailwind CSS. Meu próximo passo é construir pequenos laboratórios e documentar o que aprender com redes, nuvem e automação.",
    ],
    note: "Busco minha primeira oportunidade para aprender com uma equipe, contribuir e evoluir na prática.",
  },
  contact: {
    title: "Vamos conversar sobre uma oportunidade?",
    description: "Busco minha primeira oportunidade em cloud e infraestrutura. Você pode falar comigo pelo LinkedIn e acompanhar meu código no GitHub.",
  },
  footerNote: "Aleph Rafael · Em busca da primeira oportunidade em cloud e infraestrutura.",
};
