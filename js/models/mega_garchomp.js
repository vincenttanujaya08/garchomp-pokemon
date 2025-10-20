/**
 * ---
 * MEGA GARCHOMP MODEL SETUP
 * ---
 * You can start by developing the torso in createMegaGarchompTorso().
 * The old head is safely stored in createMegaGarchompHead() for future use.
 */

function createMegaGarchompNeck(gl) {
    const darkBlue = [0.25, 0.25, 0.45, 1.0];
    const lightBlue = [0.6, 0.6, 1.0, 1.0];
    const red = [0.8, 0.15, 0.1, 1.0];
    const redOrange = [1.0, 0.4, 0.2, 1.0];

    // --- MESH ---
    // Menggunakan Hyperboloid of 1 Sheet untuk bentuk leher yang organik
    const neckMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(
        0.6,  // radiusX di bagian terlebar
        0.6,  // radiusZ di bagian terlebar
        0.4,  // pinchY (seberapa "ramping" di tengah)
        1.0,  // height (panjang leher)
        16,   // latitudeBands (segmen vertikal)
        16    // longitudeBands (segmen horizontal)
    ));

    const neckMesh2 = new Mesh(gl, Primitives.createHyperboloidOneSheet(
        0.6,  // radiusX di bagian terlebar
        0.6,  // radiusZ di bagian terlebar
        0.4,  // pinchY (seberapa "ramping" di tengah)
        1.0,  // height (panjang leher)
        16,   // latitudeBands (segmen vertikal)
        16    // longitudeBands (segmen horizontal)
    ));

    // --- NODE ---
    const neckNode = new SceneNode(neckMesh, lightBlue);
    const neckNode2 = new SceneNode (neckMesh2, redOrange);

    neckNode.addChild(neckNode2);

    // --- TRANSFORMASI ---
    // Sedikit memiringkan leher ke depan
    mat4.rotate(neckNode.localTransform, neckNode.localTransform, Math.PI / 10, [1, 0, 0]);
    mat4.scale(neckNode.localTransform,neckNode.localTransform, [0.6, 0.85, 0.5]);
    mat4.translate(neckNode.localTransform, neckNode.localTransform, [0, 2, -0.7]);

    mat4.rotate(neckNode2.localTransform, neckNode2.localTransform, Math.PI / 12, [1, 0, 0]);
    mat4.scale(neckNode2.localTransform,neckNode2.localTransform, [0.6, 0.7, 0.5]);
    mat4.translate(neckNode2.localTransform, neckNode2.localTransform, [0, 0.4, 0.7]);


    return neckNode;
}
// ---------------------------------------------------------
//  Build Lower Jaw
// ---------------------------------------------------------
function createMegaGarchompJaw(gl) {
}

