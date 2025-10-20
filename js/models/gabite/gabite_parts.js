// File: js/models/gabite/gabite_parts.js

/**
 * Membuat satu unit kaki Gabite yang lengkap (paha, betis, kaki, cakar).
 * @param {WebGLRenderingContext} gl - Konteks WebGL.
 * @returns {SceneNode} Node root untuk satu kaki.
 */



// MENGGUNAKAN FUNGSI createGabiteBody YANG ANDA BERIKAN
function createGabiteBody(gl) {
  const cfg = GabiteAnatomy;
  const bodyRoot = new SceneNode();

  // --- BENTUK TUBUH DARI KODE ANDA ---
  const mainBodyMesh = new Mesh(gl, Primitives.createEllipsoid(1.4, 1.8, 1.2, 32, 32));
  const mainBodyNode = new SceneNode(mainBodyMesh, cfg.colors.red); // Warna diubah ke cream untuk perut
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

  // --- EKOR BARU DENGAN KURVA BEZIER (MENGGANTIKAN CONE LAMA) ---
  
  // 1. Definisikan titik kontrol untuk kurva ekor yang lebih landai
  const p0 = [0, -2.5, 1.0];  // Start: Belakang pinggul
  const p1 = [0, -2.8, 3.5];  // Control 1: Dibuat lebih rendah agar tidak terlalu naik
  const p2 = [0, -2.2, 3.5];  // Control 2: Jauh ke belakang dan tetap rendah
  const p3 = [0, -2.2, 5.0];  // End: Ujung ekor yang panjang dan tidak terlalu naik
  
  // 2. Buat path (jalur) dan faktor skala di sepanjang kurva
  const pathSegments = 20;
  const path = [];
  const scaleFactors = [];
  for (let i = 0; i <= pathSegments; i++) {
    const t = i / pathSegments;
    path.push(Curves.getBezierPoint(t, p0, p1, p2, p3));
    scaleFactors.push(1.0 - t); // Meruncing secara linear
  }

  // 3. Buat mesh "Tube" untuk ekor dari path yang sudah dibuat
  const tailMesh = new Mesh(gl, Primitives.createTubeFromPath(path, 1.2, 16, scaleFactors));
  const tailNode = new SceneNode(tailMesh, cfg.colors.darkBlue);
  bodyRoot.addChild(tailNode);


  // --- KAKI LENGKAP (MENGGANTIKAN PANGKAL PAHA LAMA) ---
  
  // Kaki Kiri
  const leftLeg = createGabiteLeg(gl);
  // Posisikan agar menempel pada torso/pinggul
  mat4.translate(leftLeg.localTransform, leftLeg.localTransform, [-1.4, -3.2, 0.3]);
  mat4.rotate(leftLeg.localTransform, leftLeg.localTransform, Math.PI / 24, [0, 1, 0]);
  bodyRoot.addChild(leftLeg);

  // Kaki Kanan
  const rightLeg = createGabiteLeg(gl);
  mat4.translate(rightLeg.localTransform, rightLeg.localTransform, [1.4, -3.2, 0.3]);
  mat4.rotate(rightLeg.localTransform, rightLeg.localTransform, -Math.PI / -24, [0, 1, 0]);
  bodyRoot.addChild(rightLeg);



  return bodyRoot;

  function createGabiteLeg(gl) {
  const cfg = GabiteAnatomy;
  const legRoot = new SceneNode();

  // 1. Paha Atas (Thigh) - Bentuk berotot sesuai referensi
  const thighMesh = new Mesh(gl, Primitives.createEllipsoid(0.8, 1.3, 1.0, 32, 32));
  const thighNode = new SceneNode(thighMesh, cfg.colors.darkBlue);
  mat4.translate(thighNode.localTransform, thighNode.localTransform, [0, 0, 0]);
  legRoot.addChild(thighNode);
  mat4.rotate(thighNode.localTransform, thighNode.localTransform, Math.PI / 15, [1, 0, 0]);
  legRoot.addChild(thighNode);

  // 2. Duri Lutut (Knee Spike)
  const spikeMesh = new Mesh(gl, Primitives.createCone(0.3, 0.9, 16));
  const spikeNode = new SceneNode(spikeMesh, cfg.colors.white);
  mat4.translate(spikeNode.localTransform, spikeNode.localTransform, [0 , -0.7, -0.8]);
  mat4.rotate(spikeNode.localTransform, spikeNode.localTransform, -Math.PI / 10, [1, 0, 0]);
  legRoot.addChild(spikeNode);

  // 3. Betis (Lower Leg)
  const shinMesh = new Mesh(gl, Primitives.createCapsule(0.5, 0.8, 32));
  const shinNode = new SceneNode(shinMesh, cfg.colors.darkBlue);
  mat4.translate(shinNode.localTransform, shinNode.localTransform, [0, -1.0, -0.3]);
  legRoot.addChild(shinNode);

  // 4. Telapak Kaki (Foot)
  const footMesh = new Mesh(gl, Primitives.createEllipsoid(0.7, 0.3, 0.9, 32, 32));
  const footNode = new SceneNode(footMesh, cfg.colors.darkBlue);
  mat4.translate(footNode.localTransform, footNode.localTransform, [0, -1.5, -0.5]);
  legRoot.addChild(footNode);

  // 5. Cakar (Claws) - Tiga cakar
  const clawSideMesh = new Mesh(gl, Primitives.createCone(0.2, 0.5, 16));
  const clawCenterMesh = new Mesh(gl, Primitives.createCone(0.22, 0.6, 16));

  const clawNode1 = new SceneNode(clawSideMesh, cfg.colors.white);
  mat4.translate(clawNode1.localTransform, clawNode1.localTransform, [-0.3, -1.4, -1.3]);
  mat4.rotate(clawNode1.localTransform, clawNode1.localTransform, Math.PI / 9, [0, 1, 0]);
  legRoot.addChild(clawNode1);

  const clawNode2 = new SceneNode(clawSideMesh, cfg.colors.white);
  mat4.translate(clawNode2.localTransform, clawNode2.localTransform, [0.3, -1.4, -1.3]);
  mat4.rotate(clawNode2.localTransform, clawNode2.localTransform, -Math.PI / 9, [0, 1, 0]);
  legRoot.addChild(clawNode2);
  
  const clawNode3 = new SceneNode(clawCenterMesh, cfg.colors.white);
  mat4.translate(clawNode3.localTransform, clawNode3.localTransform, [0.0, -1.4, -1.3]);
  mat4.rotate(clawNode2.localTransform, clawNode2.localTransform, -Math.PI / 9, [0, 1, 0]);
  legRoot.addChild(clawNode3);

  return legRoot;
} 
}

