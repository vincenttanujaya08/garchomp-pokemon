// ============================================================
// GABITE PARTS - FIXED WITH ANIMATION RIG SUPPORT
// ============================================================

/**
 * Membuat badan Gabite yang lengkap, termasuk torso, ekor, kaki, dan tangan.
 * @param {WebGLRenderingContext} gl - Konteks WebGL.
 * @returns {SceneNode} Node root untuk badan.
 */
function createGabiteBody(gl) {
  const cfg = GabiteAnatomy;
  const bodyRoot = new SceneNode();
  bodyRoot.name = "BodyRoot";

  // --- BENTUK TUBUH ---
  const mainBodyMesh = new Mesh(gl, PP1.createEllipsoid(0.9, 1.8, 1.2, 32, 32));
  const mainBodyNode = new SceneNode(mainBodyMesh, cfg.colors.red);
  mainBodyNode.name = "MainBody";
  mat4.translate(
    mainBodyNode.localTransform,
    mainBodyNode.localTransform,
    [0, -2.0, 0]
  );
  mat4.rotate(
    mainBodyNode.localTransform,
    mainBodyNode.localTransform,
    Math.PI / 12,
    [1, 0, 0]
  );
  bodyRoot.addChild(mainBodyNode);

  const bottomBodyMesh = new Mesh(
    gl,
    PP1.createEllipticParaboloid(0.9, 2.3, 1.2, 32)
  );

  const triangleBodyMesh = new Mesh(gl, PP1.createCone(0.1, 0.3, 8));
  const triangleBodyNode = new SceneNode(triangleBodyMesh, cfg.colors.white);
  triangleBodyNode.name = "TriangleBody";
  mat4.translate(
    triangleBodyNode.localTransform,
    triangleBodyNode.localTransform,
    [0, -2.9, -1.18]
  );
  mat4.scale(
    triangleBodyNode.localTransform,
    triangleBodyNode.localTransform,
    [2.5, 3, 1]
  );
  mat4.rotate(
    triangleBodyNode.localTransform,
    triangleBodyNode.localTransform,
    1.3,
    [-1, 0, 0]
  );
  bodyRoot.addChild(triangleBodyNode);

  const backMesh = new Mesh(gl, PP1.createEllipsoid(1.1, 1.9, 1, 32, 32));
  const backNode = new SceneNode(backMesh, cfg.colors.darkBlue);
  backNode.name = "Back";
  mat4.translate(
    backNode.localTransform,
    backNode.localTransform,
    [0, -2.0, 0.4]
  );
  mat4.rotate(
    backNode.localTransform,
    backNode.localTransform,
    Math.PI / 12,
    [1, 0, 0]
  );
  bodyRoot.addChild(backNode);

  // --- EKOR DENGAN KURVA BEZIER ---
  const p0 = [0, -2.8, 1.0];
  const p1 = [0, -2.9, 2.7];
  const p2 = [0, -2.6, 2.9];
  const p3 = [0, -2.6, 4.2];

  const pathSegments = 18;
  const path = [];
  const scaleFactors = [];

  const tailBaseRadius = 0.85;
  const baseScale = 1;
  const tipScale = 0.05;
  const k = 0.65;

  for (let i = 0; i <= pathSegments; i++) {
    const t = i / pathSegments;
    path.push(CC1.getBezierPoint(t, p0, p1, p2, p3));
    const s = tipScale + (baseScale - tipScale) * Math.pow(1 - t, k);
    scaleFactors.push(s);
  }

  const tailMesh = new Mesh(
    gl,
    PP1.createTubeFromPath(path, tailBaseRadius, 16, scaleFactors)
  );
  const tailNode = new SceneNode(tailMesh, cfg.colors.darkBlue);
  tailNode.name = "Tail";
  mat4.scale(tailNode.localTransform, tailNode.localTransform, [1, 1, 1]);
  bodyRoot.addChild(tailNode);

  // Tail fin
  const finShapePoints2D = [
    [2.8, 0.27],
    [0.68, 1.61],
    [1.56, 2.55],
    [2.32, 3.31],
    [3.04, 3.87],
    [3.78, 4.39],
    [4.4, 4.81],
    [5.16, 5.13],
    [6.02, 5.49],
    [5.66, 4.45],
    [4.7, 2.57],
    [3.66, 0.63],
    [3.06, 0.9],
    [4.1, 1.9],
    [3, -0.1],
  ];

  const centerX = 3.35;
  const centerZ = 2.75;
  const scale = 0.6;

  const processedPoints = finShapePoints2D.map((p) => [
    (p[0] - centerX) * scale,
    0,
    (p[1] - centerZ) * scale,
  ]);

  const finGeom = PP1.createExtrudedShape(processedPoints, 0.1, 1.0, 0.95);
  const finMesh = new Mesh(gl, finGeom);

  const fintailNode = new SceneNode(finMesh, cfg.colors.darkBlue);
  fintailNode.name = "TailFin";
  mat4.translate(
    fintailNode.localTransform,
    fintailNode.localTransform,
    [0, -2, 3.5]
  );
  mat4.rotate(
    fintailNode.localTransform,
    fintailNode.localTransform,
    1.56,
    [0, 0, 1]
  );
  mat4.rotate(
    fintailNode.localTransform,
    fintailNode.localTransform,
    1,
    [0, -1, 0]
  );
  mat4.scale(
    fintailNode.localTransform,
    fintailNode.localTransform,
    [0.5, 0.5, -0.5]
  );
  tailNode.addChild(fintailNode);

  const bottomBodyNode = new SceneNode(bottomBodyMesh, cfg.colors.white);
  bottomBodyNode.name = "BottomBody";
  mat4.translate(
    bottomBodyNode.localTransform,
    bottomBodyNode.localTransform,
    [0, -4.3, 0.81]
  );
  mat4.scale(
    bottomBodyNode.localTransform,
    bottomBodyNode.localTransform,
    [1, 1, 0.9]
  );
  tailNode.addChild(bottomBodyNode);

  // --- KAKI LENGKAP ---
  const leftLeg = createGabiteLeg(gl, "Left");
  mat4.translate(
    leftLeg.localTransform,
    leftLeg.localTransform,
    [-1.2, -3.2, 0.3]
  );
  mat4.rotate(
    leftLeg.localTransform,
    leftLeg.localTransform,
    Math.PI / 24,
    [0, 1, 0]
  );
  bodyRoot.addChild(leftLeg);

  const rightLeg = createGabiteLeg(gl, "Right");
  mat4.translate(
    rightLeg.localTransform,
    rightLeg.localTransform,
    [1.2, -3.2, 0.3]
  );
  mat4.rotate(
    rightLeg.localTransform,
    rightLeg.localTransform,
    -Math.PI / 24,
    [0, 1, 0]
  );
  bodyRoot.addChild(rightLeg);

  // --- TANGAN ---
  const armRoot = createGabiteArm(gl);
  bodyRoot.addChild(armRoot);

  // Store references for animation rig (will be picked up by parent)
  bodyRoot._rigRefs = {
    leftThigh: leftLeg.children[0], // First child is thigh
    rightThigh: rightLeg.children[0],
    leftShin: leftLeg.children[0]?.children?.find((c) =>
      c.name?.includes("Shin")
    ),
    rightShin: rightLeg.children[0]?.children?.find((c) =>
      c.name?.includes("Shin")
    ),
    leftFoot: leftLeg.children[0]?.children
      ?.find((c) => c.name?.includes("Shin"))
      ?.children?.find((c) => c.name?.includes("Foot")),
    rightFoot: rightLeg.children[0]?.children
      ?.find((c) => c.name?.includes("Shin"))
      ?.children?.find((c) => c.name?.includes("Foot")),
    tail: tailNode,
    tailFin: fintailNode,
    leftArm: armRoot.children?.find((c) => c.name?.includes("LeftUpper")),
    rightArm: armRoot.children?.find((c) => c.name?.includes("RightUpper")),
  };

  return bodyRoot;
}

