// File: js/geometry/curves.js

const Curves = {
  createSharkFin: function (baseWidth, height, depth) {
    const vertices = [];
    const indices = [];
    const normals = [];

    const halfWidth = baseWidth / 2;

    // Bentuk SABIT - base lebar, melengkung ke belakang, ujung runcing
    vertices.push(
      // BASE (lebar)
      -halfWidth,
      0,
      0, // 0: kiri bawah
      halfWidth,
      0,
      0, // 1: kanan bawah

      // KURVA SABIT (3 titik)
      -halfWidth * 0.7,
      height * 0.4,
      depth * 0.5, // 2: kurva kiri
      0,
      height * 0.8,
      depth * 1.2, // 3: kurva tengah atas
      halfWidth * 0.7,
      height * 0.4,
      depth * 0.5, // 4: kurva kanan

      // UJUNG RUNCING
      0,
      height,
      depth * 1.5 // 5: tip (ujung sabit)
    );

    indices.push(
      // Sisi kiri (2 segitiga asli)
      0,
      2,
      1, // Sisi Kiri Bawah (Base)
      2,
      3,
      1, // Sisi Kiri Tengah

      // Sisi kanan (2 segitiga asli)
      1,
      3,
      4, // Sisi Kanan Tengah
      1,
      4,
      5, // Sisi Kanan Atas-Ujung Bawah

      // === SEGITIGA BARU UNTUK MELENGKAPI PERMUKAAN ===

      // Melengkapi Sisi Kiri Atas (menghubungkan 0 ke 5)
      // Tambahkan segitiga 0, 3, 5
      0,
      3,
      5,
      // Tambahkan segitiga 0, 2, 5
      0,
      2,
      5,

      // Melengkapi Sisi Kanan Atas (membuat permukaan halus menuju 5)
      // Tambahkan segitiga 3, 4, 5
      3,
      4,
      5,

      // Segitiga Ujung (1 segitiga asli)
      2,
      3,
      5

      // Catatan: Segitiga Base asli (0, 1, 2) dihapus karena redundan/tidak datar.
    );

    // Normals (perlu dihitung ulang untuk model 3D yang tepat,
    // tapi untuk keperluan ini, normal bawaan dipertahankan)
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

    // === MAIN BLADE BODY (Rectangular cross-section) ===
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = (t - 0.5) * length;
      const y = curve * (1 - 4 * (t - 0.5) * (t - 0.5));

      // 4 corners of rectangle (in circle order for easier connection)
      // Top, Right, Bottom, Left
      const rectCorners = [
        [y + halfWidth, halfThickness], // 0: top
        [y, halfThickness], // 1: right front (transition)
        [y - halfWidth, halfThickness], // 2: bottom front
        [y - halfWidth, 0], // 3: bottom middle (transition)
        [y - halfWidth, -halfThickness], // 4: bottom back
        [y, -halfThickness], // 5: left back (transition)
        [y + halfWidth, -halfThickness], // 6: top back
        [y + halfWidth, 0], // 7: top middle (transition)
      ];

      // Create circular cross-section with 8 points
      const crossSectionSegs = 16;
      for (let j = 0; j <= crossSectionSegs; j++) {
        const theta = (j / crossSectionSegs) * Math.PI * 2;

        // Ellipse formula for cross-section
        const localY = halfWidth * Math.cos(theta);
        const localZ = halfThickness * Math.sin(theta);

        vertices.push(x, y + localY, localZ);

        // Normal pointing outward from center
        const len = Math.sqrt(localY * localY + localZ * localZ);
        if (len > 0) {
          normals.push(0, localY / len, localZ / len);
        } else {
          normals.push(0, 1, 0);
        }
      }
    }

    // Indices for blade body
    const crossSegs = 16;
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < crossSegs; j++) {
        const curr = i * (crossSegs + 1) + j;
        const next = curr + crossSegs + 1;

        indices.push(curr, next, curr + 1);
        indices.push(curr + 1, next, next + 1);
      }
    }

    // === ELLIPSOIDAL CAPS WITH TRANSITION ===
    const capSegs = 16;

    // Left cap (start)
    const x1 = -length / 2;
    const y1 = curve;
    addEllipsoidalCap(x1, y1, halfWidth, halfThickness, -1, capSegs, crossSegs);

    // Right cap (end)
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

      // Create hemisphere with ellipsoidal cross-section
      // phi: 0 (at blade edge) to PI/2 (at tip)
      for (let i = 0; i <= radialSegs; i++) {
        const phi = ((i / radialSegs) * Math.PI) / 2;

        // X extends outward from blade plane
        const rx = direction * radY * Math.sin(phi);
        const radiusAtPhi = Math.cos(phi); // Radius shrinks as we go to tip

        for (let j = 0; j <= circSegs; j++) {
          const theta = (j / circSegs) * Math.PI * 2;

          // Elliptical cross-section
          const ry = radiusAtPhi * radY * Math.cos(theta);
          const rz = radiusAtPhi * radZ * Math.sin(theta);

          const px = cx + rx;
          const py = cy + ry;
          const pz = rz;

          vertices.push(px, py, pz);

          // Normal calculation for ellipsoid
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
  // Curved right-triangle "sail" (segitiga siku-siku melengkung)
  // - width, height : kaki segitiga (siku di (0,0))
  // - bulge         : derajat “mengembung” busur hipotenusa (positif = ke dalam segitiga)
  // - segments      : resolusi busur
  createSail: function (width = 3, height = 4, bulge = 0.6, segments = 64) {
    const W = Math.abs(width);
    const H = Math.abs(height);
    const N = Math.max(3, segments | 0);

    // P0=(W,0), P2=(0,H), O=(0,0). Busur hipotenusa = Bezier kuadratik (P0 -> P2, CP=P1).
    const P0 = [W, 0];
    const P2 = [0, H];

    // Midpoint garis miring & normal yang mengarah ke dalam segitiga (ke origin).
    const Mx = 0.5 * (P0[0] + P2[0]); // W/2
    const My = 0.5 * (P0[1] + P2[1]); // H/2
    // v = P2 - P0 = (-W, H). Normal ke arah origin ~ (-H, -W).
    const nx0 = -H,
      ny0 = -W;
    const nlen = Math.hypot(nx0, ny0) || 1;
    const nx = nx0 / nlen,
      ny = ny0 / nlen;

    // Offset kontrol proporsional panjang hipotenusa
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

    // v0 = origin (siku)
    vertices.push(0, 0, 0);
    normals.push(0, 0, 1);

    // Sampel busur dari P0 -> P2
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = bez2(P0[0], P1[0], P2[0], t);
      const y = bez2(P0[1], P1[1], P2[1], t);
      vertices.push(x, y, 0);
      normals.push(0, 0, 1);
    }

    // Fan triangulation (CCW dilihat dari +Z): (0, i+1, i+2)
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
    // x
    p[0] = uuu * p0[0];
    p[0] += 3 * uu * t * p1[0];
    p[0] += 3 * u * tt * p2[0];
    p[0] += ttt * p3[0];
    // y
    p[1] = uuu * p0[1];
    p[1] += 3 * uu * t * p1[1];
    p[1] += 3 * u * tt * p2[1];
    p[1] += ttt * p3[1];
    // z
    p[2] = uuu * p0[2];
    p[2] += 3 * uu * t * p1[2];
    p[2] += 3 * u * tt * p2[2];
    p[2] += ttt * p3[2];

    return p;
  },

  // FUNGSI BARU UNTUK EFEK MERUNCING
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
      console.error("scaleFactors must have the same length as pathPoints.");
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

  // Sail dengan atas & bawah melengkung (pakai Coons patch dari 3 Bezier).
  // A=(0,0)  (kiri-bawah), B=(0,height) (kiri-atas), C=(width,0) (ujung kanan).
  // topBulge    : kelengkungan sisi atas (B→C), >0 = cembung ke luar
  // bottomBulge : kelengkungan sisi bawah (A→C), >0 = melengkung ke arah dalam (naik)
  // leftBulge   : sedikit membulatkan sisi kiri (A→B), >0 = menonjol ke +X
  // segU        : subdivisi arah ke kanan (menuju C)
  // segV        : subdivisi arah tinggi (dari bottom→top)
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

    // Sudut/pojok
    const A = [0, 0]; // kiri-bawah
    const B = [0, H]; // kiri-atas
    const C = [W, 0]; // ujung kanan (kedua sisi bertemu)

    // Helper: Bezier kuadratik 2D
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

    // === Kurva batas Bezier ===
    // TOP: B -> C dengan kontrol di tengah + normal
    {
      const vx = C[0] - B[0],
        vy = C[1] - B[1]; // (W, -H)
      const n = norm2(+H, +W); // normal cembung ke luar
      var P1_top = [
        0.5 * (B[0] + C[0]) + topBulge * Math.hypot(vx, vy) * n[0],
        0.5 * (B[1] + C[1]) + topBulge * Math.hypot(vx, vy) * n[1],
      ];
    }

    // BOTTOM: A -> C; kontrol di tengah + normal ke atas
    {
      const n = [0, 1]; // normal dari garis AC (garis datar) ke atas
      var P1_bot = [
        0.5 * (A[0] + C[0]) + bottomBulge * W * n[0],
        0.5 * (A[1] + C[1]) + bottomBulge * W * n[1],
      ];
    }

    // LEFT: A -> B; kontrol ke kanan sedikit untuk membulatkan sudut kiri-bawah
    {
      const n = [1, 0]; // normal dari garis AB ke kanan
      var P1_left = [
        0.5 * (A[0] + B[0]) + leftBulge * H * n[0],
        0.5 * (A[1] + B[1]) + leftBulge * H * n[1],
      ];
    }

    // Coons patch P(u,v), u∈[0,1] kiri→kanan, v∈[0,1] bawah→atas.
    function coons(u, v) {
      // kurva u (bawah & atas)
      const Cu0 = bez2(A, P1_bot, C, u); // bottom
      const Cu1 = bez2(B, P1_top, C, u); // top
      // kurva v (kiri & kanan); kanan degenerat di C
      const Cv0 = bez2(A, P1_left, B, v); // left
      const Cv1 = C; // right (tetap di C)

      // bilinear sudut
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

      // Coons
      const x =
        (1 - v) * Cu0[0] + v * Cu1[0] + (1 - u) * Cv0[0] + u * Cv1[0] - BLx;
      const y =
        (1 - v) * Cu0[1] + v * Cu1[1] + (1 - u) * Cv0[1] + u * Cv1[1] - BLy;
      return [x, y, 0];
    }

    const vertices = [];
    const normals = [];
    const indices = [];

    // grid (U+1) x (V+1)
    for (let j = 0; j <= V; j++) {
      const v = j / V;
      for (let i = 0; i <= U; i++) {
        const u = i / U;
        const p = coons(u, v);
        vertices.push(p[0], p[1], p[2]);
        normals.push(0, 0, 1); // bidang XY, menghadap +Z
      }
    }

    // triangulasi grid, CCW dari +Z
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

  // Sail Coons 3D: ekstrusi dari patch 2D + dinding samping
  // width, height, topBulge, bottomBulge, leftBulge, segU, segV : sama seperti createSailCoons
  // thickness : tebal total (mendapatkan z=±thickness/2)
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

    // Sudut
    const A = [0, 0],
      B = [0, H],
      C = [W, 0];

    // Helpers
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

    // Kontrol kurva batas
    (function computeControls() {
      const vx = C[0] - B[0],
        vy = C[1] - B[1];
      const nTop = norm2(+H, +W); // normal chord BC
      var P1_top = [
        0.5 * (B[0] + C[0]) + topBulge * Math.hypot(vx, vy) * nTop[0],
        0.5 * (B[1] + C[1]) + topBulge * Math.hypot(vx, vy) * nTop[1],
      ];
      var P1_bot = [0.5 * (A[0] + C[0]), 0.5 * (A[1] + C[1]) + bottomBulge * W];
      var P1_left = [leftBulge * H, 0.5 * (A[1] + B[1])];

      // simpan ke closure
      Curves.__sail3D__ = { P1_top, P1_bot, P1_left };
    })();

    const { P1_top, P1_bot, P1_left } = Curves.__sail3D__;

    function coons(u, v) {
      const Cu0 = bez2(A, P1_bot, C, u); // bottom (A->C)
      const Cu1 = bez2(B, P1_top, C, u); // top    (B->C)
      const Cv0 = bez2(A, P1_left, B, v); // left  (A->B)
      // right degenerat di C
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

    // ---------- 1) Permukaan depan (z=+T) ----------
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
    // Indeks depan (CCW dari +Z)
    for (let j = 0; j < V; j++) {
      for (let i = 0; i < U; i++) {
        const a = j * stride + i;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    // ---------- 2) Permukaan belakang (z=-T) ----------
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
    // Indeks belakang (winding dibalik agar menghadap -Z)
    for (let j = 0; j < V; j++) {
      for (let i = 0; i < U; i++) {
        const a = backOffset + j * stride + i;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        indices.push(a, b, c, b, d, c); // reversed
      }
    }

    // Helper: buat strip dinding dari polyline 2D (xy), menghubungkan z=+T ke z=-T
    function addSideStrip(points, outward2D) {
      const startIdx = vertices.length / 3;
      for (let k = 0; k < points.length; k++) {
        const [x, y] = points[k];
        // front
        vertices.push(x, y, +T);
        normals.push(outward2D[0], outward2D[1], 0);
        // back
        vertices.push(x, y, -T);
        normals.push(outward2D[0], outward2D[1], 0);
      }
      // indeks quad strip
      for (let k = 0; k < points.length - 1; k++) {
        const a = startIdx + 2 * k;
        const b = a + 1;
        const c = a + 2;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    // Kurva batas untuk dinding
    // Left: A->B   (V+1 sampel)
    const leftPts = [];
    for (let j = 0; j <= V; j++) leftPts.push(bez2(A, P1_left, B, j / V));
    addSideStrip(leftPts, [-1, 0]); // outward kira-kira ke -X

    // Top:  B->C   (U+1 sampel)
    const topPts = [];
    for (let i = 0; i <= U; i++) topPts.push(bez2(B, P1_top, C, i / U));
    // outward kira-kira ke atas-kiri (normal chord BC)
    const nTop = norm2(+H, +W);
    addSideStrip(topPts, nTop);

    // Bottom: A->C (U+1 sampel)
    const botPts = [];
    for (let i = 0; i <= U; i++) botPts.push(bez2(A, P1_bot, C, i / U));
    addSideStrip(botPts, [0, -1]); // outward ke -Y (kira-kira)

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
};

window.Curves = Curves;

console.log("✅ Curves loaded:", Object.keys(Curves));
