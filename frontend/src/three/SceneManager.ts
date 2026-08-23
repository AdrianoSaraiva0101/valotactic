import * as THREE from 'three';
import { TacticCameraControls } from './controls';
import { buildMap, getFloorMesh } from './mapBuilder';
import type { MapData } from '../types';

export class SceneManager {
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: TacticCameraControls;
  floor!: THREE.Mesh;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private frameId = 0;

  constructor(private container: HTMLElement, map: MapData) {
    this.scene.background = new THREE.Color(0x05070a);
    this.scene.fog = new THREE.Fog(0x05070a, 60, 140);

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    const hemi = new THREE.HemisphereLight(0x8fb6d9, 0x1a1f26, 0.9);
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(40, 60, 20);
    this.scene.add(hemi, dir);

    const mapGroup = buildMap(this.scene, map);
    this.floor = getFloorMesh(mapGroup);

    this.controls = new TacticCameraControls(this.camera, this.renderer.domElement);

    this.resize();
    window.addEventListener('resize', this.resize);
    this.loop();
  }

  private resize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private loop = () => {
    this.frameId = requestAnimationFrame(this.loop);
    this.renderer.render(this.scene, this.camera);
  };

  /** Converte um evento de clique em coordenadas do chão (mapa), ou null se não houve interseção. */
  screenToFloor(clientX: number, clientY: number): THREE.Vector3 | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hit = this.raycaster.intersectObject(this.floor)[0];
    return hit ? hit.point.clone() : null;
  }

  dispose() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.resize);
    this.controls.dispose();
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
