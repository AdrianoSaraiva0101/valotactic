import React, { createContext, useContext, useReducer } from 'react';
import type { Player, DrawingObject, StrategyStep, Tool, Team, Agent } from '../types';
import { DEFAULT_MAP_ID } from '../data/maps';
import { getAgents } from '../data/agents';

interface State {
  mapId: string;
  strategyName: string;
  players: Player[];
  drawings: DrawingObject[];
  steps: StrategyStep[];
  activeStepIndex: number;
  tool: Tool;
  currentTeam: Team;
  selectedAgent: Agent;
  selectedPlayerId: string | null;
  playerCounter: number;
}

type Action =
  | { type: 'SET_TOOL'; tool: Tool }
  | { type: 'SET_TEAM'; team: Team }
  | { type: 'SET_AGENT'; agent: Agent }
  | { type: 'ADD_PLAYER'; x: number; z: number }
  | { type: 'SELECT_PLAYER'; id: string | null }
  | { type: 'RENAME_PLAYER'; id: string; name: string }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'MOVE_PLAYER'; id: string; x: number; z: number }
  | { type: 'ADD_DRAWING'; drawing: DrawingObject }
  | { type: 'ADD_STEP' }
  | { type: 'SET_ACTIVE_STEP'; index: number }
  | { type: 'APPLY_STEP'; index: number }
  | { type: 'SET_STRATEGY_NAME'; name: string }
  | { type: 'LOAD_STRATEGY'; players: Player[]; drawings: DrawingObject[]; steps: StrategyStep[]; mapId: string; name: string };

const initialState: State = {
  mapId: DEFAULT_MAP_ID,
  strategyName: 'Nova estratégia',
  players: [],
  drawings: [],
  steps: [],
  activeStepIndex: -1,
  tool: 'select',
  currentTeam: 'atk',
  selectedAgent: getAgents()[0],
  selectedPlayerId: null,
  playerCounter: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, tool: action.tool };
    case 'SET_TEAM':
      return { ...state, currentTeam: action.team };
    case 'SET_AGENT':
      return { ...state, selectedAgent: action.agent };
    case 'ADD_PLAYER': {
      const number = state.playerCounter;
      const player: Player = {
        id: `p${number}`,
        name: `${state.selectedAgent.name} ${number}`,
        number,
        agentId: state.selectedAgent.id,
        team: state.currentTeam,
        x: action.x,
        z: action.z,
      };
      return {
        ...state,
        players: [...state.players, player],
        playerCounter: number + 1,
        selectedPlayerId: player.id,
      };
    }
    case 'SELECT_PLAYER':
      return { ...state, selectedPlayerId: action.id };
    case 'RENAME_PLAYER':
      return {
        ...state,
        players: state.players.map((p) => (p.id === action.id ? { ...p, name: action.name } : p)),
      };
    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
        selectedPlayerId: state.selectedPlayerId === action.id ? null : state.selectedPlayerId,
      };
    case 'MOVE_PLAYER':
      return {
        ...state,
        players: state.players.map((p) => (p.id === action.id ? { ...p, x: action.x, z: action.z } : p)),
      };
    case 'ADD_DRAWING':
      return { ...state, drawings: [...state.drawings, action.drawing] };
    case 'ADD_STEP': {
      const step: StrategyStep = {
        id: `s${state.steps.length + 1}`,
        label: `Etapa ${state.steps.length + 1}`,
        playerPositions: state.players.map((p) => ({ playerId: p.id, x: p.x, z: p.z })),
      };
      return { ...state, steps: [...state.steps, step], activeStepIndex: state.steps.length };
    }
    case 'SET_ACTIVE_STEP':
      return { ...state, activeStepIndex: action.index };
    case 'APPLY_STEP': {
      const step = state.steps[action.index];
      if (!step) return state;
      const positions = new Map(step.playerPositions.map((sp) => [sp.playerId, sp]));
      return {
        ...state,
        activeStepIndex: action.index,
        players: state.players.map((p) => {
          const pos = positions.get(p.id);
          return pos ? { ...p, x: pos.x, z: pos.z } : p;
        }),
      };
    }
    case 'SET_STRATEGY_NAME':
      return { ...state, strategyName: action.name };
    case 'LOAD_STRATEGY':
      return {
        ...state,
        players: action.players,
        drawings: action.drawings,
        steps: action.steps,
        mapId: action.mapId,
        strategyName: action.name,
        activeStepIndex: -1,
        selectedPlayerId: null,
        playerCounter: action.players.length + 1,
      };
    default:
      return state;
  }
}

const StrategyStateContext = createContext<State>(initialState);
const StrategyDispatchContext = createContext<React.Dispatch<Action>>(() => {});

export function StrategyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StrategyStateContext.Provider value={state}>
      <StrategyDispatchContext.Provider value={dispatch}>{children}</StrategyDispatchContext.Provider>
    </StrategyStateContext.Provider>
  );
}

export function useStrategyState() {
  return useContext(StrategyStateContext);
}

export function useStrategyDispatch() {
  return useContext(StrategyDispatchContext);
}
