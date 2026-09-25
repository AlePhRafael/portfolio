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
    description: "Um espaço para apresentar minha trajetória em tecnologia. A página combina uma interface responsiva, componentes reutilizáveis e interações para explorar cloud e projetos.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    status: "real",
    cover: { variant: "portfolio", alt: "Ilustração do portfólio: janela de navegador escura com apresentação e cartões de conhecimentos." },
    details: [
      "Conteúdo organizado em um arquivo para facilitar atualizações.",
      "Carrossel manual com navegação por teclado e toque.",
      "Componentes interativos isolados do conteúdo estático.",
    ],
  },
  {
    id: "cloud-futuro",
    title: "Infraestrutura cloud",
    category: "CLOUD & INFRAESTRUTURA",
    description: "Uma ideia para explorar redes, computação e armazenamento na nuvem. Este espaço poderá reunir o desenho da arquitetura, as decisões técnicas e os aprendizados de um projeto futuro.",
    technologies: ["AWS", "Redes", "Infraestrutura"],
    status: "illustrative",
    cover: { variant: "cloud", alt: "Ilustração conceitual de uma nuvem conectada a três serviços de infraestrutura." },
  },
  {
    id: "python-futuro",
    title: "Automação com Python",
    category: "CÓDIGO & AUTOMAÇÃO",
    description: "Uma ideia de ferramenta para organizar e analisar logs fictícios. Quando o projeto existir, este painel poderá mostrar o problema resolvido, exemplos de uso e o código no GitHub.",
    technologies: ["Python", "Scripts", "Análise de logs"],
    status: "illustrative",
    cover: { variant: "python", alt: "Ilustração de um terminal com um pequeno exemplo de organização de eventos em Python." },
  },
  {
    id: "seguranca-futuro",
    title: "Segurança e monitoramento",
    category: "CIBERSEGURANÇA",
    description: "Uma ideia de laboratório sobre identidade, permissões e observação de eventos. Um lugar reservado para documentar um cenário de estudo e as medidas de proteção exploradas.",
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
  eyebrow: "CLOUD · SEGURANÇA · DESENVOLVIMENTO",
  intro: "Olá, eu sou Aleph Rafael",
  headline: ["Construindo na nuvem.", "Pensando em segurança."],
  description: "Explorando a conexão entre infraestrutura, código e proteção digital. Meu próximo passo é transformar curiosidade em soluções que fazem a diferença.",
  social: {
    github: "https://github.com/AlePhRafael",
    linkedin: "https://www.linkedin.com/in/aleph-rafael-991a46325/",
  },
  skills: [
    {
      name: "AWS Cloud", icon: "cloud", category: "INFRAESTRUTURA", number: "01",
      description: "Da primeira instância à arquitetura na nuvem. Interesse em construir ambientes disponíveis, organizados e preparados para crescer.",
      tags: ["Computação em nuvem", "Redes", "Infraestrutura"],
    },
    {
      name: "Cibersegurança", icon: "shield", category: "PROTEÇÃO DIGITAL", number: "02",
      description: "Segurança como parte do processo. Explorando a proteção de ambientes, o controle de acessos e a importância de cada camada de defesa.",
      tags: ["Segurança em cloud", "Identidade e acesso", "Boas práticas"],
    },
  ],
  tools: [
    { name: "Python", mark: "Py", description: "Automação & scripts" },
    { name: "Next.js", mark: "N", description: "Desenvolvimento web" },
    { name: "Tailwind CSS", mark: "~", description: "Interfaces responsivas" },
  ],
  about: {
    title: "Curiosidade que vira aprendizado.",
    paragraphs: [
      "Gosto de entender o que acontece por trás de uma aplicação: onde ela roda, como se conecta e o que a mantém segura. É nesse encontro entre cloud e cibersegurança que quero construir minha trajetória.",
      "Python, Next.js e Tailwind CSS fazem parte dessa exploração. Cada novo conceito é uma oportunidade de conectar infraestrutura, desenvolvimento e uma visão mais cuidadosa sobre tecnologia.",
    ],
    note: "Busco minha primeira oportunidade para aprender com uma equipe, contribuir e evoluir na prática.",
  },
  contact: {
    title: "Toda conexão pode ser um novo começo.",
    description: "Tem uma oportunidade ou quer trocar uma ideia sobre tecnologia? Vamos conversar.",
  },
  demoNotice: "Portfólio demonstrativo · Textos ilustrativos sobre as áreas de interesse.",
};
