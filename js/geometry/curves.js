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
};
