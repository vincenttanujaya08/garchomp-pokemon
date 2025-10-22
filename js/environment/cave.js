/**
 * js/environment/cave.js
 * Assembly Cave dengan semua komponennya
 */

/**
 * Buat cave/goa lengkap
 * @param {WebGLRenderingContext} gl
 * @returns {SceneNode} Cave root node
 */
function createCave(gl) {
  const caveRoot = new SceneNode();
  caveRoot.name = "CAVE_ROOT";

  // ===== WARNA PALETTE =====
  const colors = {
    bodyDark: [0.15, 0.15, 0.17, 1.0], // Very dark grey (outer)
    interiorDark: [0.08, 0.06, 0.08, 1.0], // Almost black (interior)
    interiorBrown: [0.18, 0.14, 0.12, 1.0], // Dark brownish (walls)
    stalactite: [0.25, 0.22, 0.2, 1.0], // Dark rock grey
    frameBrown: [0.35, 0.28, 0.2, 1.0], // Brown frame
  };

  // ===== 1. CAVE BODY dengan ENTRANCE CUT =====
  console.log("Creating cave body...");
  const bodyGeometry = CaveGeometry.createProperCaveBody(15, 8, 10, 4, 48);
  const bodyMesh = new Mesh(gl, bodyGeometry);
  const bodyNode = new SceneNode(bodyMesh, colors.bodyDark);
  bodyNode.name = "CAVE_BODY";

  caveRoot.addChild(bodyNode);

  // ===== 2. INTERIOR CAVITY (dark inside) =====
  console.log("Creating cave interior...");
  const interiorGeometry = CaveGeometry.createCaveInterior(14, 8, 10, 6, 32);
  const interiorMesh = new Mesh(gl, interiorGeometry);
  const interiorNode = new SceneNode(interiorMesh, colors.interiorDark);
  interiorNode.name = "CAVE_INTERIOR";

  caveRoot.addChild(interiorNode);

  // ===== 3. INTERIOR WALLS (brownish tint) =====
  const wallsGeometry = CaveGeometry.createCaveInterior(13.5, 7.5, 9.5, 5, 24);
  const wallsMesh = new Mesh(gl, wallsGeometry);
  const wallsNode = new SceneNode(wallsMesh, colors.interiorBrown);
  wallsNode.name = "CAVE_WALLS";

  caveRoot.addChild(wallsNode);

  // ===== 4. ENTRANCE FRAME =====
  const frameGeometry = CaveGeometry.createCaveFrame(8, 10, 1.5, 32);
  const frameMesh = new Mesh(gl, frameGeometry);
  const frameNode = new SceneNode(frameMesh, colors.frameBrown);
  frameNode.name = "CAVE_FRAME";

  mat4.translate(
    frameNode.localTransform,
    frameNode.localTransform,
    [0, 2, 10.5]
  );

  caveRoot.addChild(frameNode);

  // ===== 5. STALACTITES (hanging rocks) =====
  console.log("Creating stalactites...");
  const stalactitesGeometry = CaveGeometry.createStalactites(8, 0.3, 1.5);
  const stalactitesMesh = new Mesh(gl, stalactitesGeometry);
  const stalactitesNode = new SceneNode(stalactitesMesh, colors.stalactite);
  stalactitesNode.name = "STALACTITES";

  // Position stalactites at entrance top
  const stalactitePositions = [
    [-3, 8, 9.5],
    [-2, 8.5, 10],
    [-1, 9, 10.5],
    [0, 9.5, 11],
    [1, 9, 10.5],
    [2, 8.5, 10],
    [3, 8, 9.5],
    [0, 10, 10.5],
  ];

  stalactitePositions.forEach((pos, i) => {
    const stalGeometry = CaveGeometry.createStalactites(
      1,
      0.25 + Math.random() * 0.15,
      1.2 + Math.random() * 0.6
    );
    const stalMesh = new Mesh(gl, stalGeometry);
    const stalNode = new SceneNode(stalMesh, colors.stalactite);
    stalNode.name = `STALACTITE_${i}`;

    mat4.translate(stalNode.localTransform, stalNode.localTransform, pos);

    caveRoot.addChild(stalNode);
  });

  return caveRoot;
}

// Export
window.createCave = createCave;
console.log("✅ createCave function loaded");
