import type { MapData } from '../../types';
import { havenMap } from './haven';

// Para adicionar um novo mapa: crie um arquivo <nome>.ts exportando um MapData
// e registre-o aqui. Nenhuma outra parte do código precisa mudar.
export const MAPS: Record<string, MapData> = {
  [havenMap.id]: havenMap,
};

export const DEFAULT_MAP_ID = havenMap.id;

export function getMap(id: string): MapData {
  return MAPS[id] ?? havenMap;
}
