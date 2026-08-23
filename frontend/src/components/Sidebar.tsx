import React from 'react';
import { getAgents } from '../data/agents';
import { useStrategyState, useStrategyDispatch } from '../state/StrategyContext';

export function Sidebar() {
  const state = useStrategyState();
  const dispatch = useStrategyDispatch();
  const agents = getAgents();

  return (
    <aside className="sidebar">
      <h4>Equipe</h4>
      <div className="team-toggle">
        <button
          data-team="atk"
          className={state.currentTeam === 'atk' ? 'active' : ''}
          onClick={() => dispatch({ type: 'SET_TEAM', team: 'atk' })}
        >
          Ataque
        </button>
        <button
          data-team="def"
          className={state.currentTeam === 'def' ? 'active' : ''}
          onClick={() => dispatch({ type: 'SET_TEAM', team: 'def' })}
        >
          Defesa
        </button>
      </div>

      <h4>Agentes</h4>
      {agents.map((a) => (
        <div
          key={a.id}
          className={`agent-card ${state.selectedAgent.id === a.id ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_AGENT', agent: a })}
        >
          <div className="agent-swatch" style={{ background: `#${a.color.toString(16)}` }}>
            {a.name[0]}
          </div>
          <div>
            <div>{a.name}</div>
            <div className="agent-role">{a.role}</div>
          </div>
        </div>
      ))}

      <h4>Jogadores no mapa</h4>
      {state.players.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Nenhum jogador posicionado ainda.</div>
      )}
      {state.players.map((p) => (
        <div key={p.id} className="player-row" onClick={() => dispatch({ type: 'SELECT_PLAYER', id: p.id })}>
          <span className="player-dot" style={{ background: p.team === 'atk' ? '#ff5c72' : '#4fa3ff' }} />
          {p.name}
        </div>
      ))}
    </aside>
  );
}
