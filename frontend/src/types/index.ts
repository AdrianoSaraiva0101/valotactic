export type Team = 'atk' | 'def';

export interface Agent {
  id: string;
  name: string;
  role: string;
  color: number; // hex, ex: 0xff5c72
}

export interface Player {
  id: string;
  name: string;
  number: number;
  agentId: string;
  team: Team;
  x: number;
  z: number;
}

export type DrawingType = 'line' | 'arrow' | 'circle' | 'marker' | 'text';

export interface DrawingObject {
  id: string;
  type: DrawingType;
  points: { x: number; z: number }[];
  text?: string;
}

export interface StrategyStep {
  id: string;
  label: string;
  playerPositions: { playerId: string; x: number; z: number }[];
}

export interface Strategy {
  id?: string;
  name: string;
  mapId: string;
  side: 'attack' | 'defense';
  players: Player[];
  drawings: DrawingObject[];
  steps: StrategyStep[];
  updatedAt?: string;
}

export interface WallDef {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
}

export interface CalloutDef {
  x: number;
  z: number;
  label: string;
}

export interface MapData {
  id: string;
  name: string;
  size: number;
  walls: WallDef[];
  callouts: CalloutDef[];
  spawns: { team: Team; x: number; z: number }[];
}

export type Tool = 'select' | 'player' | 'line' | 'arrow' | 'circle' | 'marker' | 'text' | 'delete';
