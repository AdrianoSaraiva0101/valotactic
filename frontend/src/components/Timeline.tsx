import React, { useRef, useState } from 'react';
import { useStrategyState, useStrategyDispatch } from '../state/StrategyContext';

export function Timeline() {
  const state = useStrategyState();
  const dispatch = useStrategyDispatch();
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const playTokenRef = useRef(0);

  const tweenStep = (fromIdx: number, toIdx: number, duration: number, myToken: number) =>
    new Promise<void>((resolve) => {
      const from = state.steps[fromIdx];
      const to = state.steps[toIdx];
      const start = performance.now();
      function frame(now: number) {
        if (playTokenRef.current !== myToken) return resolve();
        const t = Math.min(1, (now - start) / duration);
        to.playerPositions.forEach((tp) => {
          const fp = from.playerPositions.find((x) => x.playerId === tp.playerId);
          if (!fp) return;
          const x = fp.x + (tp.x - fp.x) * t;
          const z = fp.z + (tp.z - fp.z) * t;
          dispatch({ type: 'MOVE_PLAYER', id: tp.playerId, x, z });
        });
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });

  const play = async () => {
    if (playing) {
      playTokenRef.current++;
      setPlaying(false);
      return;
    }
    if (state.steps.length < 2) {
      window.alert('Crie ao menos 2 etapas para reproduzir a execução.');
      return;
    }
    const myToken = ++playTokenRef.current;
    setPlaying(true);
    for (let i = 0; i < state.steps.length - 1; i++) {
      if (playTokenRef.current !== myToken) break;
      await tweenStep(i, i + 1, speed, myToken);
      dispatch({ type: 'SET_ACTIVE_STEP', index: i + 1 });
    }
    if (playTokenRef.current === myToken) setPlaying(false);
  };

  return (
    <footer className="timeline">
      <div className="controls">
        <button id="playBtn" onClick={play}>
          {playing ? '⏸ Pausar' : '▶ Reproduzir'}
        </button>
        <button onClick={() => dispatch({ type: 'ADD_STEP' })} title="Adicionar etapa a partir das posições atuais">
          + Etapa
        </button>
        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
          <option value={2000}>Velocidade: lenta</option>
          <option value={1000}>Velocidade: normal</option>
          <option value={500}>Velocidade: rápida</option>
        </select>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{state.steps.length} etapa(s)</span>
      </div>
      <div className="steps">
        {state.steps.map((s, i) => (
          <div
            key={s.id}
            className={`step-chip ${i === state.activeStepIndex ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'APPLY_STEP', index: i })}
          >
            {s.label}
          </div>
        ))}
      </div>
    </footer>
  );
}
