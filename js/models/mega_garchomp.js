/**
 * ---
 * MEGA GARCHOMP MODEL SETUP
 * ---
 * You can start by developing the torso in createMegaGarchompTorso().
 * The old head is safely stored in createMegaGarchompHead() for future use.
 */
// ---------------------------------------------------------
//  Build Neck
// ---------------------------------------------------------
function createMegaGarchompNeck(gl) {
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const reds = [0.8, 0.15, 0.1, 1.0];
  const redOrange = [0.8, 0.15, 0.1, 1.0];

  // --- MESH ---
  // Menggunakan Hyperboloid of 1 Sheet untuk bentuk leher yang organik
  const neckMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(
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
    Prm.createHyperboloidOneSheet(
      0.6, // radiusX di bagian terlebar
      0.6, // radiusZ di bagian terlebar
      0.4, // pinchY (seberapa "ramping" di tengah)
      1.0, // height (panjang leher)
      16, // latitudeBands (segmen vertikal)
      16 // longitudeBands (segmen horizontal)
    )
  );

  // --- NODE ---
  const neckNode = new SceneNode(neckMesh, darkBlue);
  const neckNode2 = new SceneNode(neckMesh2, redOrange);

  neckNode.addChild(neckNode2);

  // --- TRANSFORMASI ---
  // Sedikit memiringkan leher ke depan
  mat4.rotate(
    neckNode.localTransform,
    neckNode.localTransform,
    Math.PI / 10,
    [1, 0, 0]
  );
  mat4.scale(neckNode.localTransform, neckNode.localTransform, [0.6, 1, 0.5]);
  mat4.translate(
    neckNode.localTransform,
    neckNode.localTransform,
    [0, 2, -0.7]
  );

  mat4.rotate(
    neckNode2.localTransform,
    neckNode2.localTransform,
    Math.PI / 12,
    [1, 0, 0]
  );
  mat4.scale(
    neckNode2.localTransform,
    neckNode2.localTransform,
    [0.6, 0.7, 0.5]
  );
  mat4.translate(
    neckNode2.localTransform,
    neckNode2.localTransform,
    [0, 0.1, 1.4]
  );

  return neckNode;
}
// ---------------------------------------------------------
//  Build Lower Jaw (gajadi)
// ---------------------------------------------------------
function createMegaGarchompJaw(gl) {
  const redOrange = [0.8, 0.15, 0.1, 1.0];
  const white = [1.0, 1.0, 1.0, 1.0];
  const black = [0.1, 0.1, 0.1, 1.0]; // Warna untuk bagian dalam mulut

  // --- MESH ---
  const jawBaseMesh = new Mesh(gl, Prm.createCuboid(1, 1, 1));
  const toothMesh = new Mesh(gl, Prm.createCone(0.1, 0.3, 8));

  // BARU: Mesh untuk penutup dagu dan bagian dalam mulut
  const chinCoverMesh = new Mesh(gl, Prm.createTriangularPrism(1, 1, 1));
  const innerMouthMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));

  // --- NODE ---
  const jawRoot = new SceneNode(null);
  const jawCenter = new SceneNode(jawBaseMesh, redOrange);
  const leftJawBlock = new SceneNode(jawBaseMesh, redOrange);
  const rightJawBlock = new SceneNode(jawBaseMesh, redOrange);

  const leftJawCover = new SceneNode(jawBaseMesh, redOrange);
  const rightJawCover = new SceneNode(jawBaseMesh, redOrange);

  // BARU: Node untuk penutup dagu dan bagian dalam mulut
  const chinCoverNode = new SceneNode(chinCoverMesh, redOrange);
  const innerMouthNode = new SceneNode(innerMouthMesh, black);

  const lowerToothL1 = new SceneNode(toothMesh, white);
  const lowerToothL2 = new SceneNode(toothMesh, white);
  const lowerToothL3 = new SceneNode(toothMesh, white);
  const lowerToothR1 = new SceneNode(toothMesh, white);
  const lowerToothR2 = new SceneNode(toothMesh, white);
  const lowerToothR3 = new SceneNode(toothMesh, white);

  jawRoot.addChild(jawCenter);
  jawRoot.addChild(leftJawBlock);
  jawRoot.addChild(rightJawBlock);

  jawRoot.addChild(leftJawCover);
  jawRoot.addChild(rightJawCover);

  // BARU: Tambahkan node baru ke root rahang
  jawRoot.addChild(chinCoverNode);
  jawRoot.addChild(innerMouthNode);

  jawRoot.addChild(lowerToothL1);
  jawRoot.addChild(lowerToothL2);
  jawRoot.addChild(lowerToothL3);
  jawRoot.addChild(lowerToothR1);
  jawRoot.addChild(lowerToothR2);
  jawRoot.addChild(lowerToothR3);

  // --- TRANSFORMASI ---
  mat4.translate(
    jawRoot.localTransform,
    jawRoot.localTransform,
    [0, 0.25, 1.1]
  );

  mat4.translate(
    jawCenter.localTransform,
    jawCenter.localTransform,
    [0, 0.4, 1]
  );
  mat4.rotate(
    jawCenter.localTransform,
    jawCenter.localTransform,
    -Math.PI / 12,
    [-1, 0, 0]
  );
  mat4.scale(
    jawCenter.localTransform,
    jawCenter.localTransform,
    [0.4, 0.2, 0.6]
  );

  mat4.translate(
    leftJawBlock.localTransform,
    leftJawBlock.localTransform,
    [-0.3, 0.45, 0.3]
  );
  mat4.rotate(
    leftJawBlock.localTransform,
    leftJawBlock.localTransform,
    Math.PI / 6,
    [0, 1, 0]
  );
  mat4.scale(
    leftJawBlock.localTransform,
    leftJawBlock.localTransform,
    [0.3, 0.2, 1.5]
  );

  mat4.translate(
    rightJawBlock.localTransform,
    rightJawBlock.localTransform,
    [0.3, 0.45, 0.3]
  );
  mat4.rotate(
    rightJawBlock.localTransform,
    rightJawBlock.localTransform,
    -Math.PI / 6,
    [0, 1, 0]
  );
  mat4.scale(
    rightJawBlock.localTransform,
    rightJawBlock.localTransform,
    [0.3, 0.2, 1.5]
  );

  mat4.translate(
    leftJawCover.localTransform,
    leftJawCover.localTransform,
    [-0.8, 0.6, -0.4]
  );
  mat4.scale(
    leftJawCover.localTransform,
    leftJawCover.localTransform,
    [0.2, 0.5, 0.3]
  );

  mat4.translate(
    rightJawCover.localTransform,
    rightJawCover.localTransform,
    [0.8, 0.6, -0.4]
  );
  mat4.scale(
    rightJawCover.localTransform,
    rightJawCover.localTransform,
    [0.2, 0.5, 0.3]
  );

  // BARU: Transformasi untuk elipsoid dalam mulut
  mat4.translate(
    innerMouthNode.localTransform,
    innerMouthNode.localTransform,
    [0, 0.6, -0.6]
  );
  mat4.scale(
    innerMouthNode.localTransform,
    innerMouthNode.localTransform,
    [0.7, 0.2, 1]
  );

  // BARU: Transformasi untuk prisma segitiga di bawah dagu
  mat4.translate(
    chinCoverNode.localTransform,
    chinCoverNode.localTransform,
    [0, 0.3, 0.3]
  );
  mat4.rotate(
    chinCoverNode.localTransform,
    chinCoverNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  ); // Posisikan tidur
  mat4.scale(
    chinCoverNode.localTransform,
    chinCoverNode.localTransform,
    [1.4, 1.4, 0.05]
  ); // Geprek sangat tipis

  mat4.translate(
    lowerToothL1.localTransform,
    lowerToothL1.localTransform,
    [-0.15, 0.65, 0.58]
  );
  mat4.scale(
    lowerToothL1.localTransform,
    lowerToothL1.localTransform,
    [1, 0.7, 1]
  );

  mat4.translate(
    lowerToothL2.localTransform,
    lowerToothL2.localTransform,
    [-0.36, 0.65, 0.28]
  );
  mat4.scale(
    lowerToothL2.localTransform,
    lowerToothL2.localTransform,
    [1, 0.7, 1]
  );

  mat4.translate(
    lowerToothL3.localTransform,
    lowerToothL3.localTransform,
    [-0.6, 0.65, -0.02]
  );
  mat4.scale(
    lowerToothL3.localTransform,
    lowerToothL3.localTransform,
    [1, 0.7, 1]
  );

  mat4.translate(
    lowerToothR1.localTransform,
    lowerToothR1.localTransform,
    [0.15, 0.65, 0.58]
  );
  mat4.scale(
    lowerToothR1.localTransform,
    lowerToothR1.localTransform,
    [1, 0.7, 1]
  );

  mat4.translate(
    lowerToothR2.localTransform,
    lowerToothR2.localTransform,
    [0.4, 0.65, 0.28]
  );
  mat4.scale(
    lowerToothR2.localTransform,
    lowerToothR2.localTransform,
    [1, 0.7, 1]
  );

  mat4.translate(
    lowerToothR3.localTransform,
    lowerToothR3.localTransform,
    [0.6, 0.65, -0.02]
  );
  mat4.scale(
    lowerToothR3.localTransform,
    lowerToothR3.localTransform,
    [1, 0.7, 1]
  );

  return jawRoot;
}
// ---------------------------------------------------------
//  Build Upper Head (gajadi)
// ---------------------------------------------------------
function createMegaGarchompUpperHead(gl) {
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const yellow = [1.0, 0.84, 0.0, 1.0];
  const black = [0.1, 0.1, 0.1, 1.0];
  const white = [1.0, 1.0, 1.0, 1.0];

  // --- MESHES ---

  const rugbyProfile = [];
  const smoothness = 10;

  const p0 = [0.0, 1.8, 0];
  const p1 = [0.4, 1.2, 0];
  const p2 = [0.7, 0.5, 0];
  const p3 = [0.7, 0.0, 0];

  for (let i = 0; i <= smoothness; i++) {
    const t = i / smoothness;
    const pt = Crv.getBezierPoint(t, p0, p1, p2, p3);
    rugbyProfile.push([pt[0], pt[1]]);
  }

  for (let i = smoothness - 1; i >= 0; i--) {
    const pt = rugbyProfile[i];
    if (Math.abs(pt[1]) > 0.0001) {
      rugbyProfile.push([pt[0], -pt[1]]);
    }
  }

  const rugbyMesh = new Mesh(
    gl,
    Crv.createSurfaceOfRevolution(rugbyProfile, 32)
  );

  const connectorMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.5, 0.5, 0.4, 1.0, 16, 16)
  );

  const nosePrismMesh = new Mesh(gl, Prm.createTriangularPrism(0.4, 0.7, 0.2));

  const underJawMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));

  const eyeMesh = new Mesh(gl, Prm.createTrapezoidalPrism(0.5, 0.3, 0.8, 0.2));

  const pupilMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 16, 16));

  const retinaMesh = pupilMesh;

  const toothMesh = new Mesh(gl, Prm.createCone(0.1, 0.3, 8));

  // BARU: Mesh untuk tanduk depan
  const hornMesh = new Mesh(gl, Prm.createCone(0.6, 1, 4));

  // --- NODES & HIERARCHY ---
  const upperHeadRoot = new SceneNode(null);

  const centerRugbyNode = new SceneNode(rugbyMesh, darkBlue);
  const leftRugbyNode = new SceneNode(rugbyMesh, darkBlue);
  const rightRugbyNode = new SceneNode(rugbyMesh, darkBlue);

  const leftConnectorNode = new SceneNode(connectorMesh, darkBlue);
  const rightConnectorNode = new SceneNode(connectorMesh, darkBlue);

  const noseLeftNode = new SceneNode(nosePrismMesh, darkBlue);
  const noseRightNode = new SceneNode(nosePrismMesh, darkBlue);

  const underJawNode = new SceneNode(underJawMesh, darkBlue);

  const leftEyeNode = new SceneNode(eyeMesh, black);
  const rightEyeNode = new SceneNode(eyeMesh, black);

  const leftPupilNode = new SceneNode(pupilMesh, yellow);
  const rightPupilNode = new SceneNode(pupilMesh, yellow);

  const leftRetinaNode = new SceneNode(retinaMesh, black);
  const rightRetinaNode = new SceneNode(retinaMesh, black);

  const toothL1 = new SceneNode(toothMesh, white);
  const toothL2 = new SceneNode(toothMesh, white);
  const toothL3 = new SceneNode(toothMesh, white);
  const toothR1 = new SceneNode(toothMesh, white);
  const toothR2 = new SceneNode(toothMesh, white);
  const toothR3 = new SceneNode(toothMesh, white);

  // BARU: Node untuk tanduk depan
  const centerHornNode = new SceneNode(hornMesh, yellow);

  // Gabungkan semua
  upperHeadRoot.addChild(centerRugbyNode);
  upperHeadRoot.addChild(leftRugbyNode);
  upperHeadRoot.addChild(rightRugbyNode);
  upperHeadRoot.addChild(leftConnectorNode);
  upperHeadRoot.addChild(rightConnectorNode);

  centerRugbyNode.addChild(noseLeftNode);
  centerRugbyNode.addChild(noseRightNode);

  centerRugbyNode.addChild(underJawNode);
  centerRugbyNode.addChild(leftEyeNode);
  centerRugbyNode.addChild(rightEyeNode);

  // BARU: Tambahkan tanduk depan ke rugby tengah
  centerRugbyNode.addChild(centerHornNode);

  leftEyeNode.addChild(leftPupilNode);
  rightEyeNode.addChild(rightPupilNode);

  leftPupilNode.addChild(leftRetinaNode);
  rightPupilNode.addChild(rightRetinaNode);

  underJawNode.addChild(toothL1);
  underJawNode.addChild(toothL2);
  underJawNode.addChild(toothL3);
  underJawNode.addChild(toothR1);
  underJawNode.addChild(toothR2);
  underJawNode.addChild(toothR3);

  // --- TRANSFORMATIONS ---
  mat4.translate(
    upperHeadRoot.localTransform,
    upperHeadRoot.localTransform,
    [0, 1.5, 0.5]
  );
  mat4.scale(
    upperHeadRoot.localTransform,
    upperHeadRoot.localTransform,
    [1, 0.7, 1.2]
  );

  mat4.scale(
    centerRugbyNode.localTransform,
    centerRugbyNode.localTransform,
    [1.3, 1, 1]
  );

  mat4.translate(
    leftRugbyNode.localTransform,
    leftRugbyNode.localTransform,
    [-1.7, 0, 0]
  );
  mat4.scale(
    leftRugbyNode.localTransform,
    leftRugbyNode.localTransform,
    [0.6, 0.6, 0.6]
  );

  mat4.translate(
    rightRugbyNode.localTransform,
    rightRugbyNode.localTransform,
    [1.7, 0, 0]
  );
  mat4.scale(
    rightRugbyNode.localTransform,
    rightRugbyNode.localTransform,
    [0.6, 0.6, 0.6]
  );

  mat4.translate(
    leftConnectorNode.localTransform,
    leftConnectorNode.localTransform,
    [-0.9, 0, 0]
  );
  mat4.rotate(
    leftConnectorNode.localTransform,
    leftConnectorNode.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  mat4.scale(
    leftConnectorNode.localTransform,
    leftConnectorNode.localTransform,
    [0.8, 1, 0.25]
  );

  mat4.translate(
    rightConnectorNode.localTransform,
    rightConnectorNode.localTransform,
    [0.9, 0, 0]
  );
  mat4.rotate(
    rightConnectorNode.localTransform,
    rightConnectorNode.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  mat4.scale(
    rightConnectorNode.localTransform,
    rightConnectorNode.localTransform,
    [0.8, 1, 0.25]
  );

  mat4.translate(
    noseLeftNode.localTransform,
    noseLeftNode.localTransform,
    [-0.08, 1, 0.6]
  );
  mat4.rotate(
    noseLeftNode.localTransform,
    noseLeftNode.localTransform,
    Math.PI / 50,
    [0, 1, 0]
  );
  mat4.rotate(
    noseLeftNode.localTransform,
    noseLeftNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.rotate(
    noseLeftNode.localTransform,
    noseLeftNode.localTransform,
    6.07,
    [0, 0, 1]
  );
  mat4.scale(
    noseLeftNode.localTransform,
    noseLeftNode.localTransform,
    [1, 1.2, 0.3]
  );

  mat4.translate(
    noseRightNode.localTransform,
    noseRightNode.localTransform,
    [0.1, 1, 0.6]
  );
  mat4.rotate(
    noseRightNode.localTransform,
    noseRightNode.localTransform,
    -Math.PI / 50,
    [0, 1, 0]
  );
  mat4.rotate(
    noseRightNode.localTransform,
    noseRightNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.rotate(
    noseRightNode.localTransform,
    noseRightNode.localTransform,
    6.1,
    [0, 0, -1]
  );
  mat4.scale(
    noseRightNode.localTransform,
    noseRightNode.localTransform,
    [1, 1.2, 0.3]
  );

  mat4.translate(
    underJawNode.localTransform,
    underJawNode.localTransform,
    [0, -0.03, 0.35]
  );
  mat4.rotate(
    underJawNode.localTransform,
    underJawNode.localTransform,
    Math.PI / 10,
    [1, 0, 0]
  );
  mat4.scale(
    underJawNode.localTransform,
    underJawNode.localTransform,
    [0.6, 1.1, 0.5]
  );

  mat4.translate(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    [-0.45, 0.6, 0.6]
  );
  mat4.rotate(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.rotate(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    Math.PI / 2,
    [0, 0, -1]
  );
  mat4.rotate(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    2,
    [1, 0, 0]
  );
  mat4.rotate(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    3,
    [0, 0, 1]
  );
  mat4.scale(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    [0.8, 0.7, 0.3]
  );

  mat4.translate(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    [0.45, 0.6, 0.6]
  );
  mat4.rotate(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.rotate(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  mat4.rotate(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    2,
    [1, 0, 0]
  );
  mat4.rotate(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    3,
    [0, 0, -1]
  );
  mat4.scale(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    [0.8, 0.7, 0.3]
  );

  mat4.translate(
    leftPupilNode.localTransform,
    leftPupilNode.localTransform,
    [-0.04, 0.3, 0.11]
  );
  mat4.scale(
    leftPupilNode.localTransform,
    leftPupilNode.localTransform,
    [0.15, 0.2, 0.05]
  );

  mat4.translate(
    rightPupilNode.localTransform,
    rightPupilNode.localTransform,
    [0.04, 0.3, 0.11]
  );
  mat4.scale(
    rightPupilNode.localTransform,
    rightPupilNode.localTransform,
    [0.15, 0.2, 0.05]
  );

  mat4.translate(
    leftRetinaNode.localTransform,
    leftRetinaNode.localTransform,
    [0, 0.5, 1]
  );
  mat4.scale(
    leftRetinaNode.localTransform,
    leftRetinaNode.localTransform,
    [0.9, 0.2, 0.1]
  );

  mat4.translate(
    rightRetinaNode.localTransform,
    rightRetinaNode.localTransform,
    [0, 0.5, 1]
  );
  mat4.scale(
    rightRetinaNode.localTransform,
    rightRetinaNode.localTransform,
    [0.9, 0.2, 0.1]
  );

  // Transformasi untuk setiap gigi secara manual
  // Gigi Kiri
  mat4.translate(
    toothL1.localTransform,
    toothL1.localTransform,
    [-0.3, 0.9, 0.5]
  );
  mat4.rotate(toothL1.localTransform, toothL1.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothL1.localTransform, toothL1.localTransform, [1.6, 1.6, 1.6]);

  mat4.translate(
    toothL2.localTransform,
    toothL2.localTransform,
    [-0.55, 0.75, 0.6]
  );
  mat4.rotate(toothL2.localTransform, toothL2.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothL2.localTransform, toothL2.localTransform, [1.6, 1.6, 1.6]);

  mat4.translate(
    toothL3.localTransform,
    toothL3.localTransform,
    [-0.74, 0.6, 0.6]
  );
  mat4.rotate(toothL3.localTransform, toothL3.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothL3.localTransform, toothL3.localTransform, [1.6, 1.6, 1.6]);

  // Gigi Kanan
  mat4.translate(
    toothR1.localTransform,
    toothR1.localTransform,
    [0.3, 0.9, 0.5]
  );
  mat4.rotate(toothR1.localTransform, toothR1.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothR1.localTransform, toothR1.localTransform, [1.6, 1.6, 1.6]);

  mat4.translate(
    toothR2.localTransform,
    toothR2.localTransform,
    [0.55, 0.75, 0.6]
  );
  mat4.rotate(toothR2.localTransform, toothR2.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothR2.localTransform, toothR2.localTransform, [1.6, 1.6, 1.6]);

  mat4.translate(
    toothR3.localTransform,
    toothR3.localTransform,
    [0.74, 0.6, 0.6]
  );
  mat4.rotate(toothR3.localTransform, toothR3.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothR3.localTransform, toothR3.localTransform, [1.6, 1.6, 1.6]);

  // BARU: Transformasi untuk tanduk depan
  mat4.translate(
    centerHornNode.localTransform,
    centerHornNode.localTransform,
    [0, 1.6, 0]
  ); // Posisikan di ujung rugby
  mat4.scale(
    centerHornNode.localTransform,
    centerHornNode.localTransform,
    [0.65, 0.7, 0.8]
  );

  mat4.rotate(
    upperHeadRoot.localTransform,
    upperHeadRoot.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );

  return upperHeadRoot;
}
// ---------------------------------------------------------
//  Build Head
// ---------------------------------------------------------
function createMegaGarchompHead(gl) {
  const headRoot = new SceneNode(null);

  // --- UPPER HEAD ---
  const upperHead = (function createMegaGarchompUpperHead(gl) {
    const lightBlue = [0.6, 0.6, 1.0, 1.0];
    const yellow = [1.0, 0.84, 0.0, 1.0];
    const black = [0.1, 0.1, 0.1, 1.0];
    const white = [1.0, 1.0, 1.0, 1.0];
    const darkBlue = [0.25, 0.25, 0.45, 1.0];

    const rugbyProfile = [];
    const smoothness = 10;
    const p0 = [0.0, 1.8, 0],
      p1 = [0.4, 1.2, 0],
      p2 = [0.7, 0.5, 0],
      p3 = [0.7, 0.0, 0];
    for (let i = 0; i <= smoothness; i++) {
      const t = i / smoothness;
      rugbyProfile.push(Crv.getBezierPoint(t, p0, p1, p2, p3).slice(0, 2));
    }
    for (let i = smoothness - 1; i >= 0; i--) {
      const pt = rugbyProfile[i];
      if (Math.abs(pt[1]) > 0.0001) rugbyProfile.push([pt[0], -pt[1]]);
    }

    const rugbyMesh = new Mesh(
      gl,
      Crv.createSurfaceOfRevolution(rugbyProfile, 32)
    );
    const connectorMesh = new Mesh(
      gl,
      Prm.createHyperboloidOneSheet(0.5, 0.5, 0.4, 1.0, 16, 16)
    );
    const nosePrismMesh = new Mesh(
      gl,
      Prm.createTriangularPrism(0.4, 0.7, 0.2)
    );
    const underJawMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));
    const eyeMesh = new Mesh(
      gl,
      Prm.createTrapezoidalPrism(0.5, 0.3, 0.8, 0.2)
    );
    const pupilMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 16, 16));
    const retinaMesh = pupilMesh;
    const toothMesh = new Mesh(gl, Prm.createCone(0.1, 0.3, 8));
    const hornMesh = new Mesh(gl, Prm.createCone(0.6, 1, 4));

    const upperHeadRoot = new SceneNode(null);
    const centerRugbyNode = new SceneNode(rugbyMesh, darkBlue);
    const leftRugbyNode = new SceneNode(rugbyMesh, darkBlue);
    const rightRugbyNode = new SceneNode(rugbyMesh, darkBlue);
    const leftConnectorNode = new SceneNode(connectorMesh, darkBlue);
    const rightConnectorNode = new SceneNode(connectorMesh, darkBlue);
    const noseLeftNode = new SceneNode(nosePrismMesh, darkBlue);
    const noseRightNode = new SceneNode(nosePrismMesh, darkBlue);
    const underJawNode = new SceneNode(underJawMesh, darkBlue);
    const leftEyeNode = new SceneNode(eyeMesh, black);
    const rightEyeNode = new SceneNode(eyeMesh, black);
    const leftPupilNode = new SceneNode(pupilMesh, yellow);
    const rightPupilNode = new SceneNode(pupilMesh, yellow);
    const leftRetinaNode = new SceneNode(retinaMesh, black);
    const rightRetinaNode = new SceneNode(retinaMesh, black);
    const toothL1 = new SceneNode(toothMesh, white),
      toothL2 = new SceneNode(toothMesh, white),
      toothL3 = new SceneNode(toothMesh, white);
    const toothR1 = new SceneNode(toothMesh, white),
      toothR2 = new SceneNode(toothMesh, white),
      toothR3 = new SceneNode(toothMesh, white);
    const centerHornNode = new SceneNode(hornMesh, yellow);

    upperHeadRoot.addChild(centerRugbyNode);
    upperHeadRoot.addChild(leftRugbyNode);
    upperHeadRoot.addChild(rightRugbyNode);
    upperHeadRoot.addChild(leftConnectorNode);
    upperHeadRoot.addChild(rightConnectorNode);
    centerRugbyNode.addChild(noseLeftNode);
    centerRugbyNode.addChild(noseRightNode);
    centerRugbyNode.addChild(underJawNode);
    centerRugbyNode.addChild(leftEyeNode);
    centerRugbyNode.addChild(rightEyeNode);
    centerRugbyNode.addChild(centerHornNode);
    leftEyeNode.addChild(leftPupilNode);
    rightEyeNode.addChild(rightPupilNode);
    leftPupilNode.addChild(leftRetinaNode);
    rightPupilNode.addChild(rightRetinaNode);
    underJawNode.addChild(toothL1);
    underJawNode.addChild(toothL2);
    underJawNode.addChild(toothL3);
    underJawNode.addChild(toothR1);
    underJawNode.addChild(toothR2);
    underJawNode.addChild(toothR3);

    mat4.translate(
      upperHeadRoot.localTransform,
      upperHeadRoot.localTransform,
      [0, 1.5, 0.5]
    );
    mat4.scale(
      upperHeadRoot.localTransform,
      upperHeadRoot.localTransform,
      [1, 0.7, 1.2]
    );
    mat4.scale(
      centerRugbyNode.localTransform,
      centerRugbyNode.localTransform,
      [1.3, 0.9, 1]
    );
    mat4.translate(
      leftRugbyNode.localTransform,
      leftRugbyNode.localTransform,
      [-1.7, 0, 0]
    );
    mat4.scale(
      leftRugbyNode.localTransform,
      leftRugbyNode.localTransform,
      [0.6, 0.6, 0.6]
    );
    mat4.translate(
      rightRugbyNode.localTransform,
      rightRugbyNode.localTransform,
      [1.7, 0, 0]
    );
    mat4.scale(
      rightRugbyNode.localTransform,
      rightRugbyNode.localTransform,
      [0.6, 0.6, 0.6]
    );
    mat4.translate(
      leftConnectorNode.localTransform,
      leftConnectorNode.localTransform,
      [-0.9, 0, 0]
    );
    mat4.rotate(
      leftConnectorNode.localTransform,
      leftConnectorNode.localTransform,
      Math.PI / 2,
      [0, 0, 1]
    );
    mat4.scale(
      leftConnectorNode.localTransform,
      leftConnectorNode.localTransform,
      [0.8, 1, 0.25]
    );
    mat4.translate(
      rightConnectorNode.localTransform,
      rightConnectorNode.localTransform,
      [0.9, 0, 0]
    );
    mat4.rotate(
      rightConnectorNode.localTransform,
      rightConnectorNode.localTransform,
      Math.PI / 2,
      [0, 0, 1]
    );
    mat4.scale(
      rightConnectorNode.localTransform,
      rightConnectorNode.localTransform,
      [0.8, 1, 0.25]
    );
    mat4.translate(
      noseLeftNode.localTransform,
      noseLeftNode.localTransform,
      [-0.08, 1, 0.6]
    );
    mat4.rotate(
      noseLeftNode.localTransform,
      noseLeftNode.localTransform,
      Math.PI / 50,
      [0, 1, 0]
    );
    mat4.rotate(
      noseLeftNode.localTransform,
      noseLeftNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.rotate(
      noseLeftNode.localTransform,
      noseLeftNode.localTransform,
      6.07,
      [0, 0, 1]
    );
    mat4.scale(
      noseLeftNode.localTransform,
      noseLeftNode.localTransform,
      [1, 1.2, 0.3]
    );
    mat4.translate(
      noseRightNode.localTransform,
      noseRightNode.localTransform,
      [0.1, 1, 0.6]
    );
    mat4.rotate(
      noseRightNode.localTransform,
      noseRightNode.localTransform,
      -Math.PI / 50,
      [0, 1, 0]
    );
    mat4.rotate(
      noseRightNode.localTransform,
      noseRightNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.rotate(
      noseRightNode.localTransform,
      noseRightNode.localTransform,
      6.1,
      [0, 0, -1]
    );
    mat4.scale(
      noseRightNode.localTransform,
      noseRightNode.localTransform,
      [1, 1.2, 0.3]
    );
    mat4.translate(
      underJawNode.localTransform,
      underJawNode.localTransform,
      [0, -0.03, 0.35]
    );
    mat4.rotate(
      underJawNode.localTransform,
      underJawNode.localTransform,
      Math.PI / 10,
      [1, 0, 0]
    );
    mat4.scale(
      underJawNode.localTransform,
      underJawNode.localTransform,
      [0.6, 1.1, 0.5]
    );
    mat4.translate(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      [-0.45, 0.6, 0.6]
    );
    mat4.rotate(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.rotate(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      Math.PI / 2,
      [0, 0, -1]
    );
    mat4.rotate(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      2,
      [1, 0, 0]
    );
    mat4.rotate(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      3,
      [0, 0, 1]
    );
    mat4.scale(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      [0.8, 0.7, 0.3]
    );
    mat4.translate(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      [0.45, 0.6, 0.6]
    );
    mat4.rotate(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.rotate(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      Math.PI / 2,
      [0, 0, 1]
    );
    mat4.rotate(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      2,
      [1, 0, 0]
    );
    mat4.rotate(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      3,
      [0, 0, -1]
    );
    mat4.scale(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      [0.8, 0.7, 0.3]
    );
    mat4.translate(
      leftPupilNode.localTransform,
      leftPupilNode.localTransform,
      [-0.04, 0.3, 0.11]
    );
    mat4.scale(
      leftPupilNode.localTransform,
      leftPupilNode.localTransform,
      [0.15, 0.2, 0.05]
    );
    mat4.translate(
      rightPupilNode.localTransform,
      rightPupilNode.localTransform,
      [0.04, 0.3, 0.11]
    );
    mat4.scale(
      rightPupilNode.localTransform,
      rightPupilNode.localTransform,
      [0.15, 0.2, 0.05]
    );
    mat4.translate(
      leftRetinaNode.localTransform,
      leftRetinaNode.localTransform,
      [0, 0.5, 1]
    );
    mat4.scale(
      leftRetinaNode.localTransform,
      leftRetinaNode.localTransform,
      [0.9, 0.2, 0.1]
    );
    mat4.translate(
      rightRetinaNode.localTransform,
      rightRetinaNode.localTransform,
      [0, 0.5, 1]
    );
    mat4.scale(
      rightRetinaNode.localTransform,
      rightRetinaNode.localTransform,
      [0.9, 0.2, 0.1]
    );
    mat4.translate(
      toothL1.localTransform,
      toothL1.localTransform,
      [-0.3, 0.9, 0.5]
    );
    mat4.rotate(toothL1.localTransform, toothL1.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothL1.localTransform, toothL1.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      toothL2.localTransform,
      toothL2.localTransform,
      [-0.55, 0.75, 0.6]
    );
    mat4.rotate(toothL2.localTransform, toothL2.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothL2.localTransform, toothL2.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      toothL3.localTransform,
      toothL3.localTransform,
      [-0.74, 0.6, 0.6]
    );
    mat4.rotate(toothL3.localTransform, toothL3.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothL3.localTransform, toothL3.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      toothR1.localTransform,
      toothR1.localTransform,
      [0.3, 0.9, 0.5]
    );
    mat4.rotate(toothR1.localTransform, toothR1.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothR1.localTransform, toothR1.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      toothR2.localTransform,
      toothR2.localTransform,
      [0.55, 0.75, 0.6]
    );
    mat4.rotate(toothR2.localTransform, toothR2.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothR2.localTransform, toothR2.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      toothR3.localTransform,
      toothR3.localTransform,
      [0.74, 0.6, 0.6]
    );
    mat4.rotate(toothR3.localTransform, toothR3.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothR3.localTransform, toothR3.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      centerHornNode.localTransform,
      centerHornNode.localTransform,
      [0, 1.6, 0]
    );
    mat4.scale(
      centerHornNode.localTransform,
      centerHornNode.localTransform,
      [0.65, 0.7, 0.8]
    );
    mat4.rotate(
      upperHeadRoot.localTransform,
      upperHeadRoot.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    return upperHeadRoot;
  })(gl);

  // --- LOWER JAW ---
  const lowerJaw = (function createMegaGarchompJaw(gl) {
    const redOrange = [0.8, 0.15, 0.1, 1.0];
    const white = [1.0, 1.0, 1.0, 1.0];
    const black = [0.1, 0.1, 0.1, 1.0];

    const jawBaseMesh = new Mesh(gl, Prm.createCuboid(1, 1, 1));
    const toothMesh = new Mesh(gl, Prm.createCone(0.1, 0.3, 8));
    const chinCoverMesh = new Mesh(gl, Prm.createTriangularPrism(1, 1, 1));
    const innerMouthMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));

    const jawRoot = new SceneNode(null);
    const jawCenter = new SceneNode(jawBaseMesh, redOrange);
    const leftJawBlock = new SceneNode(jawBaseMesh, redOrange);
    const rightJawBlock = new SceneNode(jawBaseMesh, redOrange);
    const leftJawCover = new SceneNode(jawBaseMesh, redOrange);
    const rightJawCover = new SceneNode(jawBaseMesh, redOrange);
    const chinCoverNode = new SceneNode(chinCoverMesh, redOrange);
    const innerMouthNode = new SceneNode(innerMouthMesh, black);
    const lowerToothL1 = new SceneNode(toothMesh, white),
      lowerToothL2 = new SceneNode(toothMesh, white),
      lowerToothL3 = new SceneNode(toothMesh, white);
    const lowerToothR1 = new SceneNode(toothMesh, white),
      lowerToothR2 = new SceneNode(toothMesh, white),
      lowerToothR3 = new SceneNode(toothMesh, white);

    jawRoot.addChild(jawCenter);
    jawRoot.addChild(leftJawBlock);
    jawRoot.addChild(rightJawBlock);
    jawRoot.addChild(leftJawCover);
    jawRoot.addChild(rightJawCover);
    jawRoot.addChild(chinCoverNode);
    jawRoot.addChild(innerMouthNode);
    jawRoot.addChild(lowerToothL1);
    jawRoot.addChild(lowerToothL2);
    jawRoot.addChild(lowerToothL3);
    jawRoot.addChild(lowerToothR1);
    jawRoot.addChild(lowerToothR2);
    jawRoot.addChild(lowerToothR3);

    mat4.translate(
      jawRoot.localTransform,
      jawRoot.localTransform,
      [0, 0.25, 1.1]
    );

    mat4.translate(
      jawCenter.localTransform,
      jawCenter.localTransform,
      [0, 0.4, 1]
    );
    mat4.rotate(
      jawCenter.localTransform,
      jawCenter.localTransform,
      -Math.PI / 12,
      [-1, 0, 0]
    );
    mat4.scale(
      jawCenter.localTransform,
      jawCenter.localTransform,
      [0.4, 0.2, 0.6]
    );

    mat4.translate(
      leftJawBlock.localTransform,
      leftJawBlock.localTransform,
      [-0.3, 0.45, 0.3]
    );
    mat4.rotate(
      leftJawBlock.localTransform,
      leftJawBlock.localTransform,
      Math.PI / 6,
      [0, 1, 0]
    );
    mat4.scale(
      leftJawBlock.localTransform,
      leftJawBlock.localTransform,
      [0.3, 0.2, 1.5]
    );

    mat4.translate(
      rightJawBlock.localTransform,
      rightJawBlock.localTransform,
      [0.3, 0.45, 0.3]
    );
    mat4.rotate(
      rightJawBlock.localTransform,
      rightJawBlock.localTransform,
      -Math.PI / 6,
      [0, 1, 0]
    );
    mat4.scale(
      rightJawBlock.localTransform,
      rightJawBlock.localTransform,
      [0.3, 0.2, 1.5]
    );

    mat4.translate(
      leftJawCover.localTransform,
      leftJawCover.localTransform,
      [-0.7, 0.6, -0.4]
    );
    mat4.scale(
      leftJawCover.localTransform,
      leftJawCover.localTransform,
      [0.2, 0.5, 0.3]
    );

    mat4.translate(
      rightJawCover.localTransform,
      rightJawCover.localTransform,
      [0.7, 0.6, -0.4]
    );
    mat4.scale(
      rightJawCover.localTransform,
      rightJawCover.localTransform,
      [0.2, 0.5, 0.3]
    );

    mat4.translate(
      innerMouthNode.localTransform,
      innerMouthNode.localTransform,
      [0, 0.6, -0.6]
    );
    mat4.scale(
      innerMouthNode.localTransform,
      innerMouthNode.localTransform,
      [0.45, 0.2, 1]
    );

    mat4.translate(
      chinCoverNode.localTransform,
      chinCoverNode.localTransform,
      [0, 0.3, 0.3]
    );
    mat4.rotate(
      chinCoverNode.localTransform,
      chinCoverNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.scale(
      chinCoverNode.localTransform,
      chinCoverNode.localTransform,
      [1.4, 1.4, 0.05]
    );

    mat4.translate(
      lowerToothL1.localTransform,
      lowerToothL1.localTransform,
      [-0.15, 0.65, 0.58]
    );
    mat4.scale(
      lowerToothL1.localTransform,
      lowerToothL1.localTransform,
      [1, 0.7, 1]
    );
    mat4.translate(
      lowerToothL2.localTransform,
      lowerToothL2.localTransform,
      [-0.36, 0.65, 0.28]
    );
    mat4.scale(
      lowerToothL2.localTransform,
      lowerToothL2.localTransform,
      [1, 0.7, 1]
    );
    mat4.translate(
      lowerToothL3.localTransform,
      lowerToothL3.localTransform,
      [-0.6, 0.65, -0.02]
    );
    mat4.scale(
      lowerToothL3.localTransform,
      lowerToothL3.localTransform,
      [1, 0.7, 1]
    );
    mat4.translate(
      lowerToothR1.localTransform,
      lowerToothR1.localTransform,
      [0.15, 0.65, 0.58]
    );
    mat4.scale(
      lowerToothR1.localTransform,
      lowerToothR1.localTransform,
      [1, 0.7, 1]
    );
    mat4.translate(
      lowerToothR2.localTransform,
      lowerToothR2.localTransform,
      [0.4, 0.65, 0.28]
    );
    mat4.scale(
      lowerToothR2.localTransform,
      lowerToothR2.localTransform,
      [1, 0.7, 1]
    );
    mat4.translate(
      lowerToothR3.localTransform,
      lowerToothR3.localTransform,
      [0.6, 0.65, -0.02]
    );
    mat4.scale(
      lowerToothR3.localTransform,
      lowerToothR3.localTransform,
      [1, 0.7, 1]
    );
    return jawRoot;
  })(gl);

  headRoot.addChild(upperHead);
  headRoot.addChild(lowerJaw);
  mat4.translate(
    headRoot.localTransform,
    headRoot.localTransform,
    [0, -0.78, 0]
  );

  return headRoot;
}
// ---------------------------------------------------------
//  Build Torso
// ---------------------------------------------------------
function createMegaGarchompTorso(gl) {
  // --- COLORS ---
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];
  const redOrange = [0.8, 0.15, 0.1, 1.0];
  const yellow = [1.0, 0.84, 0.0, 1.0];
  const white = [0.9, 0.9, 0.9, 1.0]; // Warna putih untuk duri

  // --- MESHES ---
  const upperBodyMesh = new Mesh(
    gl,
    Prm.createEllipsoid(0.8, 1.2, 0.7, 32, 32)
  );
  const lowerBodyMesh = new Mesh(
    gl,
    Prm.createEllipsoid(0.81, 0.9, 0.73, 32, 32)
  );
  const shoulderMesh = new Mesh(
    gl,
    Prm.createEllipticParaboloid(0.8, 0.7, 1.5, 16)
  );
  const connectorMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.6, 0.5, 0.8, 1.8, 32, 32)
  );
  const chestPlateMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));
  const waistPlateMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.6, 0.5, 0.8, 1.8, 32, 32)
  );
  const stomachPlateMesh1 = new Mesh(
    gl,
    Prm.createEllipsoid(1, 1, 1, 2.9, 100)
  );
  const stomachPlateMesh2 = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));
  const spikeMesh = new Mesh(gl, Prm.createTriangularPrism(0.4, 0.6, 0.1));

  // --- SCENE NODES ---
  const torsoRoot = new SceneNode(null);
  const upperBodyNode = new SceneNode(upperBodyMesh, darkBlue);
  const lowerBodyNode = new SceneNode(lowerBodyMesh, darkBlue);
  const leftShoulderNode = new SceneNode(shoulderMesh, darkBlue);
  const rightShoulderNode = new SceneNode(shoulderMesh, darkBlue);
  const connectorNode = new SceneNode(connectorMesh, darkBlue);
  const chestPlateNode = new SceneNode(chestPlateMesh, redOrange);
  const waistPlateNode = new SceneNode(waistPlateMesh, redOrange);
  const stomachPlateNode1 = new SceneNode(stomachPlateMesh1, yellow);
  const stomachPlateNode2 = new SceneNode(stomachPlateMesh2, redOrange);
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
// ---------------------------------------------------------
//  Build Tail
// ---------------------------------------------------------
function createMegaGarchompTail(gl) {
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const pathSegments = 25; // Tingkatkan detail kurva

  // --- EKOR UTAMA ---

  const p0 = [0, 0, -0.6];
  const p1 = [0, -0.3, -2.0];
  const p2 = [0, 0.5, -4.0];
  const p3 = [0, 0.7, -5.0];

  const tailPath = [];
  const scaleFactors = [];
  for (let i = 0; i <= pathSegments; i++) {
    const t = i / pathSegments;
    tailPath.push(Crv.getBezierPoint(t, p0, p1, p2, p3));
    scaleFactors.push(1.0 - t); // Meruncing hingga 0
  }

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

  const tailMesh = new Mesh(
    gl,
    Crv.createTaperedSweptSurface(tailProfile, tailPath, scaleFactors, true)
  );
  // --- SIRIP SAMPING (BARU) ---
  const finProfile = [
    [0, 0.3],
    [0.15, 0],
    [0, -0.3],
    [-0.1, 0],
  ]; // Profil pipih

  // Sirip Kiri
  const leftFin_p0 = [0, 0, 0];
  const leftFin_p1 = [0.5, 0.1, -0.5];
  const leftFin_p2 = [1.0, 0.0, -1.0];
  const leftFin_p3 = [1.5, -0.2, -1.5];
  const leftFinPath = [];
  const leftFinScales = [];

  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    leftFinPath.push(
      Crv.getBezierPoint(t, leftFin_p0, leftFin_p1, leftFin_p2, leftFin_p3)
    );
    leftFinScales.push(1.0 - t);
  }

  const leftFinMesh = new Mesh(
    gl,
    Crv.createTaperedSweptSurface(finProfile, leftFinPath, leftFinScales, true)
  );
  // Sirip Kanan
  const rightFin_p0 = [0, 0, 0];
  const rightFin_p1 = [-0.5, 0.1, -0.5];
  const rightFin_p2 = [-1.0, 0.0, -1.0];
  const rightFin_p3 = [-1.5, -0.2, -1.5];
  const rightFinPath = [];
  const rightFinScales = [];

  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    rightFinPath.push(
      Crv.getBezierPoint(t, rightFin_p0, rightFin_p1, rightFin_p2, rightFin_p3)
    );
    rightFinScales.push(1.0 - t);
  }
  const rightFinMesh = new Mesh(
    gl,
    Crv.createTaperedSweptSurface(
      finProfile,
      rightFinPath,
      rightFinScales,
      true
    )
  );

  // --- NODE & HIERARKI ---
  const tailRoot = new SceneNode(null); // Node root untuk seluruh bagian ekor
  const mainTailNode = new SceneNode(tailMesh, darkBlue);
  const leftFinNode = new SceneNode(leftFinMesh, darkBlue);
  const rightFinNode = new SceneNode(rightFinMesh, darkBlue);

  // Gabungkan semua ke root ekor
  tailRoot.addChild(mainTailNode);
  tailRoot.addChild(leftFinNode);
  tailRoot.addChild(rightFinNode);

  // Posisikan sirip-sirip (Anda bisa atur ini nanti)
  // Diberi posisi awal agar terlihat
  mat4.translate(
    leftFinNode.localTransform,
    leftFinNode.localTransform,
    [0, 0.43, -3.8]
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
    [1, 1, 0.5]
  );

  mat4.translate(
    rightFinNode.localTransform,
    rightFinNode.localTransform,
    [0, 0.43, -3.8]
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
    [1, 1, 0.1]
  );

  return tailRoot;
}
// ---------------------------------------------------------
//  Build Left Leg
// ---------------------------------------------------------
function createMegaGarchompLeftLeg(gl) {
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const white = [0.9, 0.9, 0.9, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];
  const redOrange = [0.8, 0.15, 0.1, 1.0];

  // --- MESHES ---
  const thighMesh = new Mesh(gl, Prm.createEllipsoid(0.5, 0.8, 0.5, 32, 32)); // Paha
  const shinMesh = new Mesh(gl, Prm.createEllipsoid(0.5, 0.5, 0.5, 32, 32)); // Betis/Telapak atas
  const shinConnectorMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.3, 0.3, 0.5, 0.4, 16, 16)
  ); // Sambungan lutut
  const footMesh = new Mesh(gl, Prm.createTrapezoidalPrism(0.8, 0.6, 0.3, 0.9)); // Telapak bawah
  const spikeMesh = new Mesh(gl, Prm.createCone(0.2, 0.8, 16)); // Duri baru

  // --- NODES & HIERARCHY ---
  const legRoot = new SceneNode(null);
  const thighNode = new SceneNode(thighMesh, darkBlue);
  const shinConnectorNode = new SceneNode(shinConnectorMesh, darkBlue);
  const shinNode = new SceneNode(shinMesh, darkBlue);
  const footNode = new SceneNode(footMesh, darkBlue);
  const thighSpikeNode = new SceneNode(spikeMesh, white);
  const thighSpikeNode2 = new SceneNode(spikeMesh, white); // Node untuk duri
  const thighSpikeNode3 = new SceneNode(spikeMesh, redOrange);
  const footSpikeNode = new SceneNode(spikeMesh, white);
  const footSpikeNode2 = new SceneNode(spikeMesh, white);
  const footSpikeNode3 = new SceneNode(spikeMesh, white);

  legRoot.addChild(thighNode);
  thighNode.addChild(shinConnectorNode);
  thighNode.addChild(thighSpikeNode);
  thighNode.addChild(thighSpikeNode2);
  thighNode.addChild(thighSpikeNode3); // Duri menempel di paha
  shinConnectorNode.addChild(shinNode);
  legRoot.addChild(footNode);
  footNode.addChild(footSpikeNode);
  footNode.addChild(footSpikeNode2);
  footNode.addChild(footSpikeNode3);

  // --- TRANSFORMATIONS (Anda bisa atur ini) ---
  // Posisikan paha
  mat4.scale(
    thighNode.localTransform,
    thighNode.localTransform,
    [1.15, 1.5, 1.5]
  );
  mat4.translate(
    thighNode.localTransform,
    thighNode.localTransform,
    [1.1, 0, 0]
  );
  mat4.rotate(
    thighNode.localTransform,
    thighNode.localTransform,
    Math.PI / 6,
    [-1, 0, 1]
  ); // Sedikit miring keluar

  // Posisikan sambungan lutut relatif terhadap paha
  mat4.translate(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    [0, -0.4, -0.5]
  );
  mat4.rotate(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    [1, 1, 0.75]
  );

  // Posisikan betis relatif terhadap sambungan lutut
  mat4.translate(
    shinNode.localTransform,
    shinNode.localTransform,
    [0, -0.3, 0.22]
  );
  mat4.scale(shinNode.localTransform, shinNode.localTransform, [0.8, 0.4, 1.2]);

  // Posisikan telapak bawah relatif terhadap betis
  mat4.translate(
    footNode.localTransform,
    footNode.localTransform,
    [1.6, -1.7, -0.4]
  );
  mat4.scale(footNode.localTransform, footNode.localTransform, [1.2, 1, 1]);
  mat4.rotate(
    footNode.localTransform,
    footNode.localTransform,
    -Math.PI / 6,
    [0, 0, 0]
  );

  // Transformasi untuk duri paha
  mat4.translate(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    [0.2, 0.2, 0.6]
  );
  mat4.rotate(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    -Math.PI / 1.2,
    [0, 1, 1]
  );
  mat4.scale(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    [0.4, 0.4, 0.7]
  ); // Sedikit gepeng

  // Transformasi untuk duri paha
  mat4.translate(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    [0.1, -0.3, 0.6]
  );
  mat4.rotate(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    -Math.PI / 1.2,
    [0, 1, 1]
  );
  mat4.scale(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    [0.4, 0.4, 0.7]
  ); // Sedikit gepeng

  // Transformasi untuk duri paha
  mat4.translate(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    [0, -0.93, 0.2]
  ); // Posisi diatur lebih rendah
  mat4.rotate(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    Math.PI / 1.2,
    [1, 0, 0]
  ); // Diputar 180 derajat agar menghadap ke bawah
  mat4.scale(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    [0.7, 0.7, 1]
  ); // Sedikit gepeng

  // Transformasi untuk duri kaki
  mat4.translate(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    [0.2, -0.01, 0.8]
  ); // Posisi disesuaikan agar pas di depan
  mat4.rotate(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  ); // Diputar -90 derajat pada sumbu X
  mat4.scale(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    [0.8, 1, 0.8]
  ); // Sedikit gepeng
  // Transformasi untuk duri kaki
  mat4.translate(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    [-0.01, -0.01, 0.8]
  ); // Posisi disesuaikan agar pas di depan
  mat4.rotate(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  ); // Diputar -90 derajat pada sumbu X
  mat4.scale(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    [0.8, 1, 0.8]
  ); // Sedikit gepeng
  // Transformasi untuk duri kaki
  mat4.translate(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    [-0.2, -0.01, 0.8]
  ); // Posisi disesuaikan agar pas di depan
  mat4.rotate(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  ); // Diputar -90 derajat pada sumbu X
  mat4.scale(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    [0.8, 1, 0.8]
  ); // Sedikit gepeng

  return legRoot;
}
// ---------------------------------------------------------
//  Build Right Leg
// ---------------------------------------------------------
function createMegaGarchompRightLeg(gl) {
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const white = [0.9, 0.9, 0.9, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];
  const redOrange = [0.8, 0.15, 0.1, 1.0];

  // --- MESHES ---
  const thighMesh = new Mesh(gl, Prm.createEllipsoid(0.5, 0.8, 0.5, 32, 32)); // Paha
  const shinMesh = new Mesh(gl, Prm.createEllipsoid(0.5, 0.5, 0.5, 32, 32)); // Betis/Telapak atas
  const shinConnectorMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.3, 0.3, 0.5, 0.4, 16, 16)
  ); // Sambungan lutut
  const footMesh = new Mesh(gl, Prm.createTrapezoidalPrism(0.8, 0.6, 0.3, 0.9)); // Telapak bawah
  const spikeMesh = new Mesh(gl, Prm.createCone(0.2, 0.8, 16)); // Duri

  // --- NODES & HIERARCHY ---
  const legRoot = new SceneNode(null);
  const thighNode = new SceneNode(thighMesh, darkBlue);
  const shinConnectorNode = new SceneNode(shinConnectorMesh, darkBlue);
  const shinNode = new SceneNode(shinMesh, darkBlue);
  const footNode = new SceneNode(footMesh, darkBlue);
  const thighSpikeNode = new SceneNode(spikeMesh, white);
  const thighSpikeNode2 = new SceneNode(spikeMesh, white);
  const thighSpikeNode3 = new SceneNode(spikeMesh, redOrange);
  const footSpikeNode = new SceneNode(spikeMesh, white);
  const footSpikeNode2 = new SceneNode(spikeMesh, white);
  const footSpikeNode3 = new SceneNode(spikeMesh, white);

  legRoot.addChild(thighNode);
  thighNode.addChild(shinConnectorNode);
  thighNode.addChild(thighSpikeNode);
  thighNode.addChild(thighSpikeNode2);
  thighNode.addChild(thighSpikeNode3);
  shinConnectorNode.addChild(shinNode);
  legRoot.addChild(footNode);
  footNode.addChild(footSpikeNode);
  footNode.addChild(footSpikeNode2);
  footNode.addChild(footSpikeNode3);

  // --- TRANSFORMATIONS ---
  // Posisikan paha (mirror ke sisi kanan → ubah x jadi negatif)
  mat4.scale(
    thighNode.localTransform,
    thighNode.localTransform,
    [1.15, 1.5, 1.5]
  );
  mat4.translate(
    thighNode.localTransform,
    thighNode.localTransform,
    [-0.7, -1.2, 0]
  );
  mat4.rotate(
    thighNode.localTransform,
    thighNode.localTransform,
    Math.PI / 6,
    [-1, 0, -1]
  ); // arah miring dibalik

  // Posisikan sambungan lutut relatif terhadap paha
  mat4.translate(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    [0, -0.4, -0.5]
  );
  mat4.rotate(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    [1, 1, 0.75]
  );

  // Posisikan betis relatif terhadap sambungan lutut
  mat4.translate(
    shinNode.localTransform,
    shinNode.localTransform,
    [0, -0.3, 0.22]
  );
  mat4.scale(shinNode.localTransform, shinNode.localTransform, [0.8, 0.4, 1.2]);

  // Posisikan telapak bawah (mirror pada sumbu X)
  mat4.translate(
    footNode.localTransform,
    footNode.localTransform,
    [-1.1, -3.5, -0.4]
  );
  mat4.scale(footNode.localTransform, footNode.localTransform, [1.2, 1, 1]);
  mat4.rotate(
    footNode.localTransform,
    footNode.localTransform,
    Math.PI / 6,
    [0, 0, 0]
  );

  // Transformasi duri paha (mirror posisi x)
  mat4.translate(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    [-0.2, 0.2, 0.6]
  );
  mat4.rotate(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    Math.PI / 1.2,
    [0, 1, 1]
  );
  mat4.scale(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    [0.4, 0.4, 0.7]
  );

  mat4.translate(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    [-0.1, -0.3, 0.6]
  );
  mat4.rotate(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    Math.PI / 1.2,
    [0, 1, 1]
  );
  mat4.scale(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    [0.4, 0.4, 0.7]
  );

  mat4.translate(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    [0, -0.93, 0.2]
  );
  mat4.rotate(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    Math.PI / 1.2,
    [1, 0, 0]
  );
  mat4.scale(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    [0.7, 0.7, 1]
  );

  // Duri kaki (mirror posisi x)
  mat4.translate(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    [-0.2, -0.01, 0.8]
  );
  mat4.rotate(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.scale(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    [0.8, 1, 0.8]
  );

  mat4.translate(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    [0.01, -0.01, 0.8]
  );
  mat4.rotate(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.scale(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    [0.8, 1, 0.8]
  );

  mat4.translate(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    [0.2, -0.01, 0.8]
  );
  mat4.rotate(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.scale(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    [0.8, 1, 0.8]
  );

  return legRoot;
}
// ---------------------------------------------------------
//  Build Dorsal Fin
// ---------------------------------------------------------
function createDorsalFin(gl) {
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];

  // -- Gabungkan semua titik menjadi SATU array --
  // Urutan titik diatur untuk menjiplak seluruh outline sirip, TANPA B dan C
  const finShapePoints = [
    // Garis atas sirip
    [0.06, 0, 2.87], // A
    [1.6, 0, 2.97], // D
    [3.32, 0, 3.17], // E
    [4.4, 0, 3.09], // F
    [5.38, 0, 2.91], // G
    [6.5, 0, 2.57], // H
    [7.56, 0, 2.19], // I
    // Lekukan-lekukan di bagian bawah
    [6.08, 0, 1.65], // J
    [5.14, 0, 1.93], // K
    [4.24, 0, 2.03], // L
    [5.22, 0, 1.41], // M
    [3.86, 0, 0.91], // N
    [3.02, 0, 1.23], // O
    [2.22, 0, 1.41], // P
    [3.02, 0, 0.63], // Q
    [1.78, 0, 0.17], // R
    [0.02, 0, 0.71], // S
  ];

  // Buat satu mesh dari satu outline utuh
  const finMesh = new Mesh(gl, Prm.createExtrudedShape(finShapePoints, 0.2));

  const dorsalFinRoot = new SceneNode(finMesh, darkBlue);

  // -- TRANSFORMASI KESELURUHAN --
  // Rotasi agar berdiri tegak
  mat4.rotate(
    dorsalFinRoot.localTransform,
    dorsalFinRoot.localTransform,
    Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.rotate(
    dorsalFinRoot.localTransform,
    dorsalFinRoot.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  // Sesuaikan skala agar proporsional
  mat4.scale(
    dorsalFinRoot.localTransform,
    dorsalFinRoot.localTransform,
    [0.4, 0.4, 0.4]
  );
  mat4.translate(
    dorsalFinRoot.localTransform,
    dorsalFinRoot.localTransform,
    [1, 0, 0]
  );

  return dorsalFinRoot;
}
// ---------------------------------------------------------
//  Build Right Arm
// ---------------------------------------------------------
function createMegaGarchompRightArm(gl) {
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];

  // --- MESHES ---
  // Lengan atas melengkung (di-mirror dari lengan kiri)
  const armProfile = [];
  const armRadius = 0.3;
  const armSides = 16;
  for (let i = 0; i <= armSides; i++) {
    const angle = (i / armSides) * 2 * Math.PI;
    armProfile.push([Math.cos(angle) * armRadius, Math.sin(angle) * armRadius]);
  }

  // Path di-mirror pada sumbu X
  const arm_p0 = [0, 0, 0];
  const arm_p1 = [-0.1, -0.4, 0]; // X dinegatifkan
  const arm_p2 = [-0.1, -1.0, 0]; // X dinegatifkan
  const arm_p3 = [-0.2, -1.5, 0]; // X dinegatifkan
  const armPath = [];
  const armSegments = 10;
  for (let i = 0; i <= armSegments; i++) {
    const t = i / armSegments;
    armPath.push(Crv.getBezierPoint(t, arm_p0, arm_p1, arm_p2, arm_p3));
  }
  const upperArmMesh = new Mesh(
    gl,
    Crv.createSweptSurface(armProfile, armPath, true)
  );
  const elbowMesh = new Mesh(gl, Prm.createEllipsoid(0.4, 0.25, 0.35, 16, 16));
  const forearmMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.2, 0.2, 0.3, 0.5, 16, 16)
  );
  const wristJointMesh = new Mesh(
    gl,
    Prm.createEllipsoid(0.26, 0.1, 0.3, 16, 16)
  );

  // Geometri sirip sama dengan tangan kiri
  const finW = 0.6,
    finH = 0.7,
    topBulge = 0.12,
    bottomBulge = 0.18,
    leftBulge = 0.1;
  const finSegU = 24,
    finSegV = 10,
    finT = 0.2;
  const finGeom = Prm.createSailCoons3D(
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

  // --- NODES & HIERARCHY ---
  const armRoot = new SceneNode(null);
  const upperArmNode = new SceneNode(upperArmMesh, darkBlue);
  const elbowNode = new SceneNode(elbowMesh, darkBlue);
  const rightFore = new SceneNode(forearmMesh, darkBlue);
  const wristJointNode = new SceneNode(wristJointMesh, darkBlue);
  const rightFin = new SceneNode(finMesh, darkBlue);
  const finInnerNode = new SceneNode(finMesh, red);

  armRoot.addChild(upperArmNode);
  upperArmNode.addChild(elbowNode);
  elbowNode.addChild(rightFore);
  rightFore.addChild(wristJointNode);
  wristJointNode.addChild(rightFin);
  wristJointNode.addChild(finInnerNode);

  // --- TRANSFORMATIONS (MIRRORED) ---
  // Lengan atas di-mirror
  mat4.translate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    [1, 1, 0]
  ); // X positif
  mat4.rotate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    Math.PI / 3.6,
    [0, 0, 1]
  ); // Rotasi Z dibalik
  mat4.rotate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    Math.PI / 8,
    [0, 1, 0]
  ); // Rotasi Y dibalik
  mat4.scale(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    [0.7, 0.7, 0.7]
  );
  mat4.translate(elbowNode.localTransform, elbowNode.localTransform, arm_p3);

  // Lengan bawah di-mirror
  mat4.translate(
    rightFore.localTransform,
    rightFore.localTransform,
    [0, 0, 0.8]
  );
  mat4.rotate(
    rightFore.localTransform,
    rightFore.localTransform,
    -Math.PI / 6,
    [0, 0, 1]
  ); // Rotasi Z dibalik
  mat4.rotate(
    rightFore.localTransform,
    rightFore.localTransform,
    -Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(rightFore.localTransform, rightFore.localTransform, [0.8, 2.5, 1]);

  // Sendi pergelangan tangan (posisi sama secara lokal)
  mat4.translate(
    wristJointNode.localTransform,
    wristJointNode.localTransform,
    [0, -0.25, 0]
  );

  // Sirip luar di-mirror
  mat4.translate(rightFin.localTransform, rightFin.localTransform, [0, 0, 0]);
  mat4.rotate(rightFin.localTransform, rightFin.localTransform, -4, [0, 1, 0]); // Rotasi Y dibalik
  mat4.rotate(rightFin.localTransform, rightFin.localTransform, -2, [0, 0, -1]); // Rotasi Z dibalik
  mat4.scale(rightFin.localTransform, rightFin.localTransform, [-2.5, 2, 0.9]); // Skala X dinegatifkan untuk mirror sempurna

  // Sirip dalam (merah) di-mirror
  mat4.translate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    [0, 0.23, 0]
  );
  mat4.rotate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    -4,
    [0, 1, 0]
  ); // Rotasi Y dibalik
  mat4.rotate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    -2,
    [0, 0, -1]
  ); // Rotasi Z dibalik
  mat4.scale(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    [-3.2, 3.2, 0.1]
  ); // Skala X dinegatifkan

  return armRoot;
}
// ---------------------------------------------------------
//  Build Left Arm
// ---------------------------------------------------------
function createMegaGarchompLeftArm(gl) {
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const white = [0.9, 0.9, 0.9, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];

  // --- MESHES ---
  // Lengan atas melengkung (dipertahankan dari kode lama)
  const armProfile = [];
  const armRadius = 0.3;
  const armSides = 16;
  for (let i = 0; i <= armSides; i++) {
    const angle = (i / armSides) * 2 * Math.PI;
    armProfile.push([Math.cos(angle) * armRadius, Math.sin(angle) * armRadius]);
  }

  const arm_p0 = [0, 0, 0];
  const arm_p1 = [0.1, -0.4, 0];
  const arm_p2 = [0.1, -1.0, 0];
  const arm_p3 = [0.2, -1.5, 0];
  const armPath = [];
  const armSegments = 10;
  for (let i = 0; i <= armSegments; i++) {
    const t = i / armSegments;
    armPath.push(Crv.getBezierPoint(t, arm_p0, arm_p1, arm_p2, arm_p3));
  }
  const upperArmMesh = new Mesh(
    gl,
    Crv.createSweptSurface(armProfile, armPath, true)
  );
  const elbowMesh = new Mesh(gl, Prm.createEllipsoid(0.4, 0.25, 0.35, 16, 16));
  const forearmMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.2, 0.2, 0.3, 0.5, 16, 16)
  );

  // BARU: Mesh untuk sendi pergelangan tangan
  const wristJointMesh = new Mesh(
    gl,
    Prm.createEllipsoid(0.26, 0.1, 0.3, 16, 16)
  );

  // --- Geometri Sirip/Tangan Baru dari Snippet Anda ---
  const finW = 0.6,
    finH = 0.7,
    topBulge = 0.12,
    bottomBulge = 0.18,
    leftBulge = 0.1;
  const finSegU = 24,
    finSegV = 10,
    finT = 0.2;
  const finGeom = Prm.createSailCoons3D(
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

  // --- NODES & HIERARCHY ---
  const armRoot = new SceneNode(null);
  const upperArmNode = new SceneNode(upperArmMesh, darkBlue);
  const elbowNode = new SceneNode(elbowMesh, darkBlue);
  const leftFore = new SceneNode(forearmMesh, darkBlue);

  // BARU: Node untuk sendi
  const wristJointNode = new SceneNode(wristJointMesh, darkBlue);

  const leftFin = new SceneNode(finMesh, darkBlue);
  const finInnerNode = new SceneNode(finMesh, red);

  armRoot.addChild(upperArmNode);
  upperArmNode.addChild(elbowNode);
  elbowNode.addChild(leftFore);

  // BARU: Hirarki diperbarui untuk menyertakan sendi
  leftFore.addChild(wristJointNode);
  wristJointNode.addChild(leftFin);
  wristJointNode.addChild(finInnerNode);

  // --- TRANSFORMATIONS ---
  // Transformasi Lengan Atas & Siku (dipertahankan dari kode lama)
  mat4.translate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    [-1, 1, 0]
  );
  mat4.rotate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    -Math.PI / 3.6,
    [0, 0, 1]
  );
  mat4.rotate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    -Math.PI / 8,
    [0, 1, 0]
  );
  mat4.scale(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    [0.7, 0.7, 0.7]
  );
  mat4.translate(elbowNode.localTransform, elbowNode.localTransform, arm_p3);

  // Transformasi Lengan Bawah (dipertahankan dari kode lama)
  mat4.translate(leftFore.localTransform, leftFore.localTransform, [0, 0, 0.8]);
  mat4.rotate(
    leftFore.localTransform,
    leftFore.localTransform,
    Math.PI / 6,
    [0, 0, 1]
  );
  mat4.rotate(
    leftFore.localTransform,
    leftFore.localTransform,
    -Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(leftFore.localTransform, leftFore.localTransform, [0.8, 2.5, 1]);

  // BARU: Transformasi untuk sendi pergelangan tangan (ellipsoid)
  // Posisikan di ujung lengan bawah (hyperboloid).
  // Tinggi hyperboloid adalah 0.5, jadi ujung bawahnya di y = -0.25 dalam koordinat lokalnya.
  mat4.translate(
    wristJointNode.localTransform,
    wristJointNode.localTransform,
    [0, -0.25, 0]
  );

  // --- Transformasi untuk Fin/Tangan, sekarang relatif terhadap sendi ---
  // Translasi diatur agar sabit muncul sedikit ke depan dari pusat sendi.
  mat4.translate(leftFin.localTransform, leftFin.localTransform, [0, 0, 0]);
  mat4.rotate(leftFin.localTransform, leftFin.localTransform, 4, [0, 1, 0]);
  mat4.rotate(leftFin.localTransform, leftFin.localTransform, 2, [0, 0, -1]);
  mat4.scale(leftFin.localTransform, leftFin.localTransform, [2.5, 2, 0.9]);

  mat4.translate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    [0, 0.23, 0]
  );
  mat4.rotate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    4,
    [0, 1, 0]
  );
  mat4.rotate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    2,
    [0, 0, -1]
  );
  mat4.scale(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    [3.2, 3.2, 0.1]
  );
  return armRoot;
}

