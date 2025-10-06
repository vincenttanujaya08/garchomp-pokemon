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

  // === PENGHUBUNG MULUT KE CONE (Gusi/Rahang) ===
  const jawConnectorMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(1, 0.3, 0.7, 16, 16)
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
    [-0.3, -0.5, -0.35] // Posisi di kiri jaw
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
    [-0.45, -0.55, -0.25]
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
    [0.4, -0.5, -0.35]
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
    [0.55, -0.55, -0.25]
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
    Primitives.createCylinder(0.8, 0.8, 40) // Sama seperti neck
  );
  const mouthBase = new SceneNode(mouthBaseMesh, cfg.colors.red);
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

  // Cylinder transisi merah
  const transitionMesh = new Mesh(gl, Primitives.createCylinder(0.8, 0.5, 20));
  const transition = new SceneNode(transitionMesh, cfg.colors.red);
  mat4.translate(
    transition.localTransform,
    transition.localTransform,
    [0, -1.0, 0.5]
  );
  mat4.scale(
    transition.localTransform,
    transition.localTransform,
    [1.0, 0.3, 0.8]
  );
  neckRoot.addChild(transition);

  // === PENGHUBUNG ANTARA NECK 1 DAN NECK 2 ===
  const neckConnectorMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(1.1, 0.5, 0.5, 32, 32)
  );
  const neckConnector = new SceneNode(neckConnectorMesh, cfg.colors.darkBlue);
  mat4.translate(
    neckConnector.localTransform,
    neckConnector.localTransform,
    [0, -1.3, 1.85] // Posisi di antara neck1 dan neck2
  );
  mat4.rotate(
    neckConnector.localTransform,
    neckConnector.localTransform,
    Math.PI / 8,
    [1, 0, 0]
  );
  neckRoot.addChild(neckConnector);

  // Leher bagian bawah (neck2)
  const neckNode2 = new SceneNode(neckMesh, cfg.colors.darkBlue);
  mat4.translate(
    neckNode2.localTransform,
    neckNode2.localTransform,
    [0, -1.9, 2.1]
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
    [1.4, 2.8, 0.6]
  );
  neckRoot.addChild(neckNode2);

  const hbConnectorMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.75, 0.7, 0.7, 32, 32)
  );
  const hbConnector = new SceneNode(hbConnectorMesh, cfg.colors.red);
  mat4.translate(
    hbConnector.localTransform,
    hbConnector.localTransform,
    [0, -1.3, 0.6] // Posisi di antara neck1 dan neck2
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
    [0, -2.3, 1] // Ubah dari [5, -2.3, 0.5] ke posisi yang benar
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
