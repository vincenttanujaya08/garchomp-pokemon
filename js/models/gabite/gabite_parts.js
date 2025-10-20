// File: js/models/gabite/gabite_parts.js

/**
 * Membuat badan Gabite yang lengkap, termasuk torso, ekor, kaki, dan tangan.
 * @param {WebGLRenderingContext} gl - Konteks WebGL.
 * @returns {SceneNode} Node root untuk badan.
 */
function createGabiteBody(gl) {
  const cfg = GabiteAnatomy;
  const bodyRoot = new SceneNode();

  // --- BENTUK TUBUH ---
  const mainBodyMesh = new Mesh(gl, Primitives.createEllipsoid(1.4, 1.8, 1.2, 32, 32));
  const mainBodyNode = new SceneNode(mainBodyMesh, cfg.colors.red);
  mat4.translate(mainBodyNode.localTransform, mainBodyNode.localTransform, [0, -2.0, 0]);
  mat4.rotate(mainBodyNode.localTransform, mainBodyNode.localTransform, Math.PI / 12, [1, 0, 0]);
  bodyRoot.addChild(mainBodyNode);

  const backMesh = new Mesh(gl, Primitives.createEllipsoid(1.5, 1.9, 1.4, 32, 32));
  const backNode = new SceneNode(backMesh, cfg.colors.darkBlue);
  mat4.translate(backNode.localTransform, backNode.localTransform, [0, -2.0, 0.4]);
  mat4.rotate(backNode.localTransform, backNode.localTransform, Math.PI / 12, [1, 0, 0]);
  bodyRoot.addChild(backNode);

  const redPatchMesh = new Mesh(gl, Primitives.createTriangularPrism(1.2, 0.8, 0.3));
  const redPatchNode = new SceneNode(redPatchMesh, cfg.colors.red);
  mat4.translate(redPatchNode.localTransform, redPatchNode.localTransform, [0, -2.6, -0.8]);
  mat4.rotate(redPatchNode.localTransform, redPatchNode.localTransform, Math.PI / 12 + Math.PI / 6, [1, 0, 0]);
  bodyRoot.addChild(redPatchNode);

  // --- EKOR DENGAN KURVA BEZIER ---
  const p0 = [0, -2.5, 1.0];
  const p1 = [0, -2.8, 3.5];
  const p2 = [0, -2.2, 3.5];
  const p3 = [0, -2.2, 5.0];

  const pathSegments = 20;
  const path = [];
  const scaleFactors = [];
  for (let i = 0; i <= pathSegments; i++) {
    const t = i / pathSegments;
    path.push(Curves.getBezierPoint(t, p0, p1, p2, p3));
    scaleFactors.push(1.0 - t);
  }

  const tailMesh = new Mesh(gl, Primitives.createTubeFromPath(path, 1.2, 16, scaleFactors));
  const tailNode = new SceneNode(tailMesh, cfg.colors.darkBlue);
  bodyRoot.addChild(tailNode);

  // --- KAKI LENGKAP ---
  const leftLeg = createGabiteLeg(gl);
  mat4.translate(leftLeg.localTransform, leftLeg.localTransform, [-1.4, -3.2, 0.3]);
  mat4.rotate(leftLeg.localTransform, leftLeg.localTransform, Math.PI / 24, [0, 1, 0]);
  bodyRoot.addChild(leftLeg);

  const rightLeg = createGabiteLeg(gl);
  mat4.translate(rightLeg.localTransform, rightLeg.localTransform, [1.4, -3.2, 0.3]);
  mat4.rotate(rightLeg.localTransform, rightLeg.localTransform, -Math.PI / 24, [0, 1, 0]);
  bodyRoot.addChild(rightLeg);

  // --- TANGAN (MENGGUNAKAN LOGIKA GARCHOMP) ---
  const arm = createGabiteArm(gl);
  bodyRoot.addChild(arm);

  return bodyRoot;
}

/**
 * Membuat satu unit kaki Gabite.
 * @param {WebGLRenderingContext} gl - Konteks WebGL.
 * @returns {SceneNode} Node root untuk satu kaki.
 */
