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
};