// ---------------------------------------------------------
//  Build Upper Head (Bentuk Rugby)
// ---------------------------------------------------------
function createMegaGarchompUpperHead(gl) {
    const darkBlue = [0.25, 0.25, 0.45, 1.0];
    const lightBlue = [0.6, 0.6, 1.0, 1.0];
    const yellow = [1.0, 0.84, 0.0, 1.0];

    // --- MESHES ---

    // BARU: Membuat profil 2D untuk bentuk rugby menggunakan kurva Bezier
    const rugbyProfile = [];
    const smoothness = 10; // Jumlah titik, naikkan untuk lebih halus

    // Titik-titik untuk setengah profil (dari ujung atas ke tengah)
    const p0 = [0.0, 1.8, 0];   // Ujung atas (lebih runcing)
    const p1 = [0.4, 1.2, 0];   // Kontrol untuk kelengkungan atas
    const p2 = [0.7, 0.5, 0];   // Kontrol untuk bagian tengah yang lebih lebar
    const p3 = [0.7, 0.0, 0];   // Titik tengah (paling lebar di sumbu X)

    // Hasilkan titik-titik di sepanjang kurva atas
    for (let i = 0; i <= smoothness; i++) {
        const t = i / smoothness;
        const pt = Curves.getBezierPoint(t, p0, p1, p2, p3);
        rugbyProfile.push([pt[0], pt[1]]); // Hanya perlu x dan y untuk surface of revolution
    }
    
    // Cerminkan profil untuk membuat bagian bawah, pastikan tidak ada titik duplikat di tengah
    for (let i = smoothness - 1; i >= 0; i--) {
        const pt = rugbyProfile[i];
        // Hanya tambahkan jika titiknya tidak nol di sumbu y untuk menghindari duplikasi
        if (Math.abs(pt[1]) > 0.0001) {
             rugbyProfile.push([pt[0], -pt[1]]);
        }
    }

    // Buat mesh dengan memutar profil di sekitar sumbu Y
    const rugbyMesh = new Mesh(gl, Curves.createSurfaceOfRevolution(rugbyProfile, 32));

    // Mesh untuk penghubung tetap sama
    const connectorMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(0.5, 0.5, 0.4, 1.0, 16, 16));

    // Mesh untuk hidung
    const nosePrismMesh = new Mesh(gl, Primitives.createTriangularPrism(0.4, 0.7, 0.2));

    // BARU: Mesh untuk bagian bawah rahang
    const underJawMesh = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 32, 32));

    // --- NODES & HIERARCHY ---
    const upperHeadRoot = new SceneNode(null);

    // Sekarang setiap "rugby" hanya butuh satu node
    const centerRugbyNode = new SceneNode(rugbyMesh, lightBlue);
    const leftRugbyNode = new SceneNode(rugbyMesh, lightBlue);
    const rightRugbyNode = new SceneNode(rugbyMesh, lightBlue);

    const leftConnectorNode = new SceneNode(connectorMesh, lightBlue);
    const rightConnectorNode = new SceneNode(connectorMesh, lightBlue);
    
    const noseLeftNode = new SceneNode(nosePrismMesh, lightBlue);
    const noseRightNode = new SceneNode(nosePrismMesh, lightBlue);

    // BARU: Node untuk bagian mata
    const underJawNode = new SceneNode(underJawMesh, lightBlue);

    // Gabungkan semua
    upperHeadRoot.addChild(centerRugbyNode);
    upperHeadRoot.addChild(leftRugbyNode);
    upperHeadRoot.addChild(rightRugbyNode);
    upperHeadRoot.addChild(leftConnectorNode);
    upperHeadRoot.addChild(rightConnectorNode);

    // Tambahkan hidung sebagai anak dari rugby tengah
    centerRugbyNode.addChild(noseLeftNode);
    centerRugbyNode.addChild(noseRightNode);
    
    // BARU: Tambahkan bagian bawah rahang sebagai anak dari rugby tengah
    centerRugbyNode.addChild(underJawNode);


    // --- TRANSFORMATIONS ---
    // Transformasi GLOBAL untuk seluruh kepala
    mat4.translate(upperHeadRoot.localTransform, upperHeadRoot.localTransform, [0, 1.5, 0]);
    mat4.scale(upperHeadRoot.localTransform, upperHeadRoot.localTransform, [1, 0.7, 1.2]);
    // Rugby Tengah
    mat4.scale(centerRugbyNode.localTransform, centerRugbyNode.localTransform, [1.3, 1, 1]);
    // Rugby kiri
    mat4.translate(leftRugbyNode.localTransform, leftRugbyNode.localTransform, [-1.7, 0, 0]);
    mat4.scale(leftRugbyNode.localTransform, leftRugbyNode.localTransform, [0.6, 0.6, 0.6]);

    // Rugby kanan
    mat4.translate(rightRugbyNode.localTransform, rightRugbyNode.localTransform, [1.7, 0, 0]);
    mat4.scale(rightRugbyNode.localTransform, rightRugbyNode.localTransform, [0.6, 0.6, 0.6]);

    // Transformasi untuk penghubung
    // Penghubung Kiri
    mat4.translate(leftConnectorNode.localTransform, leftConnectorNode.localTransform, [-0.9, 0, 0]);
    mat4.rotate(leftConnectorNode.localTransform, leftConnectorNode.localTransform, Math.PI / 2, [0, 0, 1]); 
    mat4.scale(leftConnectorNode.localTransform, leftConnectorNode.localTransform, [0.8, 1, 0.25]);

    // Penghubung Kanan
    mat4.translate(rightConnectorNode.localTransform, rightConnectorNode.localTransform, [0.9, 0, 0]);
    mat4.rotate(rightConnectorNode.localTransform, rightConnectorNode.localTransform, Math.PI / 2, [0, 0, 1]);
    mat4.scale(rightConnectorNode.localTransform, rightConnectorNode.localTransform, [0.8, 1, 0.25]);

    // Transformasi untuk "hidung" (tidak diubah)
    mat4.translate(noseLeftNode.localTransform, noseLeftNode.localTransform, [-0.08, 1, 0.6]);
    mat4.rotate(noseLeftNode.localTransform, noseLeftNode.localTransform, Math.PI / 50, [0, 1, 0]);
    mat4.rotate(noseLeftNode.localTransform, noseLeftNode.localTransform, Math.PI / 2, [1, 0, 0]);
    mat4.rotate(noseLeftNode.localTransform, noseLeftNode.localTransform, 6.07, [0, 0, 1]);
    mat4.scale(noseLeftNode.localTransform, noseLeftNode.localTransform, [1, 1.1, 0.3]);

    mat4.translate(noseRightNode.localTransform, noseRightNode.localTransform, [0.1, 1, 0.6]);
    mat4.rotate(noseRightNode.localTransform, noseRightNode.localTransform, -Math.PI / 50, [0, 1, 0]);
    mat4.rotate(noseRightNode.localTransform, noseRightNode.localTransform, Math.PI / 2, [1, 0, 0]);
    mat4.rotate(noseRightNode.localTransform, noseRightNode.localTransform, 6.1, [0, 0, -1]);
    mat4.scale(noseRightNode.localTransform, noseRightNode.localTransform, [1, 1.1, 0.3]);
    
    // BARU: Transformasi untuk elipsoid bawah rahang
    mat4.translate(underJawNode.localTransform, underJawNode.localTransform, [0, -0.03, 0.3]); // Posisikan di bawah-depan
    mat4.rotate(underJawNode.localTransform, underJawNode.localTransform, Math.PI / 10, [1, 0, 0]); // REBAHKAN elipsoid agar 'tidur'
    mat4.scale(underJawNode.localTransform, underJawNode.localTransform, [0.6, 1.1, 0.5]); // Buat gepeng dan lonjong


    // Putar seluruh bagian kepala atas agar horizontal
    mat4.rotate(upperHeadRoot.localTransform, upperHeadRoot.localTransform, Math.PI / 2, [1, 0, 0]);


    return upperHeadRoot;
}