function createGabiteLeg(gl) {
  const cfg = GabiteAnatomy;
  const legRoot = new SceneNode();

  const thighMesh = new Mesh(gl, Primitives.createEllipsoid(0.8, 1.3, 1.0, 32, 32));
  const thighNode = new SceneNode(thighMesh, cfg.colors.darkBlue);
  mat4.rotate(thighNode.localTransform, thighNode.localTransform, Math.PI / 15, [1, 0, 0]);
  legRoot.addChild(thighNode);

  const spikeMesh = new Mesh(gl, Primitives.createCone(0.3, 0.9, 16));
  const spikeNode = new SceneNode(spikeMesh, cfg.colors.white);
  mat4.translate(spikeNode.localTransform, spikeNode.localTransform, [0, -0.7, -0.8]);
  mat4.rotate(spikeNode.localTransform, spikeNode.localTransform, -Math.PI / 10, [1, 0, 0]);
  thighNode.addChild(spikeNode);

  const shinMesh = new Mesh(gl, Primitives.createCapsule(0.5, 0.8, 32));
  const shinNode = new SceneNode(shinMesh, cfg.colors.darkBlue);
  mat4.translate(shinNode.localTransform, shinNode.localTransform, [0, -1.0, -0.3]);
  thighNode.addChild(shinNode);

  const footMesh = new Mesh(gl, Primitives.createEllipsoid(0.7, 0.3, 0.9, 32, 32));
  const footNode = new SceneNode(footMesh, cfg.colors.darkBlue);
  mat4.translate(footNode.localTransform, footNode.localTransform, [0, -0.6, -0.1]);
  shinNode.addChild(footNode);

  const clawSideMesh = new Mesh(gl, Primitives.createCone(0.2, 0.5, 16));
  const clawCenterMesh = new Mesh(gl, Primitives.createCone(0.22, 0.6, 16));

  const clawNode1 = new SceneNode(clawSideMesh, cfg.colors.white);
  mat4.translate(clawNode1.localTransform, clawNode1.localTransform, [-0.3, 0.2, -0.8]);
  mat4.rotate(clawNode1.localTransform, clawNode1.localTransform, Math.PI / 9, [0, 1, 0]);
  footNode.addChild(clawNode1);

  const clawNode2 = new SceneNode(clawSideMesh, cfg.colors.white);
  mat4.translate(clawNode2.localTransform, clawNode2.localTransform, [0.3, 0.2, -0.8]);
  mat4.rotate(clawNode2.localTransform, clawNode2.localTransform, -Math.PI / 9, [0, 1, 0]);
  footNode.addChild(clawNode2);

  const clawNode3 = new SceneNode(clawCenterMesh, cfg.colors.white);
  mat4.translate(clawNode3.localTransform, clawNode3.localTransform, [0.0, 0.2, -0.9]);
  footNode.addChild(clawNode3);

  return legRoot;
}

/**
 * Membuat kedua tangan Gabite, menggunakan kode persis dari Garchomp.
 * @param {WebGLRenderingContext} gl - Konteks WebGL.
 * @returns {SceneNode} Node root yang berisi kedua tangan.
 */