/**
 * Membuat satu unit kaki Gabite.
 * @param {WebGLRenderingContext} gl - Konteks WebGL.
 * @param {string} side - "Left" atau "Right"
 * @returns {SceneNode} Node root untuk satu kaki.
 */
function createGabiteLeg(gl, side = "Left") {
  const cfg = GabiteAnatomy;
  const legRoot = new SceneNode();
  legRoot.name = `${side}LegRoot`;

  const thighMesh = new Mesh(gl, PP1.createEllipsoid(0.7, 1.3, 1.0, 32, 32));
  const thighNode = new SceneNode(thighMesh, cfg.colors.darkBlue);
  thighNode.name = `${side}Thigh`;
  mat4.rotate(
    thighNode.localTransform,
    thighNode.localTransform,
    Math.PI / 15,
    [1, 0, 0]
  );
  legRoot.addChild(thighNode);

  const spikeMesh = new Mesh(gl, PP1.createCone(0.1, 1, 16));
  const spikeNode = new SceneNode(spikeMesh, cfg.colors.white);
  spikeNode.name = `${side}ThighSpike1`;
  mat4.translate(
    spikeNode.localTransform,
    spikeNode.localTransform,
    [0, 0.3, -1]
  );
  mat4.rotate(
    spikeNode.localTransform,
    spikeNode.localTransform,
    1,
    [-1, 0, 0]
  );
  mat4.scale(spikeNode.localTransform, spikeNode.localTransform, [1, 1, 6]);
  thighNode.addChild(spikeNode);

  const spikeMesh2 = new Mesh(gl, PP1.createCone(0.1, 1, 16));
  const spikeNode2 = new SceneNode(spikeMesh2, cfg.colors.white);
  spikeNode2.name = `${side}ThighSpike2`;
  mat4.translate(
    spikeNode2.localTransform,
    spikeNode2.localTransform,
    [0, -0.3, -1]
  );
  mat4.rotate(
    spikeNode2.localTransform,
    spikeNode2.localTransform,
    1.3,
    [-1, 0, 0]
  );
  mat4.scale(
    spikeNode2.localTransform,
    spikeNode2.localTransform,
    [0.5, 0.5, 3]
  );
  thighNode.addChild(spikeNode2);

  const shinMesh = new Mesh(
    gl,
    PP1.createHyperboloidOneSheet(0.4, 0.4, 0.6, 0.9, 16, 16)
  );
  const shinNode = new SceneNode(shinMesh, cfg.colors.darkBlue);
  shinNode.name = `${side}Shin`;
  mat4.translate(
    shinNode.localTransform,
    shinNode.localTransform,
    [0, -1.0, -0.3]
  );
  thighNode.addChild(shinNode);

  const footMesh = new Mesh(gl, PP1.createEllipsoid(0.6, 0.3, 0.9, 32, 32));
  const footNode = new SceneNode(footMesh, cfg.colors.darkBlue);
  footNode.name = `${side}Foot`;
  mat4.translate(
    footNode.localTransform,
    footNode.localTransform,
    [0, -0.6, -0.1]
  );
  shinNode.addChild(footNode);

  const clawSideMesh = new Mesh(gl, PP1.createCone(0.2, 0.5, 16));
  const clawCenterMesh = new Mesh(gl, PP1.createCone(0.22, 0.6, 16));

  const clawNode1 = new SceneNode(clawSideMesh, cfg.colors.white);
  clawNode1.name = `${side}Claw1`;
  mat4.translate(
    clawNode1.localTransform,
    clawNode1.localTransform,
    [-0.3, 0.2, -0.8]
  );
  mat4.rotate(clawNode1.localTransform, clawNode1.localTransform, 1, [0, 1, 0]);
  footNode.addChild(clawNode1);

  const clawNode2 = new SceneNode(clawSideMesh, cfg.colors.white);
  clawNode2.name = `${side}Claw2`;
  mat4.translate(
    clawNode2.localTransform,
    clawNode2.localTransform,
    [0.3, 0.2, -0.8]
  );
  mat4.rotate(
    clawNode2.localTransform,
    clawNode2.localTransform,
    -Math.PI / 9,
    [0, 1, 0]
  );
  footNode.addChild(clawNode2);

  const clawNode3 = new SceneNode(clawCenterMesh, cfg.colors.white);
  clawNode3.name = `${side}Claw3`;
  mat4.translate(
    clawNode3.localTransform,
    clawNode3.localTransform,
    [0.0, 0.2, -0.9]
  );
  footNode.addChild(clawNode3);

  return legRoot;
}

