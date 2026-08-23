import * as THREE from 'three';
import type { Player } from '../types';
import { makeTextSprite } from './textSprite';

export interface PlayerObject {
  player: Player;
  group: THREE.Group;
  label: THREE.Sprite;
}

const TEAM_COLOR: Record<Player['team'], number> = {
  atk: 0xff5c72,
  def: 0x4fa3ff,
};

export function createPlayerObject(scene: THREE.Scene, player: Player): PlayerObject {
  const color = TEAM_COLOR[player.team];
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 2, 16),
    new THREE.MeshStandardMaterial({ color })
  );
  body.position.y = 1;

  const head = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 1.4, 16),
    new THREE.MeshStandardMaterial({ color })
  );
  head.position.y = 2.4;

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.1, 1.4, 24),
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;

  group.add(body, head, ring);
  group.position.set(player.x, 0, player.z);
  scene.add(group);

  const label = makeTextSprite(`${player.name}`, { size: 22 });
  label.position.set(player.x, 3.6, player.z);
  scene.add(label);

  return { player, group, label };
}

export function updatePlayerPosition(obj: PlayerObject, x: number, z: number) {
  obj.group.position.x = x;
  obj.group.position.z = z;
  obj.label.position.x = x;
  obj.label.position.z = z;
  obj.player.x = x;
  obj.player.z = z;
}

export function disposePlayerObject(scene: THREE.Scene, obj: PlayerObject) {
  scene.remove(obj.group);
  scene.remove(obj.label);
}
