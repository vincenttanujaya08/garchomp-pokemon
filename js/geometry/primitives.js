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
  createEllipticParaboloid: function (
    width = 1,
    depth = 1,
    height = 1,
    segments = 32
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      for (let j = 0; j <= segments; j++) {
        const v = (j * 2 * Math.PI) / segments;

        const x = width * u * Math.cos(v);
        const y = height * u * u; // Menggunakan Y sebagai sumbu tinggi
        const z = depth * u * Math.sin(v);
        vertices.push(x, y, z);

        const nx = 2 * height * x;
        const ny = -(width * depth);
        const nz = 2 * height * z;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

        if (len > 0) {
          normals.push(nx / len, ny / len, nz / len);
        } else {
          normals.push(0, -1, 0);
        }
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const first = i * (segments + 1) + j;
        const second = first + segments + 1;

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
  createSolidEllipticParaboloid: function (
    width = 1,
    depth = 1,
    height = 1,
    segments = 32
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    // === PERMUKAAN PARABOLOID (sama seperti sebelumnya) ===
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      for (let j = 0; j <= segments; j++) {
        const v = (j * 2 * Math.PI) / segments;

        const x = width * u * Math.cos(v);
        const y = height * u * u;
        const z = depth * u * Math.sin(v);
        vertices.push(x, y, z);

        const nx = 2 * height * x;
        const ny = -(width * depth);
        const nz = 2 * height * z;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

        if (len > 0) {
          normals.push(nx / len, ny / len, nz / len);
        } else {
          normals.push(0, -1, 0);
        }
      }
    }

    // Indices untuk permukaan paraboloid
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const first = i * (segments + 1) + j;
        const second = first + segments + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    // === TUTUP ALAS (BASE CAP) - Membuat solid ===
    const baseStartIndex = vertices.length / 3;

    // Center point alas (Y = 0)
    vertices.push(0, 0, 0);
    normals.push(0, -1, 0); // Normal ke bawah
    const centerIndex = baseStartIndex;

    // Ring vertices di alas (u = 1, Y = height)
    for (let j = 0; j <= segments; j++) {
      const v = (j * 2 * Math.PI) / segments;
      const x = width * Math.cos(v);
      const z = depth * Math.sin(v);
      vertices.push(x, height, z); // Y = height (di alas paraboloid)
      normals.push(0, -1, 0);
    }

    // Triangles dari center ke ring
    for (let j = 0; j < segments; j++) {
      indices.push(
        centerIndex,
        baseStartIndex + 1 + j + 1,
        baseStartIndex + 1 + j
      );
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  createHyperboloidOneSheet: function (
    radiusX = 1,
    radiusZ = 1,
    pinchY = 1,
    height = 2,
    latitudeBands = 30,
    longitudeBands = 30
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      const v = -1 + (latNumber / latitudeBands) * 2; // v ranges from -1 to 1
      const y = (v * height) / 2;

      // Calculate the radius at this height 'y' based on the hyperboloid equation
      // x^2/a^2 + z^2/b^2 = 1 + y^2/c^2
      const radiusScale = Math.sqrt(1 + (y * y) / (pinchY * pinchY));

      for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        const u = (longNumber / longitudeBands) * 2 * Math.PI;
        const cosU = Math.cos(u);
        const sinU = Math.sin(u);

        const x = radiusX * radiusScale * cosU;
        const z = radiusZ * radiusScale * sinU;
        vertices.push(x, y, z);

        // Normal vector is derived from the gradient of the implicit equation
        // F(x,y,z) = x^2/a^2 + z^2/b^2 - y^2/c^2 - 1 = 0
        // grad(F) = (2x/a^2, -2y/c^2, 2z/b^2)
        const nx = x / (radiusX * radiusX);
        const ny = -y / (pinchY * pinchY);
        const nz = z / (radiusZ * radiusZ);

        const len = Math.hypot(nx, ny, nz);
        if (len > 0) {
          normals.push(nx / len, ny / len, nz / len);
        } else {
          normals.push(0, 1, 0); // Fallback
        }
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
  createExtrudedShape: function (
    shapePoints,
    thickness,
    scaleTop = 1,
    scaleBottom = 1
  ) {
    // Helper matematika vektor untuk kompatibilitas
    const vec3_helpers = {
      subtract: (out, a, b) => {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        return out;
      },
      cross: (out, a, b) => {
        const ax = a[0],
          ay = a[1],
          az = a[2],
          bx = b[0],
          by = b[1],
          bz = b[2];
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
      },
      normalize: (out, a) => {
        const x = a[0],
          y = a[1],
          z = a[2];
        let len = x * x + y * y + z * z;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
        }
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        return out;
      },
    };

    const vertices = [];
    const normals = [];
    const indices = [];
    const n = shapePoints.length;

    // --- 1. BUAT SISI ATAS ---
    let offset = vertices.length / 3;
    for (const p of shapePoints) {
      vertices.push(p[0] * scaleTop, 0, p[2] * scaleTop);
      normals.push(0, 1, 0);
    }
    // Buat indices untuk sisi atas
    for (let i = 1; i < n - 1; i++) {
      indices.push(offset, offset + i, offset + i + 1);
    }

    // --- 2. BUAT SISI BAWAH ---
    offset = vertices.length / 3;
    for (const p of shapePoints) {
      vertices.push(p[0] * scaleBottom, -thickness, p[2] * scaleBottom);
      normals.push(0, -1, 0);
    }
    // Buat indices untuk sisi bawah (urutan dibalik)
    for (let i = 1; i < n - 1; i++) {
      indices.push(offset, offset + i + 1, offset + i);
    }

    // --- 3. BUAT DINDING SAMPING ---
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;

      const pTop1 = [
        shapePoints[i][0] * scaleTop,
        0,
        shapePoints[i][2] * scaleTop,
      ];
      const pTop2 = [
        shapePoints[next][0] * scaleTop,
        0,
        shapePoints[next][2] * scaleTop,
      ];
      const pBottom1 = [
        shapePoints[i][0] * scaleBottom,
        -thickness,
        shapePoints[i][2] * scaleBottom,
      ];
      const pBottom2 = [
        shapePoints[next][0] * scaleBottom,
        -thickness,
        shapePoints[next][2] * scaleBottom,
      ];

      // Hitung normal untuk dinding ini
      const v1 = vec3.create();
      const v2 = vec3.create();
      vec3_helpers.subtract(v1, pTop2, pTop1);
      vec3_helpers.subtract(v2, pBottom1, pTop1);
      const normal = vec3.create();
      vec3_helpers.cross(normal, v1, v2);
      vec3_helpers.normalize(normal, normal);

      offset = vertices.length / 3;
      vertices.push(...pTop1, ...pBottom1, ...pTop2, ...pBottom2);
      normals.push(...normal, ...normal, ...normal, ...normal);

      indices.push(offset, offset + 1, offset + 2);
      indices.push(offset + 2, offset + 1, offset + 3);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
  // Tambahkan fungsi ini di dalam object Primitives di js/geometry/primitives.js

/**
 * Setengah Ellipsoid (Bagian Bawah Saja) - untuk air
 */
createHalfEllipsoid: function (
  radiusX = 1,
  radiusY = 1,
  radiusZ = 1,
  latitudeBands = 30,
  longitudeBands = 30
) {
  const vertices = [];
  const normals = [];
  const indices = [];

  // Hanya iterasi dari equator (PI/2) ke kutub bawah (PI)
  for (let latNumber = latitudeBands / 2; latNumber <= latitudeBands; latNumber++) {
    const theta = (latNumber * Math.PI) / latitudeBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta); // Negatif atau nol untuk bagian bawah

    for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
      const phi = (longNumber * 2 * Math.PI) / longitudeBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = radiusX * cosPhi * sinTheta;
      const y = radiusY * cosTheta; // Akan selalu <= 0
      const z = radiusZ * sinPhi * sinTheta;

      // Normal mengarah keluar dari pusat ellipsoid
      const normal = [
        x / (radiusX * radiusX),
        y / (radiusY * radiusY),
        z / (radiusZ * radiusZ),
      ];
      const len = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);

      vertices.push(x, y, z);
      // Normal dibalik agar menghadap ke dalam mangkok jika diinginkan,
      // tapi untuk air, normal keluar (permukaan atas) mungkin lebih baik.
      // Kita gunakan normal keluar standar saja.
      normals.push(normal[0] / len, normal[1] / len, normal[2] / len);
    }
  }

  // Tambahkan permukaan datar di bagian atas (y=0)
  const topCenterIndex = vertices.length / 3;
  vertices.push(0, 0, 0); // Titik pusat di y=0
  normals.push(0, 1, 0); // Normal menghadap ke atas

  const equatorStartIndex = 0; // Index vertex pertama di equator
  for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
     const phi = (longNumber * 2 * Math.PI) / longitudeBands;
     const sinPhi = Math.sin(phi);
     const cosPhi = Math.cos(phi);
     const x = radiusX * cosPhi; // sinTheta is 1 at equator
     const z = radiusZ * sinPhi;
     vertices.push(x, 0, z); // Vertex di y=0
     normals.push(0, 1, 0); // Normal menghadap ke atas
  }


  // Indices untuk bagian melengkung
  const latStart = 0; // Mulai dari equator (index 0 setelah modifikasi loop)
  const numLatBands = latitudeBands / 2; // Hanya setengah band
   for (let latNumber = latStart; latNumber < numLatBands; latNumber++) {
     for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
       const first = latNumber * (longitudeBands + 1) + longNumber;
       const second = first + longitudeBands + 1;

       indices.push(first, first + 1, second);
       indices.push(second, first + 1, second + 1);
     }
   }

  // Indices untuk permukaan datar atas
   const topRingStartIndex = topCenterIndex + 1;
   for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
       indices.push(
           topCenterIndex,
           topRingStartIndex + longNumber,
           topRingStartIndex + longNumber + 1
       );
   }


  return {
    vertices: new Float32Array(vertices),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
  };
},
};

window.Primitives = Primitives;

console.log("✅ Primitives loaded:", Object.keys(Primitives));
