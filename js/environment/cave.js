/**
 * js/environment/cave.js - FIXED VERSION
 * Assembly Cave dengan entrance BOLONG dan ruangan dalam yang terlihat
 */

/**
 * Buat cave lengkap dengan hollow entrance dan interior room
 * @param {WebGLRenderingContext} gl
 * @returns {SceneNode} Cave root node
 */
function createCave(gl) {
  const caveRoot = new SceneNode();
  caveRoot.name = "CAVE_ROOT";

  // ===== COLOR PALETTE =====
  const colors = {
    // Outer body - dark rocky
    bodyDark: [0.15, 0.15, 0.17, 1.0],

    // Entrance edge (cut thickness) - slightly lighter to show depth
    edgeStone: [0.22, 0.2, 0.18, 1.0],

    // Interior - VERY dark
    interiorDark: [0.08, 0.06, 0.05, 1.0],

    // Stalactites
    stalactite: [0.25, 0.22, 0.2, 1.0],
  };

  console.log("🗻 Building hollow cave...");

  // ===== 1. CAVE BODY - Hemisphere dengan entrance BOLONG =====
  console.log("  → Creating hollow body...");
  const bodyGeometry = CaveGeometry.createHollowCaveBody(
    15, // radius
    12, // entranceWidth (BIGGER!)
    14, // entranceHeight (BIGGER!)
    48 // segments
  );
  const bodyMesh = new Mesh(gl, bodyGeometry);
  const bodyNode = new SceneNode(bodyMesh, colors.bodyDark);
  bodyNode.name = "CAVE_BODY";
  caveRoot.addChild(bodyNode);

  // ===== 2. STALACTITES - Hanging from top of entrance =====
  console.log("  → Creating stalactites...");

  const stalactitePositions = [
    // Top arc only
    [-3, 11, 11],
    [-1.5, 12, 11],
    [0, 12.5, 11],
    [1.5, 12, 11],
    [3, 11, 11],
    [-2, 11.5, 10.5],
    [2, 11.5, 10.5],
  ];

  stalactitePositions.forEach((pos, i) => {
    const stalGeometry = CaveGeometry.createStalactites(
      1,
      0.15 + Math.random() * 0.08,
      0.8 + Math.random() * 0.4
    );
    const stalMesh = new Mesh(gl, stalGeometry);
    const stalNode = new SceneNode(stalMesh, colors.stalactite);
    stalNode.name = `STALACTITE_${i}`;

    mat4.translate(stalNode.localTransform, stalNode.localTransform, pos);

    caveRoot.addChild(stalNode);
  });

  console.log("✅ Cave assembly complete!");
  console.log("   - Simple entrance hole with thick edge");
  console.log("   - Dark interior visible");
  console.log("   - No decorative frames");

  return caveRoot;
}

// Export
window.createCave = createCave;
console.log("✅ createCave function loaded - NEW hollow version");
