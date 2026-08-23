import React from 'react';
import { useStrategyState, useStrategyDispatch } from '../state/StrategyContext';

export function PropertiesPanel() {
  const state = useStrategyState();
  const dispatch = useStrategyDispatch();
  const player = state.players.find((p) => p.id === state.selectedPlayerId);

  if (!player) {
    return (
      <aside className="props">
        <h4>Propriedades</h4>
        <div className="empty">Selecione um jogador no mapa para editar.</div>
      </aside>
    );
  }

  return (
    <aside className="props">
      <h4>Propriedades</h4>
      <label>Nome</label>
      <input
        type="text"
        value={player.name}
        onChange={(e) => dispatch({ type: 'RENAME_PLAYER', id: player.id, name: e.target.value })}
      />
      <label>Agente</label>
      <input type="text" value={player.agentId} disabled />
      <label>Equipe</label>
      <input type="text" value={player.team === 'atk' ? 'Ataque' : 'Defesa'} disabled />
      <button className="danger" onClick={() => dispatch({ type: 'REMOVE_PLAYER', id: player.id })}>
        Remover jogador
      </button>
    </aside>
  );
}
