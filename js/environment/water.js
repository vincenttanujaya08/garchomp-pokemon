function createWaterBody(gl, islandWorldPosition, islandScaleFactor) {
  const baseRadiusX = 1.5;
  const baseRadiusZ = 1.2;
  const baseDepth = 0.5;
  const baseYOffset = -(0.05 + 0.2 + 0.3 + 0.1);

  const radiusX = baseRadiusX * islandScaleFactor;
  const radiusZ = baseRadiusZ * islandScaleFactor;
  const depth = baseDepth * islandScaleFactor;
  const waterY = islandWorldPosition[1] + baseYOffset * islandScaleFactor;

  console.log(
    `🌊 Membuat air di Y=${waterY.toFixed(
      2
    )} (pulau Y=${islandWorldPosition[1].toFixed(2)})`
  );

  const waterMesh = new Mesh(
    gl,
    Primitives.createHalfEllipsoid(radiusX, depth, radiusZ, 32, 32)
  );

  const waterNode = new SceneNode(waterMesh, [0.2, 0.5, 0.8, 0.7]);
  waterNode.name = "WaterBody";

  mat4.identity(waterNode.localTransform);
  mat4.translate(waterNode.localTransform, waterNode.localTransform, [
    islandWorldPosition[0],
    waterY,
    islandWorldPosition[2],
  ]);

  return waterNode;
}

window.createWaterBody = createWaterBody;
console.log("✅ water.js loaded");
