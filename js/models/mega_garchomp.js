/**
 * ---
 * MEGA GARCHOMP MODEL SETUP
 * ---
 * You can start by developing the torso in createMegaGarchompTorso().
 * The old head is safely stored in createMegaGarchompHead() for future use.
 */

function createMegaGarchompHead(gl) {
  // --- MESHES ---
  const ellipsoidMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(1, 1.1, 2, 32, 32)
  );
  const ellipsoidMesh2 = new Mesh(
    gl,
    Primitives.createEllipsoid(1, 1, 1, 32, 32)
  );
  const coneMesh = new Mesh(
    gl,
    Primitives.createTriangularPrism(3.8, 2.5, 0.4)
  );
  const crestMesh = new Mesh(gl, Primitives.createChevron(1.6, 2.2, 0.2, 0.1));
  const nostrilMesh = new Mesh(gl, Primitives.createCone(0.1, 0.2, 32));
  const revolutionProfile = [
    [0.6, -1.0],
    [0.5, 1.0],
  ];
  const revolutionMesh = new Mesh(
    gl,
    Curves.createSurfaceOfRevolution(revolutionProfile, 32)
  );
  const smallConeMesh = new Mesh(gl, Primitives.createCone(0.1, 0.3, 16));

  // --- COLORS ---
  const darkBlue = [0.11, 0.16, 0.34, 1.0];
  const yellow = [1.0, 0.8, 0.2, 1.0];

  // --- SCENE NODES ---
  const pangkalKepala = new SceneNode(ellipsoidMesh2, darkBlue);
  const moncong = new SceneNode(coneMesh, darkBlue);
  const tandukKiri = new SceneNode(ellipsoidMesh, darkBlue);
  const tandukKanan = new SceneNode(ellipsoidMesh, darkBlue);
  const crestNode = new SceneNode(crestMesh, yellow);
  const hidung = new SceneNode(nostrilMesh, darkBlue);
  const surfaceNode = new SceneNode(revolutionMesh, darkBlue);
  const surfaceNode2 = new SceneNode(revolutionMesh, darkBlue);
  const surfaceNode3 = new SceneNode(revolutionMesh, darkBlue);
  const telinga1 = new SceneNode(smallConeMesh, darkBlue);
  const telinga2 = new SceneNode(smallConeMesh, darkBlue);

  // --- HIERARCHY ---
  pangkalKepala.addChild(moncong);
  moncong.addChild(tandukKiri);
  moncong.addChild(tandukKanan);
  moncong.addChild(crestNode);
  moncong.addChild(hidung);
  moncong.addChild(surfaceNode);
  moncong.addChild(surfaceNode2);
  moncong.addChild(surfaceNode3);
  moncong.addChild(telinga1);
  moncong.addChild(telinga2);

  // --- TRANSFORMS ---
  mat4.scale(pangkalKepala.localTransform, pangkalKepala.localTransform, [
    0.4, 0.2, 0.3,
  ]);
  mat4.translate(pangkalKepala.localTransform, pangkalKepala.localTransform, [
    0, -1, 0,
  ]);
  mat4.translate(crestNode.localTransform, crestNode.localTransform, [
    0, 0.5, -0.2,
  ]);
  mat4.rotate(crestNode.localTransform, crestNode.localTransform, Math.PI, [
    1.5, 0, 0,
  ]);
  mat4.scale(crestNode.localTransform, crestNode.localTransform, [
    0.5, 0.5, 0.5,
  ]);
  mat4.translate(moncong.localTransform, moncong.localTransform, [
    0, 0.6, 0.5,
  ]);
  mat4.rotate(moncong.localTransform, moncong.localTransform, 1.57, [1, 0, 0]);
  mat4.scale(moncong.localTransform, moncong.localTransform, [3.5, 3, 3]);
  mat4.translate(tandukKiri.localTransform, tandukKiri.localTransform, [
    -1.7, -1.0, -0.1,
  ]);
  mat4.scale(tandukKiri.localTransform, tandukKiri.localTransform, [
    0.4, 1, 0.3,
  ]);
  mat4.translate(tandukKanan.localTransform, tandukKanan.localTransform, [
    1.6, -0.8, -0.1,
  ]);
  mat4.scale(tandukKanan.localTransform, tandukKanan.localTransform, [
    0.4, 1, 0.3,
  ]);
  mat4.translate(hidung.localTransform, hidung.localTransform, [
    -0.0, 0.6, 0.3,
  ]);
  mat4.scale(hidung.localTransform, hidung.localTransform, [3.5, 8.16, 8.16]);
  mat4.rotate(hidung.localTransform, hidung.localTransform, -0.5, [1, 0, 0]);
  mat4.translate(surfaceNode.localTransform, surfaceNode.localTransform, [
    0, -1.3, 2.5,
  ]);
  mat4.rotate(surfaceNode.localTransform, surfaceNode.localTransform, 1.9, [
    1, 0, 0,
  ]);
  mat4.scale(surfaceNode.localTransform, surfaceNode.localTransform, [
    1.5, 2.5, 1.5,
  ]);
  mat4.translate(surfaceNode2.localTransform, surfaceNode2.localTransform, [
    0, -1, 0.4,
  ]);
  mat4.scale(surfaceNode2.localTransform, surfaceNode2.localTransform, [
    1.5, 1.2, 0.5,
  ]);
  mat4.rotate(surfaceNode2.localTransform, surfaceNode2.localTransform, 1.8, [
    1, 0, 0,
  ]);
  mat4.translate(surfaceNode3.localTransform, surfaceNode3.localTransform, [
    0, -0.5, 0.1,
  ]);
  mat4.scale(surfaceNode3.localTransform, surfaceNode3.localTransform, [
    1.1, 1.0, 0.5,
  ]);
  mat4.translate(telinga1.localTransform, telinga1.localTransform, [
    0.8, -0.9, 0.5,
  ]);
  mat4.scale(telinga1.localTransform, telinga1.localTransform, [3.1, 3.0, 4.5]);
  mat4.rotate(telinga1.localTransform, telinga1.localTransform, -1.4, [
    1, 0, 1,
  ]);
  mat4.translate(telinga2.localTransform, telinga2.localTransform, [
    -0.9, -0.9, 0.3,
  ]);
  mat4.scale(telinga2.localTransform, telinga2.localTransform, [3.1, 3.0, 4.5]);
  mat4.rotate(telinga2.localTransform, telinga2.localTransform, 1.4, [
    -1, 0, 1,
  ]);

  return pangkalKepala;
}

