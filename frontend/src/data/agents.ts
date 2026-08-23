import type { Agent } from '../types';

// Dados mockados/locais. Para substituir por uma API externa no futuro, troque a
// implementação de getAgents() por um fetch — nenhum componente precisa mudar,
// pois todos consomem apenas essa função.
const AGENTS: Agent[] = [
  { id: 'jett', name: 'Jett', role: 'Duelista', color: 0x9be7c4 },
  { id: 'sova', name: 'Sova', role: 'Iniciador', color: 0x4fa3ff },
  { id: 'sage', name: 'Sage', role: 'Sentinela', color: 0x8fd3f4 },
  { id: 'omen', name: 'Omen', role: 'Controlador', color: 0x8a6bd1 },
  { id: 'killjoy', name: 'Killjoy', role: 'Sentinela', color: 0xf4d35e },
  { id: 'raze', name: 'Raze', role: 'Duelista', color: 0xff9f45 },
];

export function getAgents(): Agent[] {
  return AGENTS;
}

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}
