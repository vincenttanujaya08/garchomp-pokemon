function createGarchompHead(gl) {
  const cfg = GarchompAnatomy;
  const headRoot = new SceneNode();

  // 1. TONJOLAN KIRI
  const lobeMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.5, 0.5, 1.2, 16, 16)
  );

  const lobeLeft = new SceneNode(lobeMesh, cfg.colors.darkBlue);
  mat4.translate(
    lobeLeft.localTransform,
    lobeLeft.localTransform,
    [-2.1, 0.2, 0.5]
  );
  headRoot.addChild(lobeLeft);

  // 2. TONJOLAN KANAN
  const lobeRight = new SceneNode(lobeMesh, cfg.colors.darkBlue);
  mat4.translate(
    lobeRight.localTransform,
    lobeRight.localTransform,
    [2.1, 0.2, 0.5]
  );
  headRoot.addChild(lobeRight);

  // 3. SEGITIGA TENGAH
  const centerWedgeMesh = new Mesh(gl, Primitives.createWedge(5.0, 1.8, 0.1));
  const centerWedge = new SceneNode(centerWedgeMesh, cfg.colors.darkBlue);

  mat4.rotate(
    centerWedge.localTransform,
    centerWedge.localTransform,
    -Math.PI / 2,
    [1, 0, 0]
  );
  mat4.translate(
    centerWedge.localTransform,
    centerWedge.localTransform,
    [0, 0, 0.2]
  );

  headRoot.addChild(centerWedge);

  const baseMesh = new Mesh(gl, Primitives.createCylinder(0.7, 0.6, 32));
  const baseTransition = new SceneNode(baseMesh, cfg.colors.darkBlue);

  mat4.translate(
    baseTransition.localTransform,
    baseTransition.localTransform,
    [0, 0, 0.35]
  );
  mat4.scale(
    baseTransition.localTransform,
    baseTransition.localTransform,
    [2.0, 0.5, 0.8]
  );

  headRoot.addChild(baseTransition);

  const tipMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.2, 0.15, 0.6, 16, 16)
  );

  const tipLeft = new SceneNode(tipMesh, cfg.colors.yellow);
  mat4.translate(
    tipLeft.localTransform,
    tipLeft.localTransform,
    [-0.3, 0.3, -0.4]
  );
  mat4.rotate(
    tipLeft.localTransform,
    tipLeft.localTransform,
    -Math.PI / 6,
    [0, 1, 0]
  );
  headRoot.addChild(tipLeft);

  const tipRight = new SceneNode(tipMesh, cfg.colors.yellow);
  mat4.translate(
    tipRight.localTransform,
    tipRight.localTransform,
    [0.3, 0.3, -0.4]
  );
  mat4.rotate(
    tipRight.localTransform,
    tipRight.localTransform,
    Math.PI / 6,
    [0, 1, 0]
  );
  headRoot.addChild(tipRight);

  // 6. CONE TERBALIK
  const coneMesh = new Mesh(gl, Primitives.createCone(0.4, 1.2, 16));
  const coneInverted = new SceneNode(coneMesh, cfg.colors.darkBlue);

  mat4.translate(
    coneInverted.localTransform,
    coneInverted.localTransform,
    [0, -0.4, -0.4]
  );
  mat4.rotate(
    coneInverted.localTransform,
    coneInverted.localTransform,
    Math.PI,
    [1, 0, 0]
  );

  headRoot.addChild(coneInverted);

  // === CAKAR AYAM TERBALIK (3 JARI KUNING) ===
  const clawMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.1, 0.1, 0.2, 16, 16)
  );

  const clawLeft = new SceneNode(clawMesh, cfg.colors.yellow);
  mat4.translate(
    clawLeft.localTransform,
    clawLeft.localTransform,
    [-0.15, 0, -0.7]
  );
  mat4.rotate(
    clawLeft.localTransform,
    clawLeft.localTransform,
    Math.PI / 3,
    [1, 0, 0]
  );
  mat4.rotate(
    clawLeft.localTransform,
    clawLeft.localTransform,
    -Math.PI / 6,
    [0, 1, 0]
  );
  headRoot.addChild(clawLeft);

  const clawRight = new SceneNode(clawMesh, cfg.colors.yellow);
  mat4.translate(
    clawRight.localTransform,
    clawRight.localTransform,
    [0.15, 0, -0.7]
  );
  mat4.rotate(
    clawRight.localTransform,
    clawRight.localTransform,
    Math.PI / 3,
    [1, 0, 0]
  );
  mat4.rotate(
    clawRight.localTransform,
    clawRight.localTransform,
    Math.PI / 6,
    [0, 1, 0]
  );
  headRoot.addChild(clawRight);

  const clawCenterMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.15, 0.1, 0.4, 16, 16)
  );
  const clawCenter = new SceneNode(clawCenterMesh, cfg.colors.yellow);
  mat4.translate(
    clawCenter.localTransform,
    clawCenter.localTransform,
    [0, -0.2, -0.65]
  );
  mat4.rotate(
    clawCenter.localTransform,
    clawCenter.localTransform,
    Math.PI / 3,
    [1, 0, 0]
  );
  headRoot.addChild(clawCenter);

  // === MATA KIRI ===
  const eyeSocketMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 0.3, 0.4, 16, 16)
  );
  const eyeSocketLeft = new SceneNode(eyeSocketMesh, cfg.colors.darkBlue);
  mat4.translate(
    eyeSocketLeft.localTransform,
    eyeSocketLeft.localTransform,
    [-0.8, -0.1, 0.1]
  );
  mat4.rotate(
    eyeSocketLeft.localTransform,
    eyeSocketLeft.localTransform,
    Math.PI / 4,
    [0, 1, 0]
  );
  headRoot.addChild(eyeSocketLeft);

  const eyeWhiteMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.45, 0.25, 0.15, 16, 16)
  );
  const eyeWhiteLeft = new SceneNode(eyeWhiteMesh, cfg.colors.black);
  mat4.translate(
    eyeWhiteLeft.localTransform,
    eyeWhiteLeft.localTransform,
    [-0.8, -0.2, -0.4]
  );
  mat4.rotate(
    eyeWhiteLeft.localTransform,
    eyeWhiteLeft.localTransform,
    Math.PI / 4,
    [0, 1, 0]
  );
  headRoot.addChild(eyeWhiteLeft);

  const eyeIrisMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.18, 0.15, 0.1, 16, 16)
  );
  const eyeIrisLeft = new SceneNode(eyeIrisMesh, cfg.colors.yellow);
  mat4.translate(
    eyeIrisLeft.localTransform,
    eyeIrisLeft.localTransform,
    [-0.78, -0.3, -0.5]
  );
  mat4.rotate(
    eyeIrisLeft.localTransform,
    eyeIrisLeft.localTransform,
    Math.PI / 4,
    [0, 1, 0]
  );
  headRoot.addChild(eyeIrisLeft);

  const eyePupilMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.05, 0.1, 0.05, 16, 16)
  );
  const eyePupilLeft = new SceneNode(eyePupilMesh, cfg.colors.black);
  mat4.translate(
    eyePupilLeft.localTransform,
    eyePupilLeft.localTransform,
    [-0.76, -0.35, -0.65]
  );
  mat4.rotate(
    eyePupilLeft.localTransform,
    eyePupilLeft.localTransform,
    Math.PI / 4,
    [0, 1, 0]
  );
  headRoot.addChild(eyePupilLeft);

  // === MATA KANAN ===
  const eyeSocketRight = new SceneNode(eyeSocketMesh, cfg.colors.darkBlue);
  mat4.translate(
    eyeSocketRight.localTransform,
    eyeSocketRight.localTransform,
    [0.8, -0.1, 0.1]
  );
  mat4.rotate(
    eyeSocketRight.localTransform,
    eyeSocketRight.localTransform,
    -Math.PI / 4,
    [0, 1, 0]
  );
  headRoot.addChild(eyeSocketRight);

  const eyeWhiteRight = new SceneNode(eyeWhiteMesh, cfg.colors.black);
  mat4.translate(
    eyeWhiteRight.localTransform,
    eyeWhiteRight.localTransform,
    [0.8, -0.2, -0.4]
  );
  mat4.rotate(
    eyeWhiteRight.localTransform,
    eyeWhiteRight.localTransform,
    -Math.PI / 4,
    [0, 1, 0]
  );
  headRoot.addChild(eyeWhiteRight);

  const eyeIrisRight = new SceneNode(eyeIrisMesh, cfg.colors.yellow);
  mat4.translate(
    eyeIrisRight.localTransform,
    eyeIrisRight.localTransform,
    [0.78, -0.3, -0.5]
  );
  mat4.rotate(
    eyeIrisRight.localTransform,
    eyeIrisRight.localTransform,
    -Math.PI / 4,
    [0, 1, 0]
  );
  headRoot.addChild(eyeIrisRight);

  const eyePupilRight = new SceneNode(eyePupilMesh, cfg.colors.black);
  mat4.translate(
    eyePupilRight.localTransform,
    eyePupilRight.localTransform,
    [0.76, -0.35, -0.6]
  );
  mat4.rotate(
    eyePupilRight.localTransform,
    eyePupilRight.localTransform,
    -Math.PI / 4,
    [0, 1, 0]
  );
  headRoot.addChild(eyePupilRight);

  //   === PENGHUBUNG MULUT KE CONE (Gusi/Rahang) ===
  const jawConnectorMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 0.3, 0.5, 16, 16)
  );
  const jawConnector = new SceneNode(jawConnectorMesh, cfg.colors.black);
  mat4.translate(
    jawConnector.localTransform,
    jawConnector.localTransform,
    [0, -0.4, 0.4] // Di antara cone (Y=-0.4) dan mulut (Y=-0.7)
  );
  mat4.rotate(
    jawConnector.localTransform,
    jawConnector.localTransform,
    -Math.PI / 12,
    [1, 0, 0]
  );
  headRoot.addChild(jawConnector);

  const toothMesh = new Mesh(gl, Primitives.createCone(0.08, 0.25, 16));

  // Gigi kiri 1
  const toothLeft1 = new SceneNode(toothMesh, cfg.colors.white);
  mat4.translate(
    toothLeft1.localTransform,
    toothLeft1.localTransform,
    [-0.3, -0.9, 0] // Posisi di kiri jaw
  );
  mat4.rotate(
    toothLeft1.localTransform,
    toothLeft1.localTransform,
    Math.PI, // Terbalik (ujung ke bawah)
    [1, 0, 0]
  );
  headRoot.addChild(toothLeft1);

  // Gigi kiri 2
  const toothLeft2 = new SceneNode(toothMesh, cfg.colors.white);
  mat4.translate(
    toothLeft2.localTransform,
    toothLeft2.localTransform,
    [-0.55, -0.9, 0.15]
  );
  mat4.rotate(
    toothLeft2.localTransform,
    toothLeft2.localTransform,
    Math.PI,
    [1, 0, 0]
  );
  headRoot.addChild(toothLeft2);

  // Gigi kanan 1
  const toothRight1 = new SceneNode(toothMesh, cfg.colors.white);
  mat4.translate(
    toothRight1.localTransform,
    toothRight1.localTransform,
    [0.3, -0.9, 0]
  );
  mat4.rotate(
    toothRight1.localTransform,
    toothRight1.localTransform,
    Math.PI,
    [1, 0, 0]
  );
  headRoot.addChild(toothRight1);

  // Gigi kanan 2
  const toothRight2 = new SceneNode(toothMesh, cfg.colors.white);
  mat4.translate(
    toothRight2.localTransform,
    toothRight2.localTransform,
    [0.55, -0.9, 0.15]
  );
  mat4.rotate(
    toothRight2.localTransform,
    toothRight2.localTransform,
    Math.PI,
    [1, 0, 0]
  );
  headRoot.addChild(toothRight2);

  /// === MULUT - Cylinder seperti neck (tidak dirotasi) ===
  const mouthBaseMesh = new Mesh(
    gl,
    Primitives.createCylinder(0.8, 0.4, 40) // Sama seperti neck
  );
  const mouthBase = new SceneNode(mouthBaseMesh, cfg.colors.darkBlue);
  mat4.translate(
    mouthBase.localTransform,
    mouthBase.localTransform,
    [0, -0.7, 0.5]
  );
  // Tidak ada rotasi, berdiri vertikal seperti neck
  mat4.scale(
    mouthBase.localTransform,
    mouthBase.localTransform,
    [1.0, 0.6, 0.8] // Scale untuk menyesuaikan proporsi
  );
  headRoot.addChild(mouthBase);

  return headRoot;
}

