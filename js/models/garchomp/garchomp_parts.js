function createGarchompHead(gl) {
  const cfg = GarchompAnatomy;
  const headRoot = new SceneNode();

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

  const lobeRight = new SceneNode(lobeMesh, cfg.colors.darkBlue);
  mat4.translate(
    lobeRight.localTransform,
    lobeRight.localTransform,
    [2.1, 0.2, 0.5]
  );
  headRoot.addChild(lobeRight);

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
  eyeIrisLeft.name = "EyeIrisLeft";
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
  eyePupilLeft.name = "EyePupilLeft";
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
  eyeIrisRight.name = "EyeIrisRight";
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
  eyePupilRight.name = "EyePupilRight";
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

  headRoot.eyes = {
    irisL: eyeIrisLeft,
    irisR: eyeIrisRight,
    pupilL: eyePupilLeft,
    pupilR: eyePupilRight,
  };

  const jawConnectorMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 0.3, 0.5, 16, 16)
  );
  const jawConnector = new SceneNode(jawConnectorMesh, cfg.colors.black);
  mat4.translate(
    jawConnector.localTransform,
    jawConnector.localTransform,
    [0, -0.4, 0.4]
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
    [-0.3, -0.9, 0]
  );
  mat4.rotate(
    toothLeft1.localTransform,
    toothLeft1.localTransform,
    Math.PI,
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

  const mouthBaseMesh = new Mesh(gl, Primitives.createCylinder(0.8, 0.4, 40));
  const mouthBase = new SceneNode(mouthBaseMesh, cfg.colors.darkBlue);
  mat4.translate(
    mouthBase.localTransform,
    mouthBase.localTransform,
    [0, -0.7, 0.5]
  );

  mat4.scale(
    mouthBase.localTransform,
    mouthBase.localTransform,
    [1.0, 0.6, 0.8]
  );
  headRoot.addChild(mouthBase);

  return headRoot;
}

function createGarchompNeck(gl) {
  const cfg = GarchompAnatomy;

  const neckRoot = new SceneNode();

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

  const neckConnectorMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(1.05, 0.1, 0.3, 32, 32)
  );
  const neckConnector = new SceneNode(neckConnectorMesh, cfg.colors.black);
  mat4.translate(
    neckConnector.localTransform,
    neckConnector.localTransform,
    [0, 0.05, 0.9]
  );
  mat4.rotate(
    neckConnector.localTransform,
    neckConnector.localTransform,
    Math.PI / 6,
    [1, 0, 0]
  );
  neckRoot.addChild(neckConnector);

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
    [0, -2.0, 1]
  );
  mat4.rotate(
    hyperboloid.localTransform,
    hyperboloid.localTransform,
    -Math.PI / 7,
    [1, 0, 0]
  );

  neckRoot.addChild(hyperboloid);

  mat4.translate(neckRoot.localTransform, neckRoot.localTransform, [0, 5, 2.0]);
  mat4.rotate(
    neckRoot.localTransform,
    neckRoot.localTransform,
    Math.PI,
    [0, 1, 0]
  );

  return neckRoot;
}

