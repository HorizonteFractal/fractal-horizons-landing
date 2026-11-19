# Horizonte Fractal — Site institucional

Repositório da aplicação web institucional da **Horizonte Fractal**, empresa de tecnologia que desenvolve soluções digitais para negócios.

O projeto reúne a página institucional da empresa e uma área comercial dedicada à apresentação de modelos de sites profissionais para advocacia.

- **Repositório:** https://github.com/HorizonteFractal/fractal-horizons-landing
- **Aplicação publicada:** https://fractal-growth-engine.lovable.app
- **Projeto no Lovable:** https://lovable.dev/projects/286f824b-afc0-47d3-94e6-0578caf6bf4b

> O projeto está conectado diretamente ao Lovable. Preserve essa integração e trabalhe neste repositório como fonte de código do projeto.

## Visão geral

A aplicação apresenta a Horizonte Fractal e seus serviços de tecnologia, com foco em geração de contatos comerciais. A página institucional reúne conteúdo sobre serviços, abordagem de trabalho, diferenciais, processo, tecnologias, projetos, prova social, planos de suporte e canais de contato.

A rota comercial /sites apresenta soluções de presença digital voltadas a advogados e escritórios de advocacia, incluindo modelos demonstrativos, chamadas para contato e atalhos para WhatsApp e Instagram.

## Rotas

| Rota | Finalidade | Implementação |
| --- | --- | --- |
| / | Página institucional da Horizonte Fractal | src/routes/index.tsx |
| /sites | Página comercial de sites para advocacia | src/routes/sites.tsx |

O roteamento é baseado em arquivos, por meio do **TanStack Router**. A estrutura raiz da aplicação está em src/routes/__root.tsx.

## Arquitetura e organização

A separação entre a experiência institucional e a área comercial é uma regra importante do projeto.

```text
.
├── .lovable/                # Metadados e contexto mantidos pelo Lovable
├── public/                  # Arquivos estáticos públicos
├── src/
│   ├── assets/              # Recursos visuais importados pela aplicação
│   ├── components/
│   │   ├── landing/         # Componentes da página institucional
│   │   ├── commercial/      # Componentes isolados da página /sites
│   │   └── ui/              # Primitivos e componentes de interface
│   ├── hooks/               # Hooks reutilizáveis
│   ├── lib/                 # Utilitários e configurações compartilhadas
│   │   └── commercial-sites.ts
│   ├── routes/              # Rotas do TanStack Router
│   ├── routeTree.gen.ts     # Arquivo de rotas gerado automaticamente
│   ├── router.tsx           # Configuração do roteador
│   ├── server.ts            # Entrada e tratamento do servidor
│   ├── start.ts             # Inicialização do TanStack Start
│   └── styles.css           # Estilos globais
├── AGENTS.md                # Regras de arquitetura para agentes de desenvolvimento
├── roadmap.md               # Planejamento e histórico de entregas da área comercial
├── package.json             # Scripts e dependências
├── bun.lock                 # Lockfile do Bun
├── bunfig.toml              # Configuração do Bun
├── vite.config.ts           # Configuração do Vite/TanStack Start
└── vercel.json              # Regras de rewrite para a implantação na Vercel
```

### Separação institucional e comercial

- A página institucional permanece em src/routes/index.tsx e utiliza os componentes de src/components/landing/.
- A página comercial permanece em src/routes/sites.tsx e utiliza os componentes de src/components/commercial/.
- Elementos visuais, navegação e conteúdo específicos da área comercial devem permanecer isolados, evitando alterações involuntárias na experiência institucional.
- Os endereços das demonstrações comerciais e os contatos dessa área são centralizados em src/lib/commercial-sites.ts.
- O arquivo AGENTS.md contém as regras arquiteturais que devem ser consultadas antes de mudanças nessas áreas.

**Não mova a rota comercial para dentro da página institucional nem compartilhe alterações específicas de sua interface sem avaliar o impacto nas duas experiências.**

## Tecnologias

A implementação atual utiliza:

- **React 19** — construção da interface.
- **TypeScript** — tipagem estática.
- **TanStack Start** — estrutura da aplicação e renderização no servidor.
- **TanStack Router** — roteamento baseado em arquivos.
- **TanStack Query** — gerenciamento de estado assíncrono e cache de consultas.
- **Vite** — ambiente de desenvolvimento e build.
- **Tailwind CSS 4** — estilos utilitários.
- **Radix UI** — primitivas acessíveis de interface.
- **Lucide React** — ícones.
- **Recharts** — visualização de dados.
- **Zod** — validação de dados.
- **Bun** — gerenciamento de dependências e execução dos scripts.

As versões e dependências efetivas estão declaradas em package.json e bun.lock.

## Executar localmente

### Pré-requisitos

- Git
- Bun instalado

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/HorizonteFractal/fractal-horizons-landing.git
cd fractal-horizons-landing
bun install
```

Inicie o ambiente de desenvolvimento:

```bash
bun run dev
```

O Vite exibirá no terminal o endereço local para acessar a aplicação.

### Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| bun run dev | Inicia o servidor de desenvolvimento |
| bun run build | Gera o build de produção |
| bun run build:dev | Gera o build no modo development |
| bun run preview | Executa a prévia local do build |
| bun run lint | Executa o ESLint |
| bun run format | Formata os arquivos com Prettier |

## Configurações importantes

### Demonstrações comerciais

Os endereços dos modelos demonstrativos da área de advocacia estão centralizados em:

src/lib/commercial-sites.ts

Quando os endereços definitivos forem disponibilizados, atualize os valores nesse arquivo. Evite duplicar URLs diretamente nos componentes.

### Contatos comerciais

A configuração de WhatsApp e Instagram usada pela área comercial também está centralizada em src/lib/commercial-sites.ts. A configuração de contato da página institucional pode estar em componentes ou utilitários próprios; verifique a implementação antes de alterar números ou mensagens.

### Lovable

O projeto mantém arquivos de contexto em .lovable/. Eles fazem parte da integração e do fluxo de trabalho do projeto.

- Não remova nem substitua arquivos de .lovable/ sem necessidade confirmada.
- Continue utilizando o projeto Lovable já conectado a este repositório.
- Alterações sincronizadas pelo Lovable devem ser consideradas parte do histórico normal do código.

### Implantação

O repositório contém configuração de build baseada em Vite/TanStack Start e um arquivo vercel.json com regras de rewrite relacionadas à rota /sites. A configuração efetiva de produção deve ser conferida no ambiente de implantação antes de qualquer alteração de hospedagem ou roteamento.

## Diretrizes para manutenção

1. Consulte AGENTS.md antes de modificar a arquitetura.
2. Preserve a separação entre a página institucional e a área comercial.
3. Centralize as URLs das demonstrações comerciais em src/lib/commercial-sites.ts.
4. Não edite manualmente src/routeTree.gen.ts; o arquivo é gerado pelo sistema de rotas.
5. Preserve os arquivos de integração do Lovable.
6. Atualize roadmap.md somente quando houver mudança real no planejamento ou no estado das entregas.
7. Execute ao menos bun run lint e bun run build após alterações relevantes, quando o ambiente permitir.

## Planejamento

O arquivo roadmap.md registra as entregas e pendências da área comercial. Ele deve ser consultado para compreender o histórico do trabalho, sem ser tratado como substituto da implementação atual.

---

**Horizonte Fractal**  
Tecnologia, inteligência e soluções digitais para negócios.
