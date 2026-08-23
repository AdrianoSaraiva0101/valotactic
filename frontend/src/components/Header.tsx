import React, { useRef, useState } from 'react';
import { useStrategyState, useStrategyDispatch } from '../state/StrategyContext';
import type { Strategy } from '../types';
import { saveStrategy } from '../api/strategies';

type Preset = 'orbit' | 'top' | 'third';

export function Header({ onPreset }: { onPreset: (preset: Preset) => void }) {
  const state = useStrategyState();
  const dispatch = useStrategyDispatch();
  const [preset, setPreset] = useState<Preset>('orbit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const choosePreset = (p: Preset) => {
    setPreset(p);
    onPreset(p);
  };

  const exportJson = () => {
    const data: Strategy = {
      name: state.strategyName,
      mapId: state.mapId,
      side: state.currentTeam === 'atk' ? 'attack' : 'defense',
      players: state.players,
      drawings: state.drawings,
      steps: state.steps,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${state.strategyName.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  const saveToBackend = async () => {
    const data: Strategy = {
      name: state.strategyName,
      mapId: state.mapId,
      side: state.currentTeam === 'atk' ? 'attack' : 'defense',
      players: state.players,
      drawings: state.drawings,
      steps: state.steps,
    };
    try {
      await saveStrategy(data);
      window.alert('Estratégia salva no servidor.');
    } catch {
      window.alert('Não foi possível salvar no servidor — verifique se o backend está rodando.');
    }
  };

  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data: Strategy = JSON.parse(String(reader.result));
        dispatch({
          type: 'LOAD_STRATEGY',
          players: data.players,
          drawings: data.drawings,
          steps: data.steps,
          mapId: data.mapId,
          name: data.name,
        });
      } catch {
        window.alert('Arquivo inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="app-header">
      <div className="logo">
        TACTIC3D <span>— {state.strategyName}</span>
      </div>
      <div className="views">
        <button className={`chip ${preset === 'orbit' ? 'active' : ''}`} onClick={() => choosePreset('orbit')}>
          Câmera livre
        </button>
        <button className={`chip ${preset === 'top' ? 'active' : ''}`} onClick={() => choosePreset('top')}>
          Vista superior
        </button>
        <button className={`chip ${preset === 'third' ? 'active' : ''}`} onClick={() => choosePreset('third')}>
          3ª pessoa
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="chip" onClick={saveToBackend}>
          Salvar
        </button>
        <button className="chip" onClick={exportJson}>
          Exportar .json
        </button>
        <button className="chip" onClick={() => fileInputRef.current?.click()}>
          Importar
        </button>
        <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importJson} />
      </div>
    </header>
  );
}
