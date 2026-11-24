import * as THREE from 'three';
import { createLiquidEnvironment } from './liquidEnvironment';
import { createLiquidLetters } from './liquidLetters';
import { createLiquidMaterial } from './liquidMaterial';

export function createLiquidWordmark(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, 0.1, 30);
  camera.position.set(0, 0, 12);
  const environment = createLiquidEnvironment(renderer);
  scene.environment = environment.texture;
  const { material, uniforms } = createLiquidMaterial();
  const letters = createLiquidLetters(material);
  scene.add(letters.word);
  const filmGeometry = new THREE.PlaneGeometry(8, 2.2, 64, 20);
  const filmPositions = filmGeometry.attributes.position;
  for (let index = 0; index < filmPositions.count; index++) {
    const x = filmPositions.getX(index);
    const y = filmPositions.getY(index);
    filmPositions.setXYZ(
      index,
      x,
      y * Math.pow(Math.max(0, Math.sin(((x + 4) / 8) * Math.PI)), 0.65) +
        Math.sin(x * 0.9) * 0.5,
      Math.cos(x * 0.9 + y) * 0.45,
    );
  }
  filmGeometry.computeVertexNormals();
  const filmMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xc7b6ed,
    metalness: 0.85,
    roughness: 0.16,
    transparent: true,
    opacity: 0.58,
    side: THREE.DoubleSide,
    iridescence: 1,
    depthWrite: false,
  });
  const film = new THREE.Mesh(filmGeometry, filmMaterial);
  film.position.z = -1.2;
  film.rotation.set(0.3, -0.12, 0.14);
  scene.add(film);
  const bubbleGeometry = new THREE.SphereGeometry(1, 28, 20);
  const bubbles = [
    [-3.7, 1.4, 0.13],
    [3.2, -1.3, 0.32],
    [4.2, 0.9, 0.07],
  ].map(([x, y, radius]) => {
    const bubble = new THREE.Mesh(bubbleGeometry, material);
    bubble.position.set(x, y, -0.2);
    bubble.scale.setScalar(radius);
    scene.add(bubble);
    return bubble;
  });
  let paused = false;
  let visible = true;
  let mobile = false;
  let lastTime = 0;
  let elapsed = 0;
  let strength = 0;
  const pointer = new THREE.Vector2();
  const pull = new THREE.Vector2();
  const springVelocity = new THREE.Vector2();
  const movePointer = (event: PointerEvent) => {
    if (paused || event.pointerType !== 'mouse') return;
    const rect = canvas.getBoundingClientRect();
    const next = new THREE.Vector2(
      (((event.clientX - rect.left) / rect.width) * 2 - 1) * camera.right,
      (1 - ((event.clientY - rect.top) / rect.height) * 2) * camera.top,
    );
    pull.subVectors(next, uniforms.liquidPointer.value).clampLength(0, 1.2);
    pointer.copy(next);
    strength = 1;
  };
  const leavePointer = () => {
    strength = 0;
    pull.set(0, 0);
  };
  canvas.addEventListener('pointermove', movePointer);
  canvas.addEventListener('pointerleave', leavePointer);
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    mobile = width < 600;
    const halfWidth = mobile ? 2.9 : 5.2;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = (halfWidth * height) / width;
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    letters.layout(mobile);
    film.scale.set(
      mobile ? 0.64 : 1,
      mobile ? 1.5 : Math.min(1, camera.top / 2.4),
      1,
    );
    bubbles.forEach((bubble, index) => {
      bubble.visible = !mobile || index === 1;
      const verticalLimit = Math.max(0, camera.top - bubble.scale.y - 0.1);
      bubble.position.y =
        index === 1
          ? -Math.min(mobile ? 1.85 : 1.3, verticalLimit)
          : Math.min(index === 0 ? 1.4 : 0.9, verticalLimit);
      if (index === 1) {
        bubble.position.x = mobile ? 2 : 3.2;
      }
    });
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  observer.observe(canvas);
  resize();
  renderer.setAnimationLoop((time) => {
    const delta = Math.min((time - lastTime) / 1000, 0.04);
    lastTime = time;
    if (!visible || document.hidden || paused) return;
    elapsed += delta;
    uniforms.liquidTime.value = elapsed;
    uniforms.liquidPointer.value.lerp(pointer, 1 - Math.exp(-delta * 12));
    springVelocity.addScaledVector(
      pull.clone().sub(uniforms.liquidPull.value),
      delta * 110,
    );
    springVelocity.multiplyScalar(Math.exp(-delta * 13));
    uniforms.liquidPull.value.addScaledVector(springVelocity, delta);
    uniforms.liquidStrength.value +=
      (strength - uniforms.liquidStrength.value) * (1 - Math.exp(-delta * 5));
    pull.multiplyScalar(Math.exp(-delta * 3));
    const travel = Math.max(
      0,
      -canvas.getBoundingClientRect().top / window.innerHeight,
    );
    letters.word.rotation.set(
      Math.sin(elapsed * 0.24) * 0.05,
      Math.sin(elapsed * 0.18) * 0.055,
      Math.sin(elapsed * 0.16) * 0.018,
    );
    letters.word.position.y = travel * 0.22;
    film.rotation.x = 0.3 + Math.sin(elapsed * 0.22) * 0.15;
    film.rotation.z =
      (0.14 + Math.sin(elapsed * 0.18) * 0.07) * Math.min(1, camera.top / 2.4);
    bubbles.forEach((bubble, index) => {
      bubble.position.z = Math.sin(elapsed * 0.4 + index) * 0.2;
    });
    renderer.render(scene, camera);
  });
  return {
    setPaused(value: boolean) {
      paused = value;
      if (value) {
        leavePointer();
        uniforms.liquidStrength.value = 0;
        renderer.render(scene, camera);
      }
    },
    dispose() {
      renderer.setAnimationLoop(null);
      canvas.removeEventListener('pointermove', movePointer);
      canvas.removeEventListener('pointerleave', leavePointer);
      observer.disconnect();
      sizeObserver.disconnect();
      letters.dispose();
      filmGeometry.dispose();
      filmMaterial.dispose();
      bubbleGeometry.dispose();
      material.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
