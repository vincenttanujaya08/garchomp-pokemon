const CaveGeometry = {
  createHollowCaveBody(
    radius = 15,
    entranceWidth = 12,
    entranceHeight = 14,
    segments = 64,
    floorThickness = 1.2,
    wallThickness = 0.8,
    bevelRings = 4
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const halfW = entranceWidth / 2;
    const halfH = entranceHeight / 2;
    const entranceCenterY = 2;
    function noise(x, y) {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return (n - Math.floor(n)) * 2 - 1;
    }
    function smoothNoise(x, y) {
      const fx = x - Math.floor(x),
        fy = y - Math.floor(y);
      const x1 = Math.floor(x),
        y1 = Math.floor(y);
      const x2 = x1 + 1,
        y2 = y1 + 1;
      const v1 = noise(x1, y1),
        v2 = noise(x2, y1);
      const v3 = noise(x1, y2),
        v4 = noise(x2, y2);
      const cx = fx * fx * (3 - 2 * fx);
      const cy = fy * fy * (3 - 2 * fy);
      const i1 = v1 * (1 - cx) + v2 * cx;
      const i2 = v3 * (1 - cx) + v4 * cx;
      return i1 * (1 - cy) + i2 * cy;
    }
    function layeredNoise(x, y, octaves = 4) {
      let total = 0,
        frequency = 1,
        amplitude = 1,
        maxValue = 0;
      for (let i = 0; i < octaves; i++) {
        total += smoothNoise(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }
      return total / maxValue;
    }
    function inEntrance(x, y, z) {
      const zThreshold = radius * 0.65;
      if (z < zThreshold) return false;
      if (y < 0.2) return false;
      const nx = x / (halfW * 1.02);
      const ny = (y - entranceCenterY) / (halfH * 1.02);
      return nx * nx + ny * ny <= 1.0;
    }
    const midPos = [];
    const midNorm = [];
    const valid = [];
    for (let lat = 0; lat <= segments; lat++) {
      const theta = (lat * Math.PI) / (segments * 2);
      const sinT = Math.sin(theta),
        cosT = Math.cos(theta);
      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const sinP = Math.sin(phi),
          cosP = Math.cos(phi);
        let x = radius * cosP * sinT;
        let y = radius * cosT;
        let z = radius * sinP * sinT;
        const n1 = layeredNoise(lon * 0.45, lat * 0.45, 4);
        const n2 = layeredNoise(lon * 0.9 + 77, lat * 0.9 + 77, 3) * 0.5;
        const heightFactor = 1 - cosT * 0.7;
        const disp = 1 + (n1 * 0.22 + n2 * 0.12) * (0.4 + 0.6 * heightFactor);
        x *= disp;
        y *= disp;
        z *= disp;
        const len = Math.hypot(x, y, z) || 1;
        const nx = x / len,
          ny = y / len,
          nz = z / len;
        midPos.push([x, y, z]);
        midNorm.push([nx, ny, nz]);
        valid.push(true);
      }
    }
    const vertIndexOuter = new Array(midPos.length);
    const vertIndexInner = new Array(midPos.length);
    for (let i = 0; i < midPos.length; i++) {
      const [x, y, z] = midPos[i];
      const [nx, ny, nz] = midNorm[i];
      const xo = x + nx * (wallThickness * 0.5);
      const yo = y + ny * (wallThickness * 0.5);
      const zo = z + nz * (wallThickness * 0.5);
      const io = vertices.length / 3;
      vertices.push(xo, yo, zo);
      normals.push(nx, ny, nz);
      vertIndexOuter[i] = io;
      const xi = x - nx * (wallThickness * 0.5);
      const yi = y - ny * (wallThickness * 0.5);
      const zi = z - nz * (wallThickness * 0.5);
      const ii = vertices.length / 3;
      vertices.push(xi, yi, zi);
      normals.push(-nx, -ny, -nz);
      vertIndexInner[i] = ii;
    }
    const V = (lat, lon) => lat * (segments + 1) + lon;
    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = V(lat, lon);
        const b = V(lat + 1, lon);
        const c = V(lat, lon + 1);
        const d = V(lat + 1, lon + 1);
        const centerX =
          (midPos[a][0] + midPos[b][0] + midPos[c][0] + midPos[d][0]) * 0.25;
        const centerY =
          (midPos[a][1] + midPos[b][1] + midPos[c][1] + midPos[d][1]) * 0.25;
        const centerZ =
          (midPos[a][2] + midPos[b][2] + midPos[c][2] + midPos[d][2]) * 0.25;
        const cut = inEntrance(centerX, centerY, centerZ);
        if (!cut) {
          const ao = vertIndexOuter[a],
            bo = vertIndexOuter[b],
            co = vertIndexOuter[c],
            do_ = vertIndexOuter[d];
          indices.push(ao, bo, co);
          indices.push(bo, do_, co);
        }
        if (!cut) {
          const ai = vertIndexInner[a],
            bi = vertIndexInner[b],
            ci = vertIndexInner[c],
            di = vertIndexInner[d];
          indices.push(ai, ci, bi);
          indices.push(bi, ci, di);
        }
      }
    }
    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = V(lat, lon);
        const b = V(lat + 1, lon);
        const c = V(lat, lon + 1);
        const d = V(lat + 1, lon + 1);
        const centerX =
          (midPos[a][0] + midPos[b][0] + midPos[c][0] + midPos[d][0]) * 0.25;
        const centerY =
          (midPos[a][1] + midPos[b][1] + midPos[c][1] + midPos[d][1]) * 0.25;
        const centerZ =
          (midPos[a][2] + midPos[b][2] + midPos[c][2] + midPos[d][2]) * 0.25;
        const cut = inEntrance(centerX, centerY, centerZ);
        if (cut) continue;
        const pairs = [
          [a, c],
          [b, d],
          [a, b],
          [c, d],
        ];
        for (const [p, q] of pairs) {
          const po = vertIndexOuter[p],
            qo = vertIndexOuter[q];
          const pi = vertIndexInner[p],
            qi = vertIndexInner[q];
          indices.push(po, pi, qo);
          indices.push(qo, pi, qi);
        }
      }
    }
    const rimVertsOuter = [];
    const rimVertsInner = [];
    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = V(lat, lon);
        const b = V(lat + 1, lon);
        const c = V(lat, lon + 1);
        const d = V(lat + 1, lon + 1);
        const centerX =
          (midPos[a][0] + midPos[b][0] + midPos[c][0] + midPos[d][0]) * 0.25;
        const centerY =
          (midPos[a][1] + midPos[b][1] + midPos[c][1] + midPos[d][1]) * 0.25;
        const centerZ =
          (midPos[a][2] + midPos[b][2] + midPos[c][2] + midPos[d][2]) * 0.25;
        const cut = inEntrance(centerX, centerY, centerZ);
        if (!cut) continue;
        const corners = [a, b, d, c];
        for (let k = 0; k < 4; k++) {
          const i0 = corners[k];
          const i1 = corners[(k + 1) % 4];
          const midx = (midPos[i0][0] + midPos[i1][0]) * 0.5;
          const midy = (midPos[i0][1] + midPos[i1][1]) * 0.5;
          const midz = (midPos[i0][2] + midPos[i1][2]) * 0.5;
          const neighborCut = inEntrance(midx, midy, midz);
          if (!neighborCut) {
            rimVertsOuter.push([vertIndexOuter[i0], vertIndexOuter[i1]]);
            rimVertsInner.push([vertIndexInner[i0], vertIndexInner[i1]]);
          }
        }
      }
    }
    function dedupEdges(edges) {
      const set = new Set();
      const out = [];
      for (const [a, b] of edges) {
        const key = a < b ? `${a}-${b}` : `${b}-${a}`;
        if (!set.has(key)) {
          set.add(key);
          out.push([a, b]);
        }
      }
      return out;
    }
    const rimO = dedupEdges(rimVertsOuter);
    const rimI = dedupEdges(rimVertsInner);

    function pushBevel(edges, outward = +1) {
      const ringsIdx = [];
      for (let r = 1; r <= bevelRings; r++) {
        const t = r / bevelRings;
        const layer = [];
        for (const [a, b] of edges) {
          const ax = vertices[a * 3],
            ay = vertices[a * 3 + 1],
            az = vertices[a * 3 + 2];
          const bx = vertices[b * 3],
            by = vertices[b * 3 + 1],
            bz = vertices[b * 3 + 2];
          const off = 0.25 * (1 - Math.cos(t * Math.PI)) * outward;
          const ax2 = ax;
          const ay2 = ay;
          const az2 = az + off;
          const bx2 = bx;
          const by2 = by;
          const bz2 = bz + off;
          const ia = vertices.length / 3;
          vertices.push(ax2, ay2, az2);
          const anx = normals[a * 3],
            any = normals[a * 3 + 1],
            anz = normals[a * 3 + 2];
          const nl = Math.hypot(anx, any, anz + 0.2) || 1;
          normals.push(anx / nl, any / nl, (anz + 0.2) / nl);
          const ib = vertices.length / 3;
          vertices.push(bx2, by2, bz2);
          const bnx = normals[b * 3],
            bny = normals[b * 3 + 1],
            bnz = normals[b * 3 + 2];
          const nl2 = Math.hypot(bnx, bny, bnz + 0.2) || 1;
          normals.push(bnx / nl2, bny / nl2, (bnz + 0.2) / nl2);
          layer.push([ia, ib]);
        }
        ringsIdx.push(layer);
      }
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        const [c, d] = ringsIdx[0][i];
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
      for (let r = 0; r < ringsIdx.length - 1; r++) {
        const cur = ringsIdx[r];
        const nxt = ringsIdx[r + 1];
        for (let i = 0; i < cur.length; i++) {
          const [a, b] = cur[i];
          const [c, d] = nxt[i];
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }
    }
    pushBevel(rimO, +1);
    pushBevel(rimI, -1);
    const floorStart = vertices.length / 3;
    const floorSegments = 32;
    vertices.push(0, 0.1, 0);
    normals.push(0, 1, 0);
    for (let i = 0; i <= floorSegments; i++) {
      const angle = (i / floorSegments) * Math.PI * 2;
      const r = radius * 1.2;
      const noise = layeredNoise(i * 0.3, 0, 3) * 0.3;
      const x = r * Math.cos(angle) * (1 + noise);
      const z = r * Math.sin(angle) * (1 + noise);
      const y = layeredNoise(i * 0.5 + 500, 0, 2) * 0.5;
      vertices.push(x, y, z);
      normals.push(0, 1, 0);
    }
    for (let i = 0; i < floorSegments; i++) {
      indices.push(floorStart, floorStart + i + 2, floorStart + i + 1);
    }
    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
  createStalactites(count = 1, baseRadius = 0.2, height = 1.0) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const segments = 8;
    function noise(x) {
      const n = Math.sin(x * 12.9898) * 43758.5453;
      return (n - Math.floor(n)) * 2 - 1;
    }
    for (let s = 0; s < count; s++) {
      const startIdx = vertices.length / 3;
      const baseRingVertices = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = baseRadius * Math.cos(angle);
        const z = baseRadius * Math.sin(angle);
        vertices.push(x, 0, z);
        normals.push(0, 1, 0);
        baseRingVertices.push(vertices.length / 3 - 1);
      }
      const rings = 6;
      for (let ring = 1; ring <= rings; ring++) {
        const t = ring / rings;
        const ringRadius =
          baseRadius * (1 - t * 0.85) * (1 + noise(s + ring) * 0.12);
        const ringY = -t * height;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const x = ringRadius * Math.cos(angle);
          const z = ringRadius * Math.sin(angle);
          vertices.push(x, ringY, z);
          const len = Math.hypot(x, z) || 1;
          const ny = ring < rings ? -0.4 : -0.9;
          normals.push((x / len) * 0.6, ny, (z / len) * 0.6);
        }
      }
      const tipY = -height;
      vertices.push(0, tipY, 0);
      normals.push(0, -1, 0);
      const tipIdx = vertices.length / 3 - 1;
      for (let ring = 0; ring < rings; ring++) {
        const ringStart = startIdx + ring * (segments + 1);
        const nextRingStart = ringStart + (segments + 1);
        for (let i = 0; i < segments; i++) {
          const a = ringStart + i;
          const b = ringStart + i + 1;
          const c = nextRingStart + i;
          const d = nextRingStart + i + 1;
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }
      const lastRingStart = startIdx + rings * (segments + 1);
      for (let i = 0; i < segments; i++) {
        indices.push(lastRingStart + i, tipIdx, lastRingStart + i + 1);
      }
    }
    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
  createStalagmites(count = 1, baseRadius = 0.3, height = 1.5) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const segments = 8;
    function noise(x) {
      const n = Math.sin(x * 12.9898 + 500) * 43758.5453;
      return (n - Math.floor(n)) * 2 - 1;
    }
    for (let s = 0; s < count; s++) {
      const startIdx = vertices.length / 3;
      vertices.push(0, height, 0);
      normals.push(0, 1, 0);
      const rings = 7;
      for (let ring = 0; ring < rings; ring++) {
        const t = ring / (rings - 1);
        const ringRadius =
          baseRadius * (1 - t) * (1 + noise(s * 10 + ring) * 0.2);
        const ringY = height * t;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const x = ringRadius * Math.cos(angle);
          const z = ringRadius * Math.sin(angle);
          vertices.push(x, ringY, z);
          const len = Math.hypot(x, z) || 1;
          const ny = ring > 0 ? 0.4 : -0.8;
          normals.push((x / len) * 0.6, ny, (z / len) * 0.6);
        }
      }
      for (let ring = 0; ring < rings - 1; ring++) {
        const ringStart = startIdx + 1 + ring * (segments + 1);
        const nextRingStart = ringStart + (segments + 1);
        for (let i = 0; i < segments; i++) {
          const a = ringStart + i;
          const b = ringStart + i + 1;
          const c = nextRingStart + i;
          const d = nextRingStart + i + 1;
          indices.push(a, c, b);
          indices.push(b, c, d);
        }
      }
      const lastRing = startIdx + 1 + (rings - 1) * (segments + 1);
      for (let i = 0; i < segments; i++) {
        indices.push(startIdx, lastRing + i, lastRing + i + 1);
      }
    }
    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
  createRockFormation(size = 1.0, seed = 0) {
    const vertices = [];
    const normals = [];
    const indices = [];
    function noise(x, y) {
      const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
      return (n - Math.floor(n)) * 2 - 1;
    }
    const segments = 12;
    const rings = 8;
    for (let ring = 0; ring <= rings; ring++) {
      const v = ring / rings;
      const theta = v * Math.PI;
      for (let seg = 0; seg <= segments; seg++) {
        const u = seg / segments;
        const phi = u * Math.PI * 2;
        let x = Math.sin(theta) * Math.cos(phi);
        let y = Math.cos(theta);
        let z = Math.sin(theta) * Math.sin(phi);
        const n1 = noise(u * 3, v * 3);
        const n2 = noise(u * 5 + 10, v * 5 + 10);
        const distort = 0.7 + n1 * 0.25 + n2 * 0.15;
        x *= size * distort;
        y *= size * distort * 0.8;
        z *= size * distort;
        vertices.push(x, y, z);
        const len = Math.hypot(x, y, z) || 1;
        normals.push(x / len, y / len, z / len);
      }
    }
    for (let ring = 0; ring < rings; ring++) {
      for (let seg = 0; seg < segments; seg++) {
        const a = ring * (segments + 1) + seg;
        const b = a + 1;
        const c = a + (segments + 1);
        const d = c + 1;
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
};
window.CaveGeometry = CaveGeometry;
