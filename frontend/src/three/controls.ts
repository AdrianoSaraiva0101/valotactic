import * as THREE from 'three';

// Controle de câmera orbit/pan/zoom implementado à mão para não depender do
// addon OrbitControls (que não faz parte do pacote npm principal do three).
export class TacticCameraControls {
  camera: THREE.PerspectiveCamera;
  target = new THREE.Vector3(0, 0, 0);
  distance = 55;
  theta = Math.PI / 4;
  phi = 0.95;
  private dragging = false;
  private panning = false;
  private lastX = 0;
  private lastY = 0;
  private domElement: HTMLElement;
  enabled = true;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.bind();
    this.update();
  }

  private bind() {
    this.domElement.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    this.domElement.addEventListener('wheel', this.onWheel, { passive: true });
  }

  dispose() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('wheel', this.onWheel);
  }

  private onMouseDown = (e: MouseEvent) => {
    this.dragging = true;
    this.panning = e.button === 2;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  };

  private onMouseUp = () => {
    this.dragging = false;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.dragging || !this.enabled) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    if (this.panning) {
      const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 1);
      this.target.addScaledVector(right, -dx * 0.05);
      this.target.addScaledVector(up, dy * 0.05);
    } else {
      this.theta -= dx * 0.006;
      this.phi = Math.min(1.5, Math.max(0.15, this.phi - dy * 0.006));
    }
    this.update();
  };

  private onWheel = (e: WheelEvent) => {
    if (!this.enabled) return;
    this.distance = Math.min(120, Math.max(8, this.distance + e.deltaY * 0.03));
    this.update();
  };

  setPreset(preset: 'orbit' | 'top' | 'third') {
    if (preset === 'top') {
      this.phi = 0.01;
      this.distance = 70;
      this.theta = 0.0001;
    } else if (preset === 'third') {
      this.phi = 1.3;
      this.distance = 18;
    } else {
      this.phi = 0.95;
      this.distance = 55;
    }
    this.update();
  }

  update() {
    const x = this.target.x + this.distance * Math.sin(this.phi) * Math.sin(this.theta);
    const y = this.target.y + this.distance * Math.cos(this.phi);
    const z = this.target.z + this.distance * Math.sin(this.phi) * Math.cos(this.theta);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }
}
