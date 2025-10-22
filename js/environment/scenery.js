/**
 * Membuat satu buah batu dengan bentuk acak.
 * @param {WebGLRenderingContext} gl
 * @returns {SceneNode}
 */
function createRock(gl) {
  // Gunakan radius X, Y, Z yang sedikit berbeda untuk bentuk yang tidak sempurna
  const rockMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 0.5, 0.7, 16, 16)
  );
  const rockNode = new SceneNode(rockMesh, [0.5, 0.5, 0.55, 1.0]); // Warna batu abu-abu gelap
  return rockNode;
}

/**
 * Membuat satu pohon kering tanpa daun.
 * @param {WebGLRenderingContext} gl
 * @returns {SceneNode}
 */
function createDeadTree(gl) {
  const brown = [0.4, 0.25, 0.15, 1.0];
  const cylinderMesh = new Mesh(gl, Primitives.createCylinder(1, 1, 8));

  // Batang utama
  const trunk = new SceneNode(cylinderMesh, brown);
  mat4.scale(trunk.localTransform, trunk.localTransform, [0.3, 2.5, 0.3]);

  // Cabang 1
  const branch1 = new SceneNode(cylinderMesh, brown);
  mat4.translate(branch1.localTransform, branch1.localTransform, [0, 1.5, 0]);
  // PERBAIKAN: Ganti mat4.rotateZ dengan mat4.rotate pada sumbu Z [0, 0, 1]
  mat4.rotate(
    branch1.localTransform,
    branch1.localTransform,
    Math.PI / 5,
    [0, 0, 1]
  );
  mat4.scale(branch1.localTransform, branch1.localTransform, [0.2, 1.5, 0.2]);

  // Cabang 2
  const branch2 = new SceneNode(cylinderMesh, brown);
  mat4.translate(branch2.localTransform, branch2.localTransform, [0, 0.8, 0]);
  // PERBAIKAN: Ganti mat4.rotateZ dengan mat4.rotate pada sumbu Z [0, 0, 1]
  mat4.rotate(
    branch2.localTransform,
    branch2.localTransform,
    -Math.PI / 4,
    [0, 0, 1]
  );
  // PERBAIKAN: Ganti mat4.rotateY dengan mat4.rotate pada sumbu Y [0, 1, 0]
  mat4.rotate(
    branch2.localTransform,
    branch2.localTransform,
    Math.PI / 3,
    [0, 1, 0]
  );
  mat4.scale(branch2.localTransform, branch2.localTransform, [0.15, 1.8, 0.15]);

  // Gabungkan semua bagian
  const treeRoot = new SceneNode();
  treeRoot.addChild(trunk);
  treeRoot.addChild(branch1);
  treeRoot.addChild(branch2);

  return treeRoot;
}

/**
 * Membuat satu kaktus saguaro dengan bentuk klasik (batang utama + 2 lengan).
 * Bagian atas setiap segmen vertikal menggunakan ellipsoid untuk tampilan yang lebih halus.
 * @param {WebGLRenderingContext} gl
 * @returns {SceneNode}
 */
