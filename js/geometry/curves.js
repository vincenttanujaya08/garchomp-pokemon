const Curves = {
  createSharkFin: function (baseWidth, height, depth) {
    const vertices = [];
    const indices = [];
    const normals = [];

    const halfWidth = baseWidth / 2;

    vertices.push(
      -halfWidth,
      0,
      0,
      halfWidth,
      0,
      0,
      -halfWidth * 0.7,
      height * 0.4,
      depth * 0.5,
      0,
      height * 0.8,
      depth * 1.2,
      halfWidth * 0.7,
      height * 0.4,
      depth * 0.5,
      0,
      height,
      depth * 1.5
    );

    indices.push(
      0,
      2,
      1,
      2,
      3,
      1,
      1,
      3,
      4,
      1,
      4,
      5,
      0,
      3,
      5,
      0,
      2,
      5,
      3,
      4,
      5,
      2,
      3,
      5
    );

    for (let i = 0; i < 6; i++) {
      normals.push(0, 0.7, 0.7);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
  createKatanaCrescent: function (
    length = 3,
    width = 0.4,
    curve = 0.3,
    thickness = 0.15,
    segments = 64
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const halfWidth = width / 2;
    const halfThickness = thickness / 2;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = (t - 0.5) * length;
      const y = curve * (1 - 4 * (t - 0.5) * (t - 0.5));

      const rectCorners = [
        [y + halfWidth, halfThickness],
        [y, halfThickness],
        [y - halfWidth, halfThickness],
        [y - halfWidth, 0],
        [y - halfWidth, -halfThickness],
        [y, -halfThickness],
        [y + halfWidth, -halfThickness],
        [y + halfWidth, 0],
      ];

      const crossSectionSegs = 16;
      for (let j = 0; j <= crossSectionSegs; j++) {
        const theta = (j / crossSectionSegs) * Math.PI * 2;

        const localY = halfWidth * Math.cos(theta);
        const localZ = halfThickness * Math.sin(theta);

        vertices.push(x, y + localY, localZ);

        const len = Math.sqrt(localY * localY + localZ * localZ);
        if (len > 0) {
          normals.push(0, localY / len, localZ / len);
        } else {
          normals.push(0, 1, 0);
        }
      }
    }

    const crossSegs = 16;
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < crossSegs; j++) {
        const curr = i * (crossSegs + 1) + j;
        const next = curr + crossSegs + 1;

        indices.push(curr, next, curr + 1);
        indices.push(curr + 1, next, next + 1);
      }
    }

    const capSegs = 16;

    const x1 = -length / 2;
    const y1 = curve;
    addEllipsoidalCap(x1, y1, halfWidth, halfThickness, -1, capSegs, crossSegs);

    const x2 = length / 2;
    const y2 = curve;
    addEllipsoidalCap(x2, y2, halfWidth, halfThickness, 1, capSegs, crossSegs);

    function addEllipsoidalCap(
      cx,
      cy,
      radY,
      radZ,
      direction,
      radialSegs,
      circSegs
    ) {
      const capStart = vertices.length / 3;

      for (let i = 0; i <= radialSegs; i++) {
        const phi = ((i / radialSegs) * Math.PI) / 2;

        const rx = direction * radY * Math.sin(phi);
        const radiusAtPhi = Math.cos(phi);

        for (let j = 0; j <= circSegs; j++) {
          const theta = (j / circSegs) * Math.PI * 2;

          const ry = radiusAtPhi * radY * Math.cos(theta);
          const rz = radiusAtPhi * radZ * Math.sin(theta);

          const px = cx + rx;
          const py = cy + ry;
          const pz = rz;

          vertices.push(px, py, pz);

          const nx = (direction * Math.sin(phi)) / radY;
          const ny = (radiusAtPhi * Math.cos(theta)) / radY;
          const nz = (radiusAtPhi * Math.sin(theta)) / radZ;
          const nlen = Math.sqrt(nx * nx + ny * ny + nz * nz);

          if (nlen > 0) {
            normals.push(nx / nlen, ny / nlen, nz / nlen);
          } else {
            normals.push(direction, 0, 0);
          }
        }
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
  createSail: function (width = 3, height = 4, bulge = 0.6, segments = 64) {
    const W = Math.abs(width);
    const H = Math.abs(height);
    const N = Math.max(3, segments | 0);

    const P0 = [W, 0];
    const P2 = [0, H];

    const Mx = 0.5 * (P0[0] + P2[0]);
    const My = 0.5 * (P0[1] + P2[1]);
    const nx0 = -H,
      ny0 = -W;
    const nlen = Math.hypot(nx0, ny0) || 1;
    const nx = nx0 / nlen,
      ny = ny0 / nlen;

    const L = Math.hypot(W, H);
    const b = Math.max(-2, Math.min(2, bulge));
    const s = b * 0.35 * L;
    const P1 = [Mx + s * nx, My + s * ny];

    function bez2(a, b, c, t) {
      const it = 1 - t;
      return it * it * a + 2 * it * t * b + t * t * c;
    }

    const vertices = [];
    const normals = [];
    const indices = [];

    vertices.push(0, 0, 0);
    normals.push(0, 0, 1);

    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = bez2(P0[0], P1[0], P2[0], t);
      const y = bez2(P0[1], P1[1], P2[1], t);
      vertices.push(x, y, 0);
      normals.push(0, 0, 1);
    }

    for (let i = 0; i < N; i++) {
      indices.push(0, i + 1, i + 2);
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
  getBezierPoint: function (t, p0, p1, p2, p3) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    let p = [0, 0, 0];
    p[0] = uuu * p0[0];
    p[0] += 3 * uu * t * p1[0];
    p[0] += 3 * u * tt * p2[0];
    p[0] += ttt * p3[0];
    p[1] = uuu * p0[1];
    p[1] += 3 * uu * t * p1[1];
    p[1] += 3 * u * tt * p2[1];
    p[1] += ttt * p3[1];
    p[2] = uuu * p0[2];
    p[2] += 3 * uu * t * p1[2];
    p[2] += 3 * u * tt * p2[2];
    p[2] += ttt * p3[2];

    return p;
  },

  createTaperedSweptSurface: function (
    profilePoints,
    pathPoints,
    scaleFactors,
    isProfileClosed = false
  ) {
    const vec3 = {
      subtract: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
      normalize: (v) => {
        const len = Math.hypot(v[0], v[1], v[2]);
        return len > 1e-5 ? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0];
      },
      cross: (a, b) => [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
      ],
      add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
      scale: (v, s) => [v[0] * s, v[1] * s, v[2] * s],
    };

    if (scaleFactors.length !== pathPoints.length) {
      scaleFactors = Array(pathPoints.length).fill(1.0);
    }

    const vertices = [];
    const normals = [];
    const indices = [];
    const profilePointCount = profilePoints.length;
    const pathPointCount = pathPoints.length;
    let lastUp = [0, 1, 0];

    for (let i = 0; i < pathPointCount; i++) {
      const currentPoint = pathPoints[i];
      let tangent;
      if (i < pathPointCount - 1) {
        tangent = vec3.normalize(
          vec3.subtract(pathPoints[i + 1], currentPoint)
        );
      } else {
        tangent = vec3.normalize(
          vec3.subtract(currentPoint, pathPoints[i - 1])
        );
      }

      if (Math.abs(tangent[1]) > 0.999) lastUp = [1, 0, 0];

      const right = vec3.normalize(vec3.cross(tangent, lastUp));
      const up = vec3.normalize(vec3.cross(right, tangent));
      lastUp = up;

      const currentScale = scaleFactors[i];

      for (let j = 0; j < profilePointCount; j++) {
        const profilePoint = profilePoints[j];
        const scaledProfilePoint = [
          profilePoint[0] * currentScale,
          profilePoint[1] * currentScale,
        ];

        const pos = vec3.add(
          currentPoint,
          vec3.add(
            vec3.scale(right, scaledProfilePoint[0]),
            vec3.scale(up, scaledProfilePoint[1])
          )
        );
        vertices.push(...pos);

        const normal = vec3.normalize(vec3.subtract(pos, currentPoint));
        normals.push(...normal);
      }
    }

    for (let i = 0; i < pathPointCount - 1; i++) {
      for (let j = 0; j < profilePointCount - 1; j++) {
        const a = i * profilePointCount + j,
          b = a + 1;
        const c = (i + 1) * profilePointCount + j,
          d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
      if (isProfileClosed) {
        const a = i * profilePointCount + (profilePointCount - 1),
          b = i * profilePointCount;
        const c = (i + 1) * profilePointCount + (profilePointCount - 1),
          d = (i + 1) * profilePointCount;
        indices.push(a, c, b, b, c, d);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },

  createSailCoons: function (
    width = 3,
    height = 2,
    topBulge = 0.35,
    bottomBulge = 0.25,
    leftBulge = 0.15,
    segU = 64,
    segV = 16
  ) {
    const W = Math.max(1e-6, width);
    const H = Math.max(1e-6, height);
    const U = Math.max(2, segU | 0);
    const V = Math.max(2, segV | 0);

    const A = [0, 0];
    const B = [0, H];
    const C = [W, 0];

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

    {
      const vx = C[0] - B[0],
        vy = C[1] - B[1];
      const n = norm2(+H, +W);
      var P1_top = [
        0.5 * (B[0] + C[0]) + topBulge * Math.hypot(vx, vy) * n[0],
        0.5 * (B[1] + C[1]) + topBulge * Math.hypot(vx, vy) * n[1],
      ];
    }

    {
      const n = [0, 1];
      var P1_bot = [
        0.5 * (A[0] + C[0]) + bottomBulge * W * n[0],
        0.5 * (A[1] + C[1]) + bottomBulge * W * n[1],
      ];
    }

    {
      const n = [1, 0];
      var P1_left = [
        0.5 * (A[0] + B[0]) + leftBulge * H * n[0],
        0.5 * (A[1] + B[1]) + leftBulge * H * n[1],
      ];
    }

    function coons(u, v) {
      const Cu0 = bez2(A, P1_bot, C, u);
      const Cu1 = bez2(B, P1_top, C, u);
      const Cv0 = bez2(A, P1_left, B, v);
      const Cv1 = C;

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
        (1 - v) * Cu0[0] + v * Cu1[0] + (1 - u) * Cv0[0] + u * Cv1[0] - BLx;
      const y =
        (1 - v) * Cu0[1] + v * Cu1[1] + (1 - u) * Cv0[1] + u * Cv1[1] - BLy;
      return [x, y, 0];
    }

    const vertices = [];
    const normals = [];
    const indices = [];

    for (let j = 0; j <= V; j++) {
      const v = j / V;
      for (let i = 0; i <= U; i++) {
        const u = i / U;
        const p = coons(u, v);
        vertices.push(p[0], p[1], p[2]);
        normals.push(0, 0, 1);
      }
    }

    const stride = U + 1;
    for (let j = 0; j < V; j++) {
      for (let i = 0; i < U; i++) {
        const a = j * stride + i;
        const b = a + 1;
        const c = a + stride;
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

  createSailCoons3D: function (
    width = 3,
    height = 2,
    topBulge = 0.35,
    bottomBulge = 0.25,
    leftBulge = 0.15,
    segU = 64,
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

    (function computeControls() {
      const vx = C[0] - B[0],
        vy = C[1] - B[1];
      const nTop = norm2(+H, +W);
      var P1_top = [
        0.5 * (B[0] + C[0]) + topBulge * Math.hypot(vx, vy) * nTop[0],
        0.5 * (B[1] + C[1]) + topBulge * Math.hypot(vx, vy) * nTop[1],
      ];
      var P1_bot = [0.5 * (A[0] + C[0]), 0.5 * (A[1] + C[1]) + bottomBulge * W];
      var P1_left = [leftBulge * H, 0.5 * (A[1] + B[1])];

      Curves.__sail3D__ = { P1_top, P1_bot, P1_left };
    })();

    const { P1_top, P1_bot, P1_left } = Curves.__sail3D__;

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
        vertices.push(x, y, +T);
        normals.push(outward2D[0], outward2D[1], 0);
        vertices.push(x, y, -T);
        normals.push(outward2D[0], outward2D[1], 0);
      }
      for (let k = 0; k < points.length - 1; k++) {
        const a = startIdx + 2 * k;
        const b = a + 1;
        const c = a + 2;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const leftPts = [];
    for (let j = 0; j <= V; j++) leftPts.push(bez2(A, P1_left, B, j / V));
    addSideStrip(leftPts, [-1, 0]);

    const topPts = [];
    for (let i = 0; i <= U; i++) topPts.push(bez2(B, P1_top, C, i / U));
    const nTop = norm2(+H, +W);
    addSideStrip(topPts, nTop);

    const botPts = [];
    for (let i = 0; i <= U; i++) botPts.push(bez2(A, P1_bot, C, i / U));
    addSideStrip(botPts, [0, -1]);

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
};

window.Curves = Curves;
