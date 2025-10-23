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

  const baseRockNode2 = new SceneNode(rockMesh, [0.5, 0.5, 0.5, 2.0]);

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

  // --- Dekorasi Batu Angular ---

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

  // --- Dekorasi Awan dengan CloudAnimator ---

  // ===== PENTING: Array untuk menyimpan CloudAnimator =====
  islandRoot.cloudAnimators = [];

  // Awan 1 (tipe sederhana) - kiri depan
  const cloud1 = createCloud1(gl);
  cloud1.name = "Cloud1";
  mat4.translate(
    cloud1.localTransform,
    cloud1.localTransform,
    [-1.5, 1.8, -1.0]
  );
  mat4.rotate(
    cloud1.localTransform,
    cloud1.localTransform,
    Math.PI / 8,
    [0, 1, 0]
  );
  mat4.scale(cloud1.localTransform, cloud1.localTransform, [0.3, 0.3, 0.3]);
  islandRoot.addChild(cloud1);

  // Create animator for cloud1
  const cloud1Animator = new CloudAnimator(cloud1, [0, 0, 0], {
    orbitRadius: 8.0,
    orbitSpeed: 0.05,
    orbitPhase: 0,
    bobbingAmplitude: 0.3,
    bobbingFrequency: 0.5,
    heightOffset: 1.8,
  });
  islandRoot.cloudAnimators.push(cloud1Animator);

  // Awan 2 (tipe kompleks) - kanan belakang
  const cloud2 = createCloud2(gl);
  cloud2.name = "Cloud2";
  mat4.translate(
    cloud2.localTransform,
    cloud2.localTransform,
    [1.2, 2.2, -1.5]
  );
  mat4.rotate(
    cloud2.localTransform,
    cloud2.localTransform,
    -Math.PI / 4,
    [0, 1, 0]
  );
  mat4.scale(cloud2.localTransform, cloud2.localTransform, [0.25, 0.25, 0.25]);
  islandRoot.addChild(cloud2);

  const cloud2Animator = new CloudAnimator(cloud2, [0, 0, 0], {
    orbitRadius: 9.5,
    orbitSpeed: 0.04,
    orbitPhase: Math.PI / 2,
    bobbingAmplitude: 0.4,
    bobbingFrequency: 0.6,
    heightOffset: 2.2,
  });
  islandRoot.cloudAnimators.push(cloud2Animator);

  // Awan 3 (tipe sederhana) - kanan depan atas
  const cloud3 = createCloud1(gl);
  cloud3.name = "Cloud3";
  mat4.translate(cloud3.localTransform, cloud3.localTransform, [0.8, 1.4, 0.5]);
  mat4.rotate(
    cloud3.localTransform,
    cloud3.localTransform,
    -Math.PI / 6,
    [0, 1, 0]
  );
  mat4.scale(cloud3.localTransform, cloud3.localTransform, [0.2, 0.2, 0.2]);
  islandRoot.addChild(cloud3);

  const cloud3Animator = new CloudAnimator(cloud3, [0, 0, 0], {
    orbitRadius: 7.5,
    orbitSpeed: 0.06,
    orbitPhase: Math.PI,
    bobbingAmplitude: 0.25,
    bobbingFrequency: 0.7,
    heightOffset: 1.4,
  });
  islandRoot.cloudAnimators.push(cloud3Animator);

  // Awan 4 (tipe kompleks) - kiri belakang
  const cloud4 = createCloud2(gl);
  cloud4.name = "Cloud4";
  mat4.translate(
    cloud4.localTransform,
    cloud4.localTransform,
    [-1.0, 2.3, -0.8]
  );
  mat4.rotate(
    cloud4.localTransform,
    cloud4.localTransform,
    Math.PI / 3,
    [0, 1, 0]
  );
  mat4.scale(cloud4.localTransform, cloud4.localTransform, [0.28, 0.28, 0.28]);
  islandRoot.addChild(cloud4);

  const cloud4Animator = new CloudAnimator(cloud4, [0, 0, 0], {
    orbitRadius: 8.8,
    orbitSpeed: 0.045,
    orbitPhase: Math.PI * 1.5,
    bobbingAmplitude: 0.35,
    bobbingFrequency: 0.55,
    heightOffset: 2.3,
  });
  islandRoot.cloudAnimators.push(cloud4Animator);

  // Awan 5 (tipe sederhana) - tengah jauh
  const cloud5 = createCloud1(gl);
  cloud5.name = "Cloud5";
  mat4.translate(
    cloud5.localTransform,
    cloud5.localTransform,
    [-0.3, 2.0, -2.0]
  );
  mat4.rotate(
    cloud5.localTransform,
    cloud5.localTransform,
    Math.PI / 2,
    [0, 1, 0]
  );
  mat4.scale(cloud5.localTransform, cloud5.localTransform, [0.35, 0.35, 0.35]);
  islandRoot.addChild(cloud5);

  const cloud5Animator = new CloudAnimator(cloud5, [0, 0, 0], {
    orbitRadius: 10.0,
    orbitSpeed: 0.035,
    orbitPhase: Math.PI / 4,
    bobbingAmplitude: 0.45,
    bobbingFrequency: 0.5,
    heightOffset: 2.0,
  });
  islandRoot.cloudAnimators.push(cloud5Animator);

  // Awan 6 (tipe kompleks) - kanan jauh tinggi
  const cloud6 = createCloud2(gl);
  cloud6.name = "Cloud6";
  mat4.translate(
    cloud6.localTransform,
    cloud6.localTransform,
    [1.5, 2.7, -0.5]
  );
  mat4.rotate(
    cloud6.localTransform,
    cloud6.localTransform,
    -Math.PI / 5,
    [0, 1, 0]
  );
  mat4.scale(cloud6.localTransform, cloud6.localTransform, [0.22, 0.22, 0.22]);
  islandRoot.addChild(cloud6);

  const cloud6Animator = new CloudAnimator(cloud6, [0, 0, 0], {
    orbitRadius: 9.2,
    orbitSpeed: 0.055,
    orbitPhase: Math.PI * 1.75,
    bobbingAmplitude: 0.3,
    bobbingFrequency: 0.65,
    heightOffset: 2.7,
  });
  islandRoot.cloudAnimators.push(cloud6Animator);

  // Awan 7 (tipe sederhana) - depan kiri
  const cloud7 = createCloud1(gl);
  cloud7.name = "Cloud7";
  mat4.translate(
    cloud7.localTransform,
    cloud7.localTransform,
    [-0.8, 1.6, 0.8]
  );
  mat4.rotate(
    cloud7.localTransform,
    cloud7.localTransform,
    Math.PI / 4,
    [0, 1, 0]
  );
  mat4.scale(cloud7.localTransform, cloud7.localTransform, [0.18, 0.18, 0.18]);
  islandRoot.addChild(cloud7);

  const cloud7Animator = new CloudAnimator(cloud7, [0, 0, 0], {
    orbitRadius: 7.8,
    orbitSpeed: 0.065,
    orbitPhase: Math.PI * 0.5,
    bobbingAmplitude: 0.28,
    bobbingFrequency: 0.75,
    heightOffset: 1.6,
  });
  islandRoot.cloudAnimators.push(cloud7Animator);

  // Awan 8 (tipe kompleks) - tengah atas
  const cloud8 = createCloud2(gl);
  cloud8.name = "Cloud8";
  mat4.translate(
    cloud8.localTransform,
    cloud8.localTransform,
    [0.3, 2.8, -1.2]
  );
  mat4.rotate(
    cloud8.localTransform,
    cloud8.localTransform,
    Math.PI / 7,
    [0, 1, 0]
  );
  mat4.scale(cloud8.localTransform, cloud8.localTransform, [0.32, 0.32, 0.32]);
  islandRoot.addChild(cloud8);

  const cloud8Animator = new CloudAnimator(cloud8, [0, 0, 0], {
    orbitRadius: 8.5,
    orbitSpeed: 0.048,
    orbitPhase: Math.PI * 1.25,
    bobbingAmplitude: 0.38,
    bobbingFrequency: 0.58,
    heightOffset: 2.8,
  });
  islandRoot.cloudAnimators.push(cloud8Animator);

  console.log(
    `✅ Island created with ${islandRoot.cloudAnimators.length} cloud animators`
  );

  // Atur skala dan posisi keseluruhan pulau
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

  window.createIsland = createIsland;

  return islandRoot;
}
