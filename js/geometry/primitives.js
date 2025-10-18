const Primitives = {
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

  createStar: function (innerRadius = 0.5, outerRadius = 1.0) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const points = 5;

    // Definisikan 10 titik untuk bintang (5 ujung luar, 5 lekukan dalam)
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = radius * Math.cos(angle - Math.PI / 2);
      const y = radius * Math.sin(angle - Math.PI / 2);
      vertices.push(x, y, 0);
      normals.push(0, 0, -1); // Normal menghadap ke depan (sumbu -Z)
    }

    // Tambahkan titik pusat untuk membuat segitiga
    vertices.push(0, 0, 0);
    normals.push(0, 0, -1);
    const centerIndex = vertices.length / 3 - 1;

    // Buat indices yang menghubungkan semua titik ke pusat
    for (let i = 0; i < points * 2; i++) {
      indices.push(centerIndex, i, (i + 1) % (points * 2));
    }

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
  createChevron: function (
    width = 2.0,
    height = 2.0,
    vCut = 0.1,
    thickness = 0.1
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const zPos = thickness / 2.0;

    // 1. Tentukan 4 titik outline 2D berdasarkan parameter
    const halfW = width / 2.0;
    const halfH = height / 2.0;
    const outlinePoints = [
      { x: -halfW * 1.6, y: halfH }, // 0: Puncak kiri atas
      { x: 0, y: vCut * halfH }, // 1: Lekukan tengah
      { x: halfW * 1.6, y: halfH }, // 2: Puncak kanan atas
      { x: 0, y: -halfH }, // 3: Puncak bawah
    ];

    // 2. Buat vertices dan normal untuk muka DEPAN dan BELAKANG
    const frontNormal = [0, 0, 1];
    outlinePoints.forEach((p) => {
      vertices.push(p.x, p.y, zPos);
      normals.push(...frontNormal);
    });
    const backOffset = 4;
    const backNormal = [0, 0, -1];
    outlinePoints.forEach((p) => {
      vertices.push(p.x, p.y, -zPos);
      normals.push(...backNormal);
    });

    // 3. Indices untuk muka DEPAN (2 segitiga)
    indices.push(0, 3, 1);
    indices.push(2, 1, 3);

    // 4. Indices untuk muka BELAKANG (urutan dibalik)
    indices.push(backOffset + 0, backOffset + 1, backOffset + 3);
    indices.push(backOffset + 2, backOffset + 3, backOffset + 1);

    // 5. Buat sisi-sisi samping untuk memberikan KETEBALAN
    for (let i = 0; i < 4; i++) {
      const p1_idx = i;
      const p2_idx = (i + 1) % 4;
      const p1 = outlinePoints[p1_idx];
      const p2 = outlinePoints[p2_idx];
      const vIndex = vertices.length / 3;

      vertices.push(p1.x, p1.y, zPos, p2.x, p2.y, zPos);
      vertices.push(p1.x, p1.y, -zPos, p2.x, p2.y, -zPos);

      // Hitung normal samping secara matematis (tegak lurus dari vektor tepian)
      const edgeVec = { x: p2.x - p1.x, y: p2.y - p1.y };
      let sideNormal = [edgeVec.y, -edgeVec.x, 0];
      const len = Math.hypot(sideNormal[0], sideNormal[1]);
      if (len > 0.0001) {
        sideNormal[0] /= len;
        sideNormal[1] /= len;
      }
      for (let j = 0; j < 4; j++) normals.push(...sideNormal);

      indices.push(vIndex, vIndex + 2, vIndex + 1);
      indices.push(vIndex + 1, vIndex + 2, vIndex + 3);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  createCylinder: function (radius = 1, height = 2, radialSegments = 32) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const halfHeight = height / 2;

    const sideVertices = [];
    const topCapVertices = [0, halfHeight, 0];
    const bottomCapVertices = [0, -halfHeight, 0];

    // Buat vertices untuk sisi, tutup atas, dan tutup bawah
    for (let i = 0; i <= radialSegments; i++) {
      const theta = (i * 2 * Math.PI) / radialSegments;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);

      // Sisi
      vertices.push(x, halfHeight, z);
      normals.push(x / radius, 0, z / radius);
      vertices.push(x, -halfHeight, z);
      normals.push(x / radius, 0, z / radius);

      // Tutup Atas
      vertices.push(x, halfHeight, z);
      normals.push(0, 1, 0);

      // Tutup Bawah
      vertices.push(x, -halfHeight, z);
      normals.push(0, -1, 0);
    }

    // Titik pusat tutup
    const topCenterIndex = vertices.length / 3;
    vertices.push(0, halfHeight, 0);
    normals.push(0, 1, 0);

    const bottomCenterIndex = vertices.length / 3;
    vertices.push(0, -halfHeight, 0);
    normals.push(0, -1, 0);

    // Buat indices
    let sideOffset = 0;
    let topOffset = radialSegments * 2 + 2;
    let bottomOffset = topOffset + radialSegments + 1;

    for (let i = 0; i < radialSegments; i++) {
      // Sisi
      const a = sideOffset + i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c);
      indices.push(b, d, c);

      // Tutup Atas
      indices.push(topCenterIndex, topOffset + i, topOffset + i + 1);

      // Tutup Bawah
      indices.push(bottomCenterIndex, bottomOffset + i + 1, bottomOffset + i);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  createTriangularPrism: function (baseWidth, height, depth) {
    const halfBaseW = baseWidth / 2;
    const halfH = height / 2;
    const halfD = depth / 2;

    // Definisikan 6 titik sudut unik dari prisma segitiga
    const p = [
      // Muka depan (sumbu Z positif)
      [-halfBaseW, -halfH, halfD], // 0: Kiri Bawah
      [halfBaseW, -halfH, halfD], // 1: Kanan Bawah
      [0.0, halfH, halfD], // 2: Atas Tengah

      // Muka belakang (sumbu Z negatif)
      [-halfBaseW, -halfH, -halfD], // 3: Kiri Bawah
      [halfBaseW, -halfH, -halfD], // 4: Kanan Bawah
      [0.0, halfH, -halfD], // 5: Atas Tengah
    ];

    const vertices = [];
    const normals = [];
    const indices = [];

    // Muka depan segitiga
    vertices.push(...p[0], ...p[1], ...p[2]);
    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1); // Normal menghadap ke depan
    indices.push(0, 1, 2);

    // Muka belakang segitiga
    vertices.push(...p[3], ...p[5], ...p[4]); // Urutan dibalik agar normal menghadap ke belakang
    normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
    indices.push(3, 4, 5); // Sesuaikan indeks karena ini set vertex baru

    // Sisi Bawah (persegi panjang)
    vertices.push(...p[0], ...p[3], ...p[4], ...p[1]);
    normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0);
    indices.push(6, 7, 8, 6, 8, 9);

    // Sisi Kiri Miring (persegi panjang)
    // Hitung normal sisi miring: cross product dari dua vektor di sisi
    const v0 = [p[0][0], p[0][1], p[0][2]];
    const v2 = [p[2][0], p[2][1], p[2][2]];
    const v3 = [p[3][0], p[3][1], p[3][2]];

    const vec1_left = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]]; // Vektor dari p0 ke p2
    const vec2_left = [v3[0] - v0[0], v3[1] - v0[1], v3[2] - v0[2]]; // Vektor dari p0 ke p3
    const normalLeft = [
      vec1_left[1] * vec2_left[2] - vec1_left[2] * vec2_left[1],
      vec1_left[2] * vec2_left[0] - vec1_left[0] * vec2_left[2],
      vec1_left[0] * vec2_left[1] - vec1_left[1] * vec2_left[0],
    ];
    const lenLeft = Math.hypot(...normalLeft);
    if (lenLeft > 0)
      normalLeft.forEach((val, i) => (normalLeft[i] = val / lenLeft));

    vertices.push(...p[0], ...p[3], ...p[5], ...p[2]);
    normals.push(...normalLeft, ...normalLeft, ...normalLeft, ...normalLeft);
    indices.push(10, 11, 12, 10, 12, 13);

    // Sisi Kanan Miring (persegi panjang)
    const v1 = [p[1][0], p[1][1], p[1][2]];
    const v4 = [p[4][0], p[4][1], p[4][2]];

    const vec1_right = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]]; // Vektor dari p1 ke p2
    const vec2_right = [v4[0] - v1[0], v4[1] - v1[1], v4[2] - v1[2]]; // Vektor dari p1 ke p4
    const normalRight = [
      vec1_right[1] * vec2_right[2] - vec1_right[2] * vec2_right[1],
      vec1_right[2] * vec2_right[0] - vec1_right[0] * vec2_right[2],
      vec1_right[0] * vec2_right[1] - vec1_right[1] * vec2_right[0],
    ];
    const lenRight = Math.hypot(...normalRight);
    if (lenRight > 0)
      normalRight.forEach((val, i) => (normalRight[i] = val / lenRight));

    vertices.push(...p[1], ...p[4], ...p[5], ...p[2]);
    normals.push(
      ...normalRight,
      ...normalRight,
      ...normalRight,
      ...normalRight
    );
    indices.push(14, 15, 16, 14, 16, 17);

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
  // GANTI SELURUH FUNGSI createExtrudedShape DENGAN VERSI BARU INI
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
  createHexagonalPrism: function (radius, height) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const halfHeight = height / 2;

    const topPoints = [];
    const bottomPoints = [];

    // Buat 6 titik untuk alas atas dan bawah
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      topPoints.push([x, halfHeight, z]);
      bottomPoints.push([x, -halfHeight, z]);
    }

    // --- SISI ATAS (SEGI ENAM) ---
    let offset = vertices.length / 3;
    for (const p of topPoints) {
      vertices.push(...p);
      normals.push(0, 1, 0);
    }
    // Buat 4 segitiga untuk membentuk segi enam
    indices.push(offset, offset + 1, offset + 2);
    indices.push(offset, offset + 2, offset + 3);
    indices.push(offset, offset + 3, offset + 4);
    indices.push(offset, offset + 4, offset + 5);

    // --- SISI BAWAH (SEGI ENAM) ---
    offset = vertices.length / 3;
    for (const p of bottomPoints) {
      vertices.push(...p);
      normals.push(0, -1, 0);
    }
    // Urutan dibalik agar normal benar
    indices.push(offset, offset + 2, offset + 1);
    indices.push(offset, offset + 3, offset + 2);
    indices.push(offset, offset + 4, offset + 3);
    indices.push(offset, offset + 5, offset + 4);

    // --- DINDING SAMPING (6 PERSEGI PANJANG) ---
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      const p1 = topPoints[i];
      const p2 = bottomPoints[i];
      const p3 = topPoints[next];
      const p4 = bottomPoints[next];

      // Hitung normal
      const v1 = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];
      const v2 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
      const normal = [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0],
      ];
      const len = Math.hypot(...normal);
      if (len > 0) normal.forEach((val, idx) => (normal[idx] = val / len));

      offset = vertices.length / 3;
      vertices.push(...p1, ...p2, ...p3, ...p4);
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
};
