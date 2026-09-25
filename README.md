# Portfólio — Aleph Rafael

Página em português construída com Next.js (App Router), TypeScript e Tailwind CSS. Visual escuro com foco em AWS Cloud e cibersegurança, conhecimentos complementares e links reais para GitHub e LinkedIn.

## Executar localmente

Requer Node.js 20.9 ou superior e npm. No PowerShell, use `npm.cmd` caso a política de execução bloqueie `npm.ps1`.

```sh
npm install
npm run dev
```

Abra http://localhost:3000.

## Verificar e gerar produção

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## Personalizar

- `content/portfolio.ts`: textos, conhecimentos, nome e links sociais.
- `app/globals.css`: cores, composição, animações e responsividade.
- `app/layout.tsx`: título e descrição para buscadores.

Os textos são demonstrativos e não comprovam experiência, projetos ou certificações. Substitua-os antes de publicar. A indexação está desabilitada em `app/layout.tsx` enquanto o conteúdo for ilustrativo.

As fontes são servidas localmente pelo pacote Fontsource. Não há formulário, backend, analytics ou variáveis de ambiente obrigatórias. Os links externos abrem em nova aba com `noopener noreferrer`.

## Projetos e carrossel

Edite o array `projects` em `content/portfolio.ts`. O primeiro item descreve este portfólio real; os demais são exemplos ilustrativos, sem implantação, resultados ou repositórios fictícios.

Cada item tem `id` único, `title`, `category`, `description`, `technologies`, `status` (`real` ou `illustrative`) e `cover`. Os campos `details`, `repositoryUrl` e `demoUrl` são opcionais. Links não cadastrados não aparecem na interface.

As ilustrações disponíveis em `cover.variant` são `portfolio`, `cloud`, `python` e `security`. Para substituir a ilustração por uma captura real:

1. Coloque a imagem em `public/projects/`, por exemplo `public/projects/meu-projeto.webp`.
2. Defina `cover.image: "/projects/meu-projeto.webp"` e escreva uma descrição em `cover.alt`.
3. Atualize os textos, tecnologias e status; acrescente os links reais quando disponíveis.

Prefira imagens em proporção próxima de 4:3, com o conteúdo importante no centro: a capa utiliza recorte `object-fit: cover`. Use caminhos locais em `public/`; imagens remotas exigem configuração adicional do Next.js.

O carrossel não avança automaticamente. Oferece setas, indicadores, teclado (esquerda/direita quando em foco) e deslize horizontal. Zero projetos exibe um estado vazio; um projeto oculta os controles. Os painéis inativos ficam fora da navegação por teclado e da árvore de acessibilidade.

## Diagrama e compartilhamento

As explicações do diagrama ficam no objeto `cloudDiagram`, no mesmo arquivo de conteúdo. É uma arquitetura conceitual educativa, sem conexão com uma conta AWS ou serviços reais.

`app/opengraph-image.tsx` gera uma imagem PNG de 1200 × 630 com fontes locais. Antes da publicação, copie `.env.example` para `.env.local` e configure `SITE_URL` com a URL pública real, incluindo `https://`. O valor local padrão é `http://localhost:3000`. Refaça o build depois da alteração. Revise os textos demonstrativos antes de habilitar a indexação.

## Validação das interações

`npm test` usa o executor do Node.js, React Testing Library e jsdom para verificar estados vazios, limites, indicadores, teclado, gestos de toque, links opcionais e seleção das camadas. Não substitui uma revisão visual em navegador real. Os testes requerem Node.js 24 ou superior; foi utilizado Node.js 24.14.1.

Para a revisão visual, conferir larguras de 320, 390, 768 e 1440 px, zoom de 200%, redução de movimento, contraste, foco visível e navegação até as seções abaixo do cabeçalho fixo.

## Fundo de rede digital

O componente `components/animated-background.tsx` adiciona uma camada decorativa em Canvas 2D ao site inteiro, sem bibliotecas adicionais, imagens externas ou captura de cliques. O botão no canto inferior direito pausa e retoma o movimento; essa preferência não é salva entre visitas.

Ajuste o objeto `networkSettings` em `components/network-renderer.ts` para mudar as cores dos pontos e das linhas, a velocidade (pixels por segundo), a distância de conexão e a quantidade de pontos. Os valores padrão são 45 pontos a partir de 768 px e 22 abaixo desse tamanho, até três conexões por ponto, 30 fps e resolução interna limitada a 1,5 vezes a resolução CSS.

O gradiente estático alternativo e o estilo do controle ficam em `.network-background` e `.background-toggle`, em `app/globals.css`. Os painéis permanecem opacos e há espaço reservado após o rodapé para o controle.

Com `prefers-reduced-motion`, a rede fica estática e o botão é ocultado. A renderização para em abas ocultas; ao desmontar o componente, os eventos e o ciclo de animação são removidos. Quando o Canvas não está disponível, o gradiente continua visível e o controle é omitido.

Os testes em `tests/background.test.tsx` verificam pausa, retomada, movimento reduzido, visibilidade, fallback, resolução, limites de conexões e quadros, cleanup e integração com as interações existentes. As dimensões do Canvas são verificadas em DOM simulado; contraste e sobreposições precisam de navegador real.

## Referências de implementação

- [Instalação do Next.js](https://nextjs.org/docs/app/getting-started/installation)
- [Tailwind CSS com Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- Direção A aprovada seguindo as skills locais `plan-screen` e `to-wireframe`. Estrutura registrada em `mocks/1-wire-a.txt`.

As skills existentes em `skills/` foram preservadas e não fazem parte do bundle da aplicação.

O ESLint está fixado em 9.39.5 por compatibilidade com o plugin React incluído no `eslint-config-next`. A versão 10 foi verificada e falhou ao carregar as regras desse plugin. Reavaliar a atualização quando o plugin suportar a nova API.
