import * as THREE from 'three';

export const SCULPTURE_VIOLET = '#7A3CFF';

function roundedProfile(inner: number, outer: number, height: number, bevel: number) {
  const profile: THREE.Vector2[] = [];
  const corners = [
    [outer - bevel, bevel, -Math.PI / 2],
    [outer - bevel, height - bevel, 0],
    [inner + bevel, height - bevel, Math.PI / 2],
    [inner + bevel, bevel, Math.PI],
  ];
  for (const [r, y, angle] of corners) {
    for (let step = 0; step <= 5; step++) {
      const a = angle + (step / 5) * Math.PI / 2;
      profile.push(new THREE.Vector2(r + Math.cos(a) * bevel, y + Math.sin(a) * bevel));
    }
  }
  profile.push(profile[0].clone());
  return profile;
}

/** A closed, rounded rectangular section revolved around the vertical axis. */
export function ceramicWall(
  inner: number,
  outer: number,
  height: number,
  start = 0,
  sweep = Math.PI * 2,
  bevel = 0.025,
): THREE.BufferGeometry {
  const rounded = roundedProfile(inner, outer, height, bevel);
  const profile: THREE.Vector2[] = [];
  // Sample the straight walls so rim occlusion fades locally, rather than
  // interpolating one flat shade over the entire cylinder height.
  for (let i = 0; i < rounded.length - 1; i++) {
    const current = rounded[i];
    const next = rounded[i + 1];
    const steps = Math.max(1, Math.ceil(Math.abs(next.y - current.y) / 0.08));
    for (let step = 0; step < steps; step++) {
      profile.push(current.clone().lerp(next, step / steps));
    }
  }
  profile.push(rounded[rounded.length - 1].clone());

  // LatheGeometry uses sin(theta) for x, cos(theta) for z.
  const wall = new THREE.LatheGeometry(profile, 192, start, sweep);
  if (sweep >= Math.PI * 2 - 0.001) return wall;

  // Close both cut ends. Keep cap vertices separate for clean planar normals.
  const outline = profile.slice(0, -1);
  const triangles = THREE.ShapeUtils.triangulateShape(outline, []);
  const positions = Array.from(wall.attributes.position.array);
  const normals = Array.from(wall.attributes.normal.array);
  const uvs = Array.from(wall.attributes.uv.array);
  const indices = Array.from(wall.index!.array);
  for (const [end, angle] of [start, start + sweep].entries()) {
    const offset = positions.length / 3;
    for (const point of outline) {
      positions.push(point.x * Math.sin(angle), point.y, point.x * Math.cos(angle));
      const sign = end === 0 ? -1 : 1;
      normals.push(Math.cos(angle) * sign, 0, -Math.sin(angle) * sign);
      uvs.push((point.x - inner) / (outer - inner), point.y / height);
    }
    for (const [a, b, c] of triangles) {
      // Counterclockwise profile triangles face along the positive arc tangent.
      const face = end === 0 ? [a, c, b] : [a, b, c];
      indices.push(...face.map(index => offset + index));
    }
  }
  wall.dispose();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

/** One closed descending ribbon, with gently bevelled edges and solid end caps. */
export function spiralRibbon(): THREE.BufferGeometry {
  const segments = 240;
  const positions: number[] = [];
  const indices: number[] = [];
  const start = Math.PI - 0.82;
  const sweep = Math.PI * 1.76;
  const thickness = 0.11;
  const section = (t: number) => {
    // Keep the upper turn inside the crown opening before flaring below it.
    const flare = Math.pow(t, 4);
    return {
      inner: 1.32 + 0.18 * flare,
      outer: 1.64 + 0.35 * THREE.MathUtils.smoothstep(t, 0.44, 0.7),
      y: 3.08 - 2.53 * t,
    };
  };
  const profileLength = roundedProfile(1.32, 1.99, thickness, 0.015).length;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const { inner, outer, y } = section(t);
    const angle = start + sweep * t;
    const profile = roundedProfile(inner, outer, thickness, 0.015);
    for (const point of profile) {
      positions.push(point.x * Math.sin(angle), y - thickness + point.y, point.x * Math.cos(angle));
    }
    if (i === segments) continue;
    for (let j = 0; j < profileLength - 1; j++) {
      const a = i * profileLength + j;
      const b = a + profileLength;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  for (const t of [0, 1]) {
    const { inner, outer, y } = section(t);
    const angle = start + sweep * t;
    const profile = roundedProfile(inner, outer, thickness, 0.015).slice(0, -1);
    const offset = positions.length / 3;
    for (const point of profile) {
      positions.push(point.x * Math.sin(angle), y - thickness + point.y, point.x * Math.cos(angle));
    }
    for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(profile, [])) {
      const face = t === 0 ? [a, c, b] : [a, b, c];
      indices.push(...face.map(index => offset + index));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createSculptureGeometry() {
  const glass = ceramicWall(1.14, 1.32, 2.45, -0.73, Math.PI * 0.83, 0.008);
  glass.rotateY(Math.PI);
  const colors: number[] = [];
  const paleViolet = new THREE.Color('#d3bdff');
  const violet = new THREE.Color(SCULPTURE_VIOLET);
  const position = glass.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const t = THREE.MathUtils.smoothstep(position.getX(i), -1.235, 1.235);
    const verticalFade = THREE.MathUtils.smoothstep(position.getY(i), 0, 2.45);
    const color = paleViolet.clone().lerp(violet, 0.16 + t * (0.65 + 0.08 * verticalFade));
    const alpha = THREE.MathUtils.lerp(0.76, 0.98, t) * (0.94 + 0.06 * verticalFade);
    colors.push(color.r, color.g, color.b, alpha);
  }
  glass.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
  const geometry = {
    crown: ceramicWall(1.7, 2.52, 1.3, 0, Math.PI * 2, 0.03),
    middle: ceramicWall(2.12, 2.46, 1.20, 0, Math.PI * 2, 0.025),
    base: ceramicWall(1.74, 2.44, 0.44, 0, Math.PI * 2, 0.025),
    ribbon: spiralRibbon(),
    glass,
  };
  // Hemisphere visibility against the actual annular wall volumes. This bakes
  // local ambient occlusion at ring/ramp junctions without a render pass.
  const volumes = [
    { x: 0, z: 0, y: 2.15, h: 1.3, inner: 1.7, outer: 2.52 },
    { x: -0.035, z: -0.035, y: 0.44, h: 1.2, inner: 2.12, outer: 2.46 },
    { x: 0, z: 0, y: 0, h: 0.44, inner: 1.74, outer: 2.44 },
  ];
  const ribbonOccludes = (point: THREE.Vector3) => {
    const radius = Math.hypot(point.x, point.z);
    if (radius < 1.32 || radius > 1.99) return false;
    const angle = Math.atan2(point.x, point.z);
    for (let turn = -1; turn <= 2; turn++) {
      const t = (angle + turn * Math.PI * 2 - (Math.PI - 0.82)) / (Math.PI * 1.76);
      if (t < 0 || t > 1) continue;
      const inner = 1.32 + 0.18 * Math.pow(t, 4);
      const outer = 1.64 + 0.35 * THREE.MathUtils.smoothstep(t, 0.44, 0.7);
      const top = 3.08 - 2.53 * t;
      if (radius > inner && radius < outer && point.y > top - 0.11 && point.y < top) return true;
    }
    return false;
  };
  const sample = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const bitangent = new THREE.Vector3();
  for (const [name, wall] of Object.entries(geometry)) {
    if (name === 'glass') continue;
    const positions = wall.getAttribute('position');
    const normals = wall.getAttribute('normal');
    const colors: number[] = [];
    const height = name === 'crown' ? 1.3 : name === 'middle' ? 1.2 : 0.44;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const radialNormal = (x * normals.getX(i) + z * normals.getZ(i)) / Math.max(Math.hypot(x, z), 0.001);
      const cavity = Math.max(0, -radialNormal);
      const underRim = Math.max(0, -normals.getY(i));
      const verticalFace = 1 - Math.abs(normals.getY(i));
      const shadowSide = 1 - THREE.MathUtils.smoothstep(normals.getX(i) * 0.84 + normals.getZ(i) * 0.28, -0.8, 0.65);
      const rimFade = name === 'ribbon' ? 0 : Math.exp(-Math.max(0, height - positions.getY(i)) / 0.15);
      const lowerRimFade = name === 'ribbon' ? 0 : Math.exp(-Math.max(0, positions.getY(i)) / 0.14);
      const volume = name === 'crown' ? volumes[0] : name === 'middle' ? volumes[1] : volumes[2];
      const worldY = positions.getY(i) + (name === 'ribbon' ? 0 : volume.y);
      const worldX = x + (name === 'middle' ? -0.035 : 0);
      const worldZ = z + (name === 'middle' ? -0.035 : 0);
      normal.fromBufferAttribute(normals, i).normalize();
      tangent.set(0, 1, 0);
      if (Math.abs(normal.y) > 0.9) tangent.set(1, 0, 0);
      tangent.cross(normal).normalize();
      bitangent.crossVectors(normal, tangent);
      let blocked = 0;
      for (let ray = 0; ray < 12; ray++) {
        const angle = ray * Math.PI / 6;
        for (const distance of [0.06, 0.14, 0.28, 0.5, 0.8]) {
          sample.copy(normal).multiplyScalar(0.65)
            .addScaledVector(tangent, Math.cos(angle) * 0.76)
            .addScaledVector(bitangent, Math.sin(angle) * 0.76)
            .multiplyScalar(distance).add(new THREE.Vector3(worldX, worldY, worldZ));
          if (volumes.some(v => {
            const radius = Math.hypot(sample.x - v.x, sample.z - v.z);
            return sample.y > v.y + 0.005 && sample.y < v.y + v.h - 0.005
              && radius > v.inner + 0.005 && radius < v.outer - 0.005;
          }) || ribbonOccludes(sample)) { blocked++; break; }
        }
      }
      const shade = 1 - blocked / 12 * 0.74 - verticalFace * (0.035 + shadowSide * 0.54)
        - cavity * (0.27 + rimFade * 0.22) - underRim * 0.27
        - Math.max(0, radialNormal) * lowerRimFade * 0.075;
      const occlusion = Math.max(0.18, shade);
      // Violet bounce stays local to the cavity and the inner spiral, leaving
      // the broad exterior ceramic neutral and the upward rims bright.
      const bounce = Math.exp(-Math.hypot(worldX - 0.15, worldZ) / 1.5)
        * Math.exp(-Math.abs(worldY - 1.35) / 1.25)
        * (name === 'ribbon' ? 0.42 : cavity * 0.32 + underRim * 0.12);
      colors.push(occlusion * (1 - bounce * 0.23), occlusion * (1 - bounce * 0.7),
        Math.min(1, occlusion + bounce * 0.3));
    }
    wall.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  }
  return geometry;
}

/** Soft contact / reflection textures, made once without a postprocessing pass. */
export function radialTexture(color: THREE.Color, opacity: number, falloff = 2.5, coreRadius = 0) {
  const resolution = 128;
  const data = new Uint8Array(resolution * resolution * 4);
  const srgb = color.clone().convertLinearToSRGB();
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const radius = Math.hypot((x + 0.5) / resolution * 2 - 1, (y + 0.5) / resolution * 2 - 1);
      const offset = (y * resolution + x) * 4;
      data[offset] = Math.round(srgb.r * 255);
      data[offset + 1] = Math.round(srgb.g * 255);
      data[offset + 2] = Math.round(srgb.b * 255);
      const feather = Math.max(0, (radius - coreRadius) / (1 - coreRadius));
      data[offset + 3] = Math.pow(Math.max(0, 1 - feather), falloff) * opacity * 255;
    }
  }
  const texture = new THREE.DataTexture(data, resolution, resolution);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
