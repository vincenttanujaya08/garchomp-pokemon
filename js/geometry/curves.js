// File: js/geometry/curves.js

const Curves = {
  /**
   * Calculates a point on a cubic Bézier curve.
   * @param {number} t - The parameter, from 0 to 1.
   * @param {number[]} p0 - The start point.
   * @param {number[]} p1 - The first control point.
   * @param {number[]} p2 - The second control point.
   * @param {number[]} p3 - The end point.
   * @returns {number[]} The calculated point on the curve.
   */
  getBezierPoint: function(t, p0, p1, p2, p3) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    let p = [0, 0, 0];
    // Blending functions for each coordinate
    p[0] = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
    p[1] = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];
    p[2] = uuu * p0[2] + 3 * uu * t * p1[2] + 3 * u * tt * p2[2] + ttt * p3[2];

    return p;
  },

  createSharkFin: function (baseWidth, height, depth) {
    const halfWidth = baseWidth / 2;
    const vertices = [
      -halfWidth, 0, 0,  // 0: base left
       halfWidth, 0, 0,  // 1: base right
      -halfWidth * 0.7, height * 0.4, depth * 0.5, // 2: curve left
       0, height * 0.8, depth * 1.2, // 3: curve mid
       halfWidth * 0.7, height * 0.4, depth * 0.5, // 4: curve right
       0, height, depth * 1.5 // 5: tip
    ];
    const indices = [
      0, 2, 1, 2, 3, 1, 1, 3, 4, 1, 4, 5, 0, 3, 5, 0, 2, 5, 3, 4, 5, 2, 3, 5
    ];
    const normals = new Array(vertices.length).fill(0); // Placeholder
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
    const nx0 = -H, ny0 = -W;
    const nlen = Math.hypot(nx0, ny0) || 1;
    const nx = nx0 / nlen, ny = ny0 / nlen;

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
    
    const vx = C[0] - B[0], vy = C[1] - B[1];
    const n = norm2(+H, +W);
    var P1_top = [
      0.5 * (B[0] + C[0]) + topBulge * Math.hypot(vx, vy) * n[0],
      0.5 * (B[1] + C[1]) + topBulge * Math.hypot(vx, vy) * n[1],
    ];
    
    const n_bot = [0, 1];
    var P1_bot = [
      0.5 * (A[0] + C[0]) + bottomBulge * W * n_bot[0],
      0.5 * (A[1] + C[1]) + bottomBulge * W * n_bot[1],
    ];
    
    const n_left = [1, 0];
    var P1_left = [
      0.5 * (A[0] + B[0]) + leftBulge * H * n_left[0],
      0.5 * (A[1] + B[1]) + leftBulge * H * n_left[1],
    ];
    
    function coons(u, v) {
      const Cu0 = bez2(A, P1_bot, C, u);
      const Cu1 = bez2(B, P1_top, C, u);
      const Cv0 = bez2(A, P1_left, B, v);
      const Cv1 = C;

      const BLx = (1 - u) * (1 - v) * A[0] + (1 - u) * v * B[0] + u * (1 - v) * C[0] + u * v * C[0];
      const BLy = (1 - u) * (1 - v) * A[1] + (1 - u) * v * B[1] + u * (1 - v) * C[1] + u * v * C[1];

      const x = (1 - v) * Cu0[0] + v * Cu1[0] + (1 - u) * Cv0[0] + u * Cv1[0] - BLx;
      const y = (1 - v) * Cu0[1] + v * Cu1[1] + (1 - u) * Cv0[1] + u * Cv1[1] - BLy;
      return [x, y, 0];
    }

    const vertices = []; const normals = []; const indices = [];
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
        const a = j * stride + i; const b = a + 1; const c = a + stride; const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  },

  createSailCoons3D: function (
    width = 3, height = 2, topBulge = 0.35, bottomBulge = 0.25, leftBulge = 0.15,
    segU = 64, segV = 16, thickness = 0.12
  ) {
    const W = Math.max(1e-6, width); const H = Math.max(1e-6, height);
    const U = Math.max(2, segU | 0); const V = Math.max(2, segV | 0);
    const T = Math.max(1e-6, thickness) * 0.5;

    const A = [0, 0], B = [0, H], C = [W, 0];

    function bez2(P0, P1, P2, t) {
      const it = 1 - t;
      return [
        it * it * P0[0] + 2 * it * t * P1[0] + t * t * P2[0],
        it * it * P0[1] + 2 * it * t * P1[1] + t * t * P2[1],
      ];
    }
    function norm2(x, y) { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; }

    let P1_top, P1_bot, P1_left;
    (function computeControls() {
      const vx = C[0] - B[0], vy = C[1] - B[1];
      const nTop = norm2(+H, +W);
      P1_top = [
        0.5 * (B[0] + C[0]) + topBulge * Math.hypot(vx, vy) * nTop[0],
        0.5 * (B[1] + C[1]) + topBulge * Math.hypot(vx, vy) * nTop[1],
      ];
      P1_bot = [0.5 * (A[0] + C[0]), 0.5 * (A[1] + C[1]) + bottomBulge * W];
      P1_left = [leftBulge * H, 0.5 * (A[1] + B[1])];
    })();

    function coons(u, v) {
      const Cu0 = bez2(A, P1_bot, C, u); const Cu1 = bez2(B, P1_top, C, u);
      const Cv0 = bez2(A, P1_left, B, v);
      const BLx = (1 - u) * (1 - v) * A[0] + (1 - u) * v * B[0] + u * (1 - v) * C[0] + u * v * C[0];
      const BLy = (1 - u) * (1 - v) * A[1] + (1 - u) * v * B[1] + u * (1 - v) * C[1] + u * v * C[1];
      const x = (1 - v) * Cu0[0] + v * Cu1[0] + (1 - u) * Cv0[0] + u * C[0] - BLx;
      const y = (1 - v) * Cu0[1] + v * Cu1[1] + (1 - u) * Cv0[1] + u * C[1] - BLy;
      return [x, y];
    }

    const vertices = [], normals = [], indices = [];

    const stride = U + 1;
    for (let j = 0; j <= V; j++) {
      const v = j / V;
      for (let i = 0; i <= U; i++) {
        const u = i / U; const [x, y] = coons(u, v);
        vertices.push(x, y, +T); normals.push(0, 0, 1);
      }
    }
    for (let j = 0; j < V; j++) {
      for (let i = 0; i < U; i++) {
        const a = j * stride + i; const b = a + 1; const c = a + stride; const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const backOffset = vertices.length / 3;
    for (let j = 0; j <= V; j++) {
      const v = j / V;
      for (let i = 0; i <= U; i++) {
        const u = i / U; const [x, y] = coons(u, v);
        vertices.push(x, y, -T); normals.push(0, 0, -1);
      }
    }
    for (let j = 0; j < V; j++) {
      for (let i = 0; i < U; i++) {
        const a = backOffset + j * stride + i; const b = a + 1; const c = a + stride; const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }

    function addSideStrip(points, outward2D) {
      const startIdx = vertices.length / 3;
      for (let k = 0; k < points.length; k++) {
        const [x, y] = points[k];
        vertices.push(x, y, +T); normals.push(outward2D[0], outward2D[1], 0);
        vertices.push(x, y, -T); normals.push(outward2D[0], outward2D[1], 0);
      }
      for (let k = 0; k < points.length - 1; k++) {
        const a = startIdx + 2 * k; const b = a + 1; const c = a + 2; const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    
    const leftPts = []; for (let j = 0; j <= V; j++) leftPts.push(bez2(A, P1_left, B, j / V));
    addSideStrip(leftPts, [-1, 0]);

    const topPts = []; for (let i = 0; i <= U; i++) topPts.push(bez2(B, P1_top, C, i / U));
    const nTop = norm2(+H, +W); addSideStrip(topPts, nTop);

    const botPts = []; for (let i = 0; i <= U; i++) botPts.push(bez2(A, P1_bot, C, i / U));
    addSideStrip(botPts, [0, -1]);

    return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  },
};

