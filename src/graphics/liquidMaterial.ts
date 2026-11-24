import * as THREE from 'three';

export function createLiquidMaterial() {
  const uniforms = {
    liquidTime: { value: 0 },
    liquidPointer: { value: new THREE.Vector2() },
    liquidPull: { value: new THREE.Vector2() },
    liquidStrength: { value: 0 },
  };
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xede3ff,
    metalness: 0.8,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    iridescence: 0.85,
    iridescenceIOR: 1.35,
    iridescenceThicknessMinimum: 180,
    iridescenceThicknessMaximum: 460,
    envMapIntensity: 1.7,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = `
      uniform float liquidTime;
      uniform vec2 liquidPointer;
      uniform vec2 liquidPull;
      uniform float liquidStrength;
      vec3 liquidPosition(vec3 p) {
        vec3 world = (modelMatrix * vec4(p, 1.0)).xyz;
        float distanceToPointer = distance(world.xy, liquidPointer);
        float influence = exp(-distanceToPointer * distanceToPointer * 2.8) * liquidStrength;
        float ripple = sin(distanceToPointer * 9.0 - liquidTime * 3.0);
        p.xy += liquidPull * influence * 0.45;
        p.z += ripple * influence * 0.13;
        p.z += sin(world.x * 2.0 + world.y * 2.4 + liquidTime * 0.65) * 0.035;
        return p;
      }
    ${shader.vertexShader}`;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `#include <beginnormal_vertex>
      vec3 liquidTangent = normalize(cross(objectNormal, abs(objectNormal.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
      vec3 liquidBitangent = cross(objectNormal, liquidTangent);
      vec3 liquidOrigin = liquidPosition(position);
      vec3 liquidU = liquidPosition(position + liquidTangent * 0.005) - liquidOrigin;
      vec3 liquidV = liquidPosition(position + liquidBitangent * 0.005) - liquidOrigin;
      objectNormal = normalize(cross(liquidU, liquidV));`,
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      'vec3 transformed = liquidPosition(position);',
    );
  };
  return { material, uniforms };
}