function createCactus(gl) {
  const green = [0.3, 0.6, 0.3, 1.0]; // Warna hijau kaktus
  const cylinderMesh = new Mesh(gl, Primitives.createCylinder(1, 1, 16));
  const ellipsoidMesh = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));

  // Batang utama (tengah) - silinder
  const mainTrunk = new SceneNode(cylinderMesh, green);
  mat4.scale(mainTrunk.localTransform, mainTrunk.localTransform, [0.4, 3.0, 0.4]);

  // Batang utama - ujung atas ellipsoid
  const mainTrunkTop = new SceneNode(ellipsoidMesh, green);
  mat4.translate(mainTrunkTop.localTransform, mainTrunkTop.localTransform, [0, 1.5, 0]);
  mat4.scale(mainTrunkTop.localTransform, mainTrunkTop.localTransform, [0.4, 0.5, 0.4]);

  // Lengan kiri - bagian vertikal (silinder)
  const leftArmVertical = new SceneNode(cylinderMesh, green);
  mat4.translate(leftArmVertical.localTransform, leftArmVertical.localTransform, [-0.8, 1.2, 0]);
  mat4.scale(leftArmVertical.localTransform, leftArmVertical.localTransform, [0.3, 1.3, 0.3]);

  // Lengan kiri - ujung atas ellipsoid
  const leftArmTop = new SceneNode(ellipsoidMesh, green);
  mat4.translate(leftArmTop.localTransform, leftArmTop.localTransform, [-0.8, 1.9, 0]);
  mat4.scale(leftArmTop.localTransform, leftArmTop.localTransform, [0.3, 0.3, 0.3]);

  // Lengan kiri - bagian horizontal (penghubung)
  const leftArmHorizontal = new SceneNode(cylinderMesh, green);
  mat4.translate(leftArmHorizontal.localTransform, leftArmHorizontal.localTransform, [-0.3, 0.8, 0]);
  mat4.rotate(
    leftArmHorizontal.localTransform,
    leftArmHorizontal.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  mat4.scale(leftArmHorizontal.localTransform, leftArmHorizontal.localTransform, [0.3, 0.6, 0.3]);

  // Lengan kanan - bagian vertikal (silinder)
  const rightArmVertical = new SceneNode(cylinderMesh, green);
  mat4.translate(rightArmVertical.localTransform, rightArmVertical.localTransform, [0.75, 0.8, 0]);
  mat4.scale(rightArmVertical.localTransform, rightArmVertical.localTransform, [0.3, 1.1, 0.3]);

  // Lengan kanan - ujung atas ellipsoid
  const rightArmTop = new SceneNode(ellipsoidMesh, green);
  mat4.translate(rightArmTop.localTransform, rightArmTop.localTransform, [0.75, 1.4, 0]);
  mat4.scale(rightArmTop.localTransform, rightArmTop.localTransform, [0.3, 0.35, 0.3]);

  // Lengan kanan - bagian horizontal (penghubung)
  const rightArmHorizontal = new SceneNode(cylinderMesh, green);
  mat4.translate(rightArmHorizontal.localTransform, rightArmHorizontal.localTransform, [0.3, 0.5, 0]);
  mat4.rotate(
    rightArmHorizontal.localTransform,
    rightArmHorizontal.localTransform,
    -Math.PI / 2,
    [0, 0, 1]
  );
  mat4.scale(rightArmHorizontal.localTransform, rightArmHorizontal.localTransform, [0.3, 0.6, 0.3]);

  // Gabungkan semua bagian
  const cactusRoot = new SceneNode();
  cactusRoot.addChild(mainTrunk);
  cactusRoot.addChild(mainTrunkTop);
  cactusRoot.addChild(leftArmVertical);
  cactusRoot.addChild(leftArmTop);
  cactusRoot.addChild(leftArmHorizontal);
  cactusRoot.addChild(rightArmVertical);
  cactusRoot.addChild(rightArmTop);
  cactusRoot.addChild(rightArmHorizontal);

  return cactusRoot;
}

/**
 * Membuat awan tipe 1 - bentuk smooth dengan ellipsoid
 * @param {WebGLRenderingContext} gl
 * @returns {SceneNode}
 */
function createCloud1(gl) {
  const cloudWhite = [0.95, 0.95, 0.98, 1.0];
  const cloudShadow = [0.75, 0.78, 0.85, 1.0];
  const cloudRoot = new SceneNode();

  // Gumpalan utama (tengah, paling besar)
  const mainClump = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const mainNode = new SceneNode(mainClump, cloudWhite);
  mat4.scale(mainNode.localTransform, mainNode.localTransform, [1.5, 0.6, 0.8]);
  cloudRoot.addChild(mainNode);

  // Gumpalan kiri depan
  const leftClump = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const leftNode = new SceneNode(leftClump, cloudWhite);
  mat4.translate(leftNode.localTransform, leftNode.localTransform, [-1.0, 0.1, 0.3]);
  mat4.scale(leftNode.localTransform, leftNode.localTransform, [0.7, 0.5, 0.6]);
  cloudRoot.addChild(leftNode);

  // Gumpalan kanan belakang (shadow)
  const rightClump = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const rightNode = new SceneNode(rightClump, cloudShadow);
  mat4.translate(rightNode.localTransform, rightNode.localTransform, [0.9, -0.15, -0.2]);
  mat4.scale(rightNode.localTransform, rightNode.localTransform, [0.8, 0.6, 0.6]);
  cloudRoot.addChild(rightNode);

  // Gumpalan atas (highlight)
  const topClump = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const topNode = new SceneNode(topClump, cloudWhite);
  mat4.translate(topNode.localTransform, topNode.localTransform, [-0.2, 0.5, 0.1]);
  mat4.scale(topNode.localTransform, topNode.localTransform, [0.9, 0.5, 0.7]);
  cloudRoot.addChild(topNode);

  return cloudRoot;
}

