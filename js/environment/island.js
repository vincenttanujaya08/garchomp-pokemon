function createIsland(gl) {
  const islandShape = [
    [-0.6852, 0, 0.48336],
    [0.22347, 0, 0.59186],
    [0.80664, 0, 0.34096],
    [0.92192, 0, -0.07269],
    [1, 0, -0.5],
    [0.49471, 0, -0.86608],
    [-0.11559, 0, -1.0017],
    [-0.51567, 0, -0.90677],
    [-1.08529, 0, -0.63552],
    [-1.22091, 0, -0.01844],
  ];

  const grassThickness = 0.05;
  const dirtThickness = 0.2;
  const rockThickness = 0.3;

  const grassMesh = new Mesh(
    gl,
    Primitives.createExtrudedShape(islandShape, grassThickness, 1.0, 1.0)
  );
  const dirtMesh = new Mesh(
    gl,
    Primitives.createExtrudedShape(islandShape, dirtThickness, 1.0, 0.8)
  );
  const rockMesh = new Mesh(
    gl,
    Primitives.createExtrudedShape(islandShape, rockThickness, 0.8, 0.5)
  );

  const sandNode = new SceneNode(grassMesh, [0.8, 0.7, 0.5, 1.0]);
  const earthNode = new SceneNode(dirtMesh, [0.6, 0.4, 0.2, 1.0]);
  const baseRockNode = new SceneNode(rockMesh, [0.5, 0.5, 0.5, 1.0]);

  // offset vertikal untuk layer tanah & batu
  mat4.translate(earthNode.localTransform, earthNode.localTransform, [
    0,
    -grassThickness,
    0,
  ]);
  mat4.translate(baseRockNode.localTransform, baseRockNode.localTransform, [
    0,
    -(grassThickness + dirtThickness),
    0,
  ]);

  const islandRoot = new SceneNode();
  islandRoot.addChild(sandNode);
  islandRoot.addChild(earthNode);
  islandRoot.addChild(baseRockNode);

  // --- Dekorasi Kaktus ---
  const cactus1 = createCactus(gl);
  mat4.translate(cactus1.localTransform, cactus1.localTransform, [
    0.5,
    grassThickness,
    0.2,
  ]);
  mat4.scale(cactus1.localTransform, cactus1.localTransform, [0.1, 0.1, 0.1]);
  islandRoot.addChild(cactus1);

  const cactus2 = createCactus(gl);
  mat4.translate(cactus2.localTransform, cactus2.localTransform, [
    -0.4,
    grassThickness,
    0.3,
  ]);
  mat4.rotate(
    cactus2.localTransform,
    cactus2.localTransform,
    Math.PI / 6,
    [0, 1, 0]
  );
  mat4.scale(
    cactus2.localTransform,
    cactus2.localTransform,
    [0.08, 0.08, 0.08]
  );
  islandRoot.addChild(cactus2);

  // --- Dekorasi Batu Angular / Simple ---
  const rock1 = createAngularRock(gl, 0.3);
  mat4.translate(rock1.localTransform, rock1.localTransform, [0.5, 0, -0.3]);
  mat4.rotate(
    rock1.localTransform,
    rock1.localTransform,
    Math.PI / 6,
    [0, 1, 0]
  );
  mat4.scale(rock1.localTransform, rock1.localTransform, [0.12, 0.12, 0.12]);
  islandRoot.addChild(rock1);

  const rock2 = createAngularRock(gl, 0.7);
  mat4.translate(rock2.localTransform, rock2.localTransform, [-0.9, 0, -0.2]);
  mat4.rotate(
    rock2.localTransform,
    rock2.localTransform,
    -Math.PI / 3,
    [0, 1, 0]
  );
  mat4.scale(rock2.localTransform, rock2.localTransform, [0.09, 0.09, 0.09]);
  islandRoot.addChild(rock2);

  const rock3 = createSimpleAngularRock(gl);
  mat4.translate(rock3.localTransform, rock3.localTransform, [-0.9, 0, -0.5]);
  mat4.rotate(
    rock3.localTransform,
    rock3.localTransform,
    Math.PI / 4,
    [0, 1, 0]
  );
  mat4.scale(rock3.localTransform, rock3.localTransform, [0.08, 0.08, 0.08]);
  islandRoot.addChild(rock3);

  const rock4 = createAngularRock(gl, 0.5);
  mat4.translate(rock4.localTransform, rock4.localTransform, [0.6, 0, 0.3]);
  mat4.rotate(
    rock4.localTransform,
    rock4.localTransform,
    -Math.PI / 5,
    [0, 1, 0]
  );
  mat4.scale(rock4.localTransform, rock4.localTransform, [0.06, 0.06, 0.06]);
  islandRoot.addChild(rock4);

  const rock5 = createSimpleAngularRock(gl);
  mat4.translate(rock5.localTransform, rock5.localTransform, [0.2, 0, -0.6]);
  mat4.rotate(
    rock5.localTransform,
    rock5.localTransform,
    Math.PI / 2,
    [0, 1, 0]
  );
  mat4.scale(rock5.localTransform, rock5.localTransform, [0.07, 0.07, 0.07]);
  islandRoot.addChild(rock5);

  const rock6 = createAngularRock(gl, 0.8);
  mat4.translate(rock6.localTransform, rock6.localTransform, [-0.4, 0, -0.1]);
  mat4.rotate(
    rock6.localTransform,
    rock6.localTransform,
    -Math.PI / 8,
    [0, 1, 0]
  );
  mat4.scale(rock6.localTransform, rock6.localTransform, [0.1, 0.1, 0.1]);
  islandRoot.addChild(rock6);

  const rock7 = createSimpleAngularRock(gl);
  mat4.translate(rock7.localTransform, rock7.localTransform, [-0.3, 0, 0.5]);
  mat4.rotate(
    rock7.localTransform,
    rock7.localTransform,
    Math.PI / 7,
    [0, 1, 0]
  );
  mat4.scale(rock7.localTransform, rock7.localTransform, [0.05, 0.05, 0.05]);
  islandRoot.addChild(rock7);

  const rock8 = createAngularRock(gl, 0.4);
  mat4.translate(rock8.localTransform, rock8.localTransform, [-0.8, 0, -0.65]);
  mat4.rotate(
    rock8.localTransform,
    rock8.localTransform,
    -Math.PI / 4,
    [0, 1, 0]
  );
  mat4.scale(rock8.localTransform, rock8.localTransform, [0.09, 0.09, 0.09]);
  islandRoot.addChild(rock8);

  // =========================
  //  Awan Prosedural Multi-Ring (worldSpace)
  // =========================

  // Helper random
  const randRange = (a, b) => a + Math.random() * (b - a);
  const GOLDEN_ANGLE = 2.399963229728653; // ~137.5°
  const evenAngle = (i, jitter = 0) =>
    i * GOLDEN_ANGLE + randRange(-jitter, jitter);

  /**
   * Buat satu ring awan yang merata
   * @param {number} count
   * @param {object} cfg { orbitRadius, orbitHeight, speedRange:[min,max], sizeRange:[min,max], tilt, angleJitter }
   * @returns {CloudOrbitAnimator[]}
   */
  function spawnCloudRing(count, cfg) {
    const anims = [];
    for (let i = 0; i < count; i++) {
      const cloudNode = (Math.random() < 0.5 ? createCloud1 : createCloud2)(gl);
      cloudNode.worldSpace = true; // Opsi A: animator tulis world-matrix

      // Skala awal (acak dalam rentang)
      const s = randRange(cfg.sizeRange[0], cfg.sizeRange[1]);
      mat4.scale(cloudNode.localTransform, cloudNode.localTransform, [s, s, s]);

      // Variasi rotasi awal
      mat4.rotateY(
        cloudNode.localTransform,
        cloudNode.localTransform,
        randRange(0, Math.PI * 2)
      );

      islandRoot.addChild(cloudNode);

      const startAngle = evenAngle(i, cfg.angleJitter ?? 0.15);
      const orbitSpeed = randRange(cfg.speedRange[0], cfg.speedRange[1]);
      const orbitRadius = cfg.orbitRadius + randRange(-2.0, 2.0);
      const orbitHeight = cfg.orbitHeight + randRange(-1.0, 1.0);

      const animator = new CloudOrbitAnimator(cloudNode, {
        orbitRadius,
        orbitHeight,
        orbitSpeed,
        orbitTilt: cfg.tilt || 0,
        startAngle,

        // variasi halus: hidup tapi tetap rapat
        heightVariation: 1.5,
        heightVariationSpeed: randRange(0.4, 0.9),

        radiusVariation: 2.0,
        radiusVariationSpeed: randRange(0.5, 0.9),

        selfRotationSpeed: randRange(0.05, 0.2),
        scalePulse: randRange(0.03, 0.08),
        scalePulseSpeed: randRange(0.5, 1.1),
      });

      anims.push(animator);
    }
    return anims;
  }

  // Ring konfigurasi (silakan tweak jumlah & parameter agar lebih padat/lega)
  const RINGS = [
    // count, orbitRadius, orbitHeight, speedRange, sizeRange, tilt, angleJitter
    {
      count: 12,
      orbitRadius: 34,
      orbitHeight: 18,
      speedRange: [0.3, 0.45],
      sizeRange: [0.18, 0.28],
      tilt: Math.PI / 12,
      angleJitter: 0.2,
    },
    {
      count: 14,
      orbitRadius: 44,
      orbitHeight: 22,
      speedRange: [0.22, 0.35],
      sizeRange: [0.22, 0.32],
      tilt: -Math.PI / 18,
      angleJitter: 0.18,
    },
    {
      count: 10,
      orbitRadius: 54,
      orbitHeight: 26,
      speedRange: [0.15, 0.25],
      sizeRange: [0.26, 0.36],
      tilt: Math.PI / 10,
      angleJitter: 0.15,
    },
  ];

  const cloudAnimators = [];
  RINGS.forEach((ring) => {
    const anims = spawnCloudRing(ring.count, ring);
    cloudAnimators.push(...anims);
  });

  // simpan supaya bisa di-pick up di main.js
  islandRoot.cloudAnimators = cloudAnimators;

  // =========================
  // Transform pulau keseluruhan
  // =========================
  mat4.scale(
    islandRoot.localTransform,
    islandRoot.localTransform,
    [30, 30, 30]
  );
  mat4.translate(
    islandRoot.localTransform,
    islandRoot.localTransform,
    [0, -0.4, -0.4]
  );

  // export
  window.createIsland = createIsland;
  return islandRoot;
}
