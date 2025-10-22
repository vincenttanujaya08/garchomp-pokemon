/**
 * js/geometry/cave.js - ENHANCED VERSION v2
 * Cave dengan:
 * - Entrance yang tersambung sempurna dari semua sisi
 * - Rocky texture (tidak smooth) menggunakan layered noise
 * - Interior structures (stalactites, stalagmites, rock formations)
 */

const CaveGeometry = {
  /**
   * MAIN CAVE BODY - Rocky hollow hemisphere dengan entrance
   * FIXED: Edge connection sempurna, tidak ada gap
   */
  createHollowCaveBody(
    radius = 15,
    entranceWidth = 12,
    entranceHeight = 14,
    segments = 64 // Increased for better smoothness
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const halfW = entranceWidth / 2;
    const halfH = entranceHeight / 2;
    const entranceCenterY = 2;

    // Helper: Check if in entrance zone with smooth falloff
    function isInEntranceZone(x, y, z) {
      const zThreshold = radius * 0.65; // Deeper cut
      if (z < zThreshold) return false;
      if (y < 0.2) return false;

      const nx = x / (halfW * 1.1); // Slightly larger for smooth edge
      const ny = (y - entranceCenterY) / (halfH * 1.1);
      const dist = nx * nx + ny * ny;

      // Smooth falloff near edge
      return dist < 1.0;
    }

    // Enhanced noise functions for rocky texture
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

      // Cubic interpolation for smoother noise
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

    // ===== OUTER SURFACE (rocky exterior) =====
    const outerVertexMap = new Map();
    const edgeVertices = []; // Track edge vertices for connection

    for (let lat = 0; lat <= segments; lat++) {
      const theta = (lat * Math.PI) / (segments * 2);
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const sinP = Math.sin(phi);
        const cosP = Math.cos(phi);

        let x = radius * cosP * sinT;
        let y = radius * cosT;
        let z = radius * sinP * sinT;

        const isEdge = isInEntranceZone(x, y, z);

        if (isEdge) {
          outerVertexMap.set(`${lat}-${lon}`, -1);
          continue;
        }

        // Enhanced rocky displacement
        const n1 = layeredNoise(lon * 0.4, lat * 0.4, 4);
        const n2 = layeredNoise(lon * 0.8 + 100, lat * 0.8 + 100, 3) * 0.5;
        const heightFactor = 1 - cosT * 0.7;

        // Combine multiple noise layers for rocky look
        const disp = 1 + (n1 * 0.22 + n2 * 0.12) * (0.4 + 0.6 * heightFactor);

        x *= disp;
        y *= disp;
        z *= disp;

        const idx = vertices.length / 3;
        outerVertexMap.set(`${lat}-${lon}`, idx);

        vertices.push(x, y, z);

        // Normal with slight random variation for rocky look
        const len = Math.hypot(x, y, z) || 1;
        const nv = layeredNoise(lon * 1.2 + 50, lat * 1.2 + 50, 2) * 0.15;
        normals.push(x / len + nv, y / len + nv, z / len + nv);

        // Check if near entrance edge for connection
        const distToEdge =
          Math.abs(x / halfW) + Math.abs((y - entranceCenterY) / halfH);
        if (z > radius * 0.5 && distToEdge > 0.85 && distToEdge < 1.15) {
          edgeVertices.push({ idx, x, y, z });
        }
      }
    }

    // Build outer surface indices
    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = outerVertexMap.get(`${lat}-${lon}`);
        const b = outerVertexMap.get(`${lat + 1}-${lon}`);
        const c = outerVertexMap.get(`${lat}-${lon + 1}`);
        const d = outerVertexMap.get(`${lat + 1}-${lon + 1}`);

        if (a >= 0 && b >= 0 && c >= 0 && d >= 0) {
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }
    }

    // ===== INNER SURFACE (rocky interior with better texture) =====
    const innerRadius = radius * 0.88; // Slightly thicker for better depth
    const innerVertexMap = new Map();

    for (let lat = 0; lat <= segments; lat++) {
      const theta = (lat * Math.PI) / (segments * 2);
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const sinP = Math.sin(phi);
        const cosP = Math.cos(phi);

        let x = innerRadius * cosP * sinT;
        let y = innerRadius * cosT;
        let z = innerRadius * sinP * sinT;

        if (isInEntranceZone(x, y, z)) {
          innerVertexMap.set(`${lat}-${lon}`, -1);
          continue;
        }

        // STRONGER rocky texture on interior
        const n1 = layeredNoise(lon * 0.5 + 200, lat * 0.5 + 200, 5);
        const n2 = layeredNoise(lon * 1.0 + 300, lat * 1.0 + 300, 3) * 0.4;
        const n3 = layeredNoise(lon * 2.0 + 400, lat * 2.0 + 400, 2) * 0.2;

        const disp = 1 + (n1 * 0.18 + n2 * 0.12 + n3 * 0.08);

        x *= disp;
        y *= disp;
        z *= disp;

        const idx = vertices.length / 3;
        innerVertexMap.set(`${lat}-${lon}`, idx);

        vertices.push(x, y, z);

        // Inward normal with rocky variation
        const len = Math.hypot(x, y, z) || 1;
        const nv = layeredNoise(lon * 1.5 + 150, lat * 1.5 + 150, 2) * 0.2;
        normals.push(-x / len + nv, -y / len + nv, -z / len + nv);
      }
    }

    // Build inner surface (reversed winding)
    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = innerVertexMap.get(`${lat}-${lon}`);
        const b = innerVertexMap.get(`${lat + 1}-${lon}`);
        const c = innerVertexMap.get(`${lat}-${lon + 1}`);
        const d = innerVertexMap.get(`${lat + 1}-${lon + 1}`);

        if (a >= 0 && b >= 0 && c >= 0 && d >= 0) {
          indices.push(a, c, b);
          indices.push(b, c, d);
        }
      }
    }

    // ===== NO EDGE CONNECTION GEOMETRY =====
    // Let the entrance be naturally hollow - no arc/rainbow shape!

    // ===== FLOOR (rocky) =====
    const floorStart = vertices.length / 3;
    const floorSegments = 32;

    // Center point
    vertices.push(0, 0.1, 0); // Slightly above ground
    normals.push(0, 1, 0);

    // Floor vertices with rocky texture
    for (let i = 0; i <= floorSegments; i++) {
      const angle = (i / floorSegments) * Math.PI * 2;
      const r = radius * 0.95;

      const noise = layeredNoise(i * 0.3, 0, 3) * 0.3;
      const x = r * Math.cos(angle) * (1 + noise);
      const z = r * Math.sin(angle) * (1 + noise);
      const y = layeredNoise(i * 0.5 + 500, 0, 2) * 0.5; // Uneven floor

      vertices.push(x, y, z);
      normals.push(0, 1, 0);
    }

    // Floor triangles
    for (let i = 0; i < floorSegments; i++) {
      indices.push(floorStart, floorStart + i + 2, floorStart + i + 1);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * ENHANCED STALACTITES - Hanging DOWN from ceiling
   * Fixed: Now properly attached and pointing downward
   */
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

      // Base attachment point (TOP - at ceiling)
      const baseRingVertices = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = baseRadius * Math.cos(angle);
        const z = baseRadius * Math.sin(angle);

        vertices.push(x, 0, z); // Y=0 = ceiling attachment
        normals.push(0, 1, 0); // Up normal (ceiling)
        baseRingVertices.push(vertices.length / 3 - 1);
      }

      // Multiple rings going DOWN
      const rings = 6;
      for (let ring = 1; ring <= rings; ring++) {
        const t = ring / rings;

        // Taper: wider at top, narrow at bottom
        const ringRadius =
          baseRadius * (1 - t * 0.85) * (1 + noise(s + ring) * 0.12);
        const ringY = -t * height; // NEGATIVE Y = going down!

        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const x = ringRadius * Math.cos(angle);
          const z = ringRadius * Math.sin(angle);

          vertices.push(x, ringY, z);

          // Normal pointing outward and slightly down
          const len = Math.hypot(x, z) || 1;
          const ny = ring < rings ? -0.4 : -0.9; // More downward at tip
          normals.push((x / len) * 0.6, ny, (z / len) * 0.6);
        }
      }

      // Pointed tip at bottom
      const tipY = -height;
      vertices.push(0, tipY, 0);
      normals.push(0, -1, 0);
      const tipIdx = vertices.length / 3 - 1;

      // Build triangles between rings
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

      // Connect last ring to tip
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

  /**
   * STALAGMITES - Growing from floor
   */
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

      // Tip (pointed top)
      vertices.push(0, height, 0);
      normals.push(0, 1, 0);

      // Rings from bottom to top
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

      // Build triangles
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

      // Connect tip to last ring
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

  /**
   * ROCK FORMATIONS - Boulder-like structures inside cave
   */
  createRockFormation(size = 1.0, seed = 0) {
    const vertices = [];
    const normals = [];
    const indices = [];

    function noise(x, y) {
      const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
      return (n - Math.floor(n)) * 2 - 1;
    }

    // Create irregular rock shape
    const segments = 12;
    const rings = 8;

    for (let ring = 0; ring <= rings; ring++) {
      const v = ring / rings;
      const theta = v * Math.PI;

      for (let seg = 0; seg <= segments; seg++) {
        const u = seg / segments;
        const phi = u * Math.PI * 2;

        // Base spherical coordinates
        let x = Math.sin(theta) * Math.cos(phi);
        let y = Math.cos(theta);
        let z = Math.sin(theta) * Math.sin(phi);

        // Irregular distortion
        const n1 = noise(u * 3, v * 3);
        const n2 = noise(u * 5 + 10, v * 5 + 10);
        const distort = 0.7 + n1 * 0.25 + n2 * 0.15;

        x *= size * distort;
        y *= size * distort * 0.8; // Flatter
        z *= size * distort;

        vertices.push(x, y, z);

        // Approximate normal
        const len = Math.hypot(x, y, z) || 1;
        normals.push(x / len, y / len, z / len);
      }
    }

    // Build triangles
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

// Export
window.CaveGeometry = CaveGeometry;
console.log(
  "✅ ENHANCED CaveGeometry v2 loaded - Rocky texture + Interior structures"
);
