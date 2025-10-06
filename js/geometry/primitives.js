const Primitives = {
  /**
   * Ellipsoid - untuk kepala, torso, joints
   */
  createEllipsoid: function (
    radiusX = 1,
    radiusY = 1,
    radiusZ = 1,
    latitudeBands = 30,
    longitudeBands = 30
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      const theta = (latNumber * Math.PI) / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        const phi = (longNumber * 2 * Math.PI) / longitudeBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = radiusX * cosPhi * sinTheta;
        const y = radiusY * cosTheta;
        const z = radiusZ * sinPhi * sinTheta;

        const normal = [
          x / (radiusX * radiusX),
          y / (radiusY * radiusY),
          z / (radiusZ * radiusZ),
        ];
        const len = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);

        vertices.push(x, y, z);
        normals.push(normal[0] / len, normal[1] / len, normal[2] / len);
      }
    }

    for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
        const first = latNumber * (longitudeBands + 1) + longNumber;
        const second = first + longitudeBands + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Cylinder - untuk lengan, kaki, ekor
   */
  createCylinder: function (radius = 1, height = 2, radialSegments = 32) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const halfHeight = height / 2;

    // Sisi silinder
    for (let i = 0; i <= radialSegments; i++) {
      const theta = (i * 2 * Math.PI) / radialSegments;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);

      vertices.push(x, halfHeight, z);
      normals.push(x / radius, 0, z / radius);
      vertices.push(x, -halfHeight, z);
      normals.push(x / radius, 0, z / radius);
    }

    // Tutup atas
    for (let i = 0; i <= radialSegments; i++) {
      const theta = (i * 2 * Math.PI) / radialSegments;
      vertices.push(
        radius * Math.cos(theta),
        halfHeight,
        radius * Math.sin(theta)
      );
      normals.push(0, 1, 0);
    }

    // Tutup bawah
    for (let i = 0; i <= radialSegments; i++) {
      const theta = (i * 2 * Math.PI) / radialSegments;
      vertices.push(
        radius * Math.cos(theta),
        -halfHeight,
        radius * Math.sin(theta)
      );
      normals.push(0, -1, 0);
    }

    // Pusat tutup
    const topCenterIndex = vertices.length / 3;
    vertices.push(0, halfHeight, 0);
    normals.push(0, 1, 0);

    const bottomCenterIndex = vertices.length / 3;
    vertices.push(0, -halfHeight, 0);
    normals.push(0, -1, 0);

    // Indices untuk sisi
    let sideOffset = 0;
    for (let i = 0; i < radialSegments; i++) {
      const a = sideOffset + i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }

    // Indices untuk tutup atas
    const topOffset = (radialSegments + 1) * 2;
    for (let i = 0; i < radialSegments; i++) {
      indices.push(topCenterIndex, topOffset + i, topOffset + i + 1);
    }

    // Indices untuk tutup bawah
    const bottomOffset = topOffset + radialSegments + 1;
    for (let i = 0; i < radialSegments; i++) {
      indices.push(bottomCenterIndex, bottomOffset + i + 1, bottomOffset + i);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Cone - untuk spike, kuku, gigi
   */
  createCone: function (radius = 1, height = 2, radialSegments = 32) {
    const vertices = [];
    const normals = [];
    const indices = [];

    vertices.push(0, height / 2, 0);
    normals.push(0, 1, 0);
    const apexIndex = 0;

    const sideVerticesStart = vertices.length / 3;
    for (let i = 0; i <= radialSegments; i++) {
      const theta = (i * 2 * Math.PI) / radialSegments;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);

      vertices.push(x, -height / 2, z);

      const surfaceNormal = [
        (2 * x) / (radius * radius),
        height,
        (2 * z) / (radius * radius),
      ];
      const len = Math.sqrt(
        surfaceNormal[0] ** 2 + surfaceNormal[1] ** 2 + surfaceNormal[2] ** 2
      );
      normals.push(
        surfaceNormal[0] / len,
        surfaceNormal[1] / len,
        surfaceNormal[2] / len
      );
    }

    for (let i = 0; i < radialSegments; i++) {
      indices.push(apexIndex, sideVerticesStart + i, sideVerticesStart + i + 1);
    }

    const baseVerticesStart = vertices.length / 3;
    vertices.push(0, -height / 2, 0);
    normals.push(0, -1, 0);
    const baseCenterIndex = baseVerticesStart;

    for (let i = 0; i <= radialSegments; i++) {
      const theta = (i * 2 * Math.PI) / radialSegments;
      vertices.push(
        radius * Math.cos(theta),
        -height / 2,
        radius * Math.sin(theta)
      );
      normals.push(0, -1, 0);
    }

    for (let i = 0; i < radialSegments; i++) {
      indices.push(
        baseCenterIndex,
        baseCenterIndex + i + 2,
        baseCenterIndex + i + 1
      );
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Hyperboloid - untuk blade lengan dan tanduk (SIGNATURE GARCHOMP!)
   */
  createHyperboloid: function (
    radiusTop = 1,
    radiusBottom = 1,
    waistRadius = 0.5,
    height = 2,
    radialSegments = 32,
    heightSegments = 16
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const halfHeight = height / 2;

    for (let i = 0; i <= heightSegments; i++) {
      const v = i / heightSegments;
      const y = -halfHeight + v * height;

      // Fungsi hyperboloid: r(y) menggunakan hyperbolic curve
      const t = y / halfHeight; // -1 to 1
      const radius =
        waistRadius *
        Math.sqrt(1 + t * t * ((radiusTop / waistRadius) ** 2 - 1));

      for (let j = 0; j <= radialSegments; j++) {
        const theta = (j * 2 * Math.PI) / radialSegments;
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);

        vertices.push(x, y, z);

        // Normal dihitung dari derivative hyperboloid
        const dr_dy =
          (t * (radiusTop ** 2 - waistRadius ** 2)) / (halfHeight * radius);
        const nx = Math.cos(theta);
        const ny = -dr_dy;
        const nz = Math.sin(theta);
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

        normals.push(nx / len, ny / len, nz / len);
      }
    }

    for (let i = 0; i < heightSegments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = a + radialSegments + 1;

        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Capsule - untuk lengan/kaki yang smooth (cylinder + hemisphere caps)
   */
  createCapsule: function (radius = 1, cylinderHeight = 2, segments = 32) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const halfHeight = cylinderHeight / 2;

    // Bagian cylinder tengah
    for (let i = 0; i <= segments; i++) {
      const theta = (i * 2 * Math.PI) / segments;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);

      vertices.push(x, halfHeight, z);
      normals.push(x / radius, 0, z / radius);
      vertices.push(x, -halfHeight, z);
      normals.push(x / radius, 0, z / radius);
    }

    // Hemisphere atas
    const topHemisphereStart = vertices.length / 3;
    for (let lat = 0; lat <= segments / 2; lat++) {
      const theta = (lat * Math.PI) / segments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const x = radius * Math.cos(phi) * sinTheta;
        const y = halfHeight + radius * cosTheta;
        const z = radius * Math.sin(phi) * sinTheta;

        vertices.push(x, y, z);
        const nx = x / radius;
        const ny = cosTheta;
        const nz = z / radius;
        normals.push(nx, ny, nz);
      }
    }

    // Hemisphere bawah
    const bottomHemisphereStart = vertices.length / 3;
    for (let lat = segments / 2; lat <= segments; lat++) {
      const theta = (lat * Math.PI) / segments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
        const phi = (lon * 2 * Math.PI) / segments;
        const x = radius * Math.cos(phi) * sinTheta;
        const y = -halfHeight + radius * cosTheta;
        const z = radius * Math.sin(phi) * sinTheta;

        vertices.push(x, y, z);
        const nx = x / radius;
        const ny = cosTheta;
        const nz = z / radius;
        normals.push(nx, ny, nz);
      }
    }

    // Indices untuk cylinder
    for (let i = 0; i < segments; i++) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }

    // Indices untuk top hemisphere
    for (let lat = 0; lat < segments / 2; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = topHemisphereStart + lat * (segments + 1) + lon;
        const b = a + segments + 1;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    // Indices untuk bottom hemisphere
    for (let lat = 0; lat < segments / 2; lat++) {
      for (let lon = 0; lon < segments; lon++) {
        const a = bottomHemisphereStart + lat * (segments + 1) + lon;
        const b = a + segments + 1;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Wedge/Prism - untuk ekor spike
   */
  createWedge: function (width = 1, height = 1, depth = 1) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;

    // 6 vertices untuk wedge
    const verts = [
      [-w, -h, d], // 0: front left bottom
      [w, -h, d], // 1: front right bottom
      [0, h, d], // 2: front top
      [-w, -h, -d], // 3: back left bottom
      [w, -h, -d], // 4: back right bottom
      [0, h, -d], // 5: back top
    ];

    // Front triangle
    vertices.push(...verts[0], ...verts[1], ...verts[2]);
    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
    indices.push(0, 1, 2);

    // Back triangle
    vertices.push(...verts[3], ...verts[5], ...verts[4]);
    normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
    indices.push(3, 4, 5);

    // Bottom rectangle
    vertices.push(...verts[0], ...verts[3], ...verts[4], ...verts[1]);
    normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0);
    indices.push(6, 7, 8, 6, 8, 9);

    // Left slope
    const leftNorm = this._calculateNormal(verts[0], verts[2], verts[3]);
    vertices.push(...verts[0], ...verts[3], ...verts[5], ...verts[2]);
    normals.push(...leftNorm, ...leftNorm, ...leftNorm, ...leftNorm);
    indices.push(10, 11, 12, 10, 12, 13);

    // Right slope
    const rightNorm = this._calculateNormal(verts[1], verts[4], verts[2]);
    vertices.push(...verts[1], ...verts[2], ...verts[5], ...verts[4]);
    normals.push(...rightNorm, ...rightNorm, ...rightNorm, ...rightNorm);
    indices.push(14, 15, 16, 14, 16, 17);

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Torus - untuk joints yang smooth (opsional, nice to have)
   */
  createTorus: function (
    majorRadius = 1,
    minorRadius = 0.3,
    majorSegments = 32,
    minorSegments = 16
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    for (let i = 0; i <= majorSegments; i++) {
      const u = (i * 2 * Math.PI) / majorSegments;
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);

      for (let j = 0; j <= minorSegments; j++) {
        const v = (j * 2 * Math.PI) / minorSegments;
        const cosV = Math.cos(v);
        const sinV = Math.sin(v);

        const x = (majorRadius + minorRadius * cosV) * cosU;
        const y = minorRadius * sinV;
        const z = (majorRadius + minorRadius * cosV) * sinU;

        vertices.push(x, y, z);

        const centerX = majorRadius * cosU;
        const centerZ = majorRadius * sinU;
        const nx = x - centerX;
        const ny = y;
        const nz = z - centerZ;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

        normals.push(nx / len, ny / len, nz / len);
      }
    }

    for (let i = 0; i < majorSegments; i++) {
      for (let j = 0; j < minorSegments; j++) {
        const a = i * (minorSegments + 1) + j;
        const b = a + minorSegments + 1;

        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  /**
   * Helper: Calculate normal dari 3 titik
   */
  _calculateNormal: function (p1, p2, p3) {
    const v1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    const v2 = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];

    const normal = [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0],
    ];

    const len = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
    return len > 0
      ? [normal[0] / len, normal[1] / len, normal[2] / len]
      : [0, 1, 0];
  },

  /**
   * Triangular Prism - prisma segitiga
   * @param {number} baseWidth - lebar base segitiga
   * @param {number} height - tinggi segitiga (dari base ke apex)
   * @param {number} depth - tebal prisma (extrude depth)
   */
  createTriangularPrism: function (baseWidth = 1, height = 1, depth = 1) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const halfW = baseWidth / 2;
    const halfD = depth / 2;

    // 6 vertices prisma segitiga
    const p = [
      // Front face (Z+)
      [-halfW, 0, halfD], // 0: base left
      [halfW, 0, halfD], // 1: base right
      [0, height, halfD], // 2: apex (puncak)

      // Back face (Z-)
      [-halfW, 0, -halfD], // 3: base left
      [halfW, 0, -halfD], // 4: base right
      [0, height, -halfD], // 5: apex (puncak)
    ];

    // Front triangle face
    vertices.push(...p[0], ...p[1], ...p[2]);
    const frontNormal = [0, 0, 1];
    normals.push(...frontNormal, ...frontNormal, ...frontNormal);
    indices.push(0, 1, 2);

    // Back triangle face
    vertices.push(...p[3], ...p[5], ...p[4]);
    const backNormal = [0, 0, -1];
    normals.push(...backNormal, ...backNormal, ...backNormal);
    indices.push(3, 4, 5);

    // Bottom rectangle (base)
    vertices.push(...p[0], ...p[3], ...p[4], ...p[1]);
    const bottomNormal = [0, -1, 0];
    normals.push(
      ...bottomNormal,
      ...bottomNormal,
      ...bottomNormal,
      ...bottomNormal
    );
    indices.push(6, 7, 8, 6, 8, 9);

    // Left slope
    const leftNorm = this._calculateNormal(p[0], p[2], p[3]);
    vertices.push(...p[0], ...p[3], ...p[5], ...p[2]);
    normals.push(...leftNorm, ...leftNorm, ...leftNorm, ...leftNorm);
    indices.push(10, 11, 12, 10, 12, 13);

    // Right slope
    const rightNorm = this._calculateNormal(p[1], p[4], p[2]);
    vertices.push(...p[1], ...p[2], ...p[5], ...p[4]);
    normals.push(...rightNorm, ...rightNorm, ...rightNorm, ...rightNorm);
    indices.push(14, 15, 16, 14, 16, 17);

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
};
