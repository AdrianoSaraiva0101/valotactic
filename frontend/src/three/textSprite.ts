import * as THREE from 'three';

export function makeTextSprite(
  text: string,
  opts: { size?: number; color?: string; bg?: string } = {}
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const scale = 8;
  canvas.width = 256;
  canvas.height = 64;
  ctx.font = `700 ${opts.size ?? 28}px sans-serif`;
  ctx.fillStyle = opts.bg ?? 'rgba(10,13,18,0.75)';
  const width = ctx.measureText(text).width;
  ctx.fillRect(0, 10, width + 20, 44);
  ctx.fillStyle = opts.color ?? '#e7ebf0';
  ctx.fillText(text, 10, 42);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set((width + 20) / scale, 44 / scale, 1);
  sprite.renderOrder = 999;
  return sprite;
}
