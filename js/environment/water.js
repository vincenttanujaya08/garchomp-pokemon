/**
 * js/environment/water.js
 * Fungsi untuk membuat objek air di bawah pulau.
 */

function createWaterBody(gl, islandWorldPosition, islandScaleFactor) {
  // Konstanta dasar (sebelum diskalakan)
  const baseWaterRadiusX = 1.5;
  const baseWaterRadiusZ = 1.2;
  const baseWaterDepth = 0.5;
  const baseWaterLevelOffset = -(0.05 + 0.2 + 0.3 + 0.1); // Offset Y relatif dari pusat pulau (grass+dirt+rock+sedikit celah)

  // Hitung dimensi dan posisi air berdasarkan skala dan posisi pulau
  const waterRadiusX = baseWaterRadiusX * islandScaleFactor;
  const waterRadiusZ = baseWaterRadiusZ * islandScaleFactor;
  const waterDepth = baseWaterDepth * islandScaleFactor;
  const waterLevel = islandWorldPosition[1] + baseWaterLevelOffset * islandScaleFactor; // Posisi Y absolut

  console.log(`Creating water at Y=${waterLevel.toFixed(2)} for island at Y=${islandWorldPosition[1].toFixed(2)}`);

  // Buat mesh setengah ellipsoid
  const waterMesh = new Mesh(gl, Primitives.createHalfEllipsoid(
      waterRadiusX,
      waterDepth, // Gunakan depth sebagai radius Y
      waterRadiusZ,
      32, // latitudeBands
      32  // longitudeBands
  ));

  // Warna air (biru semi-transparan)
  const waterColor = [0.2, 0.5, 0.8, 0.7]; // RGBA
  const waterNode = new SceneNode(waterMesh, waterColor);
  waterNode.name = "WaterBody"; // Beri nama

  // Posisikan air di world space, tepat di bawah posisi pulau
  mat4.identity(waterNode.localTransform); // Mulai dari world origin
  mat4.translate(waterNode.localTransform, waterNode.localTransform, [
      islandWorldPosition[0], // X sama dengan pulau
      waterLevel,             // Y absolut yang sudah dihitung
      islandWorldPosition[2]  // Z sama dengan pulau
  ]);

  return waterNode;
}

// Export fungsi agar bisa diakses global
window.createWaterBody = createWaterBody;
console.log("✅ water.js loaded");