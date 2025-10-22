/**
 * js/geometry/cave.js - FIXED VERSION
 * Cave dengan entrance BOLONG dan interior room yang terlihat
 */

const CaveGeometry = {
  /**
   * MAIN CAVE BODY - Clean hollow hemisphere dengan entrance
   * @returns {Object} geometry
   */
  createHollowCaveBody(
    radius = 15,
    entranceWidth = 12,
    entranceHeight = 14,
    segments = 48
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const halfW = entranceWidth / 2;
    const halfH = entranceHeight / 2;
    const entranceCenterY = 2;

    // Helper: Check if in entrance zone
    function isInEntranceZone(x, y, z) {
      const zThreshold = radius * 0.55;
      if (z < zThreshold) return false;
      if (y < 0.5) return false;

      const nx = x / halfW;
      const ny = (y - entranceCenterY) / halfH;
      return nx * nx + ny * ny < 1.0;
    }

    // Noise functions
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
      const i1 = v1 * (1 - fx) + v2 * fx;
      const i2 = v3 * (1 - fx) + v4 * fx;
      return i1 * (1 - fy) + i2 * fy;
    }
    function layeredNoise(x, y, oct = 3) {
      let t = 0,
        f = 1,
        a = 1,
        m = 0;
      for (let i = 0; i < oct; i++) {
        t += smoothNoise(x * f, y * f) * a;
        m += a;
        a *= 0.5;
        f *= 2;
      }
      return t / (m || 1);
    }

    // ===== OUTER SURFACE (normal hemisphere) =====
    const outerVertexMap = new Map();

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

        // Skip if in entrance zone
        if (isInEntranceZone(x, y, z)) {
          outerVertexMap.set(`${lat}-${lon}`, -1);
          continue;
        }

        // Rocky displacement
        const n = layeredNoise(lon * 0.3, lat * 0.3, 3);
        const heightFactor = 1 - cosT;
        const disp = 1 + n * 0.18 * (0.5 + 0.5 * heightFactor);

        x *= disp;
        y *= disp;
        z *= disp;

        const idx = vertices.length / 3;
        outerVertexMap.set(`${lat}-${lon}`, idx);

        vertices.push(x, y, z);
        const len = Math.hypot(x, y, z) || 1;
        normals.push(x / len, y / len, z / len); // Outward normal
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

    // ===== INNER SURFACE (for light reflection inside cave) =====
    // Slightly smaller hemisphere inside for ambient light bounce
    const innerRadius = radius * 0.92;
    const innerVertexMap = new Map();
    const innerStartIdx = vertices.length / 3;

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

        // Skip same entrance zone
        if (isInEntranceZone(x, y, z)) {
          innerVertexMap.set(`${lat}-${lon}`, -1);
          continue;
        }

        const idx = vertices.length / 3;
        innerVertexMap.set(`${lat}-${lon}`, idx);

        vertices.push(x, y, z);
        const len = Math.hypot(x, y, z) || 1;
        normals.push(-x / len, -y / len, -z / len); // INWARD normal for light bounce
      }
    }

    // Build inner surface indices (REVERSED winding)
    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = innerVertexMap.get(`${lat}-${lon}`);
        const b = innerVertexMap.get(`${lat + 1}-${lon}`);
        const c = innerVertexMap.get(`${lat}-${lon + 1}`);
        const d = innerVertexMap.get(`${lat + 1}-${lon + 1}`);

        if (a >= 0 && b >= 0 && c >= 0 && d >= 0) {
          // Reversed winding for inward facing
          indices.push(a, c, b);
          indices.push(b, c, d);
        }
      }
    }

    // Floor disk
    const floorCenter = vertices.length / 3;
    vertices.push(0, 0, 0);
    normals.push(0, -1, 0);

    for (let lon = 0; lon <= segments; lon++) {
      const phi = (lon * 2 * Math.PI) / segments;
      const x = radius * Math.cos(phi);
      const z = radius * Math.sin(phi);
      vertices.push(x, 0, z);
      normals.push(0, -1, 0);
    }

    for (let lon = 0; lon < segments; lon++) {
      indices.push(floorCenter, floorCenter + lon + 2, floorCenter + lon + 1);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * INTERIOR WALL - Simple dark back wall
   */
  createInteriorWalls(
    entranceWidth = 9,
    entranceHeight = 11,
    depth = 6,
    segments = 24
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const hw = entranceWidth / 2;
    const hh = entranceHeight / 2;
    const centerY = 2;

    const zBack = 11 - depth; // Back of cave

    // Simple back wall - semicircle
    const centerIdx = 0;
    vertices.push(0, centerY, zBack);
    normals.push(0, 0, 1);

    // Semicircle vertices
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI; // Top semicircle
      const x = hw * 0.85 * Math.cos(angle);
      const y = centerY + hh * 0.85 * Math.sin(angle);

      vertices.push(x, y, zBack);
      normals.push(0, 0, 1);
    }

    // Triangle fan from center
    for (let i = 0; i < segments; i++) {
      indices.push(centerIdx, i + 2, i + 1);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * ENTRANCE THICKNESS - Dinding tebal di edge lubang entrance
   * Ini yang keliatan pas batu dipotong - bagian "dalam" dari potongan
   */
  createEntranceThickness(
    width = 9,
    height = 11,
    thickness = 1.2, // Ketebalan dinding batu
    segments = 32
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const hw = width / 2;
    const hh = height / 2;
    const centerY = 2;

    // Front position (di permukaan cave)
    const zFront = 11;
    // Back position (ke dalam cave)
    const zBack = zFront - thickness;

    // Create TWO ellipse rings: front (outer) and back (inner)
    // Then connect them to show thickness

    const frontStart = 0;
    const backStart = segments + 1;

    // Front ring (at surface) - TOP HALF ONLY
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI; // 0 to PI (top semicircle)
      const x = hw * Math.cos(angle);
      const y = centerY + hh * Math.sin(angle);

      if (y > 0.3) {
        // Only above ground
        vertices.push(x, y, zFront);

        // Normal pointing slightly outward
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        normals.push(nx * 0.3, ny * 0.3, 0.7);
      }
    }

    // Back ring (deeper) - TOP HALF ONLY
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI;
      const x = hw * Math.cos(angle);
      const y = centerY + hh * Math.sin(angle);

      if (y > 0.3) {
        vertices.push(x, y, zBack);

        // Normal pointing slightly inward
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        normals.push(nx * 0.3, ny * 0.3, -0.7);
      }
    }

    // Connect front and back rings to create thickness surface
    const count = vertices.length / 3 / 2;
    for (let i = 0; i < count - 1; i++) {
      const a = i; // Front current
      const b = i + 1; // Front next
      const c = i + count; // Back current
      const d = i + 1 + count; // Back next

      // Two triangles for thickness surface
      indices.push(a, c, b);
      indices.push(b, c, d);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * STALACTITES - Hanging from ceiling
   */
  createStalactites(count = 12, baseRadius = 0.25, height = 1.2) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const segments = 6;

    for (let s = 0; s < count; s++) {
      const startIdx = vertices.length / 3;

      // Tip (bottom point)
      vertices.push(0, -height, 0);
      normals.push(0, -1, 0);

      // Base circle
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = baseRadius * Math.cos(angle);
        const z = baseRadius * Math.sin(angle);

        vertices.push(x, 0, z);

        const len = Math.hypot(x, z) || 1;
        normals.push(x / len, 0.3, z / len);
      }

      // Triangles (fan from tip)
      for (let i = 0; i < segments; i++) {
        indices.push(startIdx, startIdx + i + 1, startIdx + i + 2);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * FLOOR INSIDE CAVE - Optional textured floor
   */
  createCaveFloor(width = 14, depth = 8, segments = 16) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const hw = width / 2;
    const zStart = 10;
    const zEnd = zStart - depth;

    // Grid of vertices
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * width;
        const z = zStart + (j / segments) * (zEnd - zStart);
        const y = 0; // Floor level

        vertices.push(x, y, z);
        normals.push(0, 1, 0); // Pointing up
      }
    }

    // Indices
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = a + 1;
        const c = a + (segments + 1);
        const d = c + 1;

        indices.push(a, c, b);
        indices.push(b, c, d);
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
console.log("✅ NEW CaveGeometry loaded - Hollow entrance with interior room");
