import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';

type Stroke = [number, number][];

const letterStrokes: Record<string, Stroke[]> = {
  W: [
    [
      [0, 1],
      [0.15, 0.12],
      [0.3, 0],
      [0.52, 0.67],
      [0.68, 0],
      [0.85, 0.12],
      [1, 1],
    ],
  ],
  E: [
    [
      [0.86, 0.96],
      [0.3, 1],
      [0.08, 0.78],
      [0.06, 0.22],
      [0.3, 0],
      [0.87, 0.06],
    ],
    [
      [0.1, 0.5],
      [0.4, 0.51],
      [0.7, 0.56],
    ],
  ],
  N: [
    [
      [0.08, 0],
      [0.1, 0.94],
      [0.26, 0.96],
      [0.75, 0.08],
      [0.9, 0.06],
      [0.94, 1],
    ],
  ],
  D: [
    [
      [0.12, 0.02],
      [0.12, 0.94],
      [0.45, 1],
      [0.91, 0.78],
      [0.91, 0.28],
      [0.53, 0],
      [0.12, 0.02],
    ],
  ],
  A: [
    [
      [0, 0],
      [0.35, 0.88],
      [0.51, 1],
      [0.68, 0.86],
      [1, 0],
    ],
    [
      [0.16, 0.31],
      [0.5, 0.36],
      [0.84, 0.31],
    ],
  ],
  V: [
    [
      [0, 1],
      [0.23, 0.32],
      [0.5, 0],
      [0.75, 0.34],
      [1, 1],
    ],
  ],
};

function makeLetter(strokes: Stroke[], seed: number, material: THREE.Material) {
  const resolution = 48;
  const surface = new MarchingCubes(resolution, material, false, false, 16000);
  surface.isolation = 0;
  surface.field.fill(-0.4);
  for (const points of strokes) {
    const curve = new THREE.CatmullRomCurve3(
      points.map(
        ([x, y], index) =>
          new THREE.Vector3(
            x - 0.5,
            y - 0.5,
            Math.sin(index * 1.8 + seed) * 0.045,
          ),
      ),
      false,
      'catmullrom',
      0.25,
    );
    for (let sample = 0; sample <= 80; sample++) {
      const t = sample / 80;
      const center = curve.getPointAt(t);
      const radius = 0.175 * (1 + Math.sin(t * Math.PI * 2 + seed) * 0.22);
      const reach = radius + 0.1;
      const lower = [center.x, center.y, center.z].map((value) =>
        Math.max(1, Math.floor(((value - reach + 1) * resolution) / 2)),
      );
      const upper = [center.x, center.y, center.z].map((value) =>
        Math.min(
          resolution - 2,
          Math.ceil(((value + reach + 1) * resolution) / 2),
        ),
      );
      for (let z = lower[2]; z <= upper[2]; z++) {
        for (let y = lower[1]; y <= upper[1]; y++) {
          for (let x = lower[0]; x <= upper[0]; x++) {
            const distance = Math.hypot(
              (x * 2) / resolution - 1 - center.x,
              (y * 2) / resolution - 1 - center.y,
              (z * 2) / resolution - 1 - center.z,
            );
            const index = x + y * resolution + z * resolution * resolution;
            surface.field[index] = Math.max(
              surface.field[index],
              radius - distance,
            );
          }
        }
      }
    }
  }
  surface.blur(0.5);
  surface.update();
  const geometry = new THREE.BufferGeometry();
  for (const name of ['position', 'normal']) {
    const attribute = surface.geometry.getAttribute(name);
    geometry.setAttribute(
      name,
      new THREE.Float32BufferAttribute(
        attribute.array.slice(0, surface.geometry.drawRange.count * 3),
        3,
      ),
    );
  }
  geometry.translate(0.5, 0.5, 0);
  surface.geometry.dispose();
  return geometry;
}

export function createLiquidLetters(material: THREE.Material) {
  const word = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const letters = [...'WENDAVA'].map((letter, index) => {
    const geometry = makeLetter(letterStrokes[letter], index * 0.6, material);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    word.add(mesh);
    return mesh;
  });
  return {
    word,
    layout(mobile: boolean) {
      letters.forEach((letter, index) => {
        const secondRow = mobile && index >= 3;
        const column = secondRow ? index - 3 : index;
        const rowLength = mobile ? (secondRow ? 4 : 3) : 7;
        letter.position.set(
          (column - (rowLength - 1) / 2) * 1.27 - 0.5,
          mobile ? (secondRow ? -1.33 : 0.3) : -0.5,
          0,
        );
        letter.rotation.z = Math.sin(index * 3) * 0.035;
      });
    },
    dispose() {
      geometries.forEach((geometry) => geometry.dispose());
    },
  };
}
