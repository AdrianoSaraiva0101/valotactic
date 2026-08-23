import React from 'react';
import { useStrategyState, useStrategyDispatch } from '../state/StrategyContext';
import type { Tool } from '../types';

const TOOLS: { id: Tool; label: string; icon: string }[] = [
  { id: 'select', label: 'Selecionar', icon: '▣' },
  { id: 'player', label: 'Posicionar jogador', icon: '◉' },
  { id: 'line', label: 'Linha', icon: '╱' },
  { id: 'arrow', label: 'Seta', icon: '➤' },
  { id: 'circle', label: 'Área circular', icon: '○' },
  { id: 'marker', label: 'Marcador', icon: '✚' },
  { id: 'text', label: 'Texto', icon: 'T' },
  { id: 'delete', label: 'Excluir', icon: '✕' },
];

export function Toolbar() {
  const state = useStrategyState();
  const dispatch = useStrategyDispatch();

  return (
    <nav className="toolbar">
      {TOOLS.map((t, i) => (
        <React.Fragment key={t.id}>
          {(i === 2 || i === 7) && <div className="sep" />}
          <button
            title={t.label}
            className={state.tool === t.id ? 'active' : ''}
            onClick={() => dispatch({ type: 'SET_TOOL', tool: t.id })}
          >
            {t.icon}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
