import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createConnector, createConnectorGeometry } from './createConnector';

export function createIdeaScene(
  canvas: HTMLCanvasElement,
  reducedMotion: boolean,
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x151519);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0, 0, 14);
  const environment = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const texture = generator.fromScene(environment, 0.04);
  scene.environment = texture.texture;
  environment.dispose();
  generator.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x262024, 0.8));
  const key = new THREE.DirectionalLight(0xfff7e6, 1.6);
  key.position.set(-4, 6, 8);
  scene.add(key);
  const geometry = createConnectorGeometry();
  const materials = [0xffd526, 0xf0e9d3, 0xed2616, 0x131315].map(
    (color) =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: 0.08,
        roughness: 0.38,
      }),
  );
  const group = new THREE.Group();
  scene.add(group);
  const pieces = Array.from({ length: 26 }, (_, index) => {
    const object = createConnector(
      geometry,
      materials[index % materials.length],
    );
    const angle = index * 2.39996;
    const radius = Math.sqrt(index / 26) * 8.6;
    const origin = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.6,
      Math.sin(index * 7) * 2,
    );
    object.position.copy(origin);
    object.rotation.set(index * 0.72, index * 0.43, index * 0.21);
    object.scale.setScalar(1.35 + (index % 4) * 0.15);
    group.add(object);
    return { object, origin };
  });
  let visible = true;
  let paused = reducedMotion;
  let progress = 0;
  const pointer = new THREE.Vector2();
  const targetPointer = new THREE.Vector2();
  let time = 0;
  let lastTime = 0;
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 0.8 ? 19 : 14;
    camera.updateProjectionMatrix();
  };
  const move = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    targetPointer.set(
      (event.clientX - bounds.left) / bounds.width - 0.5,
      (event.clientY - bounds.top) / bounds.height - 0.5,
    );
  };
  const leave = () => targetPointer.set(0, 0);
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  intersection.observe(canvas);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerleave', leave);
  resize();
  renderer.setAnimationLoop((timestamp: number) => {
    const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    if (!visible || document.hidden) return;
    if (!paused) time += delta;
    pointer.lerp(targetPointer, 0.035);
    group.rotation.set(pointer.y * 0.12, pointer.x * 0.2 + progress * 0.35, 0);
    pieces.forEach(({ object, origin }, index) => {
      const drift = paused ? 0 : Math.sin(time * 0.38 + index) * 0.23;
      object.position.set(
        origin.x,
        origin.y + drift - progress * 0.6,
        origin.z,
      );
      object.rotation.x = index * 0.72 + time * (index % 2 ? 0.1 : -0.09);
      object.rotation.y = index * 0.43 + time * 0.12;
    });
    renderer.render(scene, camera);
  });
  return {
    setPaused(value: boolean) {
      paused = value;
    },
    setProgress(value: number) {
      progress = value;
    },
    dispose() {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      geometry.dispose();
      materials.forEach((material) => material.dispose());
      texture.dispose();
      renderer.dispose();
    },
  };
}