// ---------------------------------------------------------
//  NEW: Start Fresh from the Torso
// ---------------------------------------------------------
function createMegaGarchompTorso(gl) {
  // --- COLORS ---
  const darkBlue = [0.25, 0.25, 0.45, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];
  const redOrange = [1.0, 0.4, 0.2, 1.0];
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
  const upperBodyNode = new SceneNode(upperBodyMesh, lightBlue);
  const lowerBodyNode = new SceneNode(lowerBodyMesh, lightBlue);
  const leftShoulderNode = new SceneNode(shoulderMesh, lightBlue);
  const rightShoulderNode = new SceneNode(shoulderMesh, lightBlue);
  const connectorNode = new SceneNode(connectorMesh, lightBlue);
  const chestPlateNode = new SceneNode(chestPlateMesh, redOrange);
  const waistPlateNode = new SceneNode(waistPlateMesh, redOrange);
  const stomachPlateNode1 = new SceneNode(stomachPlateMesh1, yellow);
  const stomachPlateNode2  = new SceneNode(stomachPlateMesh2, redOrange);
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
    const mainTailNode = new SceneNode(tailMesh, lightBlue);
    const leftFinNode = new SceneNode(leftFinMesh, lightBlue);
    const rightFinNode = new SceneNode(rightFinMesh, lightBlue);

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
    const lightBlue = [0.6, 0.6, 1.0, 1.0];
    const white = [0.9, 0.9, 0.9, 1.0];
    const red = [0.8, 0.15, 0.1, 1.0];
    const redOrange = [1.0, 0.4, 0.2, 1.0];

    // --- MESHES ---
    const thighMesh = new Mesh(gl, Primitives.createEllipsoid(0.5, 0.8, 0.5, 32, 32)); // Paha
    const shinMesh = new Mesh(gl, Primitives.createEllipsoid(0.5, 0.5, 0.5, 32, 32)); // Betis/Telapak atas
    const shinConnectorMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(0.3, 0.3, 0.5, 0.4, 16, 16)); // Sambungan lutut
    const footMesh = new Mesh(gl, Primitives.createTrapezoidalPrism(0.8, 0.6, 0.3, 0.9)); // Telapak bawah
    const spikeMesh = new Mesh(gl, Primitives.createCone(0.2, 0.8, 16)); // Duri baru

    // --- NODES & HIERARCHY ---
    const legRoot = new SceneNode(null);
    const thighNode = new SceneNode(thighMesh, lightBlue);
    const shinConnectorNode = new SceneNode(shinConnectorMesh, lightBlue);
    const shinNode = new SceneNode(shinMesh, lightBlue);
    const footNode = new SceneNode(footMesh, lightBlue);
    const thighSpikeNode = new SceneNode(spikeMesh, white);
    const thighSpikeNode2 = new SceneNode(spikeMesh, white); // Node untuk duri
    const thighSpikeNode3 = new SceneNode(spikeMesh, redOrange);
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
    const lightBlue = [0.6, 0.6, 1.0, 1.0];
    const white = [0.9, 0.9, 0.9, 1.0];
    const red = [0.8, 0.15, 0.1, 1.0];
    const redOrange = [1.0, 0.4, 0.2, 1.0];

    // --- MESHES ---
    const thighMesh = new Mesh(gl, Primitives.createEllipsoid(0.5, 0.8, 0.5, 32, 32)); // Paha
    const shinMesh = new Mesh(gl, Primitives.createEllipsoid(0.5, 0.5, 0.5, 32, 32)); // Betis/Telapak atas
    const shinConnectorMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(0.3, 0.3, 0.5, 0.4, 16, 16)); // Sambungan lutut
    const footMesh = new Mesh(gl, Primitives.createTrapezoidalPrism(0.8, 0.6, 0.3, 0.9)); // Telapak bawah
    const spikeMesh = new Mesh(gl, Primitives.createCone(0.2, 0.8, 16)); // Duri

    // --- NODES & HIERARCHY ---
    const legRoot = new SceneNode(null);
    const thighNode = new SceneNode(thighMesh, lightBlue);
    const shinConnectorNode = new SceneNode(shinConnectorMesh, lightBlue);
    const shinNode = new SceneNode(shinMesh, lightBlue);
    const footNode = new SceneNode(footMesh, lightBlue);
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
function createDorsalFin(gl) {
    const darkBlue = [0.25, 0.25, 0.45, 1.0];
    const lightBlue = [0.6, 0.6, 1.0, 1.0];

    // -- Gabungkan semua titik menjadi SATU array --
    // Urutan titik diatur untuk menjiplak seluruh outline sirip, TANPA B dan C
    const finShapePoints = [
        // Garis atas sirip
        [0.06, 0, 2.87], // A
        [1.6, 0, 2.97],  // D
        [3.32, 0, 3.17], // E
        [4.4, 0, 3.09],  // F
        [5.38, 0, 2.91], // G
        [6.5, 0, 2.57],  // H
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
        [0.02, 0, 0.71]  // S
    ];


    // Buat satu mesh dari satu outline utuh
    const finMesh = new Mesh(gl, Primitives.createExtrudedShape(finShapePoints, 0.2));

    const dorsalFinRoot = new SceneNode(finMesh, lightBlue);
    
    // -- TRANSFORMASI KESELURUHAN --
    // Rotasi agar berdiri tegak
    mat4.rotate(dorsalFinRoot.localTransform, dorsalFinRoot.localTransform, Math.PI / 2, [-1, 0 , 0]);
    mat4.rotate(dorsalFinRoot.localTransform, dorsalFinRoot.localTransform, Math.PI / 2, [0, 0 , 1]);
    // Sesuaikan skala agar proporsional
    mat4.scale(dorsalFinRoot.localTransform, dorsalFinRoot.localTransform, [0.4, 0.4, 0.4]);
    mat4.translate(dorsalFinRoot.localTransform, dorsalFinRoot.localTransform, [1, 0, 0]);

    return dorsalFinRoot;
}