// ---------------------------------------------------------
//  NEW: Start Fresh from the Torso
// ---------------------------------------------------------
function createMegaGarchompTorso(gl) {
  // --- COLORS ---
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];
  const yellow = [1.0, 0.84, 0.0, 1.0];
  const white = [0.9, 0.9, 0.9, 1.0]; // Warna putih untuk duri

  // --- MESHES ---
  const upperBodyMesh = new Mesh(gl, Primitives.createEllipsoid(0.8, 1.2, 0.7, 32, 32));
  const lowerBodyMesh = new Mesh(gl, Primitives.createEllipsoid(0.81, 0.9, 0.73, 32, 32));
  const shoulderMesh = new Mesh(gl, Primitives.createEllipticParaboloid(0.8, 0.7, 1.5, 16));
  const connectorMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(0.6, 0.5, 0.8, 1.8, 32, 32));
  const chestPlateMesh = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 32, 32));
  const waistPlateMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(0.6, 0.5, 0.8, 1.8, 32, 32));
  const stomachPlateMesh1 = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 2.9, 100));
  const stomachPlateMesh2 = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 32, 32));
  const spikeMesh = new Mesh(gl, Primitives.createTriangularPrism(0.4, 0.6, 0.1));

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
  const stomachPlateNode2  = new SceneNode(stomachPlateMesh2, red);
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
  mat4.translate(upperBodyNode.localTransform, upperBodyNode.localTransform, [0, 0.5, 0]);
  mat4.translate(lowerBodyNode.localTransform, lowerBodyNode.localTransform, [0, -1.5, 0]);
  mat4.translate(connectorNode.localTransform, connectorNode.localTransform, [0, -0.6, 0]);
  mat4.scale(connectorNode.localTransform, connectorNode.localTransform,[0.64, 0.3, 0.65] );
  mat4.translate(leftShoulderNode.localTransform, leftShoulderNode.localTransform, [-1.4, 1.36, 0]);
  mat4.rotate(leftShoulderNode.localTransform, leftShoulderNode.localTransform, Math.PI / 2.2, [0, 0, -1]);
  mat4.rotate(leftShoulderNode.localTransform, leftShoulderNode.localTransform, Math.PI / 8, [0, 1, -3]);
  mat4.scale(leftShoulderNode.localTransform, leftShoulderNode.localTransform, [0.78, 0.8, 0.75]);
  mat4.translate(rightShoulderNode.localTransform, rightShoulderNode.localTransform, [1.4, 1.36, 0]);
  mat4.rotate(rightShoulderNode.localTransform, rightShoulderNode.localTransform, -Math.PI / 2.2, [0, 0, -1]);
  mat4.rotate(rightShoulderNode.localTransform, rightShoulderNode.localTransform, -Math.PI / 8, [0, 1, -3]);
  mat4.scale(rightShoulderNode.localTransform, rightShoulderNode.localTransform, [0.78, 0.8, 0.75]);
  mat4.translate(chestPlateNode.localTransform, chestPlateNode.localTransform, [0, 0.5, 0.15]); 
  mat4.scale(chestPlateNode.localTransform, chestPlateNode.localTransform, [0.64, 1.2, 0.75]);
  mat4.translate(waistPlateNode.localTransform, waistPlateNode.localTransform, [0, -0.6, 0.05]); 
  mat4.scale(waistPlateNode.localTransform, waistPlateNode.localTransform, [0.6, 1.2, 0.65]);
  mat4.translate(stomachPlateNode1.localTransform, stomachPlateNode1.localTransform, [0, -1.26, 0.29]); 
  mat4.scale(stomachPlateNode1.localTransform, stomachPlateNode1.localTransform, [0.5, 0.65, 0.5]);
  mat4.translate(stomachPlateNode2.localTransform, stomachPlateNode2.localTransform, [0, -1.26, 0.12]); 
  mat4.scale(stomachPlateNode2.localTransform, stomachPlateNode2.localTransform, [0.62, 0.68, 0.5]);
  mat4.translate(ChestSpikeNode1.localTransform, ChestSpikeNode1.localTransform, [0.65, 1.1, 0.45]); 
  mat4.scale(ChestSpikeNode1.localTransform, ChestSpikeNode1.localTransform, [0.6, 1.5, 0.2]);
  mat4.rotate(ChestSpikeNode1.localTransform, ChestSpikeNode1.localTransform,-Math.PI / 2.6, [0, 0, 1]);
  
  mat4.translate(ChestSpikeNode2.localTransform, ChestSpikeNode2.localTransform, [-0.65, 1.1, 0.45]); 
  mat4.scale(ChestSpikeNode2.localTransform, ChestSpikeNode2.localTransform, [0.6, 1.5, 0.2]);
  mat4.rotate(ChestSpikeNode2.localTransform, ChestSpikeNode2.localTransform,-Math.PI / 2.6, [0, 0, -1]);
  
  mat4.translate(ChestSpikeNode3.localTransform, ChestSpikeNode3.localTransform, [0.7, 0.55, 0.47]); 
  mat4.scale(ChestSpikeNode3.localTransform, ChestSpikeNode3.localTransform, [0.6, 1.5, 0.2]);
  mat4.rotate(ChestSpikeNode3.localTransform, ChestSpikeNode3.localTransform,-Math.PI / 2.2, [0, 0, 1]);

  mat4.translate(ChestSpikeNode4.localTransform, ChestSpikeNode4.localTransform, [-0.7, 0.55, 0.47]); 
  mat4.scale(ChestSpikeNode4.localTransform, ChestSpikeNode4.localTransform, [0.6, 1.5, 0.2]);
  mat4.rotate(ChestSpikeNode4.localTransform, ChestSpikeNode4.localTransform,-Math.PI / 2.2, [0, 0, -1]);

  mat4.translate(ChestSpikeNode5.localTransform, ChestSpikeNode5.localTransform, [0.6, 0.03, 0.45]); 
  mat4.scale(ChestSpikeNode5.localTransform, ChestSpikeNode5.localTransform, [0.6, 1.5, 0.2]);
  mat4.rotate(ChestSpikeNode5.localTransform, ChestSpikeNode5.localTransform,-Math.PI / 2, [0, 0, 1]);

  mat4.translate(ChestSpikeNode6.localTransform, ChestSpikeNode6.localTransform, [-0.6, 0.03, 0.45]); 
  mat4.scale(ChestSpikeNode6.localTransform, ChestSpikeNode6.localTransform, [0.6, 1.5, 0.2]);
  mat4.rotate(ChestSpikeNode6.localTransform, ChestSpikeNode6.localTransform,-Math.PI / 2, [0, 0, -1]);

  mat4.translate(ChestSpikeNode7.localTransform, ChestSpikeNode7.localTransform, [0.45, -0.45, 0.3]); 
  mat4.scale(ChestSpikeNode7.localTransform, ChestSpikeNode7.localTransform, [0.4, 0.9, 0.2]);
  mat4.rotate(ChestSpikeNode7.localTransform, ChestSpikeNode7.localTransform,-Math.PI / 1.7, [0, 0, 1]);
  
  mat4.translate(ChestSpikeNode8.localTransform, ChestSpikeNode8.localTransform, [-0.45, -0.45, 0.3]); 
  mat4.scale(ChestSpikeNode8.localTransform, ChestSpikeNode8.localTransform, [0.4, 0.9, 0.2]);
  mat4.rotate(ChestSpikeNode8.localTransform, ChestSpikeNode8.localTransform,-Math.PI / 1.7, [0, 0, -1]);

  mat4.translate(ChestSpikeNode9.localTransform, ChestSpikeNode9.localTransform, [0.4, -0.63, 0.23]); 
  mat4.scale(ChestSpikeNode9.localTransform, ChestSpikeNode9.localTransform, [0.4, 0.4, 0.2]);
  mat4.rotate(ChestSpikeNode9.localTransform, ChestSpikeNode9.localTransform,-Math.PI / 2, [0, 0, 1]);
  
  mat4.translate(ChestSpikeNode10.localTransform, ChestSpikeNode10.localTransform, [-0.4, -0.63, 0.23]); 
  mat4.scale(ChestSpikeNode10.localTransform, ChestSpikeNode10.localTransform, [0.4, 0.4, 0.2]);
  mat4.rotate(ChestSpikeNode10.localTransform, ChestSpikeNode10.localTransform,-Math.PI / 2, [0, 0, -1]);

  return torsoRoot;
}


