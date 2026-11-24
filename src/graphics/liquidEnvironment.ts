import * as THREE from 'three';

export function createLiquidEnvironment(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x35304c);
  const geometry = new THREE.PlaneGeometry(1, 1);
  const panels = [
    { color: 0xc8bbff, position: [-3, 3, 3], scale: [3, 6] },
    { color: 0x648aff, position: [-4, 0, -1], scale: [2, 7] },
    { color: 0xffc7a0, position: [3, 2, 3], scale: [2, 5] },
    { color: 0xffffff, position: [0, 5, 0], scale: [8, 2] },
    { color: 0x9c70ff, position: [2, -3, 2], scale: [6, 2] },
  ];
  const materials = panels.map(({ color, position, scale }) => {
    const material = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
    });
    material.color.multiplyScalar(3);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.scale.set(scale[0], scale[1], 1);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
    return material;
  });
  const generator = new THREE.PMREMGenerator(renderer);
  const target = generator.fromScene(scene, 0.04);
  generator.dispose();
  geometry.dispose();
  materials.forEach((material) => material.dispose());
  return target;
}
