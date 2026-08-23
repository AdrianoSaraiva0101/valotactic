# Arquitetura

## Visão geral

```
frontend/
  src/
    three/           lógica de renderização 3D pura (sem React)
      SceneManager.ts   cena, câmera, luzes, renderer, loop de render
      controls.ts       controle de câmera orbit/pan/zoom (sem dependências externas)
      mapBuilder.ts     constrói geometria do mapa a partir dos dados em data/maps
      playerFactory.ts  cria/atualiza meshes de jogadores e labels
      drawingTools.ts   cria geometria de linhas, setas, círculos, marcadores, textos
    state/
      StrategyContext.tsx  estado global (React context + reducer): jogadores, etapas,
                            desenhos, ferramenta ativa, agente/equipe selecionados
    data/
      agents.ts         dados mockados de agentes (nome, função, cor) — trocável por API
      maps/haven.ts      layout do mapa implementado (paredes, callouts, spawn points)
    components/
      Header, Sidebar, Toolbar, Viewport, PropertiesPanel, Timeline
      cada componente é fino: lê o estado do contexto e delega a manipulação 3D ao
      SceneManager através de refs
    types/            tipos compartilhados (Player, DrawingObject, StrategyStep, Agent, MapData)

backend/
  src/server.js       Express: CRUD simples de estratégias, persistidas como arquivos JSON
  data/strategies/     arquivos .json, um por estratégia salva
```

## Por que Three.js "puro" em vez de react-three-fiber

Para manter controle fino sobre performance (poucos polígonos, poucas texturas, loop de
render próprio) e reduzir a superfície de dependências, o 3D é implementado diretamente
com `three`, isolado em `src/three/`. Os componentes React apenas montam um `<canvas>` via
ref e chamam métodos do `SceneManager` — nenhuma lógica de cena vive dentro de JSX.

## Fluxo de dados de uma estratégia

1. Usuário posiciona jogadores e desenha elementos táticos no mapa 3D.
2. `StrategyContext` mantém a lista de jogadores/desenhos em memória.
3. "Adicionar etapa" tira um retrato (snapshot) das posições atuais dos jogadores.
4. A timeline reproduz a estratégia interpolando a posição de cada jogador entre etapas
   consecutivas.
5. "Salvar" serializa `{ mapId, players, steps, drawings }` e envia para
   `POST /api/strategies` no backend, que grava um arquivo `.json`.
6. "Abrir" busca `GET /api/strategies/:id` e reconstrói a cena a partir do JSON.

## Preparado para múltiplos mapas

`frontend/src/data/maps/` exporta um objeto `MapData` por mapa (paredes, callouts, spawns).
`mapBuilder.ts` é agnóstico ao mapa: recebe qualquer `MapData` e constrói a geometria.
Adicionar um novo mapa é criar um novo arquivo em `data/maps/` e registrá-lo em
`data/maps/index.ts` — nenhuma mudança é necessária no restante do código.

## Preparado para API de agentes

`data/agents.ts` exporta uma lista estática tipada como `Agent[]`. Para substituir por uma
API real, basta trocar a implementação de `getAgents()` (hoje retorna o array local) por uma
chamada `fetch`, mantendo a mesma assinatura — nenhum componente precisa mudar.