// ---------------------------------------------------------
//  Build Right Arm
// ---------------------------------------------------------
function createMegaGarchompRightArm(gl) {
    const darkBlue = [0.25, 0.25, 0.45, 1.0];
    const lightBlue = [0.6, 0.6, 1.0, 1.0];
    const red = [0.8, 0.15, 0.1, 1.0];
    const redOrange = [1.0, 0.4, 0.2, 1.0];

    // --- MESHES ---
    // NEW: Define path and profile for a curved upper arm (mirrored)
    const armProfile = [];
    const armRadius = 0.3;
    const armSides = 16;
    for (let i = 0; i <= armSides; i++) {
        const angle = (i / armSides) * 2 * Math.PI;
        armProfile.push([Math.cos(angle) * armRadius, Math.sin(angle) * armRadius]);
    }

    const arm_p0 = [0, 0, 0];
    const arm_p1 = [-0.1, -0.4, 0]; // Mirrored X
    const arm_p2 = [-0.1, -1.0, 0]; // Mirrored X
    const arm_p3 = [-0.2, -1.5, 0]; // Mirrored X
    const armPath = [];
    const armSegments = 10;
    for (let i = 0; i <= armSegments; i++) {
        const t = i / armSegments;
        armPath.push(Curves.getBezierPoint(t, arm_p0, arm_p1, arm_p2, arm_p3));
    }
    const upperArmMesh = new Mesh(gl, Curves.createSweptSurface(armProfile, armPath, true));
    
    const elbowMesh = new Mesh(gl, Primitives.createEllipsoid(0.4, 0.25, 0.35, 16, 16));
    const connectorMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(0.2, 0.2, 0.3, 0.5, 16, 16));
    
    // --- Implementasi Scythe Baru ---
    // 1. Profil "geprek" (elliptical) untuk bentuk sabit BIRU (DALAM)
    const innerScytheProfile = [];
    const profileRadiusX = 0.2; // Lebar penampang
    const profileRadiusY = 1; // Ketebalan penampang (tipis)
    const profileSides = 16;
    for (let i = 0; i <= profileSides; i++) {
        const angle = (i / profileSides) * 2 * Math.PI;
        innerScytheProfile.push([Math.cos(angle) * profileRadiusX, Math.sin(angle) * profileRadiusY]);
    }

    // BARU: Profil untuk sabit MERAH (LUAR) yang lebih besar
    const outerScytheProfile = [];
    const outerProfileRadiusX = profileRadiusX * 1.2; // Dibuat lebih lebar (dari 1.1 menjadi 1.2)
    const outerProfileRadiusY = profileRadiusY * 1.2; // Dibuat lebih tebal (dari 1.1 menjadi 1.2)
    for (let i = 0; i <= profileSides; i++) {
        const angle = (i / profileSides) * 2 * Math.PI;
        outerScytheProfile.push([Math.cos(angle) * outerProfileRadiusX, Math.sin(angle) * outerProfileRadiusY]);
    }

    // 2. Jalur kurva Bezier untuk membentuk bulan sabit (digunakan oleh kedua scythe)
    const scythePath = [];
    const scytheSegments = 20; // Jumlah segmen untuk kehalusan
    const p0 = [0, 0, 0];                  // Titik awal di pergelangan
    const p1 = [-1.5, -0.5, 0];            // Titik kontrol 1
    const p2 = [-2.5, -2.5, 0];            // Titik kontrol 2
    const p3 = [-1.0, -4.0, 0];            // Titik ujung sabit
    for (let i = 0; i <= scytheSegments; i++) {
        const t = i / scytheSegments;
        scythePath.push(Curves.getBezierPoint(t, p0, p1, p2, p3));
    }

    // 3. Faktor skala (kecil -> besar -> kecil)
    const scaleFactors = [];
    for (let i = 0; i <= scytheSegments; i++) {
        const t = i / scytheSegments;
        // Math.sin(t * Math.PI) menghasilkan kurva 0 -> 1 -> 0, sempurna untuk efek ini
        const bulge = Math.sin(t * Math.PI); 
        // 0.1 adalah skala minimum di ujung, 0.9 adalah seberapa besar puncaknya
        scaleFactors.push(0.01 + bulge * 0.9);
    }

    const innerScytheMesh = new Mesh(gl, Curves.createTaperedSweptSurface(innerScytheProfile, scythePath, scaleFactors, true));
    const outerScytheMesh = new Mesh(gl, Curves.createTaperedSweptSurface(outerScytheProfile, scythePath, scaleFactors, true));
    
    // --- NODES & HIERARCHY ---
    const armRoot = new SceneNode(null);
    const upperArmNode = new SceneNode(upperArmMesh, lightBlue);
    const elbowNode = new SceneNode(elbowMesh, lightBlue);
    const connectorNode = new SceneNode(connectorMesh, lightBlue);
    const outerScytheNode = new SceneNode(outerScytheMesh, redOrange); // Sabit luar berwarna MERAH
    const innerScytheNode = new SceneNode(innerScytheMesh, lightBlue); // Sabit dalam berwarna BIRU

    armRoot.addChild(upperArmNode);
    upperArmNode.addChild(elbowNode);
    elbowNode.addChild(connectorNode);
    // connectorNode.addChild(outerScytheNode); // Sambungkan sabit luar ke connector
    // connectorNode.addChild(innerScytheNode); // Sambungkan sabit dalam ke sabit luar

    // --- TRANSFORMATIONS (Mirrored) ---
    // Upper Arm
    mat4.translate(upperArmNode.localTransform, upperArmNode.localTransform, [1, 1, 0]);
    mat4.rotate(upperArmNode.localTransform, upperArmNode.localTransform, Math.PI / 3.6, [0, 0, 1]); // Mirror Z rotation
    mat4.rotate(upperArmNode.localTransform, upperArmNode.localTransform, Math.PI / 8, [0, 1, 0]); // Mirror Y rotation
    mat4.scale(upperArmNode.localTransform, upperArmNode.localTransform, [0.7, 0.7, 0.7]);

    // Elbow is positioned at the end point of the mirrored Bezier curve (p3)
    mat4.translate(elbowNode.localTransform, elbowNode.localTransform, arm_p3);

    // Connector
    mat4.translate(connectorNode.localTransform, connectorNode.localTransform, [-0, 0, 0.8]);
    mat4.rotate(connectorNode.localTransform, connectorNode.localTransform, -Math.PI / 5, [0, 0, 1]);
    mat4.rotate(connectorNode.localTransform, connectorNode.localTransform, -Math.PI / 2, [1, 0, 0]); // Mirror Z rotation
    mat4.scale(connectorNode.localTransform, connectorNode.localTransform, [0.8, 2.5, 1]);

  
    // // Atur posisi dan orientasi sabit LUAR (MERAH)
    // mat4.translate(outerScytheNode.localTransform, outerScytheNode.localTransform, [0.2, -0.1, -1.5]);
    // mat4.rotate(outerScytheNode.localTransform, outerScytheNode.localTransform, -Math.PI / 2.2, [1, 0, 0]);
    // mat4.rotate(outerScytheNode.localTransform, outerScytheNode.localTransform, Math.PI / 10, [0, -1, 0]);
    
    // // PERBAIKAN: Dibuat geprek ke samping (sumbu X) dan sedikit lebih besar dari sabit biru
    // mat4.scale(outerScytheNode.localTransform, outerScytheNode.localTransform, [0.3, 1, 1]); 

    // // ====================================================================================================================

    //     // Atur posisi dan orientasi sabit DALAM (BIRU)
    // mat4.translate(innerScytheNode.localTransform, innerScytheNode.localTransform, [1, 0.2, -0.9]);
    // mat4.rotate(innerScytheNode.localTransform, innerScytheNode.localTransform, -Math.PI / 2.2, [1, 0, 0]);
    // mat4.rotate(innerScytheNode.localTransform, innerScytheNode.localTransform, Math.PI / 10, [0, -1, 0]);
    
    // // Terapkan skala normal untuk sabit BIRU (tidak geprek)
    // mat4.scale(innerScytheNode.localTransform, innerScytheNode.localTransform, [0.8, 0.8, 0.8]);
  
    return armRoot;
}

