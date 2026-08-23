import * as THREE from 'three';
import type { MapData } from '../types';
import { makeTextSprite } from './textSprite';

// Constrói a geometria do mapa a partir de qualquer MapData — agnóstico ao mapa
// específico, para permitir adicionar novos mapas sem alterar este arquivo.
export function buildMap(scene: THREE.Scene, map: MapData): THREE.Object3D {
  const group = new THREE.Group();
  group.name = 'map:' + map.id;

  const floorGeo = new THREE.PlaneGeometry(map.size, map.size, 20, 20);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x161b22, roughness: 0.9 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.name = 'floor';
  group.add(floor);

  const gridHelper = new THREE.GridHelper(map.size, 20, 0x28e0a4, 0x1b222b);
  gridHelper.position.y = 0.01;
  group.add(gridHelper);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a3542, roughness: 0.8 });
  map.walls.forEach((w) => {
    const geo = new THREE.BoxGeometry(w.w, w.h, w.d);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(w.x, w.h / 2, w.z);
    group.add(mesh);
  });

  map.callouts.forEach((c) => {
    const sprite = makeTextSprite(c.label, { size: 26 });
    sprite.position.set(c.x, 5, c.z);
    group.add(sprite);
  });

  scene.add(group);
  return group;
}

export function getFloorMesh(mapGroup: THREE.Object3D): THREE.Mesh {
  return mapGroup.getObjectByName('floor') as THREE.Mesh;
}
