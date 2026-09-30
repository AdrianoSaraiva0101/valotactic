# Tactic3D

Plataforma de planejamento tático 3D para VALORANT — editor de estratégias, posicionamento
de jogadores, ferramentas de desenho tático e reprodução de execuções em um mapa 3D navegável.

> Inspirado no conceito do VALOPLANT, construído do zero com identidade própria.
> Este repositório contém o MVP funcional: um mapa 3D completo, posicionamento e edição de
> jogadores, ferramentas de desenho tático, sistema de etapas/timeline com reprodução, e
> salvamento/exportação de estratégias.

## Demonstração rápida

Antes de rodar o projeto completo, há uma demo estática de página única em
`docs/demo.html` que roda em qualquer navegador (sem instalar nada) e mostra o núcleo do
editor 3D funcionando: câmera livre, posicionamento de jogadores, desenho tático e timeline.

## Stack

- **Frontend**: React + TypeScript + Vite + Three.js (renderização 3D própria, sem
  dependência de `@react-three/fiber` para manter o controle fino de performance)
- **Backend**: Node.js + Express, armazenamento em arquivo JSON local (sem banco de dados
  pago, sem serviços externos)
- Nenhuma API paga é requisito do MVP. Onde uma API externa faria sentido (ex.: dados
  oficiais de agentes/mapas), a arquitetura já está preparada para receber um adaptador.

## Estrutura

```
/frontend       aplicação React (editor 3D, UI, estado)
/backend        API REST simples para salvar/carregar estratégias
/docs           documentação de arquitetura e a demo estática
```

Veja `docs/ARCHITECTURE.md` para o detalhamento de cada módulo.

## Como rodar localmente

Pré-requisitos: Node.js 18+ e npm.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Sobe em `http://localhost:4000`. As estratégias são salvas como arquivos JSON em
`backend/data/strategies/`.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abre em `http://localhost:5173`. O frontend fala com o backend através de
`VITE_API_URL` (definido em `.env`, padrão `http://localhost:4000`).

### 3. Build de produção

```bash
cd frontend && npm run build
```

Gera os arquivos estáticos em `frontend/dist`.

## Funcionalidades já implementadas no MVP

- Mapa 3D navegável (câmera livre por arraste/zoom, presets de vista superior e 3ª pessoa)
- Posicionamento de jogadores por clique, com agente, número, nome e cor por equipe
- Seleção e edição de jogadores (renomear, remover)
- Ferramentas de desenho tático: linha, seta, círculo de área, marcador, texto
- Sistema de etapas: captura da posição dos jogadores como uma etapa da estratégia
- Timeline com reprodução (play/pause) interpolando o movimento dos jogadores entre etapas
- Exportação e importação de estratégias em `.json`
- Dados de agentes mockados localmente, prontos para trocar por uma API futura
- Um mapa totalmente implementado (layout abstrato inspirado em callouts genéricos),
  com arquitetura pronta para adicionar novos mapas

## O que ficou para a próxima versão

- Múltiplos mapas prontos para uso (Ascent, Bind, Split, Lotus, Sunset) — a arquitetura já
  suporta adicionar novos arquivos em `frontend/src/data/maps/`, faltando apenas modelar o
  layout de cada um
- Persistência de posições de jogadores por etapa no `backend` (hoje o CRUD de estratégias
  já existe; falta a tela de biblioteca/pastas/tags no frontend)
- Autenticação de usuários e equipes
- Undo/redo, seleção múltipla e snap de objetos
- Animação de habilidades dos agentes na timeline (hoje as etapas movem apenas jogadores)
- Modo apresentação e modo espectador
- Comparação entre duas estratégias lado a lado
- Exportação de vídeo/imagem da execução