// ---------------------------------------------------------
//  Build Left Arm
// ---------------------------------------------------------
function createMegaGarchompLeftArm(gl) {
    const darkBlue = [0.25, 0.25, 0.45, 1.0];
    const lightBlue = [0.6, 0.6, 1.0, 1.0];
    const red = [0.8, 0.15, 0.1, 1.0];
    const redOrange = [1.0, 0.4, 0.2, 1.0];

    // --- MESHES ---
    // Lengan atas melengkung
    const armProfile = [];
    const armRadius = 0.3;
    const armSides = 16;
    for (let i = 0; i <= armSides; i++) {
        const angle = (i / armSides) * 2 * Math.PI;
        armProfile.push([Math.cos(angle) * armRadius, Math.sin(angle) * armRadius]);
    }

    const arm_p0 = [0, 0, 0];
    const arm_p1 = [0.1, -0.4, 0]; // Non-mirrored X
    const arm_p2 = [0.1, -1.0, 0]; // Non-mirrored X
    const arm_p3 = [0.2, -1.5, 0]; // Non-mirrored X
    const armPath = [];
    const armSegments = 10;
    for (let i = 0; i <= armSegments; i++) {
        const t = i / armSegments;
        armPath.push(Curves.getBezierPoint(t, arm_p0, arm_p1, arm_p2, arm_p3));
    }
    const upperArmMesh = new Mesh(gl, Curves.createSweptSurface(armProfile, armPath, true));
    
    const elbowMesh = new Mesh(gl, Primitives.createEllipsoid(0.4, 0.25, 0.35, 16, 16));
    const connectorMesh = new Mesh(gl, Primitives.createHyperboloidOneSheet(0.2, 0.2, 0.3, 0.5, 16, 16));
    
    // --- NODES & HIERARCHY ---
    const armRoot = new SceneNode(null);
    const upperArmNode = new SceneNode(upperArmMesh, lightBlue);
    const elbowNode = new SceneNode(elbowMesh, lightBlue);
    const connectorNode = new SceneNode(connectorMesh, lightBlue);

    armRoot.addChild(upperArmNode);
    upperArmNode.addChild(elbowNode);
    elbowNode.addChild(connectorNode);

    // --- TRANSFORMATIONS ---
    // Upper Arm
    mat4.translate(upperArmNode.localTransform, upperArmNode.localTransform, [-1, 1, 0]); // Mirrored translate
    mat4.rotate(upperArmNode.localTransform, upperArmNode.localTransform, -Math.PI / 3.6, [0, 0, 1]); // Mirrored Z rotation
    mat4.rotate(upperArmNode.localTransform, upperArmNode.localTransform, -Math.PI / 8, [0, 1, 0]); // Mirrored Y rotation
    mat4.scale(upperArmNode.localTransform, upperArmNode.localTransform, [0.7, 0.7, 0.7]);

    // Elbow
    mat4.translate(elbowNode.localTransform, elbowNode.localTransform, arm_p3);

    // Connector
    mat4.translate(connectorNode.localTransform, connectorNode.localTransform, [0, 0, 0.8]);
    mat4.rotate(connectorNode.localTransform, connectorNode.localTransform, Math.PI / 6, [0, 0, 1]); // Mirrored Z rotation
    mat4.rotate(connectorNode.localTransform, connectorNode.localTransform, -Math.PI / 2, [1, 0, 0]);
    mat4.scale(connectorNode.localTransform, connectorNode.localTransform, [0.8, 2.5, 1]);

    return armRoot;
}

// ---------------------------------------------------------
//  MAIN ENTRY
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
  const upperHead = createMegaGarchompUpperHead(gl);
//   const jaw = createMegaGarchompJaw(gl);
//   neck.addChild(jaw)
    neck.addChild(upperHead);
  torso.addChild(DorsalFin);
  torso.addChild(tail);
  torso.addChild(rightarm);
  torso.addChild(leftarm)
  torso.addChild(neck);
  mat4.translate(tail.localTransform, tail.localTransform, [0, -1.5, 0.5]);
  mat4.scale(tail.localTransform, tail.localTransform, [1, 1.3, 1]);

  // Tempelkan kaki kiri ke torso
  torso.addChild(leftLeg);
  mat4.translate(leftLeg.localTransform, leftLeg.localTransform, [-0.5, -1.8, 0]); // Atur posisi pangkal paha
  torso.addChild(rightLeg)
  mat4.translate(rightLeg.localTransform, leftLeg.localTransform, [0.5, 1.8, 0]);

  return torso;
}