// ---------------------------------------------------------
//  Main Builder
// ---------------------------------------------------------
function createMegaGarchomp(gl) {
  const torso = createMegaGarchompTorso(gl);
  const tail = createMegaGarchompTail(gl);
  const leftLeg = createMegaGarchompLeftLeg(gl); // Buat kaki kiri
  const rightLeg = createMegaGarchompRightLeg(gl);
  const DorsalFin = createDorsalFin(gl);
  const rightarm = createMegaGarchompRightArm(gl);
  const leftarm = createMegaGarchompLeftArm(gl);
  const neck = createMegaGarchompNeck(gl);
  //   const upperHead = createMegaGarchompUpperHead(gl);
  //   const jaw = createMegaGarchompJaw(gl);
  const head = createMegaGarchompHead(gl);
  //   neck.addChild(jaw);
  //   neck.addChild(upperHead);
  neck.addChild(head);
  torso.addChild(DorsalFin);
  torso.addChild(tail);
  torso.addChild(rightarm);
  torso.addChild(leftarm);
  torso.addChild(neck);
  mat4.translate(tail.localTransform, tail.localTransform, [0, -1.5, 0.5]);
  mat4.scale(tail.localTransform, tail.localTransform, [1, 1.3, 1]);

  // Tempelkan kaki kiri ke torso
  torso.addChild(leftLeg);
  mat4.translate(
    leftLeg.localTransform,
    leftLeg.localTransform,
    [-0.5, -1.8, 0]
  ); // Atur posisi pangkal paha
  torso.addChild(rightLeg);
  mat4.translate(
    rightLeg.localTransform,
    leftLeg.localTransform,
    [0.5, 1.8, 0]
  );

  return torso;
}