// ---------------------------------------------------------
//  Build Tail
// ---------------------------------------------------------
function createMegaGarchompTail(gl) {

    const darkBlue = [0.25, 0.25, 0.45, 1.0];
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
        tailPath.push(Curves.getBezierPoint(t, p0, p1, p2, p3));
        scaleFactors.push(1.0 - t); // Meruncing hingga 0
    }



    const tailProfile = [
        [0.0, 0.7], [0.5, 0.5], [0.7, 0.0], [0.5, -0.5],
        [0.0, -0.7], [-0.5, -0.5], [-0.7, 0.0], [-0.5, 0.5]
    ];

   

    const tailMesh = new Mesh(gl, Curves.createTaperedSweptSurface(tailProfile, tailPath, scaleFactors, true));
    // --- SIRIP SAMPING (BARU) ---
    const finProfile = [ [0, 0.3], [0.15, 0], [0, -0.3], [-0.1, 0] ]; // Profil pipih



    // Sirip Kiri
    const leftFin_p0 = [0, 0, 0];
    const leftFin_p1 = [0.5, 0.1, -0.5];
    const leftFin_p2 = [1.0, 0.0, -1.0];
    const leftFin_p3 = [1.5, -0.2, -1.5];
    const leftFinPath = [];
    const leftFinScales = [];

    for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        leftFinPath.push(Curves.getBezierPoint(t, leftFin_p0, leftFin_p1, leftFin_p2, leftFin_p3));
        leftFinScales.push(1.0 - t);
    }

    const leftFinMesh = new Mesh(gl, Curves.createTaperedSweptSurface(finProfile, leftFinPath, leftFinScales, true));
    // Sirip Kanan
    const rightFin_p0 = [0, 0, 0];
    const rightFin_p1 = [-0.5, 0.1, -0.5];
    const rightFin_p2 = [-1.0, 0.0, -1.0];
    const rightFin_p3 = [-1.5, -0.2, -1.5];
    const rightFinPath = [];
    const rightFinScales = [];

    for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        rightFinPath.push(Curves.getBezierPoint(t, rightFin_p0, rightFin_p1, rightFin_p2, rightFin_p3));
        rightFinScales.push(1.0 - t);
    }
    const rightFinMesh = new Mesh(gl, Curves.createTaperedSweptSurface(finProfile, rightFinPath, rightFinScales, true));

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
    mat4.translate(leftFinNode.localTransform, leftFinNode.localTransform, [0, 0.43, -3.8]);
    mat4.rotate(leftFinNode.localTransform, leftFinNode.localTransform, -Math.PI / 2, [-1, -1, 0]);
    mat4.scale(leftFinNode.localTransform, leftFinNode.localTransform, [1, 1, 0.5]);

    mat4.translate(rightFinNode.localTransform, rightFinNode.localTransform, [0, 0.43, -3.8]);
    mat4.rotate(rightFinNode.localTransform, rightFinNode.localTransform, Math.PI / 1.3, [1, 1, 1]);
    mat4.scale(rightFinNode.localTransform, rightFinNode.localTransform, [1, 1, 0.1]);

    return tailRoot;

}

