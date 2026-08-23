import React, { useEffect, useRef } from 'react';
import { SceneManager } from '../three/SceneManager';
import { getMap } from '../data/maps';
import { createPlayerObject, updatePlayerPosition, disposePlayerObject, type PlayerObject } from '../three/playerFactory';
import { buildDrawing } from '../three/drawingTools';
import { useStrategyState, useStrategyDispatch } from '../state/StrategyContext';
import type { DrawingObject, Tool } from '../types';

const TOOL_HINTS: Record<Tool, string> = {
  select: 'Clique em um jogador para selecioná-lo.',
  player: 'Clique no mapa para posicionar o jogador com o agente selecionado.',
  line: 'Clique dois ou mais pontos e pressione Enter para concluir a linha.',
  arrow: 'Clique dois ou mais pontos e pressione Enter — a última direção define a ponta.',
  circle: 'Clique o centro e depois um ponto na borda da área.',
  marker: 'Clique no mapa para adicionar um marcador.',
  text: 'Clique no mapa e digite o texto da anotação.',
  delete: 'Clique em um jogador para removê-lo.',
};

export function Viewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const playerObjectsRef = useRef<Map<string, PlayerObject>>(new Map());
  const drawBufferRef = useRef<{ x: number; z: number }[]>([]);
  const state = useStrategyState();
  const dispatch = useStrategyDispatch();
  const stateRef = useRef(state);
  stateRef.current = state;

  // Inicializa a cena uma vez
  useEffect(() => {
    if (!containerRef.current) return;
    const manager = new SceneManager(containerRef.current, getMap(state.mapId));
    sceneManagerRef.current = manager;

    const finishDrawing = () => {
      const s = stateRef.current;
      const buffer = drawBufferRef.current;
      if (buffer.length < 2 || !['line', 'arrow'].includes(s.tool)) return;
      const drawing: DrawingObject = { id: `d${Date.now()}`, type: s.tool as DrawingObject['type'], points: buffer.slice() };
      buildDrawing(manager.scene, drawing);
      dispatch({ type: 'ADD_DRAWING', drawing });
      drawBufferRef.current = [];
    };

    const onClick = (e: MouseEvent) => {
      const s = stateRef.current;
      const point = manager.screenToFloor(e.clientX, e.clientY);
      if (!point) return;

      if (s.tool === 'player') {
        dispatch({ type: 'ADD_PLAYER', x: point.x, z: point.z });
      } else if (s.tool === 'line' || s.tool === 'arrow') {
        drawBufferRef.current.push({ x: point.x, z: point.z });
      } else if (s.tool === 'circle') {
        drawBufferRef.current.push({ x: point.x, z: point.z });
        if (drawBufferRef.current.length === 2) {
          const drawing: DrawingObject = { id: `d${Date.now()}`, type: 'circle', points: drawBufferRef.current.slice() };
          buildDrawing(manager.scene, drawing);
          dispatch({ type: 'ADD_DRAWING', drawing });
          drawBufferRef.current = [];
        }
      } else if (s.tool === 'marker') {
        const drawing: DrawingObject = { id: `d${Date.now()}`, type: 'marker', points: [{ x: point.x, z: point.z }] };
        buildDrawing(manager.scene, drawing);
        dispatch({ type: 'ADD_DRAWING', drawing });
      } else if (s.tool === 'text') {
        const text = window.prompt('Texto da anotação:', '');
        if (text) {
          const drawing: DrawingObject = { id: `d${Date.now()}`, type: 'text', points: [{ x: point.x, z: point.z }], text };
          buildDrawing(manager.scene, drawing);
          dispatch({ type: 'ADD_DRAWING', drawing });
        }
      } else if (s.tool === 'select' || s.tool === 'delete') {
        let closest: string | null = null;
        let dist = 2.2;
        s.players.forEach((p) => {
          const d = Math.hypot(p.x - point.x, p.z - point.z);
          if (d < dist) {
            dist = d;
            closest = p.id;
          }
        });
        if (s.tool === 'select') dispatch({ type: 'SELECT_PLAYER', id: closest });
        else if (closest) dispatch({ type: 'REMOVE_PLAYER', id: closest });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') finishDrawing();
    };

    const onPreset = (e: Event) => {
      const preset = (e as CustomEvent<'orbit' | 'top' | 'third'>).detail;
      manager.controls.setPreset(preset);
    };

    manager.renderer.domElement.addEventListener('click', onClick);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('tactic3d:camera-preset', onPreset);

    return () => {
      manager.renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('tactic3d:camera-preset', onPreset);
      manager.dispose();
      sceneManagerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza jogadores do estado com os objetos 3D
  useEffect(() => {
    const manager = sceneManagerRef.current;
    if (!manager) return;
    const objects = playerObjectsRef.current;

    // remove jogadores que não existem mais
    for (const [id, obj] of objects) {
      if (!state.players.find((p) => p.id === id)) {
        disposePlayerObject(manager.scene, obj);
        objects.delete(id);
      }
    }
    // cria/atualiza
    state.players.forEach((p) => {
      let obj = objects.get(p.id);
      if (!obj) {
        obj = createPlayerObject(manager.scene, p);
        objects.set(p.id, obj);
      } else if (obj.group.position.x !== p.x || obj.group.position.z !== p.z) {
        updatePlayerPosition(obj, p.x, p.z);
      }
    });
  }, [state.players]);

  return (
    <main id="viewport" style={{ position: 'relative', gridColumn: 3, gridRow: 2, background: '#05070a' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(17,21,27,.85)',
          border: '1px solid #232a34',
          padding: '6px 10px',
          borderRadius: 6,
          fontSize: 11,
          color: '#7c8794',
          pointerEvents: 'none',
        }}
      >
        {TOOL_HINTS[state.tool]}
      </div>
    </main>
  );
}