/**
 * Membuat awan tipe 2 - bentuk kompleks dengan banyak gumpalan smooth
 * @param {WebGLRenderingContext} gl
 * @returns {SceneNode}
 */
function createCloud2(gl) {
  const cloudWhite = [0.95, 0.95, 0.98, 1.0];
  const cloudLight = [0.88, 0.90, 0.95, 1.0];
  const cloudShadow = [0.75, 0.78, 0.85, 1.0];
  const cloudRoot = new SceneNode();

  // Gumpalan kiri (shadow)
  const leftClump = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const leftNode = new SceneNode(leftClump, cloudShadow);
  mat4.translate(leftNode.localTransform, leftNode.localTransform, [-1.4, -0.1, 0]);
  mat4.scale(leftNode.localTransform, leftNode.localTransform, [0.6, 0.5, 0.5]);
  cloudRoot.addChild(leftNode);

  // Gumpalan tengah bawah (bagian utama)
  const centerBottom = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const centerBottomNode = new SceneNode(centerBottom, cloudWhite);
  mat4.translate(centerBottomNode.localTransform, centerBottomNode.localTransform, [-0.2, -0.15, 0.1]);
  mat4.scale(centerBottomNode.localTransform, centerBottomNode.localTransform, [1.8, 0.7, 0.9]);
  cloudRoot.addChild(centerBottomNode);

  // Gumpalan tengah atas (highlight)
  const centerTop = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const centerTopNode = new SceneNode(centerTop, cloudWhite);
  mat4.translate(centerTopNode.localTransform, centerTopNode.localTransform, [-0.4, 0.4, 0.15]);
  mat4.scale(centerTopNode.localTransform, centerTopNode.localTransform, [1.2, 0.6, 0.8]);
  cloudRoot.addChild(centerTopNode);

  // Gumpalan kanan depan (terang)
  const rightFront = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const rightFrontNode = new SceneNode(rightFront, cloudLight);
  mat4.translate(rightFrontNode.localTransform, rightFrontNode.localTransform, [1.1, 0.0, 0.3]);
  mat4.scale(rightFrontNode.localTransform, rightFrontNode.localTransform, [0.9, 0.65, 0.7]);
  cloudRoot.addChild(rightFrontNode);

  // Gumpalan kanan belakang (shadow)
  const rightBack = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const rightBackNode = new SceneNode(rightBack, cloudShadow);
  mat4.translate(rightBackNode.localTransform, rightBackNode.localTransform, [1.5, -0.1, -0.2]);
  mat4.scale(rightBackNode.localTransform, rightBackNode.localTransform, [0.75, 0.6, 0.6]);
  cloudRoot.addChild(rightBackNode);

  // Gumpalan kecil kiri atas
  const smallLeft = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const smallLeftNode = new SceneNode(smallLeft, cloudWhite);
  mat4.translate(smallLeftNode.localTransform, smallLeftNode.localTransform, [-1.0, 0.35, 0.1]);
  mat4.scale(smallLeftNode.localTransform, smallLeftNode.localTransform, [0.6, 0.45, 0.55]);
  cloudRoot.addChild(smallLeftNode);

  // Gumpalan kecil kanan atas
  const smallRight = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const smallRightNode = new SceneNode(smallRight, cloudLight);
  mat4.translate(smallRightNode.localTransform, smallRightNode.localTransform, [0.7, 0.5, 0.2]);
  mat4.scale(smallRightNode.localTransform, smallRightNode.localTransform, [0.7, 0.5, 0.6]);
  cloudRoot.addChild(smallRightNode);

  // Gumpalan tengah kecil (transisi)
  const middleSmall = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const middleSmallNode = new SceneNode(middleSmall, cloudLight);
  mat4.translate(middleSmallNode.localTransform, middleSmallNode.localTransform, [0.3, 0.2, 0.05]);
  mat4.scale(middleSmallNode.localTransform, middleSmallNode.localTransform, [0.8, 0.55, 0.65]);
  cloudRoot.addChild(middleSmallNode);

  return cloudRoot;
}