// ---------------------------------------------------------
//  Build Left Leg (DENGAN DURI)
// ---------------------------------------------------------
function createMegaGarchompLeftLeg(gl) {
    const darkBlue = [0.25, 0.25, 0.45, 1.0];
    const white = [0.9, 0.9, 0.9, 1.0];
    const red = [0.8, 0.15, 0.1, 1.0];

    // --- MESHES ---
    const thighMesh = new Mesh(gl, Primitives.createEllipsoid(0.5, 0.8, 0.5, 32, 32)); // Paha
    const shinMesh = new Mesh(gl, Primitives.createEllipsoid(0.5, 0.5, 0.5, 32, 32)); // Betis/Telapak atas
    const shinConnectorMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(0.3, 0.3, 0.5, 0.4, 16, 16)); // Sambungan lutut
    const footMesh = new Mesh(gl, Primitives.createTrapezoidalPrism(0.8, 0.6, 0.3, 0.9)); // Telapak bawah
    const spikeMesh = new Mesh(gl, Primitives.createCone(0.2, 0.8, 16)); // Duri baru

    // --- NODES & HIERARCHY ---
    const legRoot = new SceneNode(null);
    const thighNode = new SceneNode(thighMesh, darkBlue);
    const shinConnectorNode = new SceneNode(shinConnectorMesh, darkBlue);
    const shinNode = new SceneNode(shinMesh, darkBlue);
    const footNode = new SceneNode(footMesh, darkBlue);
    const thighSpikeNode = new SceneNode(spikeMesh, white);
    const thighSpikeNode2 = new SceneNode(spikeMesh, white); // Node untuk duri
    const thighSpikeNode3 = new SceneNode(spikeMesh, red);
    const footSpikeNode = new SceneNode(spikeMesh,white);
    const footSpikeNode2 = new SceneNode(spikeMesh,white);
    const footSpikeNode3 = new SceneNode(spikeMesh,white);
    
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
    mat4.scale(thighNode.localTransform, thighNode.localTransform, [1.15, 1.5, 1.5]);
    mat4.translate(thighNode.localTransform, thighNode.localTransform, [1.1, 0, 0]);
    mat4.rotate(thighNode.localTransform, thighNode.localTransform, Math.PI / 6, [-1, 0, 1]); // Sedikit miring keluar

    // Posisikan sambungan lutut relatif terhadap paha
    mat4.translate(shinConnectorNode.localTransform, shinConnectorNode.localTransform, [0, -0.4, -0.5]);
    mat4.rotate(shinConnectorNode.localTransform, shinConnectorNode.localTransform, Math.PI / 2, [1, 0, 0]);
    mat4.scale(shinConnectorNode.localTransform, shinConnectorNode.localTransform, [1, 1, 0.75]);

    // Posisikan betis relatif terhadap sambungan lutut
    mat4.translate(shinNode.localTransform, shinNode.localTransform, [0, -0.3, 0.22]);
    mat4.scale(shinNode.localTransform, shinNode.localTransform, [0.8, 0.4, 1.2]);

    // Posisikan telapak bawah relatif terhadap betis
    mat4.translate(footNode.localTransform, footNode.localTransform, [1.6, -1.7, -0.4]);
    mat4.scale(footNode.localTransform, footNode.localTransform, [1.2, 1, 1]);
    mat4.rotate(footNode.localTransform, footNode.localTransform, -Math.PI / 6, [0, 0, 0]);

    // Transformasi untuk duri paha
    mat4.translate(thighSpikeNode.localTransform, thighSpikeNode.localTransform, [0.2, 0.2, 0.6]);
    mat4.rotate(thighSpikeNode.localTransform, thighSpikeNode.localTransform, -Math.PI / 1.2, [0, 1, 1]);
    mat4.scale(thighSpikeNode.localTransform, thighSpikeNode.localTransform, [0.4, 0.4, 0.7]); // Sedikit gepeng

    // Transformasi untuk duri paha
    mat4.translate(thighSpikeNode2.localTransform, thighSpikeNode2.localTransform, [0.1, -0.3, 0.6]);
    mat4.rotate(thighSpikeNode2.localTransform, thighSpikeNode2.localTransform, -Math.PI / 1.2, [0, 1, 1]);
    mat4.scale(thighSpikeNode2.localTransform, thighSpikeNode2.localTransform, [0.4, 0.4, 0.7]); // Sedikit gepeng

    // Transformasi untuk duri paha
    mat4.translate(thighSpikeNode3.localTransform, thighSpikeNode3.localTransform, [0, -0.93, 0.2]); // Posisi diatur lebih rendah
    mat4.rotate(thighSpikeNode3.localTransform, thighSpikeNode3.localTransform, Math.PI/1.2, [1, 0, 0]); // Diputar 180 derajat agar menghadap ke bawah
    mat4.scale(thighSpikeNode3.localTransform, thighSpikeNode3.localTransform, [0.7, 0.7, 1]); // Sedikit gepeng

    // Transformasi untuk duri kaki
    mat4.translate(footSpikeNode.localTransform, footSpikeNode.localTransform, [0.2, -0.01, 0.8]); // Posisi disesuaikan agar pas di depan
    mat4.rotate(footSpikeNode.localTransform, footSpikeNode.localTransform, -Math.PI / 2, [-1, 0, 0]); // Diputar -90 derajat pada sumbu X
    mat4.scale(footSpikeNode.localTransform, footSpikeNode.localTransform, [0.8, 1, 0.8]); // Sedikit gepeng
    // Transformasi untuk duri kaki
    mat4.translate(footSpikeNode2.localTransform, footSpikeNode2.localTransform, [-0.01, -0.01, 0.8]); // Posisi disesuaikan agar pas di depan
    mat4.rotate(footSpikeNode2.localTransform, footSpikeNode2.localTransform, -Math.PI / 2, [-1, 0, 0]); // Diputar -90 derajat pada sumbu X
    mat4.scale(footSpikeNode2.localTransform, footSpikeNode2.localTransform, [0.8, 1, 0.8]); // Sedikit gepeng
    // Transformasi untuk duri kaki
    mat4.translate(footSpikeNode3.localTransform, footSpikeNode3.localTransform, [-0.2, -0.01, 0.8]); // Posisi disesuaikan agar pas di depan
    mat4.rotate(footSpikeNode3.localTransform, footSpikeNode3.localTransform, -Math.PI / 2, [-1, 0, 0]); // Diputar -90 derajat pada sumbu X
    mat4.scale(footSpikeNode3.localTransform, footSpikeNode3.localTransform, [0.8, 1, 0.8]); // Sedikit gepeng
    

    return legRoot;
}