/**
 * Membuat kedua tangan Gabite
 */
function createGabiteArm(gl) {
  const cfg = GabiteAnatomy;
  const armRoot = new SceneNode();
  armRoot.name = "ArmRoot";

  const upperArmMesh = new Mesh(gl, PP1.createEllipsoid(0.4, 1.3, 0.4, 32, 32));
  const forearmMesh = new Mesh(gl, PP1.createEllipsoid(0.4, 1.6, 0.5, 32, 32));

  const shoulderYaw = Math.PI / 14;
  const shoulderRoll = Math.PI / 24;
  const elbowBend = Math.PI / 2;
  const forearmYawIn = Math.PI / 18;
  const wristRoll = Math.PI / 20;

  // ====== RIGHT ARM ======
  const rightUpper = new SceneNode(upperArmMesh, cfg.colors.darkBlue);
  rightUpper.name = "RightUpperArm";
  mat4.translate(
    rightUpper.localTransform,
    rightUpper.localTransform,
    [1.65, -1.0, 0.4]
  );
  mat4.rotate(
    rightUpper.localTransform,
    rightUpper.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  mat4.rotate(
    rightUpper.localTransform,
    rightUpper.localTransform,
    -shoulderYaw,
    [0, 1, 0]
  );
  mat4.rotate(
    rightUpper.localTransform,
    rightUpper.localTransform,
    -shoulderRoll,
    [0, 0, 1]
  );
  armRoot.addChild(rightUpper);

  const rightFore = new SceneNode(forearmMesh, cfg.colors.darkBlue);
  rightFore.name = "RightForearm";
  mat4.translate(
    rightFore.localTransform,
    rightFore.localTransform,
    [0, -1.25, -1.3]
  );
  mat4.rotate(
    rightFore.localTransform,
    rightFore.localTransform,
    elbowBend,
    [1, 0, 0]
  );
  mat4.rotate(
    rightFore.localTransform,
    rightFore.localTransform,
    +forearmYawIn,
    [0, 1, 0]
  );
  mat4.rotate(
    rightFore.localTransform,
    rightFore.localTransform,
    -wristRoll / 2,
    [0, 0, 1]
  );
  rightUpper.addChild(rightFore);

  // ====== LEFT ARM ======
  const leftUpper = new SceneNode(upperArmMesh, cfg.colors.darkBlue);
  leftUpper.name = "LeftUpperArm";
  mat4.translate(
    leftUpper.localTransform,
    leftUpper.localTransform,
    [-1.65, -1.0, 0.4]
  );
  mat4.rotate(
    leftUpper.localTransform,
    leftUpper.localTransform,
    -Math.PI / 2,
    [0, 0, 1]
  );
  mat4.rotate(
    leftUpper.localTransform,
    leftUpper.localTransform,
    +shoulderYaw,
    [0, 1, 0]
  );
  mat4.rotate(
    leftUpper.localTransform,
    leftUpper.localTransform,
    +shoulderRoll,
    [0, 0, 1]
  );
  armRoot.addChild(leftUpper);

  const leftFore = new SceneNode(forearmMesh, cfg.colors.darkBlue);
  leftFore.name = "LeftForearm";
  mat4.translate(
    leftFore.localTransform,
    leftFore.localTransform,
    [0, -1.25, -1.3]
  );
  mat4.rotate(
    leftFore.localTransform,
    leftFore.localTransform,
    elbowBend,
    [1, 0, 0]
  );
  mat4.rotate(
    leftFore.localTransform,
    leftFore.localTransform,
    -forearmYawIn,
    [0, 1, 0]
  );
  mat4.rotate(
    leftFore.localTransform,
    leftFore.localTransform,
    +wristRoll / 2,
    [0, 0, 1]
  );
  leftUpper.addChild(leftFore);

  // ====== HAND FINS ======
  const finW = 0.6,
    finH = 0.7,
    topBulge = 0.12,
    bottomBulge = 0.18,
    leftBulge = 0.1;
  const finSegU = 24,
    finSegV = 10,
    finT = 0.2;
  const finGeom = CC1.createSailCoons3D(
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
  leftFin.name = "LeftHandFin";
  mat4.translate(leftFin.localTransform, leftFin.localTransform, [
    -0.1,
    wristOffset + 0.55,
    0,
  ]);
  mat4.rotate(
    leftFin.localTransform,
    leftFin.localTransform,
    Math.PI + wristRoll,
    [0, 0, 1]
  );
  mat4.scale(leftFin.localTransform, leftFin.localTransform, [0.9, 2.5, 0.9]);
  leftFore.addChild(leftFin);

  const rightFin = new SceneNode(finMesh, cfg.colors.white);
  rightFin.name = "RightHandFin";
  mat4.translate(rightFin.localTransform, rightFin.localTransform, [
    0.1,
    wristOffset + 0.55,
    0,
  ]);
  mat4.rotate(
    rightFin.localTransform,
    rightFin.localTransform,
    Math.PI - wristRoll,
    [0, 0, -1]
  );
  mat4.scale(
    rightFin.localTransform,
    rightFin.localTransform,
    [-0.9, 2.5, 0.9]
  );
  rightFore.addChild(rightFin);

  // ====== ARM SAILS ======
  const sailGeom = CC1.createSail(2, 3, 0.4, 64);
  const sailMesh = new Mesh(gl, sailGeom);

  const rightSail = new SceneNode(sailMesh, cfg.colors.darkBlue);
  rightSail.name = "RightArmSail";
  mat4.translate(
    rightSail.localTransform,
    rightSail.localTransform,
    [0.1, -1.2, 0]
  );
  mat4.rotate(
    rightSail.localTransform,
    rightSail.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.rotate(
    rightSail.localTransform,
    rightSail.localTransform,
    Math.PI / 2,
    [0, 1, 0]
  );
  mat4.rotate(
    rightSail.localTransform,
    rightSail.localTransform,
    -wristRoll / 2,
    [0, 0, 1]
  );
  rightFore.addChild(rightSail);

  const leftSail = new SceneNode(sailMesh, cfg.colors.darkBlue);
  leftSail.name = "LeftArmSail";
  mat4.translate(
    leftSail.localTransform,
    leftSail.localTransform,
    [-0.1, -1.2, 0]
  );
  mat4.scale(leftSail.localTransform, leftSail.localTransform, [-1, 1, 1]);
  mat4.rotate(
    leftSail.localTransform,
    leftSail.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.rotate(
    leftSail.localTransform,
    leftSail.localTransform,
    Math.PI / 2,
    [0, 1, 0]
  );
  mat4.rotate(
    leftSail.localTransform,
    leftSail.localTransform,
    +wristRoll / 2,
    [0, 0, 1]
  );
  leftFore.addChild(leftSail);

  return armRoot;
}

/**
 * Membuat kepala Gabite
 */
function createGabiteHead(gl) {
  const cfg = GabiteAnatomy;
  const headRoot = new SceneNode();
  headRoot.name = "HeadRoot";

  // Main head shape
  const headMesh = new Mesh(gl, PP1.createEllipsoid(1.0, 1.0, 1.5, 32, 32));
  const headNode = new SceneNode(headMesh, cfg.colors.darkBlue);
  headNode.name = "HeadMain";

  mat4.translate(
    headRoot.localTransform,
    headRoot.localTransform,
    [0, 0.6, -0.5]
  );
  mat4.translate(
    headNode.localTransform,
    headNode.localTransform,
    [0, 0.4, 0.1]
  );
  // mat4.rotate(
  //   headNode.localTransform,
  //   headNode.localTransform,
  //   -Math.PI / 15,
  //   [1, 0, 0]
  // );
  headRoot.addChild(headNode);

  // Jet fins (side fins)
  const finMesh = new Mesh(gl, PP1.createEllipsoid(0.5, 0.5, 1.2, 24, 24));

  const leftFinNode = new SceneNode(finMesh, cfg.colors.darkBlue);
  leftFinNode.name = "LeftJetFin";
  mat4.translate(
    leftFinNode.localTransform,
    leftFinNode.localTransform,
    [-1.3, 0.2, 0.1]
  );
  headNode.addChild(leftFinNode);

  const stripeMesh = new Mesh(gl, PP1.createCylinder(0.3, 0.25, 16));
  const leftStripeNode = new SceneNode(stripeMesh, cfg.colors.white);
  leftStripeNode.name = "LeftJetStripe";
  mat4.translate(
    leftStripeNode.localTransform,
    leftStripeNode.localTransform,
    [0, 0, 0]
  );
  mat4.rotate(
    leftStripeNode.localTransform,
    leftStripeNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(
    leftStripeNode.localTransform,
    leftStripeNode.localTransform,
    [1.7, 1, 1.7]
  );
  leftFinNode.addChild(leftStripeNode);

  const rightFinNode = new SceneNode(finMesh, cfg.colors.darkBlue);
  rightFinNode.name = "RightJetFin";
  mat4.translate(
    rightFinNode.localTransform,
    rightFinNode.localTransform,
    [1.3, 0.2, 0.1]
  );
  headNode.addChild(rightFinNode);

  const rightStripeNode = new SceneNode(stripeMesh, cfg.colors.white);
  rightStripeNode.name = "RightJetStripe";
  mat4.translate(
    rightStripeNode.localTransform,
    rightStripeNode.localTransform,
    [0, 0, 0]
  );
  mat4.rotate(
    rightStripeNode.localTransform,
    rightStripeNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(
    rightStripeNode.localTransform,
    rightStripeNode.localTransform,
    [1.7, 1, 1.7]
  );
  rightFinNode.addChild(rightStripeNode);

  // Red overlay
  const headMesh2 = new Mesh(gl, PP1.createEllipsoid(1.0, 1.0, 1.5, 32, 32));
  const headNode2 = new SceneNode(headMesh2, cfg.colors.red);
  headNode2.name = "HeadOverlay";
  mat4.translate(
    headNode2.localTransform,
    headNode2.localTransform,
    [0, 0.1, -0.1]
  );
  mat4.scale(
    headNode2.localTransform,
    headNode2.localTransform,
    [0.9, 0.8, 0.7]
  );
  mat4.rotate(
    headNode2.localTransform,
    headNode2.localTransform,
    -Math.PI / 15,
    [1, 0, 0]
  );
  headRoot.addChild(headNode2);

  // Teeth
  const toothMesh = new Mesh(gl, PP1.createCone(0.1, 0.3, 8));

  const teeth = [
    { name: "LeftTooth1", pos: [0.78, -0.5, -0.7] },
    { name: "LeftTooth2", pos: [0.74, -0.5, -0.8] },
    { name: "RightTooth1", pos: [-0.78, -0.5, -0.7] },
    { name: "RightTooth2", pos: [-0.74, -0.5, -0.8] },
  ];

  teeth.forEach((tooth) => {
    const toothNode = new SceneNode(toothMesh, cfg.colors.white);
    toothNode.name = tooth.name;
    mat4.translate(
      toothNode.localTransform,
      toothNode.localTransform,
      tooth.pos
    );
    const rotDir = tooth.name.includes("Left") ? -1 : 1;
    mat4.rotate(toothNode.localTransform, toothNode.localTransform, 2.77, [
      0,
      0,
      rotDir,
    ]);
    headNode.addChild(toothNode);
  });

  // Eyes
  function createTorusGeometry(R, r, segProfile = 48, segRevolve = 48) {
    const profile = [];
    for (let i = 0; i <= segProfile; i++) {
      const a = (i / segProfile) * 2 * Math.PI;
      profile.push([R + r * Math.cos(a), r * Math.sin(a)]);
    }
    return PP1.createLathe(profile, segRevolve);
  }

  function createGabiteEye(gl, side = 1) {
    const eyeRoot = new SceneNode();
    eyeRoot.name = `${side > 0 ? "Right" : "Left"}Eye`;

    const patchMesh = new Mesh(
      gl,
      PP1.createEllipsoid(0.55, 0.33, 0.08, 24, 24)
    );
    const patchNode = new SceneNode(patchMesh, cfg.colors.black);
    patchNode.name = "EyePatch";
    mat4.scale(
      patchNode.localTransform,
      patchNode.localTransform,
      [1.0, 1.0, 0.5]
    );
    mat4.translate(
      patchNode.localTransform,
      patchNode.localTransform,
      [0, 0, -0.03]
    );
    eyeRoot.addChild(patchNode);

    const irisGeom = createTorusGeometry(0.18, 0.045, 40, 40);
    const irisMesh = new Mesh(gl, irisGeom);
    const irisNode = new SceneNode(irisMesh, cfg.colors.yellow);
    irisNode.name = "Iris";
    mat4.rotate(
      irisNode.localTransform,
      irisNode.localTransform,
      Math.PI / 2,
      [0, 0, 1]
    );
    mat4.rotate(
      irisNode.localTransform,
      irisNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.scale(
      irisNode.localTransform,
      irisNode.localTransform,
      [1.0, 1.0, 0.5]
    );
    mat4.translate(
      irisNode.localTransform,
      irisNode.localTransform,
      [0, -0.03, 0]
    );
    eyeRoot.addChild(irisNode);

    const pupilMesh = new Mesh(
      gl,
      PP1.createEllipsoid(0.06, 0.2, 0.03, 18, 18)
    );
    const pupilNode = new SceneNode(pupilMesh, cfg.colors.black);
    pupilNode.name = "Pupil";
    mat4.translate(
      pupilNode.localTransform,
      pupilNode.localTransform,
      [0, 0, 0.05]
    );
    eyeRoot.addChild(pupilNode);

    const yawOut = side * 1.2;
    const pitch = -Math.PI / 18;
    const roll = -side * (Math.PI / 8);
    mat4.translate(eyeRoot.localTransform, eyeRoot.localTransform, [
      side * 0.81,
      -0.02,
      -0.8,
    ]);
    mat4.rotate(
      eyeRoot.localTransform,
      eyeRoot.localTransform,
      yawOut,
      [0, -1, 0]
    );
    mat4.rotate(
      eyeRoot.localTransform,
      eyeRoot.localTransform,
      pitch,
      [1, 0, 0]
    );
    mat4.rotate(
      eyeRoot.localTransform,
      eyeRoot.localTransform,
      roll,
      [0, 0, -1]
    );

    return eyeRoot;
  }

  headNode.addChild(createGabiteEye(gl, +1));
  headNode.addChild(createGabiteEye(gl, -1));

  return headRoot;
}

/**
 * Membuat leher Gabite
 */
function createGabiteNeck(gl) {
  const cfg = GabiteAnatomy;

  const neckMesh = new Mesh(
    gl,
    PP1.createHyperboloidOneSheet(0.6, 0.6, 0.4, 1.0, 16, 16)
  );

  const neckMesh2 = new Mesh(
    gl,
    PP1.createHyperboloidOneSheet(0.6, 0.6, 0.4, 1.0, 16, 16)
  );

  const neckNode = new SceneNode(neckMesh, cfg.colors.darkBlue);
  neckNode.name = "NeckMain";
  const neckNode2 = new SceneNode(neckMesh2, cfg.colors.red);
  neckNode2.name = "NeckOverlay";

  neckNode.addChild(neckNode2);

  mat4.rotate(
    neckNode.localTransform,
    neckNode.localTransform,
    Math.PI / 10,
    [-1, 0, 0]
  );
  mat4.scale(neckNode.localTransform, neckNode.localTransform, [0.75, 1, 0.9]);
  mat4.translate(
    neckNode.localTransform,
    neckNode.localTransform,
    [0, -0.2, 0.17]
  );

  mat4.rotate(
    neckNode2.localTransform,
    neckNode2.localTransform,
    Math.PI / 12,
    [-1, 0, 0]
  );
  mat4.scale(
    neckNode2.localTransform,
    neckNode2.localTransform,
    [0.8, 1.1, -0.32]
  );
  mat4.translate(
    neckNode2.localTransform,
    neckNode2.localTransform,
    [0, 0.1, 1.4]
  );

  return neckNode;
}

/**
 * Membuat sirip punggung Gabite
 */
function createGabiteFin(gl) {
  const cfg = GabiteAnatomy;

  const finShapePoints2D = [
    [2.8, 0.27],
    [0.68, 1.61],
    [1.56, 2.55],
    [2.32, 3.31],
    [3.04, 3.87],
    [3.78, 4.39],
    [4.4, 4.81],
    [5.16, 5.13],
    [6.02, 5.49],
    [5.66, 4.45],
    [4.7, 2.57],
    [3.66, 0.63],
    [3.06, 0.9],
    [4.1, 1.9],
    [3, -0.1],
  ];

  const centerX = 3.35;
  const centerZ = 2.75;
  const scale = 0.6;

  const processedPoints = finShapePoints2D.map((p) => [
    (p[0] - centerX) * scale,
    0,
    (p[1] - centerZ) * scale,
  ]);

  const finGeom = PP1.createExtrudedShape(processedPoints, 0.1, 1.0, 0.95);
  const finMesh = new Mesh(gl, finGeom);

  const finNode = new SceneNode(finMesh, cfg.colors.darkBlue);
  finNode.name = "DorsalFinMesh";
  mat4.translate(
    finNode.localTransform,
    finNode.localTransform,
    [0.1, -0.4, 2.5]
  );
  mat4.rotate(finNode.localTransform, finNode.localTransform, 1.56, [0, 0, -1]);
  mat4.rotate(finNode.localTransform, finNode.localTransform, 1, [0, -1, 0]);
  return finNode;
}

// Export to window
window.createGabiteBody = createGabiteBody;
window.createGabiteLeg = createGabiteLeg;
window.createGabiteArm = createGabiteArm;
window.createGabiteHead = createGabiteHead;
window.createGabiteNeck = createGabiteNeck;
window.createGabiteFin = createGabiteFin;
