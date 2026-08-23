import type { MapData } from '../../types';

// Layout abstrato inspirado em callouts genéricos de mapas competitivos de VALORANT
// (não reproduz geometria oficial — serve como o primeiro mapa 3D totalmente jogável do MVP).
export const havenMap: MapData = {
  id: 'haven_abstract_v1',
  name: 'Haven (layout abstrato)',
  size: 80,
  walls: [
    { x: -30, z: -30, w: 60, d: 2, h: 6 },
    { x: -30, z: 30, w: 60, d: 2, h: 6 },
    { x: -30, z: 0, w: 2, d: 60, h: 6 },
    { x: 30, z: 0, w: 2, d: 60, h: 6 },
    { x: -10, z: -10, w: 2, d: 20, h: 6 },
    { x: 12, z: 8, w: 16, d: 2, h: 6 },
    { x: -18, z: 16, w: 14, d: 2, h: 6 },
    { x: 20, z: -16, w: 2, d: 16, h: 6 },
  ],
  callouts: [
    { x: -22, z: -22, label: 'Site A' },
    { x: 22, z: 22, label: 'Site B' },
    { x: 0, z: 0, label: 'Meio' },
    { x: -22, z: 22, label: 'Spawn Atacante' },
    { x: 22, z: -22, label: 'Spawn Defensor' },
  ],
  spawns: [
    { team: 'atk', x: -22, z: 22 },
    { team: 'def', x: 22, z: -22 },
  ],
};
