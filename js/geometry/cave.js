/**
 * js/geometry/cave.js
 * Geometry util untuk Cave/Goa
 */

const CaveGeometry = {
  /**
   * Setengah bola standar (atas) + base circle.
   */
  createHemisphere(radius = 10, segments = 32) {
    const vertices = [];
    const normals = [];
    const indices = [];

    // Sphere atas (phi: 0..PI/2)
    for (let lat = 0; lat <= segments; lat++) {
      const theta = (lat * Math.PI) / (segments * 2); // 0..PI/2
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const sinP = Math.sin(phi);
        const cosP = Math.cos(phi);

        const x = radius * cosP * sinT;
        const y = radius * cosT;
        const z = radius * sinP * sinT;

        vertices.push(x, y, z);
        const len = Math.hypot(x, y, z) || 1;
        normals.push(x / len, y / len, z / len);
      }
    }

    // Indices surface
    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = lat * (segments + 1) + lon;
        const b = a + segments + 1;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    // Base circle (tutup bawah)
    const baseCenter = vertices.length / 3;
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
      indices.push(baseCenter, baseCenter + lon + 2, baseCenter + lon + 1);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Ellipsoid depan untuk entrance (bagian muka).
   * Z negatif dianggap menghadap kamera (umum untuk scene yang lihat -Z).
   */
  createCaveEntrance(width = 6, height = 8, depth = 4, segments = 24) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const rx = width / 2;
    const ry = height / 2;
    const rz = depth / 2;

    // Hanya separuh (lat: 0..segments/2)
    for (let lat = 0; lat <= segments / 2; lat++) {
      const theta = (lat * Math.PI) / segments; // 0..PI/2
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const sinP = Math.sin(phi);
        const cosP = Math.cos(phi);

        const x = rx * cosP * sinT;
        const y = ry * cosT;
        const z = -rz * sinP * sinT; // menghadap -Z

        vertices.push(x, y, z);

        // Normal ke dalam
        let nx = -x / (rx * rx);
        let ny = -y / (ry * ry);
        let nz = -z / (rz * rz);
        const len = Math.hypot(nx, ny, nz) || 1;
        normals.push(nx / len, ny / len, nz / len);
      }
    }

    // Indices
    for (let lat = 0; lat < segments / 2; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = lat * (segments + 1) + lon;
        const b = a + segments + 1;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    // Rim (opsional)
    const rimStart = vertices.length / 3;
    for (let lon = 0; lon <= segments; lon++) {
      const phi = (lon * 2 * Math.PI) / segments;
      const x = rx * Math.cos(phi);
      const y = ry * Math.sin(phi);
      vertices.push(x, y, 0);
      normals.push(0, 0, 1);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Ring frame di sekeliling entrance (ellipse).
   */
  createCaveFrame(
    innerWidth = 6,
    innerHeight = 8,
    thickness = 1.5,
    segments = 32
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const ix = innerWidth / 2;
    const iy = innerHeight / 2;
    const ox = ix + thickness;
    const oy = iy + thickness;

    for (let i = 0; i <= segments; i++) {
      const a = (i * 2 * Math.PI) / segments;
      const c = Math.cos(a),
        s = Math.sin(a);

      vertices.push(ix * c, iy * s, 0); // inner
      normals.push(0, 0, 1);

      vertices.push(ox * c, oy * s, 0); // outer
      normals.push(0, 0, 1);
    }

    for (let i = 0; i < segments; i++) {
      const i0 = i * 2;
      const i1 = i0 + 1;
      const i2 = ((i + 1) % (segments + 1)) * 2;
      const i3 = i2 + 1;
      indices.push(i0, i1, i2);
      indices.push(i1, i3, i2);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Hemisphere “berbatu” dengan bukaan depan (dipotong elliptic),
   * plus floor disk.
   */
  createProperCaveBody(
    radius = 15,
    entranceWidth = 8,
    entranceHeight = 10,
    entranceDepth = 4, // untuk kesesuaian API (tidak dipakai langsung di versi ini)
    segments = 48
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const halfW = entranceWidth / 2;
    const halfH = entranceHeight / 2;
    const entranceCenterY = 2; // sedikit diangkat

    // Noise helpers
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
        v2 = noise(x2, y1),
        v3 = noise(x1, y2),
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

    // Potong hanya di “depan”
    function isInEntranceArea(x, y, z) {
      if (z < radius * 0.5) return false; // depan = z besar
      const nx = x / halfW;
      const ny = (y - entranceCenterY) / halfH;
      return nx * nx + ny * ny < 1.0;
    }

    // Build hemisphere rocky
    const map = new Map();

    for (let lat = 0; lat <= segments; lat++) {
      const theta = (lat * Math.PI) / (segments * 2); // 0..PI/2
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const sinP = Math.sin(phi);
        const cosP = Math.cos(phi);

        let x = radius * cosP * sinT;
        let y = radius * cosT;
        let z = radius * sinP * sinT;

        if (isInEntranceArea(x, y, z)) {
          map.set(`${lat}-${lon}`, -1);
          continue;
        }

        const n = layeredNoise(lon * 0.3, lat * 0.3, 3);
        const heightFactor = 1 - cosT;
        const disp = 1 + n * 0.18 * (0.5 + 0.5 * heightFactor);

        x *= disp;
        y *= disp;
        z *= disp;

        const idx = vertices.length / 3;
        map.set(`${lat}-${lon}`, idx);

        vertices.push(x, y, z);
        const len = Math.hypot(x, y, z) || 1;
        normals.push(x / len, y / len, z / len);
      }
    }

    // Indices hemisphere
    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = map.get(`${lat}-${lon}`);
        const b = map.get(`${lat + 1}-${lon}`);
        const c = map.get(`${lat}-${lon + 1}`);
        const d = map.get(`${lat + 1}-${lon + 1}`);
        if (a >= 0 && b >= 0 && c >= 0 && d >= 0) {
          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }
    }

    // Floor (disk)
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
   * Interior sederhana: ring entrance → back “cap”.
   */
  createCaveInterior(
    radius = 14,
    entranceWidth = 8,
    entranceHeight = 10,
    depth = 6,
    segments = 32
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const halfW = entranceWidth / 2;
    const halfH = entranceHeight / 2;
    const entranceCenterY = 2;

    const zStart = radius * 0.6; // posisi mulut
    const zEnd = zStart - depth; // ke dalam

    // Entrance ring
    const ringSegs = Math.max(16, segments);
    for (let i = 0; i <= ringSegs; i++) {
      const a = (i / ringSegs) * Math.PI * 2;
      const x = halfW * Math.cos(a);
      const y = entranceCenterY + halfH * Math.sin(a);
      const z = zStart;
      vertices.push(x, y, z);
      normals.push(0, 0, 1);
    }

    // Back cap (center + ring)
    const backCenter = vertices.length / 3;
    vertices.push(0, entranceCenterY, zEnd);
    normals.push(0, 0, -1);

    const backSegs = 16;
    const scale = 0.6;
    for (let i = 0; i <= backSegs; i++) {
      const a = (i / backSegs) * Math.PI * 2;
      const x = halfW * scale * Math.cos(a);
      const y = entranceCenterY + halfH * scale * Math.sin(a);
      const z = zEnd;
      vertices.push(x, y, z);
      normals.push(0, 0, -1);
    }

    // Hubungkan ring ke center back (kipas)
    for (let i = 0; i < ringSegs; i++) {
      const a = i;
      const b = (i + 1) % (ringSegs + 1);
      indices.push(a, b, backCenter);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Stalaktit kerucut (sekumpulan kecil untuk ditempel di langit-langit).
   * Return satu mesh gabungan (tinggal di-transform per-instance di scene).
   */
  createStalactites(count = 8, baseRadius = 0.3, height = 1.5) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const seg = 8;

    for (let s = 0; s < count; s++) {
      const start = vertices.length / 3;

      // Ujung (tip)
      vertices.push(0, -height, 0);
      normals.push(0, -1, 0);

      // Lingkaran base
      for (let i = 0; i <= seg; i++) {
        const a = (i / seg) * Math.PI * 2;
        const x = baseRadius * Math.cos(a);
        const z = baseRadius * Math.sin(a);
        vertices.push(x, 0, z);
        const len = Math.hypot(x, z) || 1;
        normals.push(x / len, 0.3, z / len); // sedikit naik supaya nggak rata
      }

      // Indices (triangle fan dari tip)
      for (let i = 0; i < seg; i++) {
        indices.push(start, start + i + 1, start + i + 2);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Rocky/bumpy hemisphere (tanpa entrance) untuk variasi permukaan.
   */
  createRockyHemisphere(baseRadius = 10, segments = 48, roughness = 0.2) {
    const vertices = [];
    const normals = [];
    const indices = [];

    // Simple pseudo-random (seeded)
    function noise(x, y) {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return (n - Math.floor(n)) * 2 - 1; // -1..1
    }
    function smoothNoise(x, y) {
      const fx = x - Math.floor(x),
        fy = y - Math.floor(y);
      const x1 = Math.floor(x),
        y1 = Math.floor(y);
      const x2 = x1 + 1,
        y2 = y1 + 1;
      const v1 = noise(x1, y1),
        v2 = noise(x2, y1),
        v3 = noise(x1, y2),
        v4 = noise(x2, y2);
      const i1 = v1 * (1 - fx) + v2 * fx;
      const i2 = v3 * (1 - fx) + v4 * fx;
      return i1 * (1 - fy) + i2 * fy;
    }
    function layeredNoise(x, y) {
      let t = 0,
        f = 1,
        a = 1,
        m = 0;
      for (let i = 0; i < 3; i++) {
        t += smoothNoise(x * f, y * f) * a;
        m += a;
        a *= 0.5;
        f *= 2;
      }
      return t / (m || 1);
    }

    // Hemisphere + displacement
    for (let lat = 0; lat <= segments; lat++) {
      const theta = (lat * Math.PI) / (segments * 2); // 0..PI/2
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const sinP = Math.sin(phi);
        const cosP = Math.cos(phi);

        const n = layeredNoise(lon * 0.3, lat * 0.3);
        const heightFactor = 1 - cosT; // lebih kasar dekat base
        const disp = 1 + n * roughness * (0.5 + heightFactor * 0.5);
        const r = baseRadius * disp;

        const x = r * cosP * sinT;
        const y = r * cosT;
        const z = r * sinP * sinT;

        vertices.push(x, y, z);
        const len = Math.hypot(x, y, z) || 1;
        normals.push(x / len, y / len, z / len);
      }
    }

    // Indices
    for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = lat * (segments + 1) + lon;
        const b = a + segments + 1;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    // Base circle
    const baseCenter = vertices.length / 3;
    vertices.push(0, 0, 0);
    normals.push(0, -1, 0);

    for (let lon = 0; lon <= segments; lon++) {
      const phi = (lon * 2 * Math.PI) / segments;
      const x = baseRadius * Math.cos(phi);
      const z = baseRadius * Math.sin(phi);
      vertices.push(x, 0, z);
      normals.push(0, -1, 0);
    }

    for (let lon = 0; lon < segments; lon++) {
      indices.push(baseCenter, baseCenter + lon + 2, baseCenter + lon + 1);
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
console.log("✅ CaveGeometry loaded:", Object.keys(CaveGeometry));
