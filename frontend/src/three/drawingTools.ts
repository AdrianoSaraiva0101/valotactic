import * as THREE from 'three';
import type { DrawingObject } from '../types';
import { makeTextSprite } from './textSprite';

const DRAW_COLOR = 0x28e0a4;
const MARKER_COLOR = 0xffb020;

// Constrói os objetos 3D correspondentes a um DrawingObject já finalizado.
// Retorna uma lista porque setas geram uma linha + uma ponta separadas.
export function buildDrawing(scene: THREE.Scene, drawing: DrawingObject): THREE.Object3D[] {
  const objects: THREE.Object3D[] = [];
  const pts = drawing.points;

  if (drawing.type === 'line' || drawing.type === 'arrow') {
    if (pts.length < 2) return objects;
    const vec3 = pts.map((p) => new THREE.Vector3(p.x, 0.1, p.z));
    const geo = new THREE.BufferGeometry().setFromPoints(vec3);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: DRAW_COLOR }));
    scene.add(line);
    objects.push(line);

    if (drawing.type === 'arrow') {
      const last = pts[pts.length - 1];
      const prev = pts[pts.length - 2];
      const dir = new THREE.Vector3(last.x - prev.x, 0, last.z - prev.z).normalize();
      const head = new THREE.Mesh(
        new THREE.ConeGeometry(0.7, 1.8, 8),
        new THREE.MeshBasicMaterial({ color: DRAW_COLOR })
      );
      head.position.set(last.x, 0.1, last.z);
      head.rotation.x = Math.PI / 2;
      head.rotation.z = -Math.atan2(dir.x, dir.z) + Math.PI / 2;
      scene.add(head);
      objects.push(head);
    }
  } else if (drawing.type === 'circle' && pts.length >= 2) {
    const r = Math.hypot(pts[1].x - pts[0].x, pts[1].z - pts[0].z);
    const geo = new THREE.RingGeometry(Math.max(r - 0.1, 0.05), r, 48);
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: DRAW_COLOR, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(pts[0].x, 0.1, pts[0].z);
    scene.add(mesh);
    objects.push(mesh);
  } else if (drawing.type === 'marker' && pts.length >= 1) {
    const marker = new THREE.Mesh(
      new THREE.ConeGeometry(0.8, 2, 4),
      new THREE.MeshBasicMaterial({ color: MARKER_COLOR })
    );
    marker.position.set(pts[0].x, 1, pts[0].z);
    marker.rotation.x = Math.PI;
    scene.add(marker);
    objects.push(marker);
  } else if (drawing.type === 'text' && pts.length >= 1 && drawing.text) {
    const sprite = makeTextSprite(drawing.text, { size: 22, color: '#ffb020' });
    sprite.position.set(pts[0].x, 2.4, pts[0].z);
    scene.add(sprite);
    objects.push(sprite);
  }

  return objects;
}

export function disposeDrawing(scene: THREE.Scene, objects: THREE.Object3D[]) {
  objects.forEach((o) => scene.remove(o));
}