function createGabiteArm(gl) {
  const cfg = GabiteAnatomy; // Menggunakan anatomi Gabite untuk warna
  const armRoot = new SceneNode();

  const upperArmMesh = new Mesh(gl, Primitives.createEllipsoid(0.5, 1.9, 0.5, 32, 32));
  const forearmMesh = new Mesh(gl, Primitives.createEllipsoid(0.4, 1.6, 0.5, 32, 32));

  // ================== LENGAN KANAN (patokan) ==================
  const rightUpper = new SceneNode(upperArmMesh, cfg.colors.darkBlue);
  mat4.translate(rightUpper.localTransform, rightUpper.localTransform, [1.5, -1.0, 0.5]);
  // T-pose kanan
  mat4.rotate(rightUpper.localTransform, rightUpper.localTransform, Math.PI / 2, [0, 0, 1]);
  mat4.rotate(rightUpper.localTransform, rightUpper.localTransform, -Math.PI / 12, [0, 1, 0]);
  armRoot.addChild(rightUpper);

  const rightFore = new SceneNode(forearmMesh, cfg.colors.darkBlue);
  mat4.translate(rightFore.localTransform, rightFore.localTransform, [0, -1.7, 0]);
  rightUpper.addChild(rightFore);

  // ================== LENGAN KIRI (mirror dari kanan) ==================
  const leftUpper = new SceneNode(upperArmMesh, cfg.colors.darkBlue);
  mat4.translate(leftUpper.localTransform, leftUpper.localTransform, [-1.5, -1.0, 0.5]);
  // T-pose kiri (mirror sumbu-Z) + Y harus KEBALIKAN dari kanan
  mat4.rotate(leftUpper.localTransform, leftUpper.localTransform, -Math.PI / 2, [0, 0, 1]);
  mat4.rotate(leftUpper.localTransform, leftUpper.localTransform, +Math.PI / 12, [0, 1, 0]); // <-- FIX mirror
  armRoot.addChild(leftUpper);

  const leftFore = new SceneNode(forearmMesh, cfg.colors.darkBlue);
  mat4.translate(leftFore.localTransform, leftFore.localTransform, [0, -1.7, 0]);
  leftUpper.addChild(leftFore);

  // ============== MINI SAIL (CAKAR) ==============
  const finW = 0.6, finH = 0.7, topBulge = 0.12, bottomBulge = 0.18, leftBulge = 0.1;
  const finSegU = 24, finSegV = 10, finT = 0.2;
  const finGeom = Curves.createSailCoons3D(finW, finH, topBulge, bottomBulge, leftBulge, finSegU, finSegV, finT);
  const finMesh = new Mesh(gl, finGeom);

  const wristOffset = -(1.6 + 0.08);

  // --- KIRI (anak leftFore)
  const leftFin = new SceneNode(finMesh, cfg.colors.white);
  mat4.translate(leftFin.localTransform, leftFin.localTransform, [-0.1, wristOffset + 0.6, 0]);
  mat4.rotate(leftFin.localTransform, leftFin.localTransform, Math.PI / 1, [0, 0, 1]);
  mat4.scale(leftFin.localTransform, leftFin.localTransform, [0.9, 2.5, 0.9]);
  leftFore.addChild(leftFin);

  // --- KANAN (anak rightFore)
  const rightFin = new SceneNode(finMesh, cfg.colors.white);
  mat4.translate(rightFin.localTransform, rightFin.localTransform, [0.1, wristOffset + 0.6, 0]);
  mat4.rotate(rightFin.localTransform, rightFin.localTransform, Math.PI / 1, [0, 0, -1]);
  mat4.scale(rightFin.localTransform, rightFin.localTransform, [-0.9, 2.5, 0.9]); // mirror di X
  rightFore.addChild(rightFin);

  // ============== SAIL (layar) sebagai anak forearm ==============
  const sailGeom = Curves.createSail(2, 3, 0.4, 64);
  const sailMesh = new Mesh(gl, sailGeom);

  // --- Sail kanan (anak rightFore)
  const rightSail = new SceneNode(sailMesh, cfg.colors.darkBlue);
  mat4.translate(rightSail.localTransform, rightSail.localTransform, [0.1, -1.2, 0]);
  mat4.rotate(rightSail.localTransform, rightSail.localTransform, Math.PI / 2, [1, 0, 0]);
  mat4.rotate(rightSail.localTransform, rightSail.localTransform, Math.PI / 2, [0, 1, 0]);
  rightFore.addChild(rightSail);

  // --- Sail kiri (anak leftFore)
  const leftSail = new SceneNode(sailMesh, cfg.colors.darkBlue);
  mat4.translate(leftSail.localTransform, leftSail.localTransform, [-0.1, -1.2, 0]); // mirror X
  // kalau bentuk sail asimetris dan masih kelihatan beda, aktifkan baris scale di bawah:
  mat4.scale(leftSail.localTransform, leftSail.localTransform, [-1, 1, 1]);
  mat4.rotate(leftSail.localTransform, leftSail.localTransform, Math.PI / 2, [1, 0, 0]);
  mat4.rotate(leftSail.localTransform, leftSail.localTransform, Math.PI / 2, [0, 1, 0]);
  leftFore.addChild(leftSail);

  return armRoot;
}