function createMegaGarchompRightLeg(gl) {
    const darkBlue = [0.25, 0.25, 0.45, 1.0];
    const white = [0.9, 0.9, 0.9, 1.0];
    const red = [0.8, 0.15, 0.1, 1.0];

    // --- MESHES ---
    const thighMesh = new Mesh(gl, Primitives.createEllipsoid(0.5, 0.8, 0.5, 32, 32)); // Paha
    const shinMesh = new Mesh(gl, Primitives.createEllipsoid(0.5, 0.5, 0.5, 32, 32)); // Betis/Telapak atas
    const shinConnectorMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(0.3, 0.3, 0.5, 0.4, 16, 16)); // Sambungan lutut
    const footMesh = new Mesh(gl, Primitives.createTrapezoidalPrism(0.8, 0.6, 0.3, 0.9)); // Telapak bawah
    const spikeMesh = new Mesh(gl, Primitives.createCone(0.2, 0.8, 16)); // Duri

    // --- NODES & HIERARCHY ---
    const legRoot = new SceneNode(null);
    const thighNode = new SceneNode(thighMesh, darkBlue);
    const shinConnectorNode = new SceneNode(shinConnectorMesh, darkBlue);
    const shinNode = new SceneNode(shinMesh, darkBlue);
    const footNode = new SceneNode(footMesh, darkBlue);
    const thighSpikeNode = new SceneNode(spikeMesh, white);
    const thighSpikeNode2 = new SceneNode(spikeMesh, white);
    const thighSpikeNode3 = new SceneNode(spikeMesh, red);
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
    mat4.scale(thighNode.localTransform, thighNode.localTransform, [1.15, 1.5, 1.5]);
    mat4.translate(thighNode.localTransform, thighNode.localTransform, [-0.7, -1.2, 0]);
    mat4.rotate(thighNode.localTransform, thighNode.localTransform, Math.PI / 6, [-1, 0, -1]); // arah miring dibalik

    // Posisikan sambungan lutut relatif terhadap paha
    mat4.translate(shinConnectorNode.localTransform, shinConnectorNode.localTransform, [0, -0.4, -0.5]);
    mat4.rotate(shinConnectorNode.localTransform, shinConnectorNode.localTransform, Math.PI / 2, [1, 0, 0]);
    mat4.scale(shinConnectorNode.localTransform, shinConnectorNode.localTransform, [1, 1, 0.75]);

    // Posisikan betis relatif terhadap sambungan lutut
    mat4.translate(shinNode.localTransform, shinNode.localTransform, [0, -0.3, 0.22]);
    mat4.scale(shinNode.localTransform, shinNode.localTransform, [0.8, 0.4, 1.2]);

    // Posisikan telapak bawah (mirror pada sumbu X)
    mat4.translate(footNode.localTransform, footNode.localTransform, [-1.1, -3.5, -0.4]);
    mat4.scale(footNode.localTransform, footNode.localTransform, [1.2, 1, 1]);
    mat4.rotate(footNode.localTransform, footNode.localTransform, Math.PI / 6, [0, 0, 0]);

    // Transformasi duri paha (mirror posisi x)
    mat4.translate(thighSpikeNode.localTransform, thighSpikeNode.localTransform, [-0.2, 0.2, 0.6]);
    mat4.rotate(thighSpikeNode.localTransform, thighSpikeNode.localTransform, Math.PI / 1.2, [0, 1, 1]);
    mat4.scale(thighSpikeNode.localTransform, thighSpikeNode.localTransform, [0.4, 0.4, 0.7]);

    mat4.translate(thighSpikeNode2.localTransform, thighSpikeNode2.localTransform, [-0.1, -0.3, 0.6]);
    mat4.rotate(thighSpikeNode2.localTransform, thighSpikeNode2.localTransform, Math.PI / 1.2, [0, 1, 1]);
    mat4.scale(thighSpikeNode2.localTransform, thighSpikeNode2.localTransform, [0.4, 0.4, 0.7]);

    mat4.translate(thighSpikeNode3.localTransform, thighSpikeNode3.localTransform, [0, -0.93, 0.2]);
    mat4.rotate(thighSpikeNode3.localTransform, thighSpikeNode3.localTransform, Math.PI / 1.2, [1, 0, 0]);
    mat4.scale(thighSpikeNode3.localTransform, thighSpikeNode3.localTransform, [0.7, 0.7, 1]);

    // Duri kaki (mirror posisi x)
    mat4.translate(footSpikeNode.localTransform, footSpikeNode.localTransform, [-0.2, -0.01, 0.8]);
    mat4.rotate(footSpikeNode.localTransform, footSpikeNode.localTransform, -Math.PI / 2, [-1, 0, 0]);
    mat4.scale(footSpikeNode.localTransform, footSpikeNode.localTransform, [0.8, 1, 0.8]);

    mat4.translate(footSpikeNode2.localTransform, footSpikeNode2.localTransform, [0.01, -0.01, 0.8]);
    mat4.rotate(footSpikeNode2.localTransform, footSpikeNode2.localTransform, -Math.PI / 2, [-1, 0, 0]);
    mat4.scale(footSpikeNode2.localTransform, footSpikeNode2.localTransform, [0.8, 1, 0.8]);

    mat4.translate(footSpikeNode3.localTransform, footSpikeNode3.localTransform, [0.2, -0.01, 0.8]);
    mat4.rotate(footSpikeNode3.localTransform, footSpikeNode3.localTransform, -Math.PI / 2, [-1, 0, 0]);
    mat4.scale(footSpikeNode3.localTransform, footSpikeNode3.localTransform, [0.8, 1, 0.8]);

    return legRoot;
}


// ---------------------------------------------------------
//  MAIN ENTRY
// ---------------------------------------------------------
function createMegaGarchomp(gl) {
  const torso = createMegaGarchompTorso(gl);
  const tail = createMegaGarchompTail(gl);
  const leftLeg = createMegaGarchompLeftLeg(gl); // Buat kaki kiri
  const rightLeg = createMegaGarchompRightLeg(gl);
  torso.addChild(tail);
  mat4.translate(tail.localTransform, tail.localTransform, [0, -1.5, 0.5]);
  mat4.scale(tail.localTransform, tail.localTransform, [1, 1.3, 1]);

  // Tempelkan kaki kiri ke torso
  torso.addChild(leftLeg);
  mat4.translate(leftLeg.localTransform, leftLeg.localTransform, [-0.5, -1.8, 0]); // Atur posisi pangkal paha
  torso.addChild(rightLeg)
  mat4.translate(rightLeg.localTransform, leftLeg.localTransform, [0.5, 1.8, 0]);

  return torso;
}

