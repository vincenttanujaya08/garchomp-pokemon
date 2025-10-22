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
  mat4.translate(leftArmVertical.localTransform, leftArmVertical.localTransform, [-0.6, 1.2, 0]);
  mat4.scale(leftArmVertical.localTransform, leftArmVertical.localTransform, [0.3, 1.5, 0.3]);

  // Lengan kiri - ujung atas ellipsoid
  const leftArmTop = new SceneNode(ellipsoidMesh, green);
  mat4.translate(leftArmTop.localTransform, leftArmTop.localTransform, [-0.6, 1.9, 0]);
  mat4.scale(leftArmTop.localTransform, leftArmTop.localTransform, [0.3, 0.4, 0.3]);

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
  mat4.translate(rightArmVertical.localTransform, rightArmVertical.localTransform, [0.6, 0.8, 0]);
  mat4.scale(rightArmVertical.localTransform, rightArmVertical.localTransform, [0.3, 1.2, 0.3]);

  // Lengan kanan - ujung atas ellipsoid
  const rightArmTop = new SceneNode(ellipsoidMesh, green);
  mat4.translate(rightArmTop.localTransform, rightArmTop.localTransform, [0.6, 1.4, 0]);
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