function createGarchompArm(gl) {
  const cfg = GarchompAnatomy;
  const armRoot = new SceneNode();

  const upperArmMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.5, 1.9, 0.5, 32, 32)
  );
  const forearmMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.4, 1.6, 0.5, 32, 32)
  );

  const rightUpper = new SceneNode(upperArmMesh, cfg.colors.darkBlue);
  mat4.translate(
    rightUpper.localTransform,
    rightUpper.localTransform,
    [2.2, 0.9, 0.7]
  );
  mat4.rotate(
    rightUpper.localTransform,
    rightUpper.localTransform,
    -Math.PI / 4,
    [1, 0, 0]
  );
  mat4.rotate(
    rightUpper.localTransform,
    rightUpper.localTransform,
    Math.PI / 4,
    [0, 0, 1]
  );
  armRoot.addChild(rightUpper);

  const rightFore = new SceneNode(forearmMesh, cfg.colors.darkBlue);
  mat4.translate(
    rightFore.localTransform,
    rightFore.localTransform,
    [3.2, -0.4, 2.5]
  );
  mat4.rotate(
    rightFore.localTransform,
    rightFore.localTransform,
    -Math.PI / 3,
    [1, 0, 0]
  );
  mat4.rotate(
    rightFore.localTransform,
    rightFore.localTransform,
    Math.PI / 2,
    [0, 1, 0]
  );
  armRoot.addChild(rightFore);

  const leftUpper = new SceneNode(upperArmMesh, cfg.colors.darkBlue);
  mat4.translate(
    leftUpper.localTransform,
    leftUpper.localTransform,
    [-2.2, 0.9, 0.7]
  );
  mat4.rotate(
    leftUpper.localTransform,
    leftUpper.localTransform,
    -Math.PI / 4,
    [1, 0, 0]
  );
  mat4.rotate(
    leftUpper.localTransform,
    leftUpper.localTransform,
    -Math.PI / 4,
    [0, 0, 1]
  );
  armRoot.addChild(leftUpper);

  const leftFore = new SceneNode(forearmMesh, cfg.colors.darkBlue);
  mat4.translate(
    leftFore.localTransform,
    leftFore.localTransform,
    [-3.2, -0.4, 2.5]
  );
  mat4.rotate(
    leftFore.localTransform,
    leftFore.localTransform,
    -Math.PI / 3,
    [1, 0, 0]
  );
  mat4.rotate(
    leftFore.localTransform,
    leftFore.localTransform,
    -Math.PI / 2,
    [0, 1, 0]
  );
  armRoot.addChild(leftFore);

  const clawMesh = new Mesh(gl, Primitives.createCone(0.3, 0.8, 24));
  let wristOffsets = -(1.6 + 0.1);

  const finW = 0.6,
    finH = 0.7,
    topBulge = 0.12,
    bottomBulge = 0.18,
    leftBulge = 0.1;
  const finSegU = 24,
    finSegV = 10,
    finT = 0.2; // ketebalan tipis
  const finGeom = Curves.createSailCoons3D(
    finW,
    finH,
    topBulge,
    bottomBulge,
    leftBulge,
    finSegU,
    finSegV,
    finT
  );
  const finMesh = new Mesh(gl, finGeom);

  const wristOffset = -(1.6 + 0.08);

  const leftFin = new SceneNode(finMesh, cfg.colors.white);
  mat4.translate(leftFin.localTransform, leftFin.localTransform, [
    -0.3,
    wristOffset + 0.6,
    0,
  ]);

  mat4.rotate(
    leftFin.localTransform,
    leftFin.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  mat4.rotate(
    leftFin.localTransform,
    leftFin.localTransform,
    -Math.PI,
    [0, 1, 0]
  );
  mat4.rotate(
    leftFin.localTransform,
    leftFin.localTransform,
    Math.PI / 4,
    [0, 0, -1]
  );

  mat4.scale(leftFin.localTransform, leftFin.localTransform, [0.9, 2.5, 0.9]);
  leftFore.addChild(leftFin);

  const rightFin = new SceneNode(finMesh, cfg.colors.white);
  mat4.translate(rightFin.localTransform, rightFin.localTransform, [
    0.2,
    wristOffset + 0.7,
    0,
  ]);
  mat4.rotate(
    rightFin.localTransform,
    rightFin.localTransform,
    -Math.PI / 2,
    [0, 0, 1]
  );
  mat4.rotate(
    rightFin.localTransform,
    rightFin.localTransform,
    Math.PI / 4,
    [0, 0, -1]
  );

  mat4.scale(rightFin.localTransform, rightFin.localTransform, [0.9, 2.5, 0.9]);
  rightFore.addChild(rightFin);

  const sailGeom = Curves.createSail(2, 3, 0.4, 64);
  const sailMesh = new Mesh(gl, sailGeom);

  const xSide = 0.45;
  const yAlong = -0.4;
  const zFront = 0.0;
  const tilt = Math.PI / 8;

  const rightSail = new SceneNode(sailMesh, cfg.colors.darkBlue);

  mat4.translate(
    rightSail.localTransform,
    rightSail.localTransform,
    [0.1, 1.0, 0]
  );
  mat4.rotate(
    rightSail.localTransform,
    rightSail.localTransform,
    -Math.PI / 2,
    [0, 0, 1]
  );
  rightFore.addChild(rightSail);

  const leftSail = new SceneNode(sailMesh, cfg.colors.darkBlue);
  mat4.translate(
    leftSail.localTransform,
    leftSail.localTransform,
    [0.1, 1.2, 0]
  );
  mat4.rotate(
    leftSail.localTransform,
    leftSail.localTransform,
    Math.PI,
    [0, 0, 1]
  );
  mat4.scale(leftSail.localTransform, leftSail.localTransform, [1.3, 1, 1]);
  leftFore.addChild(leftSail);

  return armRoot;
}

