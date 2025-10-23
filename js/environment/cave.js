/**
 * js/environment/cave.js - FINAL VERSION v3
 * Assembly Cave dengan:
 * - NO rainbow/arc shape at entrance
 * - MANY stalactites dari langit-langit
 * - Stalagmites HANYA di pinggir (bukan tengah) untuk walking space
 */

/**
 * Buat cave lengkap dengan interior structures
 * @param {WebGLRenderingContext} gl
 * @returns {SceneNode} Cave root node
 */
function createCave(gl) {
  const caveRoot = new SceneNode();
  caveRoot.name = "CAVE_ROOT";

  // ===== COLOR PALETTE =====
  const colors = {
    bodyDark: [0.18, 0.16, 0.14, 1.0],
    interiorDark: [0.09, 0.08, 0.07, 1.0],
    stoneMedium: [0.28, 0.25, 0.22, 1.0],
    rockBrown1: [0.35, 0.3, 0.25, 1.0],
    rockBrown2: [0.25, 0.22, 0.18, 1.0],
    rockBrown3: [0.32, 0.28, 0.23, 1.0],
  };

  console.log("🗻 Building cave with walking space...");

  // ===== 1. MAIN CAVE BODY (rocky, NO arc) =====
  console.log("  → Creating rocky cave body...");
  const bodyGeometry = CaveGeometry.createHollowCaveBody(
    15, // radius
    12, // entranceWidth
    14, // entranceHeight
    64 // segments
  );
  const bodyMesh = new Mesh(gl, bodyGeometry);
  const bodyNode = new SceneNode(bodyMesh, colors.bodyDark);
  bodyNode.name = "CAVE_BODY";
  caveRoot.addChild(bodyNode);

  // ===== 2. STALACTITES - HANYA di DALAM gua, menempel di ceiling! =====
  console.log(
    "  → Adding stalactites INSIDE cave only, attached to ceiling..."
  );

  const stalactitePositions = [
    // ===== INNER CEILING - Deep inside cave (NOT at entrance!) =====
    // Left side - deep interior
    { pos: [-5.5, 11, 6], height: 2.5, radius: 0.3 },
    { pos: [-4.8, 10.5, 4.5], height: 2.2, radius: 0.28 },
    { pos: [-4.2, 11.5, 3], height: 2.8, radius: 0.32 },
    { pos: [-5, 10.8, 1.5], height: 2.4, radius: 0.29 },
    { pos: [-4.5, 11.2, 0], height: 2.6, radius: 0.3 },
    { pos: [-5.2, 10.5, -1.5], height: 2.9, radius: 0.33 },
    { pos: [-4.8, 11, -3], height: 3.1, radius: 0.35 },

    // Right side - deep interior
    { pos: [5.5, 11, 6], height: 2.4, radius: 0.29 },
    { pos: [4.8, 10.5, 4.5], height: 2.3, radius: 0.28 },
    { pos: [4.2, 11.5, 3], height: 2.7, radius: 0.31 },
    { pos: [5, 10.8, 1.5], height: 2.5, radius: 0.3 },
    { pos: [4.5, 11.2, 0], height: 2.6, radius: 0.3 },
    { pos: [5.2, 10.5, -1.5], height: 2.8, radius: 0.32 },
    { pos: [4.8, 11, -3], height: 3.0, radius: 0.34 },

    // Center area - inside only
    { pos: [-2.5, 11, 5], height: 2.0, radius: 0.26 },
    { pos: [2.5, 11, 5], height: 2.1, radius: 0.27 },
    { pos: [-1.5, 10.8, 3.5], height: 2.3, radius: 0.28 },
    { pos: [1.5, 10.8, 3.5], height: 2.2, radius: 0.27 },
    { pos: [-2, 11.2, 2], height: 2.5, radius: 0.29 },
    { pos: [2, 11.2, 2], height: 2.4, radius: 0.28 },
    { pos: [-1, 10.5, 0.5], height: 2.7, radius: 0.31 },
    { pos: [1, 10.5, 0.5], height: 2.6, radius: 0.3 },
    { pos: [-1.8, 11, -1], height: 2.8, radius: 0.32 },
    { pos: [1.8, 11, -1], height: 2.7, radius: 0.31 },
    { pos: [-2.2, 10.8, -2.5], height: 3.0, radius: 0.34 },
    { pos: [2.2, 10.8, -2.5], height: 2.9, radius: 0.33 },

    // ===== DEEP INTERIOR - Larger, dramatic stalactites =====
    { pos: [-3.5, 9.8, -4], height: 3.5, radius: 0.38 },
    { pos: [3.5, 9.8, -4], height: 3.4, radius: 0.37 },
    { pos: [0, 10.2, -4.5], height: 3.8, radius: 0.4 },
    { pos: [-2, 9.5, -5], height: 3.6, radius: 0.39 },
    { pos: [2, 9.5, -5], height: 3.7, radius: 0.39 },

    // ===== ENTRANCE TRANSITION - Just inside, not outside! =====
    // Only a few near entrance (Z > 7), but still inside cave
    { pos: [-3, 12, 8], height: 1.8, radius: 0.24 },
    { pos: [0, 12.5, 8], height: 2.0, radius: 0.26 },
    { pos: [3, 12, 8], height: 1.9, radius: 0.25 },
  ];

  stalactitePositions.forEach((config, i) => {
    const stalGeometry = CaveGeometry.createStalactites(
      1,
      config.radius,
      config.height
    );
    const stalMesh = new Mesh(gl, stalGeometry);
    const stalNode = new SceneNode(stalMesh, colors.stoneMedium);
    stalNode.name = `STALACTITE_${i}`;

    mat4.translate(
      stalNode.localTransform,
      stalNode.localTransform,
      config.pos
    );

    // Slight random rotation for variety
    const rotY = Math.random() * 0.3 - 0.15;
    mat4.rotateY(stalNode.localTransform, stalNode.localTransform, rotY);

    caveRoot.addChild(stalNode);
  });

  // ===== 3. STALAGMITES - RANDOM scattered di pinggir! =====
  console.log("  → Adding RANDOM stalagmites (scattered at edges)...");

  const stalagmitePositions = [
    // ===== KIRI - Random scattered, NOT uniform! =====
    { pos: [-8.2, 0, 9.3], height: 1.9, radius: 0.39 },
    { pos: [-9.1, 0, 7.8], height: 2.3, radius: 0.43 },
    { pos: [-7.8, 0, 8.1], height: 1.5, radius: 0.34 },
    { pos: [-8.9, 0, 6.2], height: 1.7, radius: 0.37 },
    { pos: [-8.3, 0, 4.7], height: 2.1, radius: 0.41 },
    { pos: [-9.3, 0, 3.5], height: 2.6, radius: 0.46 },
    { pos: [-7.9, 0, 2.8], height: 1.4, radius: 0.33 },
    { pos: [-8.7, 0, 1.2], height: 2.0, radius: 0.4 },
    { pos: [-9.5, 0, -0.3], height: 2.9, radius: 0.49 },
    { pos: [-8.1, 0, -1.8], height: 1.8, radius: 0.38 },
    { pos: [-8.9, 0, -2.7], height: 2.4, radius: 0.44 },

    // ===== KANAN - Random scattered, varied sizes =====
    { pos: [8.4, 0, 9.7], height: 2.0, radius: 0.4 },
    { pos: [9.2, 0, 8.3], height: 1.6, radius: 0.35 },
    { pos: [7.7, 0, 7.5], height: 1.9, radius: 0.39 },
    { pos: [8.8, 0, 6.1], height: 2.2, radius: 0.42 },
    { pos: [9.0, 0, 4.9], height: 1.7, radius: 0.36 },
    { pos: [8.2, 0, 3.6], height: 2.5, radius: 0.45 },
    { pos: [9.4, 0, 2.2], height: 1.5, radius: 0.34 },
    { pos: [8.6, 0, 1.0], height: 2.1, radius: 0.41 },
    { pos: [9.1, 0, -0.5], height: 2.7, radius: 0.47 },
    { pos: [8.3, 0, -1.9], height: 1.8, radius: 0.38 },
    { pos: [8.9, 0, -3.1], height: 2.3, radius: 0.43 },

    // ===== BELAKANG - Larger, more dramatic =====
    { pos: [-7.3, 0, -4.8], height: 3.2, radius: 0.52 },
    { pos: [-5.8, 0, -5.5], height: 2.7, radius: 0.47 },
    { pos: [-3.9, 0, -5.9], height: 2.4, radius: 0.44 },
    { pos: [4.1, 0, -5.8], height: 2.5, radius: 0.45 },
    { pos: [6.2, 0, -5.3], height: 2.9, radius: 0.49 },
    { pos: [7.5, 0, -4.6], height: 3.0, radius: 0.5 },

    // ===== SMALL CLUSTERS - Corner groups =====
    { pos: [-7.2, 0, 10.1], height: 1.1, radius: 0.27 },
    { pos: [-6.5, 0, 9.8], height: 1.3, radius: 0.29 },
    { pos: [-6.9, 0, 8.9], height: 0.9, radius: 0.25 },

    { pos: [6.8, 0, 10.3], height: 1.2, radius: 0.28 },
    { pos: [7.4, 0, 9.6], height: 1.0, radius: 0.26 },
    { pos: [7.1, 0, 8.8], height: 1.4, radius: 0.3 },

    // ===== RANDOM MEDIUM - Scattered for variety =====
    { pos: [-7.5, 0, 5.3], height: 1.6, radius: 0.35 },
    { pos: [7.8, 0, 5.7], height: 1.8, radius: 0.37 },
    { pos: [-8.0, 0, 0.4], height: 1.5, radius: 0.34 },
    { pos: [8.5, 0, 0.8], height: 1.7, radius: 0.36 },
  ];

  stalagmitePositions.forEach((config, i) => {
    const stalagGeometry = CaveGeometry.createStalagmites(
      1,
      config.radius,
      config.height
    );
    const stalagMesh = new Mesh(gl, stalagGeometry);
    const stalagNode = new SceneNode(stalagMesh, colors.stoneMedium);
    stalagNode.name = `STALAGMITE_${i}`;

    mat4.translate(
      stalagNode.localTransform,
      stalagNode.localTransform,
      config.pos
    );

    // Slight random rotation
    const rotY = Math.random() * Math.PI * 2;
    mat4.rotateY(stalagNode.localTransform, stalagNode.localTransform, rotY);

    caveRoot.addChild(stalagNode);
  });

  // ===== 4. ROCK FORMATIONS - Small boulders at sides =====
  console.log("  → Adding rock formations at sides...");

  const rockPositions = [
    // Left side
    { pos: [-7, 0.5, 6], size: 1.2, color: colors.rockBrown1 },
    { pos: [-8, 0.4, 4], size: 1.0, color: colors.rockBrown2 },
    { pos: [-7.5, 0.6, 2], size: 1.3, color: colors.rockBrown3 },
    { pos: [-8.5, 0.3, 0], size: 0.9, color: colors.rockBrown1 },
    { pos: [-7, 0.5, -2], size: 1.1, color: colors.rockBrown2 },
    { pos: [-8, 0.4, -4], size: 1.0, color: colors.rockBrown3 },

    // Right side
    { pos: [7, 0.5, 6], size: 1.1, color: colors.rockBrown2 },
    { pos: [8, 0.4, 4], size: 1.0, color: colors.rockBrown3 },
    { pos: [7.5, 0.6, 2], size: 1.2, color: colors.rockBrown1 },
    { pos: [8.5, 0.3, 0], size: 0.8, color: colors.rockBrown2 },
    { pos: [7, 0.5, -2], size: 1.0, color: colors.rockBrown3 },
    { pos: [8, 0.4, -4], size: 0.9, color: colors.rockBrown1 },

    // Back wall
    { pos: [-4, 0.7, -5], size: 1.4, color: colors.rockBrown1 },
    { pos: [0, 0.5, -6], size: 1.3, color: colors.rockBrown2 },
    { pos: [4, 0.7, -5], size: 1.5, color: colors.rockBrown3 },
  ];

  rockPositions.forEach((config, i) => {
    const rockGeometry = CaveGeometry.createRockFormation(
      config.size,
      i * 123.456
    );
    const rockMesh = new Mesh(gl, rockGeometry);
    const rockNode = new SceneNode(rockMesh, config.color);
    rockNode.name = `ROCK_FORMATION_${i}`;

    mat4.translate(
      rockNode.localTransform,
      rockNode.localTransform,
      config.pos
    );

    // Random rotation
    const rotY = Math.random() * Math.PI * 2;
    const rotX = (Math.random() - 0.5) * 0.3;
    const rotZ = (Math.random() - 0.5) * 0.3;
    mat4.rotateY(rockNode.localTransform, rockNode.localTransform, rotY);
    mat4.rotateX(rockNode.localTransform, rockNode.localTransform, rotX);
    mat4.rotateZ(rockNode.localTransform, rockNode.localTransform, rotZ);

    caveRoot.addChild(rockNode);
  });

  console.log("✅ Cave assembly complete!");
  console.log("   Features:");
  console.log("   - ❌ NO rainbow arc at entrance");
  console.log("   - ✅ 28 stalactites dari ceiling");
  console.log("   - ✅ 23 stalagmites di pinggir saja");
  console.log("   - ✅ 15 rock formations");
  console.log("   - ✅ CENTER IS CLEAR untuk Pokemon walking!");
  console.log("");
  console.log("   Walking Path:");
  console.log("   - X: -6 to +6 (width 12 units)");
  console.log("   - Z: 10 to -5 (depth 15 units)");
  console.log("   - SAFE walking area di tengah!");

  return caveRoot;
}

// Export
window.createCave = createCave;
console.log("✅ createCave v3 loaded - No arc, walking space ready!");
