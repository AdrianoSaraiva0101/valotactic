import type { Strategy } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function saveStrategy(strategy: Strategy): Promise<Strategy> {
  const res = await fetch(`${API_URL}/api/strategies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  });
  if (!res.ok) throw new Error('Falha ao salvar estratégia');
  return res.json();
}

export async function listStrategies(): Promise<Strategy[]> {
  const res = await fetch(`${API_URL}/api/strategies`);
  if (!res.ok) throw new Error('Falha ao listar estratégias');
  return res.json();
}

export async function loadStrategy(id: string): Promise<Strategy> {
  const res = await fetch(`${API_URL}/api/strategies/${id}`);
  if (!res.ok) throw new Error('Estratégia não encontrada');
  return res.json();
}
