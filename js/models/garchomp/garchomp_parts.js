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
  mat4.translate(spikeNode.localTransform, spikeNode.localTransform, [0 , -0.7, -0.8]);
  mat4.rotate(spikeNode.localTransform, spikeNode.localTransform, -Math.PI / 10, [1, 0, 0]);
  thighNode.addChild(spikeNode);

  const shinMesh = new Mesh(gl, Primitives.createCapsule(0.5, 0.8, 32));
  const shinNode = new SceneNode(shinMesh, cfg.colors.darkBlue);
  mat4.translate(shinNode.localTransform, shinNode.localTransform, [0, -1.0, -0.3]);
  thighNode.addChild(shinNode);

  const footMesh = new Mesh(gl, Primitives.createEllipsoid(0.7, 0.3, 0.9, 32, 32));
  const footNode = new SceneNode(footMesh, cfg.colors.darkBlue);
  mat4.translate(footNode.localTransform, footNode.localTransform, [0, -1.5, -0.5]);
  shinNode.addChild(footNode);

  const clawSideMesh = new Mesh(gl, Primitives.createCone(0.2, 0.5, 16));
  const clawCenterMesh = new Mesh(gl, Primitives.createCone(0.22, 0.6, 16));

  const clawNode1 = new SceneNode(clawSideMesh, cfg.colors.white);
  mat4.translate(clawNode1.localTransform, clawNode1.localTransform, [-0.3, -0.2, -0.8]);
  mat4.rotate(clawNode1.localTransform, clawNode1.localTransform, Math.PI / 9, [0, 1, 0]);
  footNode.addChild(clawNode1);

  const clawNode2 = new SceneNode(clawSideMesh, cfg.colors.white);
  mat4.translate(clawNode2.localTransform, clawNode2.localTransform, [0.3, -0.2, -0.8]);
  mat4.rotate(clawNode2.localTransform, clawNode2.localTransform, -Math.PI / 9, [0, 1, 0]);
  footNode.addChild(clawNode2);
  
  const clawNode3 = new SceneNode(clawCenterMesh, cfg.colors.white);
  mat4.translate(clawNode3.localTransform, clawNode3.localTransform, [0.0, -0.2, -0.9]);
  footNode.addChild(clawNode3);

  return legRoot;
} 

/**
 * Membuat kedua tangan Gabite, diadaptasi dari struktur Garchomp.
 * @param {WebGLRenderingContext} gl - Konteks WebGL.
 * @returns {SceneNode} Node root yang berisi kedua tangan.
 */
function createGabiteArm(gl) {
  const cfg = GabiteAnatomy;
  const armRoot = new SceneNode();

  const upperArmMesh = new Mesh(gl, Primitives.createEllipsoid(0.4, 0.9, 0.4, 24, 24));
  const forearmMesh = new Mesh(gl, Primitives.createEllipsoid(0.35, 0.8, 0.4, 24, 24));
  
  const finGeom = Curves.createSailCoons3D(1.2, 0.8, 0.1, 0.15, 0.05, 16, 10, 0.15);
  const finMesh = new Mesh(gl, finGeom);

  // ================== LENGAN KANAN ==================
  const rightUpper = new SceneNode(upperArmMesh, cfg.colors.darkBlue);
  mat4.translate(rightUpper.localTransform, rightUpper.localTransform, [1.6, -1.2, 0.2]);
  mat4.rotate(rightUpper.localTransform, rightUpper.localTransform, -Math.PI / 4, [1, 0, 0]);
  mat4.rotate(rightUpper.localTransform, rightUpper.localTransform, Math.PI / 4, [0, 0, 1]);
  armRoot.addChild(rightUpper);

  const rightFore = new SceneNode(forearmMesh, cfg.colors.darkBlue);
  mat4.translate(rightFore.localTransform, rightFore.localTransform, [0, -1.3, 0]);
  rightUpper.addChild(rightFore);

  const rightFin = new SceneNode(finMesh, cfg.colors.white);
  const wristOffsetRight = -0.6; 
  mat4.translate(rightFin.localTransform, rightFin.localTransform, [0.1, wristOffsetRight, 0]);
  mat4.rotate(rightFin.localTransform, rightFin.localTransform, -Math.PI / 2, [0, 0, 1]);
  mat4.rotate(rightFin.localTransform, rightFin.localTransform, Math.PI / 12, [0, 0, -1]);
  rightFore.addChild(rightFin);

  // ================== LENGAN KIRI (mirror dari kanan) ==================
  const leftUpper = new SceneNode(upperArmMesh, cfg.colors.darkBlue);
  mat4.translate(leftUpper.localTransform, leftUpper.localTransform, [-1.6, -1.2, 0.2]);
  mat4.rotate(leftUpper.localTransform, leftUpper.localTransform, -Math.PI / 4, [1, 0, 0]);
  mat4.rotate(leftUpper.localTransform, leftUpper.localTransform, -Math.PI / 4, [0, 0, 1]);
  armRoot.addChild(leftUpper);
  
  const leftFore = new SceneNode(forearmMesh, cfg.colors.darkBlue);
  mat4.translate(leftFore.localTransform, leftFore.localTransform, [0, -1.3, 0]);
  leftUpper.addChild(leftFore);

  const leftFin = new SceneNode(finMesh, cfg.colors.white);
  const wristOffsetLeft = -0.6;
  mat4.translate(leftFin.localTransform, leftFin.localTransform, [-0.1, wristOffsetLeft, 0]);
  mat4.rotate(leftFin.localTransform, leftFin.localTransform, Math.PI / 2, [0, 0, 1]);
  mat4.rotate(leftFin.localTransform, leftFin.localTransform, -Math.PI, [0, 1, 0]);
  mat4.rotate(leftFin.localTransform, leftFin.localTransform, Math.PI / 12, [0, 0, -1]);
  leftUpper.addChild(leftFin);

  return armRoot;
}

