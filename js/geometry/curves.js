// File: js/geometry/curves.js

const Curves = {
  // --- Helper function untuk kalkulasi kurva Bezier ---
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

  createSweptSurface: function (
    profilePoints,
    pathPoints,
    isProfileClosed = false
  ) {
    // --- Helper Functions untuk Matematika Vektor ---
    const vec3 = {
      subtract: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
      normalize: (v) => {
        const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return len > 0.00001 ? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0];
      },
      cross: (a, b) => [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
      ],
      add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
      scale: (v, s) => [v[0] * s, v[1] * s, v[2] * s],
    };

    const vertices = [];
    const normals = [];
    const indices = [];

    const profilePointCount = profilePoints.length;
    const pathPointCount = pathPoints.length;

    let lastUp = [0, 1, 0]; // Vektor 'up' awal

    // --- Loop utama: Iterasi di sepanjang jalur ---
    for (let i = 0; i < pathPointCount; i++) {
      const currentPoint = pathPoints[i];

      // 1. Tentukan frame orientasi (tangent, right, up) di setiap titik pada jalur
      let tangent;
      if (i < pathPointCount - 1) {
        tangent = vec3.normalize(
          vec3.subtract(pathPoints[i + 1], currentPoint)
        );
      } else {
        // Untuk titik terakhir, gunakan arah dari titik sebelumnya
        tangent = vec3.normalize(
          vec3.subtract(currentPoint, pathPoints[i - 1])
        );
      }

      // Hindari masalah saat tangent sejajar dengan 'up'
      if (Math.abs(tangent[1]) > 0.999) {
        lastUp = [1, 0, 0];
      }

      const right = vec3.normalize(vec3.cross(tangent, lastUp));
      const up = vec3.normalize(vec3.cross(right, tangent));
      lastUp = up; // Simpan 'up' untuk frame berikutnya agar konsisten

      // 2. Buat "irisan" (slice) vertex dengan menempatkan profil di frame ini
      for (let j = 0; j < profilePointCount; j++) {
        const profilePoint = profilePoints[j];

        const pos = vec3.add(
          currentPoint,
          vec3.add(
            vec3.scale(right, profilePoint[0]),
            vec3.scale(up, profilePoint[1])
          )
        );

        vertices.push(...pos);

        // Normalnya adalah vektor dari pusat jalur ke titik pada profil
        const normal = vec3.normalize(
          vec3.subtract(pos, currentPoint)
        );
        normals.push(...normal);
      }
    }

    // --- Buat Indices untuk menyambungkan irisan-irisan ---
    for (let i = 0; i < pathPointCount - 1; i++) {
      for (let j = 0; j < profilePointCount - 1; j++) {
        const a = i * profilePointCount + j;
        const b = a + 1;
        const c = (i + 1) * profilePointCount + j;
        const d = c + 1;

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
      // Jika profilnya tertutup, sambungkan titik terakhir dengan titik pertama
      if (isProfileClosed) {
        const a = i * profilePointCount + (profilePointCount - 1);
        const b = i * profilePointCount;
        const c = (i + 1) * profilePointCount + (profilePointCount - 1);
        const d = (i + 1) * profilePointCount;

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
  
  // FUNGSI BARU UNTUK EFEK MERUNCING
  createTaperedSweptSurface: function (profilePoints, pathPoints, scaleFactors, isProfileClosed = false) {
    const vec3 = {
      subtract: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
      normalize: (v) => {
        const len = Math.hypot(v[0], v[1], v[2]);
        return len > 1e-5 ? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0];
      },
      cross: (a, b) => [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ],
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
            tangent = vec3.normalize(vec3.subtract(pathPoints[i + 1], currentPoint));
        } else {
            tangent = vec3.normalize(vec3.subtract(currentPoint, pathPoints[i - 1]));
        }

        if (Math.abs(tangent[1]) > 0.999) lastUp = [1, 0, 0];
        
        const right = vec3.normalize(vec3.cross(tangent, lastUp));
        const up = vec3.normalize(vec3.cross(right, tangent));
        lastUp = up;

        const currentScale = scaleFactors[i];

        for (let j = 0; j < profilePointCount; j++) {
            const profilePoint = profilePoints[j];
            const scaledProfilePoint = [profilePoint[0] * currentScale, profilePoint[1] * currentScale];
            
            const pos = vec3.add(currentPoint, vec3.add(vec3.scale(right, scaledProfilePoint[0]), vec3.scale(up, scaledProfilePoint[1])));
            vertices.push(...pos);

            const normal = vec3.normalize(vec3.subtract(pos, currentPoint));
            normals.push(...normal);
        }
    }

    for (let i = 0; i < pathPointCount - 1; i++) {
        for (let j = 0; j < profilePointCount - 1; j++) {
            const a = i * profilePointCount + j, b = a + 1;
            const c = (i + 1) * profilePointCount + j, d = c + 1;
            indices.push(a, c, b, b, c, d);
        }
        if (isProfileClosed) {
            const a = i * profilePointCount + (profilePointCount - 1), b = i * profilePointCount;
            const c = (i + 1) * profilePointCount + (profilePointCount - 1), d = (i + 1) * profilePointCount;
            indices.push(a, c, b, b, c, d);
        }
    }

    return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  },

  createSurfaceOfRevolution: function (profilePoints, segments) {
    const vertices = [];
    const normals = [];
    const indices = [];

    // Loop melalui setiap titik pada profil (vertikal)
    for (let i = 0; i < profilePoints.length; i++) {
      // Hitung vektor tangen 2D di titik ini untuk menemukan normal
      const p_prev = profilePoints[Math.max(0, i - 1)];
      const p_curr = profilePoints[i];
      const p_next = profilePoints[Math.min(profilePoints.length - 1, i + 1)];

      const tangent = [p_next[0] - p_prev[0], p_next[1] - p_prev[1]];
      const normal2D = [-tangent[1], tangent[0]]; // Normal 2D (tegak lurus tangen)
      const len = Math.hypot(normal2D[0], normal2D[1]);
      if (len > 0) {
        normal2D[0] /= len;
        normal2D[1] /= len;
      }

      // Loop melalui setiap segmen putaran (horizontal)
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * 2 * Math.PI;
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        // Putar titik profil untuk mendapatkan posisi vertex 3D
        const x = p_curr[0] * cosAngle;
        const y = p_curr[1];
        const z = p_curr[0] * sinAngle;
        vertices.push(x, y, z);

        // Putar normal 2D untuk mendapatkan normal vertex 3D
        const nx = normal2D[0] * cosAngle;
        const ny = normal2D[1];
        const nz = normal2D[0] * sinAngle;
        normals.push(nx, ny, nz);
      }
    }

    // Buat indices untuk menyambungkan grid vertex
    const pointsPerRing = segments + 1;
    for (let i = 0; i < profilePoints.length - 1; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * pointsPerRing + j;
        const b = a + pointsPerRing;
        const c = a + 1;
        const d = b + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
};