function createGarchompLeg(gl) {
  const cfg = GarchompAnatomy;
  const legRoot = new SceneNode();

  const thighMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 2, 1.0, 32, 32)
  );

  const calfMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.6, 1.5, 0.6, 32, 32)
  );

  const spikeMesh = new Mesh(gl, Primitives.createCone(0.4, 1, 32));

  const footMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.6, 1.2, 0.4, 32, 32)
  );

  const clawMesh = new Mesh(gl, Primitives.createCone(0.1, 0.25, 16));

  const leftThigh = new SceneNode(thighMesh, cfg.colors.darkBlue);
  mat4.translate(
    leftThigh.localTransform,
    leftThigh.localTransform,
    [-1.5, -2.5, -0.2]
  );
  mat4.rotate(
    leftThigh.localTransform,
    leftThigh.localTransform,
    -Math.PI / 7,
    [0, 0, 1]
  );
  mat4.rotate(
    leftThigh.localTransform,
    leftThigh.localTransform,
    -Math.PI / 10,
    [1, 0, 0]
  );
  legRoot.addChild(leftThigh);

  const leftSpikeTop = new SceneNode(spikeMesh, cfg.colors.white);
  mat4.translate(
    leftSpikeTop.localTransform,
    leftSpikeTop.localTransform,
    [-0.2, 0.5, 0.8]
  );
  mat4.rotate(
    leftSpikeTop.localTransform,
    leftSpikeTop.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );

  leftThigh.addChild(leftSpikeTop);

  const leftSpikeBottom = new SceneNode(spikeMesh, cfg.colors.white);
  mat4.translate(
    leftSpikeBottom.localTransform,
    leftSpikeBottom.localTransform,
    [-0.3, -0.5, 0.7]
  );
  mat4.rotate(
    leftSpikeBottom.localTransform,
    leftSpikeBottom.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );

  leftThigh.addChild(leftSpikeBottom);

  const leftCalf = new SceneNode(calfMesh, cfg.colors.darkBlue);
  mat4.translate(
    leftCalf.localTransform,
    leftCalf.localTransform,
    [-2.2, -4.5, -0.1]
  );
  mat4.rotate(
    leftCalf.localTransform,
    leftCalf.localTransform,
    -Math.PI / 12,
    [0, 0, 1]
  );
  mat4.rotate(
    leftCalf.localTransform,
    leftCalf.localTransform,
    Math.PI / 6,
    [1, 0, 0]
  );
  legRoot.addChild(leftCalf);

  const leftFoot = new SceneNode(footMesh, cfg.colors.darkBlue);
  mat4.translate(
    leftFoot.localTransform,
    leftFoot.localTransform,
    [-2.5, -5.7, 0.3]
  );
  mat4.rotate(
    leftFoot.localTransform,
    leftFoot.localTransform,
    -Math.PI / 2,
    [1, 0, 0]
  );

  legRoot.addChild(leftFoot);

  const leftClaw1 = new SceneNode(clawMesh, cfg.colors.white);
  mat4.translate(
    leftClaw1.localTransform,
    leftClaw1.localTransform,
    [-0.3, -1.1, 0]
  );
  mat4.rotate(
    leftClaw1.localTransform,
    leftClaw1.localTransform,
    Math.PI,
    [1, 0, 0]
  );
  leftFoot.addChild(leftClaw1);

  const leftClaw2 = new SceneNode(clawMesh, cfg.colors.white);
  mat4.translate(
    leftClaw2.localTransform,
    leftClaw2.localTransform,
    [-0, -1.3, -0]
  );
  mat4.rotate(
    leftClaw2.localTransform,
    leftClaw2.localTransform,
    Math.PI,
    [1, 0, 0]
  );
  leftFoot.addChild(leftClaw2);

  const leftClaw3 = new SceneNode(clawMesh, cfg.colors.white);
  mat4.translate(
    leftClaw3.localTransform,
    leftClaw3.localTransform,
    [0.3, -1.1, 0]
  );
  mat4.rotate(
    leftClaw3.localTransform,
    leftClaw3.localTransform,
    Math.PI,
    [1, 0, 0]
  );
  leftFoot.addChild(leftClaw3);

  const rightThigh = new SceneNode(thighMesh, cfg.colors.darkBlue);
  mat4.translate(
    rightThigh.localTransform,
    rightThigh.localTransform,
    [1.5, -2.5, -0.2]
  );
  mat4.rotate(
    rightThigh.localTransform,
    rightThigh.localTransform,
    Math.PI / 7,
    [0, 0, 1]
  );
  mat4.rotate(
    rightThigh.localTransform,
    rightThigh.localTransform,
    -Math.PI / 10,
    [1, 0, 0]
  );
  legRoot.addChild(rightThigh);

  const rightSpikeTop = new SceneNode(spikeMesh, cfg.colors.white);
  mat4.translate(
    rightSpikeTop.localTransform,
    rightSpikeTop.localTransform,
    [0.2, 0.5, 0.8]
  );
  mat4.rotate(
    rightSpikeTop.localTransform,
    rightSpikeTop.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  rightThigh.addChild(rightSpikeTop);

  const rightSpikeBottom = new SceneNode(spikeMesh, cfg.colors.white);
  mat4.translate(
    rightSpikeBottom.localTransform,
    rightSpikeBottom.localTransform,
    [0.25, -0.5, 0.8]
  );
  mat4.rotate(
    rightSpikeBottom.localTransform,
    rightSpikeBottom.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  rightThigh.addChild(rightSpikeBottom);

  const rightCalf = new SceneNode(calfMesh, cfg.colors.darkBlue);
  mat4.translate(
    rightCalf.localTransform,
    rightCalf.localTransform,
    [2.2, -4.5, -0.1]
  );
  mat4.rotate(
    rightCalf.localTransform,
    rightCalf.localTransform,
    Math.PI / 12,
    [0, 0, 1]
  );
  mat4.rotate(
    rightCalf.localTransform,
    rightCalf.localTransform,
    Math.PI / 6,
    [1, 0, 0]
  );
  legRoot.addChild(rightCalf);
  const rightFoot = new SceneNode(footMesh, cfg.colors.darkBlue);
  mat4.translate(
    rightFoot.localTransform,
    rightFoot.localTransform,
    [2.5, -5.7, 0.3]
  );
  mat4.rotate(
    rightFoot.localTransform,
    rightFoot.localTransform,
    -Math.PI / 2,
    [1, 0, 0]
  );

  legRoot.addChild(rightFoot);

  const rightClaw1 = new SceneNode(clawMesh, cfg.colors.white);
  mat4.translate(
    rightClaw1.localTransform,
    rightClaw1.localTransform,
    [-0.3, -1.1, 0]
  );
  mat4.rotate(
    rightClaw1.localTransform,
    rightClaw1.localTransform,
    Math.PI,
    [1, 0, 0]
  );
  rightFoot.addChild(rightClaw1);

  const rightClaw2 = new SceneNode(clawMesh, cfg.colors.white);
  mat4.translate(
    rightClaw2.localTransform,
    rightClaw2.localTransform,
    [0, -1.3, 0]
  );
  mat4.rotate(
    rightClaw2.localTransform,
    rightClaw2.localTransform,
    Math.PI,
    [1, 0, 0]
  );
  rightFoot.addChild(rightClaw2);

  const rightClaw3 = new SceneNode(clawMesh, cfg.colors.white);
  mat4.translate(
    rightClaw3.localTransform,
    rightClaw3.localTransform,
    [0.3, -1.1, 0]
  );
  mat4.rotate(
    rightClaw3.localTransform,
    rightClaw3.localTransform,
    Math.PI,
    [1, 0, 0]
  );
  rightFoot.addChild(rightClaw3);

  return legRoot;
}

function createAnimatedTail(gl) {
  const cfg = GarchompAnatomy;
  const tailRoot = new SceneNode(null);
  tailRoot.name = "TailRoot";

  const numSegments = 8;
  const segmentLength = 0.8;

  const tailProfile = [
    [0.0, 0.7],
    [0.5, 0.5],
    [0.7, 0.0],
    [0.5, -0.5],
    [0.0, -0.7],
    [-0.5, -0.5],
    [-0.7, 0.0],
    [-0.5, 0.5],
  ];

  const joints = [];
  let previousJoint = tailRoot;

  for (let i = 0; i < numSegments; i++) {
    const t = i / numSegments;
    const scaleStart = 1.0 - t;
    const scaleEnd = 1.0 - (i + 1) / numSegments;

    const segPath = [
      [0, 0, 0],
      [0, 0, -segmentLength],
    ];
    const segScales = [scaleStart, scaleEnd];

    const segmentGeom = Curves.createTaperedSweptSurface(
      tailProfile,
      segPath,
      segScales,
      true
    );
    const segmentMesh = new Mesh(gl, segmentGeom);

    // Joint node (pivot point)
    const jointNode = new SceneNode(null);
    jointNode.name = `TailJoint${i}`;

    // CRITICAL FIX: Store metadata
    jointNode._segmentLength = segmentLength;
    jointNode._segmentIndex = i;

    // Mesh as child
    const segmentNode = new SceneNode(segmentMesh, cfg.colors.darkBlue);
    jointNode.addChild(segmentNode);

    // Position (only if not first)
    if (i > 0) {
      mat4.translate(jointNode.localTransform, jointNode.localTransform, [
        0,
        0,
        -segmentLength,
      ]);
    }

    previousJoint.addChild(jointNode);
    joints.push(jointNode);
    previousJoint = jointNode;
  }

  return { root: tailRoot, joints: joints, segmentLength: segmentLength };
}

function createAnimatedLegs(gl) {
  const cfg = GarchompAnatomy;
  const legRoot = new SceneNode();
  legRoot.name = "LegsRoot";

  const thighMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 2, 1.0, 32, 32)
  );
  const calfMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.6, 1.5, 0.6, 32, 32)
  );
  const spikeMesh = new Mesh(gl, Primitives.createCone(0.4, 1, 32));
  const footMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.6, 1.2, 0.4, 32, 32)
  );
  const clawMesh = new Mesh(gl, Primitives.createCone(0.1, 0.25, 16));

  // LEFT LEG
  const leftHipJoint = new SceneNode(null);
  leftHipJoint.name = "LeftHip";
  mat4.translate(
    leftHipJoint.localTransform,
    leftHipJoint.localTransform,
    [-1.5, -2.5, -0.2]
  );

  const leftThigh = new SceneNode(thighMesh, cfg.colors.darkBlue);
  mat4.rotate(
    leftThigh.localTransform,
    leftThigh.localTransform,
    -Math.PI / 10,
    [1, 0, 0]
  );
  leftHipJoint.addChild(leftThigh);

  // Spikes
  const leftSpikeTop = new SceneNode(spikeMesh, cfg.colors.white);
  mat4.translate(
    leftSpikeTop.localTransform,
    leftSpikeTop.localTransform,
    [-0.2, 0.5, 0.8]
  );
  mat4.rotate(
    leftSpikeTop.localTransform,
    leftSpikeTop.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  leftThigh.addChild(leftSpikeTop);

  const leftSpikeBottom = new SceneNode(spikeMesh, cfg.colors.white);
  mat4.translate(
    leftSpikeBottom.localTransform,
    leftSpikeBottom.localTransform,
    [-0.3, -0.5, 0.7]
  );
  mat4.rotate(
    leftSpikeBottom.localTransform,
    leftSpikeBottom.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  leftThigh.addChild(leftSpikeBottom);

  // Knee
  const leftKneeJoint = new SceneNode(null);
  leftKneeJoint.name = "LeftKnee";
  mat4.translate(
    leftKneeJoint.localTransform,
    leftKneeJoint.localTransform,
    [0, -2.0, 0]
  );
  leftThigh.addChild(leftKneeJoint);

  // Calf
  const leftCalf = new SceneNode(calfMesh, cfg.colors.darkBlue);
  mat4.rotate(
    leftCalf.localTransform,
    leftCalf.localTransform,
    Math.PI / 6,
    [1, 0, 0]
  );
  leftKneeJoint.addChild(leftCalf);

  // Foot
  const leftFoot = new SceneNode(footMesh, cfg.colors.darkBlue);
  mat4.translate(
    leftFoot.localTransform,
    leftFoot.localTransform,
    [0, -1.5, 0.4]
  );
  mat4.rotate(
    leftFoot.localTransform,
    leftFoot.localTransform,
    -Math.PI / 2,
    [1, 0, 0]
  );
  leftCalf.addChild(leftFoot);

  // Claws
  for (let i = 0; i < 3; i++) {
    const claw = new SceneNode(clawMesh, cfg.colors.white);
    const xOffset = (i - 1) * 0.3;
    mat4.translate(claw.localTransform, claw.localTransform, [
      xOffset,
      -1.1 - (i === 1 ? 0.2 : 0),
      0,
    ]);
    mat4.rotate(claw.localTransform, claw.localTransform, Math.PI, [1, 0, 0]);
    leftFoot.addChild(claw);
  }

  legRoot.addChild(leftHipJoint);

  const rightHipJoint = new SceneNode(null);
  rightHipJoint.name = "RightHip";
  mat4.translate(
    rightHipJoint.localTransform,
    rightHipJoint.localTransform,
    [1.5, -2.5, -0.2]
  );

  const rightThigh = new SceneNode(thighMesh, cfg.colors.darkBlue);
  mat4.rotate(
    rightThigh.localTransform,
    rightThigh.localTransform,
    -Math.PI / 10,
    [1, 0, 0]
  );
  rightHipJoint.addChild(rightThigh);

  const rightSpikeTop = new SceneNode(spikeMesh, cfg.colors.white);
  mat4.translate(
    rightSpikeTop.localTransform,
    rightSpikeTop.localTransform,
    [0.2, 0.5, 0.8]
  );
  mat4.rotate(
    rightSpikeTop.localTransform,
    rightSpikeTop.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  rightThigh.addChild(rightSpikeTop);

  const rightSpikeBottom = new SceneNode(spikeMesh, cfg.colors.white);
  mat4.translate(
    rightSpikeBottom.localTransform,
    rightSpikeBottom.localTransform,
    [0.25, -0.5, 0.8]
  );
  mat4.rotate(
    rightSpikeBottom.localTransform,
    rightSpikeBottom.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  rightThigh.addChild(rightSpikeBottom);

  const rightKneeJoint = new SceneNode(null);
  rightKneeJoint.name = "RightKnee";
  mat4.translate(
    rightKneeJoint.localTransform,
    rightKneeJoint.localTransform,
    [0, -2.0, 0]
  );
  rightThigh.addChild(rightKneeJoint);

  const rightCalf = new SceneNode(calfMesh, cfg.colors.darkBlue);
  mat4.rotate(
    rightCalf.localTransform,
    rightCalf.localTransform,
    Math.PI / 6,
    [1, 0, 0]
  );
  rightKneeJoint.addChild(rightCalf);

  const rightFoot = new SceneNode(footMesh, cfg.colors.darkBlue);
  mat4.translate(
    rightFoot.localTransform,
    rightFoot.localTransform,
    [0, -1.5, 0.4]
  );
  mat4.rotate(
    rightFoot.localTransform,
    rightFoot.localTransform,
    -Math.PI / 2,
    [1, 0, 0]
  );
  rightCalf.addChild(rightFoot);

  for (let i = 0; i < 3; i++) {
    const claw = new SceneNode(clawMesh, cfg.colors.white);
    const xOffset = (i - 1) * 0.3;
    mat4.translate(claw.localTransform, claw.localTransform, [
      xOffset,
      -1.1 - (i === 1 ? 0.2 : 0),
      0,
    ]);
    mat4.rotate(claw.localTransform, claw.localTransform, Math.PI, [1, 0, 0]);
    rightFoot.addChild(claw);
  }

  legRoot.addChild(rightHipJoint);

  return {
    root: legRoot,
    leftHip: leftHipJoint,
    rightHip: rightHipJoint,
    leftKnee: leftKneeJoint,
    rightKnee: rightKneeJoint,
  };
}

function createMegaGarchompTorsoAnimated(gl) {
  const cfg = GarchompAnatomy;
  const torsoRoot = new SceneNode(null);
  torsoRoot.name = "TorsoRoot";

  // Create body parts
  const upperBodyMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 1.2, 0.7, 32, 32)
  );
  const lowerBodyMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.84, 0.9, 0.73, 32, 32)
  );
  const shoulderMesh = new Mesh(
    gl,
    Primitives.createEllipticParaboloid(0.8, 0.7, 1.5, 16)
  );
  const connectorMesh = new Mesh(
    gl,
    Primitives.createHyperboloidOneSheet(0.6, 0.5, 0.8, 1.8, 32, 32)
  );
  const chestPlateMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(1, 1, 1, 32, 32)
  );
  const waistPlateMesh = new Mesh(
    gl,
    Primitives.createHyperboloidOneSheet(0.6, 0.5, 0.8, 1.8, 32, 32)
  );
  const stomachPlateMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(1, 1, 1, 32, 32)
  );

  const upperBodyNode = new SceneNode(upperBodyMesh, cfg.colors.darkBlue);
  const lowerBodyNode = new SceneNode(lowerBodyMesh, cfg.colors.darkBlue);
  const leftShoulderNode = new SceneNode(shoulderMesh, cfg.colors.darkBlue);
  const rightShoulderNode = new SceneNode(shoulderMesh, cfg.colors.darkBlue);
  const connectorNode = new SceneNode(connectorMesh, cfg.colors.darkBlue);
  const chestPlateNode = new SceneNode(chestPlateMesh, cfg.colors.red);
  const waistPlateNode = new SceneNode(waistPlateMesh, cfg.colors.red);
  const stomachPlateNode = new SceneNode(stomachPlateMesh, cfg.colors.yellow);

  torsoRoot.addChild(upperBodyNode);
  torsoRoot.addChild(lowerBodyNode);
  torsoRoot.addChild(leftShoulderNode);
  torsoRoot.addChild(rightShoulderNode);
  torsoRoot.addChild(connectorNode);
  torsoRoot.addChild(chestPlateNode);
  torsoRoot.addChild(waistPlateNode);
  torsoRoot.addChild(stomachPlateNode);

  const scale = 1.5;

  // Apply transforms
  mat4.translate(upperBodyNode.localTransform, upperBodyNode.localTransform, [
    0,
    0.5 * scale,
    0,
  ]);
  mat4.scale(upperBodyNode.localTransform, upperBodyNode.localTransform, [
    scale,
    scale,
    scale,
  ]);

  mat4.translate(lowerBodyNode.localTransform, lowerBodyNode.localTransform, [
    0,
    -1.5 * scale,
    0,
  ]);
  mat4.scale(lowerBodyNode.localTransform, lowerBodyNode.localTransform, [
    scale,
    scale,
    scale,
  ]);

  mat4.translate(connectorNode.localTransform, connectorNode.localTransform, [
    0,
    -0.6 * scale,
    0,
  ]);
  mat4.scale(connectorNode.localTransform, connectorNode.localTransform, [
    0.64 * scale,
    0.3 * scale,
    0.65 * scale,
  ]);

  mat4.translate(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    [-1.4 * scale, 1.36 * scale, 0]
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
  mat4.scale(leftShoulderNode.localTransform, leftShoulderNode.localTransform, [
    0.78 * scale,
    0.8 * scale,
    0.75 * scale,
  ]);

  mat4.translate(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    [1.4 * scale, 1.36 * scale, 0]
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
    [0.78 * scale, 0.8 * scale, 0.75 * scale]
  );

  mat4.translate(chestPlateNode.localTransform, chestPlateNode.localTransform, [
    0,
    0.5 * scale,
    0.15 * scale,
  ]);
  mat4.scale(chestPlateNode.localTransform, chestPlateNode.localTransform, [
    0.64 * scale,
    1.2 * scale,
    0.75 * scale,
  ]);

  mat4.translate(waistPlateNode.localTransform, waistPlateNode.localTransform, [
    0,
    -0.6 * scale,
    0.05 * scale,
  ]);
  mat4.scale(waistPlateNode.localTransform, waistPlateNode.localTransform, [
    0.6 * scale,
    1.2 * scale,
    0.65 * scale,
  ]);

  mat4.translate(
    stomachPlateNode.localTransform,
    stomachPlateNode.localTransform,
    [0, -1.26 * scale, 0.12 * scale]
  );
  mat4.scale(stomachPlateNode.localTransform, stomachPlateNode.localTransform, [
    0.62 * scale,
    0.68 * scale,
    0.5 * scale,
  ]);

  const tailData = createAnimatedTail(gl);
  lowerBodyNode.addChild(tailData.root);
  mat4.translate(
    tailData.root.localTransform,
    tailData.root.localTransform,
    [0, 0.2, -0.3]
  );

  const finProfile = [
    [0, 0.3],
    [0.15, 0],
    [0, -0.3],
    [-0.1, 0],
  ];

  const leftFinPath = [];
  const leftFinScales = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    leftFinPath.push(
      Curves.getBezierPoint(
        t,
        [0, 0, 0],
        [0.5, 0.1, -0.5],
        [1.0, 0.0, -1.0],
        [1.5, -0.2, -1.5]
      )
    );
    leftFinScales.push(1.0 - t);
  }
  const leftFinMesh = new Mesh(
    gl,
    Curves.createTaperedSweptSurface(
      finProfile,
      leftFinPath,
      leftFinScales,
      true
    )
  );
  const leftFinNode = new SceneNode(leftFinMesh, cfg.colors.darkBlue);

  mat4.translate(
    leftFinNode.localTransform,
    leftFinNode.localTransform,
    [0, 0, 0]
  );
  mat4.rotate(
    leftFinNode.localTransform,
    leftFinNode.localTransform,
    -Math.PI / 2,
    [-1, -1, 0]
  );
  mat4.scale(
    leftFinNode.localTransform,
    leftFinNode.localTransform,
    [0.8, 0.8, 0.4]
  );

  if (tailData.joints && tailData.joints.length > 4) {
    tailData.joints[4].addChild(leftFinNode);
  }

  const rightFinPath = [];
  const rightFinScales = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    rightFinPath.push(
      Curves.getBezierPoint(
        t,
        [0, 0, 0],
        [-0.5, 0.1, -0.5],
        [-1.0, 0.0, -1.0],
        [-1.5, -0.2, -1.5]
      )
    );
    rightFinScales.push(1.0 - t);
  }
  const rightFinMesh = new Mesh(
    gl,
    Curves.createTaperedSweptSurface(
      finProfile,
      rightFinPath,
      rightFinScales,
      true
    )
  );
  const rightFinNode = new SceneNode(rightFinMesh, cfg.colors.darkBlue);

  mat4.translate(
    rightFinNode.localTransform,
    rightFinNode.localTransform,
    [0, 0, 0]
  );
  mat4.rotate(
    rightFinNode.localTransform,
    rightFinNode.localTransform,
    Math.PI / 1.3,
    [1, 1, 1]
  );
  mat4.scale(
    rightFinNode.localTransform,
    rightFinNode.localTransform,
    [0.8, 0.8, 0.08]
  );

  if (tailData.joints && tailData.joints.length > 4) {
    tailData.joints[4].addChild(rightFinNode);
  }

  const sail3DGeom = Curves.createSailCoons3D(
    4,
    2,
    0.15,
    0.32,
    0.2,
    64,
    20,
    0.3
  );
  const sail3DMesh = new Mesh(gl, sail3DGeom);
  const sail3DNode = new SceneNode(sail3DMesh, cfg.colors.darkBlue);
  mat4.rotate(
    sail3DNode.localTransform,
    sail3DNode.localTransform,
    1.5,
    [0, 1, 0]
  );
  mat4.translate(
    sail3DNode.localTransform,
    sail3DNode.localTransform,
    [-0.2, -0.7, -0.15]
  );
  upperBodyNode.addChild(sail3DNode);

  mat4.translate(
    torsoRoot.localTransform,
    torsoRoot.localTransform,
    [0, -3, 5]
  );

  torsoRoot.tailJoints = tailData.joints;
  torsoRoot.tailSegmentLength = tailData.segmentLength;

  return torsoRoot;
}

window.createAnimatedTail = createAnimatedTail;
window.createAnimatedLegs = createAnimatedLegs;
window.createMegaGarchompTorsoAnimated = createMegaGarchompTorsoAnimated;
