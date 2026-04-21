# AI Governance & Architecture (AGENTS)

Este arquivo rege o comportamento global da inteligência artificial e da equipe de desenvolvimento autônoma neste repositório para o projeto Plataforma TCC Interativa.

## 1. Tech Stack Obrigatório
- **Frontend**: React + TypeScript.
- **Backend**: Node.js + TypeScript (Next.js App Router).
- **Estilização**: Vanilla CSS.
- **Design System**: Premium, focado em estética clínica (calma e acolhimento).

## 2. Padrões de Código
- O uso de TypeScript deve ser feito em **Strict Mode** absoluto. `any` não é permitido.
- O código deve priorizar modularidade e clareza, separando a lógica de negócio (RPD/GMT) da camada de apresentação (React).

## 3. Fluxo Obrigatório de 'Planejar-antes-de-Executar'
1. **Nunca** inicie a escrita ou alteração de código sem antes gerar e obter aprovação em um arquivo `implementation_plan.md`.
2. As lógicas clínicas (validação de distorções, etc.) devem ser discutidas na fase de planejamento.
3. Operações críticas (ex. criação ou drop de tabelas de banco de dados, e manipulação de credenciais) exigem autorização expressa do usuário humano.

## 4. Orquestração (Antigravity Swarm)
A arquitetura se baseia em agentes especializados, definidos na pasta `.agents/`. O sistema deve delegar as resoluções de tarefas às "personas" adequadas para evitar saturação de contexto e garantir alta fidelidade às premissas de Terapia Cognitivo-Comportamental.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
