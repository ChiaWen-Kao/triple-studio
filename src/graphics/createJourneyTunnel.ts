import * as THREE from 'three';
import { createConnector, createConnectorGeometry } from './createConnector';

function makePanelTexture(title: string, subtitle: string, accent: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 512;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#f7f7ef';
  context.fillRect(0, 0, 768, 512);
  context.fillStyle = '#181819';
  context.font = '20px Arial';
  context.fillText('WENDAVA / IDEAS TAKE SHAPE', 40, 52);
  context.font = '72px Arial';
  context.fillText(title, 40, 158);
  context.font = '26px Arial';
  context.fillText(subtitle, 40, 210);
  context.fillStyle = accent;
  for (let index = 0; index < 6; index++) {
    context.beginPath();
    context.roundRect(40 + index * 116, 275, 92, 155 - index * 15, 18);
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createJourneyTunnel(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111114);
  scene.fog = new THREE.FogExp2(0x111114, 0.022);
  const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 100);
  camera.position.z = 12;
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  const light = new THREE.PointLight(0xffdfa0, 90);
  camera.add(light);
  scene.add(camera);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const panelGeometry = new THREE.PlaneGeometry(7.2, 4.8);
  const connectorGeometry = createConnectorGeometry();
  const materials = [0xf3c827, 0xe94222, 0x48494b, 0xf0e7ce].map(
    (color) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.38,
        metalness: 0.25,
        emissive: color,
        emissiveIntensity: 0.35,
      }),
  );
  const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.24,
  });
  const blocks = new THREE.InstancedMesh(box, gridMaterial, 240);
  const matrix = new THREE.Object3D();
  for (let index = 0; index < 240; index++) {
    const angle = index * 2.39996;
    const radius = 8 + Math.sin(index * 7) * 1.3;
    matrix.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      8 - index * 0.28,
    );
    matrix.rotation.z = angle;
    matrix.scale.set(
      0.08 + (index % 3) * 0.12,
      1 + (index % 7) * 0.6,
      0.15 + (index % 5) * 0.6,
    );
    matrix.updateMatrix();
    blocks.setMatrixAt(index, matrix.matrix);
    blocks.setColorAt(
      index,
      new THREE.Color(
        index % 9 === 0 ? 0xffc500 : index % 7 === 0 ? 0xf54a26 : 0x81868b,
      ),
    );
  }
  scene.add(blocks);
  const frames: THREE.Mesh[] = [];
  for (let index = 0; index < 15; index++) {
    const frame = new THREE.Mesh(
      new THREE.TorusGeometry(8.5, 0.018, 4, 4),
      materials[index % 2],
    );
    frame.position.z = 8 - index * 4.5;
    frame.rotation.z = Math.PI / 4 + index * 0.035;
    frames.push(frame);
    scene.add(frame);
  }
  const textures = [
    makePanelTexture('An idea.', 'Something worth exploring.', '#ef4728'),
    makePanelTexture('A clear path.', 'A useful next step.', '#e4be2a'),
    makePanelTexture(
      'Real progress.',
      'Made for the people who use it.',
      '#344e42',
    ),
  ];
  const panelMaterials = textures.map(
    (map) => new THREE.MeshBasicMaterial({ map, side: THREE.DoubleSide }),
  );
  const panels = panelMaterials.map((material, index) => {
    const panel = new THREE.Mesh(panelGeometry, material);
    panel.position.set(
      index % 2 ? 4.4 : -4.4,
      index % 2 ? 1 : -1,
      -8 - index * 17,
    );
    panel.rotation.y = index % 2 ? -0.48 : 0.48;
    panel.rotation.z = index % 2 ? -0.12 : 0.12;
    scene.add(panel);
    return panel;
  });
  const pieces = Array.from({ length: 14 }, (_, index) => {
    const piece = createConnector(
      connectorGeometry,
      materials[index % materials.length],
    );
    piece.position.set(
      Math.sin(index * 2.4) * 5.5,
      Math.cos(index * 2.4) * 4.5,
      -index * 4.5,
    );
    piece.rotation.set(index, index * 0.4, index * 0.7);
    scene.add(piece);
    return piece;
  });
  let target = 0;
  let current = 0;
  let visible = false;
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  observer.observe(canvas);
  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
  };
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);
  resize();
  renderer.setAnimationLoop(() => {
    if (!visible || document.hidden) return;
    current += (target - current) * 0.075;
    camera.position.set(
      Math.sin(current * Math.PI * 2) * 0.65,
      Math.sin(current * Math.PI) * 0.4,
      12 - current * 61,
    );
    camera.rotation.z = Math.sin(current * Math.PI * 2) * 0.08;
    pieces.forEach((piece, index) => {
      piece.rotation.y = index * 0.4 + current * 2;
    });
    panels.forEach((panel, index) => {
      panel.rotation.z = (index % 2 ? -0.12 : 0.12) + current * 0.1;
    });
    renderer.render(scene, camera);
  });
  return {
    setProgress(progress: number) {
      target = progress;
    },
    dispose() {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      sizeObserver.disconnect();
      gridMaterial.dispose();
      box.dispose();
      panelGeometry.dispose();
      connectorGeometry.dispose();
      frames.forEach((frame) => frame.geometry.dispose());
      [...materials, ...panelMaterials].forEach((material) =>
        material.dispose(),
      );
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
    },
  };
}