function createGarchompNeck(gl) {
  const cfg = GarchompAnatomy;

  const neckRoot = new SceneNode();

  // Leher utama (bagian atas)
  const neckMesh = new Mesh(gl, Primitives.createCylinder(0.8, 0.8, 20));
  const neckNode = new SceneNode(neckMesh, cfg.colors.darkBlue);
  mat4.translate(
    neckNode.localTransform,
    neckNode.localTransform,
    [0, -0.65, 1.3]
  );
  mat4.rotate(
    neckNode.localTransform,
    neckNode.localTransform,
    Math.PI / 4,
    [-1, 0, 0]
  );
  mat4.scale(neckNode.localTransform, neckNode.localTransform, [1.4, 1.8, 0.6]);
  neckRoot.addChild(neckNode);

  // === PENGHUBUNG ANTARA NECK 1 DAN NECK 2 ===
  const neckConnectorMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(1.05, 0.1, 0.3, 32, 32)
  );
  const neckConnector = new SceneNode(neckConnectorMesh, cfg.colors.black);
  mat4.translate(
    neckConnector.localTransform,
    neckConnector.localTransform,
    [0, 0.05, 0.9] // Posisi di antara neck1 dan neck2
  );
  mat4.rotate(
    neckConnector.localTransform,
    neckConnector.localTransform,
    Math.PI / 6,
    [1, 0, 0]
  );
  neckRoot.addChild(neckConnector);

  // Leher bagian bawah (neck2)
  const neckNode2 = new SceneNode(neckMesh, cfg.colors.darkBlue);
  mat4.translate(
    neckNode2.localTransform,
    neckNode2.localTransform,
    [0, -1.85, 2.0]
  );
  mat4.rotate(
    neckNode2.localTransform,
    neckNode2.localTransform,
    -Math.PI / 9,
    [1, 0, 0]
  );
  mat4.scale(
    neckNode2.localTransform,
    neckNode2.localTransform,
    [1.4, 2.2, 0.6]
  );
  neckRoot.addChild(neckNode2);

  const hbConnectorMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.6, 0.9, 0.7, 32, 32)
  );
  const hbConnector = new SceneNode(hbConnectorMesh, cfg.colors.black);
  mat4.translate(
    hbConnector.localTransform,
    hbConnector.localTransform,
    [0, -1.3, 0.7]
  );
  mat4.rotate(
    hbConnector.localTransform,
    hbConnector.localTransform,
    -Math.PI / 7,
    [1, 0, 0]
  );

  neckRoot.addChild(hbConnector);

  const hyperboloidMesh = new Mesh(
    gl,
    Primitives.createHyperboloid(
      0.8, // radiusTop
      0.5, // radiusBottom
      0.7, // waistRadius
      2.3, // height
      32 // segments
    )
  );
  const hyperboloid = new SceneNode(hyperboloidMesh, cfg.colors.red);
  mat4.translate(
    hyperboloid.localTransform,
    hyperboloid.localTransform,
    [0, -2.0, 1] // Ubah dari [5, -2.3, 0.5] ke posisi yang benar
  );
  mat4.rotate(
    hyperboloid.localTransform,
    hyperboloid.localTransform,
    -Math.PI / 7,
    [1, 0, 0]
  );

  neckRoot.addChild(hyperboloid);

  return neckRoot;
}
function createMegaGarchompTorso(gl) {
  // --- COLORS ---
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];
  const yellow = [1.0, 0.84, 0.0, 1.0];
  const white = [0.9, 0.9, 0.9, 1.0]; // Warna putih untuk duri

  // --- MESHES ---

  // 1. Torso Parts
  const upperBodyMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 1.2, 0.7, 32, 32)
  );
  const lowerBodyMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.84, 0.9, 0.73, 32, 32)
  );

  // 2. Bahu Elliptic Paraboloid
  const shoulderMesh = new Mesh(
    gl,
    Primitives.createEllipticParaboloid(0.8, 0.7, 1.5, 16)
  );

  // 3. Hyperboloid Connector
  const connectorMesh = new Mesh(
    gl,
    Primitives.createHyperboloidOneSheet(0.6, 0.5, 0.8, 1.8, 32, 32)
  );

  // 4. Pelat Dada Merah
  const chestPlateMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(1, 1, 1, 32, 32)
  );

  // 5. Pelat Pinggang Merah
  const waistPlateMesh = new Mesh(
    gl,
    Primitives.createHyperboloidOneSheet(0.6, 0.5, 0.8, 1.8, 32, 32)
  );

  // 6. Pelat Perut Kuning
  const stomachPlateMesh1 = new Mesh(
    gl,
    Primitives.createEllipsoid(1, 1, 1, 2.9, 100)
  );
  const stomachPlateMesh2 = new Mesh(
    gl,
    Primitives.createEllipsoid(1, 1, 1, 32, 32)
  );

  // 7. Duri Putih (BARU)
  const spikeMesh = new Mesh(
    gl,
    Primitives.createTriangularPrism(0.4, 0.6, 0.1)
  );

  // --- SCENE NODES ---
  const torsoRoot = new SceneNode(null);

  const upperBodyNode = new SceneNode(upperBodyMesh, darkBlue);
  const lowerBodyNode = new SceneNode(lowerBodyMesh, darkBlue);
  const leftShoulderNode = new SceneNode(shoulderMesh, darkBlue);
  const rightShoulderNode = new SceneNode(shoulderMesh, darkBlue);
  const connectorNode = new SceneNode(connectorMesh, darkBlue);
  const chestPlateNode = new SceneNode(chestPlateMesh, red);
  const waistPlateNode = new SceneNode(waistPlateMesh, red);
  const stomachPlateNode1 = new SceneNode(stomachPlateMesh1, yellow);
  const stomachPlateNode2 = new SceneNode(stomachPlateMesh2, red);
  const ChestSpikeNode1 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode2 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode3 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode4 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode5 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode6 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode7 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode8 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode9 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode10 = new SceneNode(spikeMesh, white);

  // --- HIERARCHY ---
  torsoRoot.addChild(upperBodyNode);
  torsoRoot.addChild(lowerBodyNode);
  torsoRoot.addChild(leftShoulderNode);
  torsoRoot.addChild(rightShoulderNode);
  torsoRoot.addChild(connectorNode);
  torsoRoot.addChild(chestPlateNode);
  torsoRoot.addChild(waistPlateNode);
  torsoRoot.addChild(stomachPlateNode1);
  torsoRoot.addChild(stomachPlateNode2);
  torsoRoot.addChild(ChestSpikeNode1);
  torsoRoot.addChild(ChestSpikeNode2);
  torsoRoot.addChild(ChestSpikeNode3);
  torsoRoot.addChild(ChestSpikeNode4);
  torsoRoot.addChild(ChestSpikeNode5);
  torsoRoot.addChild(ChestSpikeNode6);
  torsoRoot.addChild(ChestSpikeNode7);
  torsoRoot.addChild(ChestSpikeNode8);
  torsoRoot.addChild(ChestSpikeNode9);
  torsoRoot.addChild(ChestSpikeNode10);

  // --- TRANSFORMATIONS ---

  // Posisikan bagian tubuh utama
  mat4.translate(
    upperBodyNode.localTransform,
    upperBodyNode.localTransform,
    [0, 0.5, 0]
  );
  mat4.translate(
    lowerBodyNode.localTransform,
    lowerBodyNode.localTransform,
    [0, -1.5, 0]
  );

  // Posisikan konektor
  mat4.translate(
    connectorNode.localTransform,
    connectorNode.localTransform,
    [0, -0.6, 0]
  );
  mat4.scale(
    connectorNode.localTransform,
    connectorNode.localTransform,
    [0.64, 0.3, 0.65]
  );

  // Posisikan dan orientasikan bahu
  // Bahu Kiri
  mat4.translate(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    [-1.4, 1.36, 0]
  );
  mat4.rotate(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    Math.PI / 2.2,
    [0, 0, -1]
  );
  mat4.rotate(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    Math.PI / 8,
    [0, 1, -3]
  );
  mat4.scale(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    [0.78, 0.8, 0.75]
  );

  // Bahu Kanan
  mat4.translate(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    [1.4, 1.36, 0]
  );
  mat4.rotate(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    -Math.PI / 2.2,
    [0, 0, -1]
  );
  mat4.rotate(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    -Math.PI / 8,
    [0, 1, -3]
  );
  mat4.scale(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    [0.78, 0.8, 0.75]
  );

  // Posisikan pelat merah
  mat4.translate(
    chestPlateNode.localTransform,
    chestPlateNode.localTransform,
    [0, 0.5, 0.15]
  );
  mat4.scale(
    chestPlateNode.localTransform,
    chestPlateNode.localTransform,
    [0.64, 1.2, 0.75]
  );
  mat4.translate(
    waistPlateNode.localTransform,
    waistPlateNode.localTransform,
    [0, -0.6, 0.05]
  );
  mat4.scale(
    waistPlateNode.localTransform,
    waistPlateNode.localTransform,
    [0.6, 1.2, 0.65]
  );

  // Posisikan pelat kuning
  mat4.translate(
    stomachPlateNode1.localTransform,
    stomachPlateNode1.localTransform,
    [0, -1.26, 0.29]
  );
  mat4.scale(
    stomachPlateNode1.localTransform,
    stomachPlateNode1.localTransform,
    [0.5, 0.65, 0.5]
  );

  mat4.translate(
    stomachPlateNode2.localTransform,
    stomachPlateNode2.localTransform,
    [0, -1.26, 0.12]
  );
  mat4.scale(
    stomachPlateNode2.localTransform,
    stomachPlateNode2.localTransform,
    [0.62, 0.68, 0.5]
  );

  mat4.translate(
    ChestSpikeNode1.localTransform,
    ChestSpikeNode1.localTransform,
    [0.65, 1.1, 0.45]
  );
  mat4.scale(
    ChestSpikeNode1.localTransform,
    ChestSpikeNode1.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode1.localTransform,
    ChestSpikeNode1.localTransform,
    -Math.PI / 2.6,
    [0, 0, 1]
  );

  mat4.translate(
    ChestSpikeNode2.localTransform,
    ChestSpikeNode2.localTransform,
    [-0.65, 1.1, 0.45]
  );
  mat4.scale(
    ChestSpikeNode2.localTransform,
    ChestSpikeNode2.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode2.localTransform,
    ChestSpikeNode2.localTransform,
    -Math.PI / 2.6,
    [0, 0, -1]
  );

  mat4.translate(
    ChestSpikeNode3.localTransform,
    ChestSpikeNode3.localTransform,
    [0.7, 0.55, 0.47]
  );
  mat4.scale(
    ChestSpikeNode3.localTransform,
    ChestSpikeNode3.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode3.localTransform,
    ChestSpikeNode3.localTransform,
    -Math.PI / 2.2,
    [0, 0, 1]
  );

  mat4.translate(
    ChestSpikeNode4.localTransform,
    ChestSpikeNode4.localTransform,
    [-0.7, 0.55, 0.47]
  );
  mat4.scale(
    ChestSpikeNode4.localTransform,
    ChestSpikeNode4.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode4.localTransform,
    ChestSpikeNode4.localTransform,
    -Math.PI / 2.2,
    [0, 0, -1]
  );

  mat4.translate(
    ChestSpikeNode5.localTransform,
    ChestSpikeNode5.localTransform,
    [0.6, 0.03, 0.45]
  );
  mat4.scale(
    ChestSpikeNode5.localTransform,
    ChestSpikeNode5.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode5.localTransform,
    ChestSpikeNode5.localTransform,
    -Math.PI / 2,
    [0, 0, 1]
  );

  mat4.translate(
    ChestSpikeNode6.localTransform,
    ChestSpikeNode6.localTransform,
    [-0.6, 0.03, 0.45]
  );
  mat4.scale(
    ChestSpikeNode6.localTransform,
    ChestSpikeNode6.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode6.localTransform,
    ChestSpikeNode6.localTransform,
    -Math.PI / 2,
    [0, 0, -1]
  );

  mat4.translate(
    ChestSpikeNode7.localTransform,
    ChestSpikeNode7.localTransform,
    [0.45, -0.45, 0.3]
  );
  mat4.scale(
    ChestSpikeNode7.localTransform,
    ChestSpikeNode7.localTransform,
    [0.4, 0.9, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode7.localTransform,
    ChestSpikeNode7.localTransform,
    -Math.PI / 1.7,
    [0, 0, 1]
  );

  mat4.translate(
    ChestSpikeNode8.localTransform,
    ChestSpikeNode8.localTransform,
    [-0.45, -0.45, 0.3]
  );
  mat4.scale(
    ChestSpikeNode8.localTransform,
    ChestSpikeNode8.localTransform,
    [0.4, 0.9, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode8.localTransform,
    ChestSpikeNode8.localTransform,
    -Math.PI / 1.7,
    [0, 0, -1]
  );

  mat4.translate(
    ChestSpikeNode9.localTransform,
    ChestSpikeNode9.localTransform,
    [0.4, -0.63, 0.23]
  );
  mat4.scale(
    ChestSpikeNode9.localTransform,
    ChestSpikeNode9.localTransform,
    [0.4, 0.4, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode9.localTransform,
    ChestSpikeNode9.localTransform,
    -Math.PI / 2,
    [0, 0, 1]
  );

  mat4.translate(
    ChestSpikeNode10.localTransform,
    ChestSpikeNode10.localTransform,
    [-0.4, -0.63, 0.23]
  );
  mat4.scale(
    ChestSpikeNode10.localTransform,
    ChestSpikeNode10.localTransform,
    [0.4, 0.4, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode10.localTransform,
    ChestSpikeNode10.localTransform,
    -Math.PI / 2,
    [0, 0, -1]
  );

  return torsoRoot;
}

// function createGarchompBody(gl) {
//   const cfg = GarchompAnatomy;
//   const bodyRoot = new SceneNode();

//   // TORSO - Hyperboloid untuk bentuk dada yang natural
//   const torsoMesh = new Mesh(
//     gl,
//     Primitives.createHyperboloid(
//       1.2, // radiusTop (lebar bahu)
//       0.9, // radiusBottom (lebar pinggul)
//       0.7, // waistRadius (pinggang tersempit)
//       2.5, // height (tinggi torso)
//       32 // segments
//     )
//   );

//   const finMesh = new Mesh(
//     gl,
//     Curves.createSharkFin(1.5, 4, 3) // BaseWidth, Height, Depth
//   );

//   const backFin = new SceneNode(finMesh, cfg.colors.darkBlue);

//   mat4.translate(
//     backFin.localTransform,
//     backFin.localTransform,
//     [0, -3.4, 3.2]
//   );

//   mat4.rotate(
//     backFin.localTransform,
//     backFin.localTransform,
//     Math.PI / 2, // Sedikit rotasi ke belakang
//     [0, 1, 1]
//   );

//   bodyRoot.addChild(backFin);

//   return bodyRoot;
// }
