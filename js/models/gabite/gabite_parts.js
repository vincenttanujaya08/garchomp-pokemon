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
    const mainBodyMesh = new Mesh(gl, Primitives.createEllipsoid(0.95, 1.8, 1.2, 32, 32));
    const mainBodyNode = new SceneNode(mainBodyMesh, cfg.colors.red);
    mat4.translate(mainBodyNode.localTransform, mainBodyNode.localTransform, [0, -2.0, 0]);
    mat4.rotate(mainBodyNode.localTransform, mainBodyNode.localTransform, Math.PI / 12, [1, 0, 0]);
    bodyRoot.addChild(mainBodyNode);

    const backMesh = new Mesh(gl, Primitives.createEllipsoid(1.1, 1.9, 1, 32, 32));
    const backNode = new SceneNode(backMesh, cfg.colors.darkBlue);
    mat4.translate(backNode.localTransform, backNode.localTransform, [0, -2.0, 0.4]);
    mat4.rotate(backNode.localTransform, backNode.localTransform, Math.PI / 12, [1, 0, 0]);
    bodyRoot.addChild(backNode);


    // --- EKOR DENGAN KURVA BEZIER (lebih kurus & lebih pendek) ---
    const p0 = [0, -2.8, 1.0];
    const p1 = [0, -2.9, 2.7];
    const p2 = [0, -2.6, 2.9];
    const p3 = [0, -2.6, 4.2];

    const pathSegments = 18;
    const path = [];
    const scaleFactors = [];

    const tailBaseRadius = 0.85;
    const baseScale = 1;
    const tipScale  = 0.05;
    const k         = 0.65;

    for (let i = 0; i <= pathSegments; i++) {
      const t = i / pathSegments;
      path.push(Curves.getBezierPoint(t, p0, p1, p2, p3));
      const s = tipScale + (baseScale - tipScale) * Math.pow(1 - t, k);
      scaleFactors.push(s);
    }

    const tailMesh = new Mesh(gl, Primitives.createTubeFromPath(path, tailBaseRadius, 16, scaleFactors));
    const tailNode = new SceneNode(tailMesh, cfg.colors.darkBlue);
    mat4.scale(tailNode.localTransform, tailNode.localTransform, [1, 1, 1]);
    bodyRoot.addChild(tailNode);

    // --- KAKI LENGKAP ---
    const leftLeg = createGabiteLeg(gl);
    mat4.translate(leftLeg.localTransform, leftLeg.localTransform, [-1.2, -3.2, 0.3]);
    mat4.rotate(leftLeg.localTransform, leftLeg.localTransform, Math.PI / 24, [0, 1, 0]);
    bodyRoot.addChild(leftLeg);

    const rightLeg = createGabiteLeg(gl);
    mat4.translate(rightLeg.localTransform, rightLeg.localTransform, [1.2, -3.2, 0.3]);
    mat4.rotate(rightLeg.localTransform, rightLeg.localTransform, -Math.PI / 24, [0, 1, 0]);
    bodyRoot.addChild(rightLeg);

    // --- TANGAN (mengarah ke depan, siku jelas) ---
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

    const thighMesh = new Mesh(gl, Primitives.createEllipsoid(0.7, 1.3, 1.0, 32, 32));
    const thighNode = new SceneNode(thighMesh, cfg.colors.darkBlue);
    mat4.rotate(thighNode.localTransform, thighNode.localTransform, Math.PI / 15, [1, 0, 0]);
    legRoot.addChild(thighNode);

    const spikeMesh = new Mesh(gl, Primitives.createCone(0.1, 1, 16));
    const spikeNode = new SceneNode(spikeMesh, cfg.colors.white);
    mat4.translate(spikeNode.localTransform, spikeNode.localTransform, [0, 0.3, -1]);
    mat4.rotate(spikeNode.localTransform, spikeNode.localTransform, 1, [-1, 0, 0]);
    mat4.scale(spikeNode.localTransform, spikeNode.localTransform, [1, 1, 6]);
    thighNode.addChild(spikeNode);

    const spikeMesh2 = new Mesh(gl, Primitives.createCone(0.1, 1, 16));
    const spikeNode2 = new SceneNode(spikeMesh, cfg.colors.white);
    mat4.translate(spikeNode2.localTransform, spikeNode2.localTransform, [0, -0.3, -1]);
    mat4.rotate(spikeNode2.localTransform, spikeNode2.localTransform, 1.3, [-1, 0, 0]);
    mat4.scale(spikeNode2.localTransform, spikeNode2.localTransform, [0.5, 0.5, 3]);
    thighNode.addChild(spikeNode2);

    // --- PERUBAHAN: Mengganti Capsule dengan Hyperboloid of One Sheet ---
    // Memberikan bentuk yang lebih melengkung dan natural pada tulang kering.
    const shinMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(0.4, 0.4, 0.6, 0.9, 16, 16));
    const shinNode = new SceneNode(shinMesh, cfg.colors.darkBlue);
    mat4.translate(shinNode.localTransform, shinNode.localTransform, [0, -1.0, -0.3]);
    thighNode.addChild(shinNode);

    const footMesh = new Mesh(gl, Primitives.createEllipsoid(0.6, 0.3, 0.9, 32, 32));
    const footNode = new SceneNode(footMesh, cfg.colors.darkBlue);
    mat4.translate(footNode.localTransform, footNode.localTransform, [0, -0.6, -0.1]);
    shinNode.addChild(footNode);

    const clawSideMesh = new Mesh(gl, Primitives.createCone(0.2, 0.5, 16));
    const clawCenterMesh = new Mesh(gl, Primitives.createCone(0.22, 0.6, 16));

    const clawNode1 = new SceneNode(clawSideMesh, cfg.colors.white);
    mat4.translate(clawNode1.localTransform, clawNode1.localTransform, [-0.3, 0.2, -0.8]);
    mat4.rotate(clawNode1.localTransform, clawNode1.localTransform, 1, [0, 1, 0]);
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
   * Membuat kedua tangan Gabite mengarah ke depan dengan siku menekuk tajam (mirror kiri-kanan).
   */
  function createGabiteArm(gl) {
    const cfg = GabiteAnatomy;
    const armRoot = new SceneNode();

    const upperArmMesh = new Mesh(gl, Primitives.createEllipsoid(0.4, 1.3, 0.4, 32, 32));
    const forearmMesh  = new Mesh(gl, Primitives.createEllipsoid(0.4, 1.6, 0.5, 32, 32));

    // ====== parameter pose (bisa ditweak cepat) ======
    const shoulderYaw    = Math.PI / 14; // ~12.8° keluar dari dada
    const shoulderRoll   = Math.PI / 24; // ~10° turun/naik sedikit
    const elbowBend      = Math.PI / 2;  // ~60° tekuk siku (besar → sudut lebih tajam)
    const forearmYawIn   = Math.PI / 18; // ~10° yaw forearm ke dalam (ke arah tengah badan)
    const wristRoll      = Math.PI / 20; // ~9° roll wrist

    // ================== LENGAN KANAN ==================
    const rightUpper = new SceneNode(upperArmMesh, cfg.colors.darkBlue);
    mat4.translate(rightUpper.localTransform, rightUpper.localTransform, [ 1.65, -1.0, 0.40 ]);
    mat4.rotate(rightUpper.localTransform, rightUpper.localTransform,  Math.PI / 2, [0, 0, 1]);
    mat4.rotate(rightUpper.localTransform, rightUpper.localTransform, -shoulderYaw, [0, 1, 0]);
    mat4.rotate(rightUpper.localTransform, rightUpper.localTransform, -shoulderRoll, [0, 0, 1]);
    armRoot.addChild(rightUpper);

    const rightFore = new SceneNode(forearmMesh, cfg.colors.darkBlue);
    mat4.translate(rightFore.localTransform, rightFore.localTransform, [0, -1.25, -1.3]);
    mat4.rotate(rightFore.localTransform, rightFore.localTransform,  elbowBend, [1, 0, 0]);
    mat4.rotate(rightFore.localTransform, rightFore.localTransform, +forearmYawIn, [0, 1, 0]);
    mat4.rotate(rightFore.localTransform, rightFore.localTransform, -wristRoll/2, [0, 0, 1]);
    rightUpper.addChild(rightFore);

    // ================== LENGAN KIRI (mirror) ==================
    const leftUpper = new SceneNode(upperArmMesh, cfg.colors.darkBlue);
    mat4.translate(leftUpper.localTransform, leftUpper.localTransform, [ -1.65, -1.0, 0.40 ]);
    mat4.rotate(leftUpper.localTransform, leftUpper.localTransform, -Math.PI / 2, [0, 0, 1]);
    mat4.rotate(leftUpper.localTransform, leftUpper.localTransform,  +shoulderYaw, [0, 1, 0]);
    mat4.rotate(leftUpper.localTransform, leftUpper.localTransform,  +shoulderRoll, [0, 0, 1]);
    armRoot.addChild(leftUpper);

    const leftFore = new SceneNode(forearmMesh, cfg.colors.darkBlue);
    mat4.translate(leftFore.localTransform, leftFore.localTransform, [0, -1.25, -1.3]);
    mat4.rotate(leftFore.localTransform, leftFore.localTransform,  elbowBend, [1, 0, 0]);
    mat4.rotate(leftFore.localTransform, leftFore.localTransform, -forearmYawIn, [0, 1, 0]); // yaw ke dalam (kebalikan)
    mat4.rotate(leftFore.localTransform, leftFore.localTransform, +wristRoll/2, [0, 0, 1]);
    leftUpper.addChild(leftFore);

    // ============== MINI SAIL (CAKAR) ==============
    const finW = 0.6, finH = 0.7, topBulge = 0.12, bottomBulge = 0.18, leftBulge = 0.1;
    const finSegU = 24, finSegV = 10, finT = 0.2;
    const finGeom = Curves.createSailCoons3D(finW, finH, topBulge, bottomBulge, leftBulge, finSegU, finSegV, finT);
    const finMesh = new Mesh(gl, finGeom);
    const wristOffset = -(1.6 + 0.08);

    // KIRI (anak leftFore)
    const leftFin = new SceneNode(finMesh, cfg.colors.white);
    mat4.translate(leftFin.localTransform, leftFin.localTransform, [-0.1, wristOffset + 0.55, 0]);
    mat4.rotate(leftFin.localTransform, leftFin.localTransform, Math.PI + wristRoll, [0, 0, 1]);
    mat4.scale(leftFin.localTransform, leftFin.localTransform, [0.9, 2.5, 0.9]);
    leftFore.addChild(leftFin);

    // KANAN (anak rightFore)
    const rightFin = new SceneNode(finMesh, cfg.colors.white);
    mat4.translate(rightFin.localTransform, rightFin.localTransform, [ 0.1, wristOffset + 0.55, 0 ]);
    mat4.rotate(rightFin.localTransform, rightFin.localTransform, Math.PI - wristRoll, [0, 0, -1]);
    mat4.scale(rightFin.localTransform, rightFin.localTransform, [-0.9, 2.5, 0.9]); // mirror X
    rightFore.addChild(rightFin);

    // ============== SAIL (sirip) sebagai anak forearm ==============
    const sailGeom = Curves.createSail(2, 3, 0.4, 64);
    const sailMesh  = new Mesh(gl, sailGeom);

    // Sail kanan
    const rightSail = new SceneNode(sailMesh, cfg.colors.darkBlue);
    mat4.translate(rightSail.localTransform, rightSail.localTransform, [0.1, -1.2, 0]);
    mat4.rotate(rightSail.localTransform, rightSail.localTransform, Math.PI / 2, [1, 0, 0]);
    mat4.rotate(rightSail.localTransform, rightSail.localTransform, Math.PI / 2, [0, 1, 0]);
    mat4.rotate(rightSail.localTransform, rightSail.localTransform, -wristRoll/2, [0, 0, 1]);
    rightFore.addChild(rightSail);

    // Sail kiri
    const leftSail = new SceneNode(sailMesh, cfg.colors.darkBlue);
    mat4.translate(leftSail.localTransform, leftSail.localTransform, [-0.1, -1.2, 0]);
    mat4.scale(leftSail.localTransform, leftSail.localTransform, [-1, 1, 1]); // simetri bentuk
    mat4.rotate(leftSail.localTransform, leftSail.localTransform, Math.PI / 2, [1, 0, 0]);
    mat4.rotate(leftSail.localTransform, leftSail.localTransform, Math.PI / 2, [0, 1, 0]);
    mat4.rotate(leftSail.localTransform, leftSail.localTransform, +wristRoll/2, [0, 0, 1]);
    leftFore.addChild(leftSail);

    return armRoot;
  }

  /**
   * Membuat kepala Gabite menggunakan kurva Bezier untuk bentuk yang lebih lancip.
   * @param {WebGLRenderingContext} gl - Konteks WebGL.
   * @returns {SceneNode} Node root untuk kepala.
   */
  function createGabiteHead(gl) {
    const cfg = GabiteAnatomy;
    const headRoot = new SceneNode();

    // --- BENTUK KEPALA UTAMA (Menggunakan Ellipsoid) ---
    const headMesh = new Mesh(gl, Primitives.createEllipsoid(1.0, 1.0, 1.5, 32, 32)); // radiusX, radiusY, radiusZ
    const headNode = new SceneNode(headMesh, cfg.colors.darkBlue);
    
    mat4.translate(headRoot.localTransform, headRoot.localTransform, [0, 0.6, -0.5]);
    // Posisikan kepala
    mat4.translate(headNode.localTransform, headNode.localTransform, [0, 0.4, 0.1]);
    mat4.rotate(headNode.localTransform, headNode.localTransform, -Math.PI / 15, [1, 0, 0]); // Miringkan sedikit
    headRoot.addChild(headNode);
    
    // --- SIRIP SISI (JET) ---
    const finMesh = new Mesh(gl, Primitives.createEllipsoid(0.5, 0.5, 1.2, 24, 24)); // Lebih pipih dan panjang
    
    const leftFinNode = new SceneNode(finMesh, cfg.colors.darkBlue);
    mat4.translate(leftFinNode.localTransform, leftFinNode.localTransform, [-1.3, 0.2, 0.1]); 
    headNode.addChild(leftFinNode);
    
    // Garis Putih Sirip Kiri
    const stripeMesh = new Mesh(gl, Primitives.createCylinder(0.3, 0.25, 16)); 
    const leftStripeNode = new SceneNode(stripeMesh, cfg.colors.white);
    mat4.translate(leftStripeNode.localTransform, leftStripeNode.localTransform, [0, 0, 0]); 
    mat4.rotate(leftStripeNode.localTransform, leftStripeNode.localTransform, Math.PI/2, [1,0,0]);
    mat4.scale(leftStripeNode.localTransform, leftStripeNode.localTransform, [1.7, 1, 1.7]); 
    leftFinNode.addChild(leftStripeNode);

    const rightFinNode = new SceneNode(finMesh, cfg.colors.darkBlue);
    mat4.translate(rightFinNode.localTransform, rightFinNode.localTransform, [1.3, 0.2, 0.1]);
    headNode.addChild(rightFinNode);
    
    // Garis Putih Sirip Kanan
    const rightStripeNode = new SceneNode(stripeMesh, cfg.colors.white);
    mat4.translate(rightStripeNode.localTransform, rightStripeNode.localTransform, [0, 0, 0]);
    mat4.rotate(rightStripeNode.localTransform, rightStripeNode.localTransform, Math.PI/2, [1,0,0]);
    mat4.scale(rightStripeNode.localTransform, rightStripeNode.localTransform, [1.7, 1, 1.7]);
    rightFinNode.addChild(rightStripeNode);

    const headMesh2 = new Mesh(gl, Primitives.createEllipsoid(1.0, 1.0, 1.5, 32, 32)); // radiusX, radiusY, radiusZ
    const headNode2 = new SceneNode(headMesh2, cfg.colors.red);

    // Posisikan kepala
    mat4.translate(headNode2.localTransform, headNode2.localTransform, [0, 0.1, -0.1])
    mat4.scale(headNode2.localTransform, headNode2.localTransform, [0.9, 0.8, 0.7]);
    mat4.rotate(headNode2.localTransform, headNode2.localTransform, -Math.PI / 15, [1, 0, 0]); // Miringkan sedikit
    headRoot.addChild(headNode2);

    const toothMesh = new Mesh(gl, Primitives.createCone(0.1, 0.3, 8));
    const leftToothNode = new SceneNode(toothMesh, cfg.colors.white); 
    mat4.translate(leftToothNode.localTransform, leftToothNode.localTransform, [0.78, -0.5, -0.7]);
    mat4.rotate(leftToothNode.localTransform, leftToothNode.localTransform, 2.77, [0, 0, -1]);
    headNode.addChild(leftToothNode);

    const leftToothNode2 = new SceneNode(toothMesh, cfg.colors.white); 
    mat4.translate(leftToothNode2.localTransform, leftToothNode2.localTransform, [0.74, -0.5, -0.8]);
    mat4.rotate(leftToothNode2.localTransform, leftToothNode2.localTransform, 2.77, [0, 0, -1]);
    headNode.addChild(leftToothNode2);

    const rightToothNode = new SceneNode(toothMesh, cfg.colors.white); 
    mat4.translate(rightToothNode.localTransform, rightToothNode.localTransform, [-0.78, -0.5, -0.7]);
    mat4.rotate(rightToothNode.localTransform, rightToothNode.localTransform, 2.77, [0, 0, 1]);
    headNode.addChild(rightToothNode);

    const rightToothNode2 = new SceneNode(toothMesh, cfg.colors.white); 
    mat4.translate(rightToothNode2.localTransform, rightToothNode2.localTransform, [-0.74, -0.5, -0.8]);
    mat4.rotate(rightToothNode2.localTransform, rightToothNode2.localTransform, 2.77, [0, 0, 1]);
    headNode.addChild(rightToothNode2);

    // ============== MATA (patch hitam, iris kuning, pupil vertikal) ==============
    // Torus sederhana via lathe untuk iris
    function createTorusGeometry(R, r, segProfile = 48, segRevolve = 48) {
      const profile = [];
      for (let i = 0; i <= segProfile; i++) {
        const a = (i / segProfile) * 2 * Math.PI;
        profile.push([R + r * Math.cos(a), r * Math.sin(a)]);
      }
      return Primitives.createLathe(profile, segRevolve);
    }

    function createGabiteEye(gl, side = 1) {
      const eyeRoot = new SceneNode();

      // Patch mata (sclera gelap) berbentuk almond
      const patchMesh = new Mesh(gl, Primitives.createEllipsoid(0.55, 0.33, 0.08, 24, 24));
      const patchNode = new SceneNode(patchMesh, cfg.colors.black);
      mat4.scale(patchNode.localTransform, patchNode.localTransform, [1.0, 1.0, 0.5]);
      mat4.translate(patchNode.localTransform, patchNode.localTransform, [0, 0, -0.03]); // sedikit masuk agar menempel
      eyeRoot.addChild(patchNode);

      // Iris cincin kuning
      const irisGeom = createTorusGeometry(0.18, 0.045, 40, 40);
      const irisMesh = new Mesh(gl, irisGeom);
      const irisNode = new SceneNode(irisMesh, cfg.colors.yellow);
      mat4.rotate(irisNode.localTransform, irisNode.localTransform, Math.PI / 2, [0, 0, 1]);
      mat4.rotate(irisNode.localTransform, irisNode.localTransform, Math.PI / 2, [1, 0, 0]);
      mat4.scale(irisNode.localTransform, irisNode.localTransform, [1.0, 1.0, 0.5]);
      mat4.translate(irisNode.localTransform, irisNode.localTransform, [0, 0, 0.04]);
      eyeRoot.addChild(irisNode);

      // Pupil vertikal
      const pupilMesh = new Mesh(gl, Primitives.createEllipsoid(0.06, 0.20, 0.03, 18, 18));
      const pupilNode = new SceneNode(pupilMesh, cfg.colors.black);
      mat4.translate(pupilNode.localTransform, pupilNode.localTransform, [0, 0, 0.05]);
      eyeRoot.addChild(pupilNode);

      // Posisi dan orientasi: miring dan menempel pada ellipsoid kepala
      // Tempatkan pada sisi ellipsoid (x mendekati radiusX, z di permukaan depan)
      const yawOut = side * 1.2;          // ~69°: arahkan normal ke samping-depan
      const pitch = -Math.PI / 18;        // ~10°: sedikit miring ke belakang
      const roll = -side * (Math.PI / 8); // bentuk almond condong
      mat4.translate(eyeRoot.localTransform, eyeRoot.localTransform, [side * 0.85, -0.02, -0.80]);
      // Arahkan +Z mata ke arah normal lokal permukaan kepala
      mat4.rotate(eyeRoot.localTransform, eyeRoot.localTransform, yawOut, [0, 1, 0]);
      mat4.rotate(eyeRoot.localTransform, eyeRoot.localTransform, pitch, [1, 0, 0]);
      mat4.rotate(eyeRoot.localTransform, eyeRoot.localTransform, roll, [0, 0, 1]);

      return eyeRoot;
    }

    // Pasang mata kiri dan kanan
    headNode.addChild(createGabiteEye(gl, +1));
    headNode.addChild(createGabiteEye(gl, -1));

    
    return headRoot;
  }

  function createGabiteNeck(gl) {

  const cfg = GabiteAnatomy;
  // --- MESH ---
  // Menggunakan Hyperboloid of 1 Sheet untuk bentuk leher yang organik
  const neckMesh = new Mesh(
    gl,
    Primitives.createHyperboloidOneSheet(
      0.6, // radiusX di bagian terlebar
      0.6, // radiusZ di bagian terlebar
      0.4, // pinchY (seberapa "ramping" di tengah)
      1.0, // height (panjang leher)
      16, // latitudeBands (segmen vertikal)
      16 // longitudeBands (segmen horizontal)
    )
  );

  const neckMesh2 = new Mesh(
    gl,
    Primitives.createHyperboloidOneSheet(
      0.6, // radiusX di bagian terlebar
      0.6, // radiusZ di bagian terlebar
      0.4, // pinchY (seberapa "ramping" di tengah)
      1.0, // height (panjang leher)
      16, // latitudeBands (segmen vertikal)
      16 // longitudeBands (segmen horizontal)
    )
  );

  // --- NODE ---
  const neckNode = new SceneNode(neckMesh, cfg.colors.darkBlue);
  const neckNode2 = new SceneNode(neckMesh2, cfg.colors.red);

  neckNode.addChild(neckNode2);

  // --- TRANSFORMASI ---
  // Sedikit memiringkan leher ke depan
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

function createGabiteFin(gl) {
    const cfg = GabiteAnatomy;

    // Koordinat 2D dari GeoGebra, diinterpretasikan di bidang XZ.
    const finShapePoints2D = [
      [2.8, 0.27], [0.68, 1.61], [1.56, 2.55], [2.32, 3.31],
      [3.04, 3.87], [3.78, 4.39], [4.4, 4.81], 
      [5.16, 5.13], [6.02, 5.49], [5.66, 4.45], [4.7, 2.57],
      [3.66, 0.63], [3.06, 0.9], [4.1, 1.9], [3, -0.1]
    ];

    // Menentukan pusat dan skala agar sesuai dengan model
    const centerX = 3.35;
    const centerZ = 2.75;
    const scale = 0.6;

    // Proses koordinat: ubah ke 3D (XZ), pusatkan, dan skalakan
    const processedPoints = finShapePoints2D.map(p => [
        (p[0] - centerX) * scale,
        0,
        (p[1] - centerZ) * scale
    ]);

    // Buat geometri 3D dengan mengekstrusi bentuk 2D
    const finGeom = Primitives.createExtrudedShape(processedPoints, 0.1, 1.0, 0.95); // Ketebalan 0.25
    const finMesh = new Mesh(gl, finGeom);
    
    const finNode = new SceneNode(finMesh, cfg.colors.darkBlue);
    mat4.translate(finNode.localTransform, finNode.localTransform, [0.1, -0.4, 2.5]);
    mat4.rotate(finNode.localTransform, finNode.localTransform, 1.56, [0, 0, -1]);
    mat4.rotate(finNode.localTransform, finNode.localTransform, 1, [0, -1, 0]);
    return finNode;
  }

