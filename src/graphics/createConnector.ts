import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function createConnectorGeometry() {
  const profile = [
    [0.14, 0.2],
    [0.14, 0.76],
    [0.15, 0.79],
    [0.18, 0.81],
    [0.3, 0.81],
    [0.33, 0.8],
    [0.35, 0.77],
    [0.35, 0.35],
    [0.38, 0.27],
    [0.4, 0.2],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const tube = new THREE.LatheGeometry(profile, 32);
  const up = new THREE.Vector3(0, 1, 0);
  const parts: THREE.BufferGeometry[] = [
    [0, 1, 0],
    [0, -1, 0],
    [1, 0, 0],
    [-1, 0, 0],
    [0, 0, 1],
    [0, 0, -1],
  ].map(([x, y, z]) => {
    const arm = tube.clone();
    arm.applyQuaternion(
      new THREE.Quaternion().setFromUnitVectors(up, new THREE.Vector3(x, y, z)),
    );
    return arm;
  });
  parts.push(new THREE.SphereGeometry(0.43, 24, 16));
  const geometry = mergeGeometries(parts);
  parts.forEach((part) => part.dispose());
  tube.dispose();
  return geometry;
}

export function createConnector(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
) {
  const connector = new THREE.Group();
  connector.add(new THREE.Mesh(geometry, material));
  return connector;
}
