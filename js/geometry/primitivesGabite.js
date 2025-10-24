const PP1 = {
  createTubeFromPath: function (path, radius, radialSegments, scaleFactors) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const vec3_subtract = (out, a, b) => {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      return out;
    };
    const vec3_normalize = (out, a) => {
      let len = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
      if (len > 0) {
        len = 1 / Math.sqrt(len);
      }
      out[0] = a[0] * len;
      out[1] = a[1] * len;
      out[2] = a[2] * len;
      return out;
    };
    const vec3_cross = (out, a, b) => {
      let ax = a[0],
        ay = a[1],
        az = a[2],
        bx = b[0],
        by = b[1],
        bz = b[2];
      out[0] = ay * bz - az * by;
      out[1] = az * bx - ax * bz;
      out[2] = ax * by - ay * bx;
      return out;
    };

    for (let i = 0; i < path.length; i++) {
      const center = path[i];
      const scale = scaleFactors[i];
      let tangent = [0, 0, 1],
        normal = [0, 1, 0],
        binormal = [1, 0, 0];
      if (i < path.length - 1) {
        vec3_subtract(tangent, path[i + 1], center);
      } else {
        vec3_subtract(tangent, center, path[i - 1]);
      }
      vec3_normalize(tangent, tangent);
      vec3_cross(binormal, tangent, [0, 1, 0]);
      if (Math.hypot(...binormal) < 0.1)
        vec3_cross(binormal, tangent, [1, 0, 0]);
      vec3_normalize(binormal, binormal);
      vec3_cross(normal, binormal, tangent);
      for (let j = 0; j <= radialSegments; j++) {
        const theta = (j / radialSegments) * 2 * Math.PI;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        const nx = cosTheta * normal[0] + sinTheta * binormal[0];
        const ny = cosTheta * normal[1] + sinTheta * binormal[1];
        const nz = cosTheta * normal[2] + sinTheta * binormal[2];
        vertices.push(
          center[0] + radius * scale * nx,
          center[1] + radius * scale * ny,
          center[2] + radius * scale * nz
        );
        normals.push(nx, ny, nz);
      }
    }

    for (let i = 0; i < path.length - 1; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (radialSegments + 1) + j;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

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

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = radius * Math.cos(angle - Math.PI / 2);
      const y = radius * Math.sin(angle - Math.PI / 2);
      vertices.push(x, y, 0);
      normals.push(0, 0, -1);
    }

    vertices.push(0, 0, 0);
    normals.push(0, 0, -1);
    const centerIndex = vertices.length / 3 - 1;

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

    const halfW = width / 2.0;
    const halfH = height / 2.0;
    const outlinePoints = [
      { x: -halfW * 1.6, y: halfH }, // 0: Puncak kiri atas
      { x: 0, y: vCut * halfH }, // 1: Lekukan tengah
      { x: halfW * 1.6, y: halfH }, // 2: Puncak kanan atas
      { x: 0, y: -halfH }, // 3: Puncak bawah
    ];

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

    indices.push(0, 3, 1);
    indices.push(2, 1, 3);

    indices.push(backOffset + 0, backOffset + 1, backOffset + 3);
    indices.push(backOffset + 2, backOffset + 3, backOffset + 1);

    for (let i = 0; i < 4; i++) {
      const p1_idx = i;
      const p2_idx = (i + 1) % 4;
      const p1 = outlinePoints[p1_idx];
      const p2 = outlinePoints[p2_idx];
      const vIndex = vertices.length / 3;

      vertices.push(p1.x, p1.y, zPos, p2.x, p2.y, zPos);
      vertices.push(p1.x, p1.y, -zPos, p2.x, p2.y, -zPos);

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

    for (let i = 0; i <= radialSegments; i++) {
      const theta = (i * 2 * Math.PI) / radialSegments;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta); // Sisi

      vertices.push(x, halfHeight, z);
      normals.push(x / radius, 0, z / radius);
      vertices.push(x, -halfHeight, z);
      normals.push(x / radius, 0, z / radius); // Tutup Atas

      vertices.push(x, halfHeight, z);
      normals.push(0, 1, 0); // Tutup Bawah

      vertices.push(x, -halfHeight, z);
      normals.push(0, -1, 0);
    }

    const topCenterIndex = vertices.length / 3;
    vertices.push(0, halfHeight, 0);
    normals.push(0, 1, 0);

    const bottomCenterIndex = vertices.length / 3;
    vertices.push(0, -halfHeight, 0);
    normals.push(0, -1, 0);

    let sideOffset = 0;
    let topOffset = radialSegments * 4;
    let bottomOffset = topOffset + radialSegments + 2;

    for (let i = 0; i < radialSegments; i++) {
      const a = i * 4;
      const b = a + 1;
      const c = a + 4;
      const d = a + 5;
      indices.push(a, c, b, b, c, d);

      indices.push(topCenterIndex, topOffset + i, topOffset + i + 1);

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

    const p = [
      [-halfBaseW, -halfH, halfD], // 0: Kiri Bawah
      [halfBaseW, -halfH, halfD], // 1: Kanan Bawah
      [0.0, halfH, halfD], // 2: Atas Tengah // Muka belakang (sumbu Z negatif)

      [-halfBaseW, -halfH, -halfD], // 3: Kiri Bawah
      [halfBaseW, -halfH, -halfD], // 4: Kanan Bawah
      [0.0, halfH, -halfD], // 5: Atas Tengah
    ];

    const vertices = [];
    const normals = [];
    const indices = [];

    vertices.push(...p[0], ...p[1], ...p[2]);
    normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);
    indices.push(0, 1, 2);

    vertices.push(...p[3], ...p[5], ...p[4]);
    normals.push(0, 0, -1, 0, 0, -1, 0, 0, -1);
    indices.push(3, 4, 5);

    vertices.push(...p[0], ...p[3], ...p[4], ...p[1]);
    normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0);
    indices.push(6, 7, 8, 6, 8, 9);

    const v0 = [p[0][0], p[0][1], p[0][2]];
    const v2 = [p[2][0], p[2][1], p[2][2]];
    const v3 = [p[3][0], p[3][1], p[3][2]];

    const vec1_left = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
    const vec2_left = [v3[0] - v0[0], v3[1] - v0[1], v3[2] - v0[2]];
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

    const v1 = [p[1][0], p[1][1], p[1][2]];
    const v4 = [p[4][0], p[4][1], p[4][2]];

    const vec1_right = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
    const vec2_right = [v4[0] - v1[0], v4[1] - v1[1], v4[2] - v1[2]];
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
  createExtrudedShape: function (
    shapePoints,
    thickness,
    scaleTop = 1,
    scaleBottom = 1
  ) {
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

    let offset = vertices.length / 3;
    for (const p of shapePoints) {
      vertices.push(p[0] * scaleTop, 0, p[2] * scaleTop);
      normals.push(0, 1, 0);
    }
    for (let i = 1; i < n - 1; i++) {
      indices.push(offset, offset + i, offset + i + 1);
    }

    offset = vertices.length / 3;
    for (const p of shapePoints) {
      vertices.push(p[0] * scaleBottom, -thickness, p[2] * scaleBottom);
      normals.push(0, -1, 0);
    }
    for (let i = 1; i < n - 1; i++) {
      indices.push(offset, offset + i + 1, offset + i);
    }

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

      const v1 = [0, 0, 0];
      const v2 = [0, 0, 0];
      vec3_helpers.subtract(v1, pTop2, pTop1);
      vec3_helpers.subtract(v2, pBottom1, pTop1);
      const normal = [0, 0, 0];
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

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      topPoints.push([x, halfHeight, z]);
      bottomPoints.push([x, -halfHeight, z]);
    }

    let offset = vertices.length / 3;
    for (const p of topPoints) {
      vertices.push(...p);
      normals.push(0, 1, 0);
    }
    indices.push(offset, offset + 1, offset + 2);
    indices.push(offset, offset + 2, offset + 3);
    indices.push(offset, offset + 3, offset + 4);
    indices.push(offset, offset + 4, offset + 5);

    offset = vertices.length / 3;
    for (const p of bottomPoints) {
      vertices.push(...p);
      normals.push(0, -1, 0);
    }
    indices.push(offset, offset + 2, offset + 1);
    indices.push(offset, offset + 3, offset + 2);
    indices.push(offset, offset + 4, offset + 3);
    indices.push(offset, offset + 5, offset + 4);

    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      const p1 = topPoints[i];
      const p2 = bottomPoints[i];
      const p3 = topPoints[next];
      const p4 = bottomPoints[next];

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
      const v = -1 + (latNumber / latitudeBands) * 2;
      const y = (v * height) / 2;

      const radiusScale = Math.sqrt(1 + (y * y) / (pinchY * pinchY));

      for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        const u = (longNumber / longitudeBands) * 2 * Math.PI;
        const cosU = Math.cos(u);
        const sinU = Math.sin(u);

        const x = radiusX * radiusScale * cosU;
        const z = radiusZ * radiusScale * sinU;
        vertices.push(x, y, z);

        const nx = x / (radiusX * radiusX);
        const ny = -y / (pinchY * pinchY);
        const nz = z / (radiusZ * radiusZ);

        const len = Math.hypot(nx, ny, nz);
        if (len > 0) {
          normals.push(nx / len, ny / len, nz / len);
        } else {
          normals.push(0, 1, 0);
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

  createTrapezoidalPrism: function (bottomWidth, topWidth, height, depth) {
    const halfBottomW = bottomWidth / 2;
    const halfTopW = topWidth / 2;
    const halfH = height / 2;
    const halfD = depth / 2;

    const p = [
      [-halfBottomW, -halfH, halfD], // 0: Kiri bawah
      [halfBottomW, -halfH, halfD], // 1: Kanan bawah
      [halfTopW, halfH, halfD], // 2: Kanan atas
      [-halfTopW, halfH, halfD], // 3: Kiri atas // Muka belakang (z negatif)
      [-halfBottomW, -halfH, -halfD], // 4: Kiri bawah
      [halfBottomW, -halfH, -halfD], // 5: Kanan bawah
      [halfTopW, halfH, -halfD], // 6: Kanan atas
      [-halfTopW, halfH, -halfD], // 7: Kiri atas
    ];

    const vertices = new Float32Array([
      ...p[0],
      ...p[1],
      ...p[2],
      ...p[3], // Depan
      ...p[5],
      ...p[4],
      ...p[7],
      ...p[6], // Belakang
      ...p[3],
      ...p[2],
      ...p[6],
      ...p[7], // Atas
      ...p[4],
      ...p[5],
      ...p[1],
      ...p[0], // Bawah
      ...p[4],
      ...p[0],
      ...p[3],
      ...p[7], // Kiri
      ...p[1],
      ...p[5],
      ...p[6],
      ...p[2], // Kanan
    ]);

    const normals = new Float32Array([
      // Depan
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1, // Belakang
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1, // Atas
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0, // Bawah
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0, // Kiri
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0, // Kanan
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
    ]);

    const indices = new Uint16Array([
      0,
      1,
      2,
      0,
      2,
      3, // Depan
      4,
      5,
      6,
      4,
      6,
      7, // Belakang
      8,
      9,
      10,
      8,
      10,
      11, // Atas
      12,
      13,
      14,
      12,
      14,
      15, // Bawah
      16,
      17,
      18,
      16,
      18,
      19, // Kiri
      20,
      21,
      22,
      20,
      22,
      23, // Kanan
    ]);

    return { vertices, normals, indices };
  },
  createSailCoons3D: function (
    width = 3,
    height = 2,
    topBulge = 0.35,
    bottomBulge = 0.25,
    leftBulge = 0.15,
    segU = 32,
    segV = 16,
    thickness = 0.12
  ) {
    const W = Math.max(1e-6, width);
    const H = Math.max(1e-6, height);
    const U = Math.max(2, segU | 0);
    const V = Math.max(2, segV | 0);
    const T = Math.max(1e-6, thickness) * 0.5;

    const A = [0, 0],
      B = [0, H],
      C = [W, 0];

    function bez2(P0, P1, P2, t) {
      const it = 1 - t;
      return [
        it * it * P0[0] + 2 * it * t * P1[0] + t * t * P2[0],
        it * it * P0[1] + 2 * it * t * P1[1] + t * t * P2[1],
      ];
    }
    function norm2(x, y) {
      const l = Math.hypot(x, y) || 1;
      return [x / l, y / l];
    }

    const vx = C[0] - B[0],
      vy = C[1] - B[1];
    const nTop = norm2(+H, +W);
    var P1_top = [
      0.5 * (B[0] + C[0]) + topBulge * Math.hypot(vx, vy) * nTop[0],
      0.5 * (B[1] + C[1]) + topBulge * Math.hypot(vx, vy) * nTop[1],
    ];
    var P1_bot = [0.5 * (A[0] + C[0]), 0.5 * (A[1] + C[1]) + bottomBulge * W];
    var P1_left = [leftBulge * H, 0.5 * (A[1] + B[1])];

    function coons(u, v) {
      const Cu0 = bez2(A, P1_bot, C, u);
      const Cu1 = bez2(B, P1_top, C, u);
      const Cv0 = bez2(A, P1_left, B, v);
      const BLx =
        (1 - u) * (1 - v) * A[0] +
        (1 - u) * v * B[0] +
        u * (1 - v) * C[0] +
        u * v * C[0];
      const BLy =
        (1 - u) * (1 - v) * A[1] +
        (1 - u) * v * B[1] +
        u * (1 - v) * C[1] +
        u * v * C[1];
      const x =
        (1 - v) * Cu0[0] + v * Cu1[0] + (1 - u) * Cv0[0] + u * C[0] - BLx;
      const y =
        (1 - v) * Cu0[1] + v * Cu1[1] + (1 - u) * Cv0[1] + u * C[1] - BLy;
      return [x, y];
    }

    const vertices = [];
    const normals = [];
    const indices = [];

    const stride = U + 1;
    for (let j = 0; j <= V; j++) {
      const v = j / V;
      for (let i = 0; i <= U; i++) {
        const u = i / U;
        const [x, y] = coons(u, v);
        vertices.push(x, y, +T);
        normals.push(0, 0, 1);
      }
    }
    for (let j = 0; j < V; j++) {
      for (let i = 0; i < U; i++) {
        const a = j * stride + i;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const backOffset = vertices.length / 3;
    for (let j = 0; j <= V; j++) {
      const v = j / V;
      for (let i = 0; i <= U; i++) {
        const u = i / U;
        const [x, y] = coons(u, v);
        vertices.push(x, y, -T);
        normals.push(0, 0, -1);
      }
    }
    for (let j = 0; j < V; j++) {
      for (let i = 0; i < U; i++) {
        const a = backOffset + j * stride + i;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }

    function addSideStrip(points, outward2D) {
      const startIdx = vertices.length / 3;
      for (let k = 0; k < points.length; k++) {
        const [x, y] = points[k];
        vertices.push(x, y, +T, x, y, -T);
        normals.push(
          outward2D[0],
          outward2D[1],
          0,
          outward2D[0],
          outward2D[1],
          0
        );
      }
      for (let k = 0; k < points.length - 1; k++) {
        const a = startIdx + 2 * k,
          b = a + 1,
          c = a + 2,
          d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const leftPts = [];
    for (let j = 0; j <= V; j++) leftPts.push(bez2(A, P1_left, B, j / V));
    addSideStrip(leftPts, [-1, 0]);

    const topPts = [];
    for (let i = 0; i <= U; i++) topPts.push(bez2(B, P1_top, C, i / U));
    addSideStrip(topPts, norm2(+H, +W));

    const botPts = [];
    for (let i = 0; i <= U; i++) botPts.push(bez2(A, P1_bot, C, i / U));
    addSideStrip(botPts, [0, -1]);

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
  createCuboid: function (width = 1, height = 1, depth = 1) {
    const halfW = width / 2;
    const halfH = height / 2;
    const halfD = depth / 2;

    const p = [
      [-halfW, -halfH, halfD], // 0: Depan kiri bawah
      [halfW, -halfH, halfD], // 1: Depan kanan bawah
      [halfW, halfH, halfD], // 2: Depan kanan atas
      [-halfW, halfH, halfD], // 3: Depan kiri atas
      [-halfW, -halfH, -halfD], // 4: Belakang kiri bawah
      [halfW, -halfH, -halfD], // 5: Belakang kanan bawah
      [halfW, halfH, -halfD], // 6: Belakang kanan atas
      [-halfW, halfH, -halfD], // 7: Belakang kiri atas
    ];

    const vertices = new Float32Array([
      ...p[0],
      ...p[1],
      ...p[2],
      ...p[3], // Depan
      ...p[5],
      ...p[4],
      ...p[7],
      ...p[6], // Belakang
      ...p[3],
      ...p[2],
      ...p[6],
      ...p[7], // Atas
      ...p[4],
      ...p[5],
      ...p[1],
      ...p[0], // Bawah
      ...p[4],
      ...p[0],
      ...p[3],
      ...p[7], // Kiri
      ...p[1],
      ...p[5],
      ...p[6],
      ...p[2], // Kanan
    ]);

    const normals = new Float32Array([
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1, // Depan
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1, // Belakang
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0, // Atas
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0, // Bawah
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0, // Kiri
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0, // Kanan
    ]);

    const indices = new Uint16Array([
      0,
      1,
      2,
      0,
      2,
      3, // Depan
      4,
      5,
      6,
      4,
      6,
      7, // Belakang
      8,
      9,
      10,
      8,
      10,
      11, // Atas
      12,
      13,
      14,
      12,
      14,
      15, // Bawah
      16,
      17,
      18,
      16,
      18,
      19, // Kiri
      20,
      21,
      22,
      20,
      22,
      23, // Kanan
    ]);

    return { vertices, normals, indices };
  },
  createCapsule: function (radius = 1, cylinderHeight = 2, segments = 32) {
    // Placeholder - returns a cylinder for now
    const { vertices, normals, indices } = this.createCylinder(
      radius,
      cylinderHeight,
      segments
    );
    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
  createLathe: function (profilePoints, segments = 32) {
    const vertices = [];
    const normals = [];
    const indices = [];
    const profileLength = profilePoints.length;
    const profileNormals = [];

    for (let j = 0; j < profileLength; j++) {
      let tangent = [0, 0];
      const p = profilePoints[j];
      if (j === 0) {
        // First point
        const pNext = profilePoints[j + 1];
        tangent = [pNext[0] - p[0], pNext[1] - p[1]];
      } else if (j === profileLength - 1) {
        // Last point
        const pPrev = profilePoints[j - 1];
        tangent = [p[0] - pPrev[0], p[1] - pPrev[1]];
      } else {
        // Middle point
        const pNext = profilePoints[j + 1];
        const pPrev = profilePoints[j - 1];
        tangent = [pNext[0] - pPrev[0], pNext[1] - pPrev[1]];
      }

      let normal = [tangent[1], -tangent[0]];
      const len = Math.hypot(normal[0], normal[1]);
      if (len > 1e-6) {
        normal[0] /= len;
        normal[1] /= len;
      } else {
        normal = [1, 0];
      }
      profileNormals.push(normal);
    }

    for (let i = 0; i <= segments; i++) {
      const phi = (i / segments) * 2 * Math.PI;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      for (let j = 0; j < profileLength; j++) {
        const radius = profilePoints[j][0];
        const y = profilePoints[j][1];

        vertices.push(radius * cosPhi, y, radius * sinPhi);

        const nx_profile = profileNormals[j][0];
        const ny_profile = profileNormals[j][1];
        const nx = nx_profile * cosPhi;
        const ny = ny_profile;
        const nz = nx_profile * sinPhi;
        normals.push(nx, ny, nz);
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < profileLength - 1; j++) {
        const a = i * profileLength + j;
        const b = a + 1;
        const c = (i + 1) * profileLength + j;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
};
