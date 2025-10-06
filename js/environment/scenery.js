/**
 * Membuat satu buah batu dengan bentuk acak.
 * @param {WebGLRenderingContext} gl 
 * @returns {SceneNode}
 */
function createRock(gl) {
    // Gunakan radius X, Y, Z yang sedikit berbeda untuk bentuk yang tidak sempurna
    const rockMesh = new Mesh(gl, Primitives.createEllipsoid(0.8, 0.5, 0.7, 16, 16));
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
    mat4.rotateZ(branch1.localTransform, branch1.localTransform, Math.PI / 5);
    mat4.scale(branch1.localTransform, branch1.localTransform, [0.2, 1.5, 0.2]);

    // Cabang 2
    const branch2 = new SceneNode(cylinderMesh, brown);
    mat4.translate(branch2.localTransform, branch2.localTransform, [0, 0.8, 0]);
    mat4.rotateZ(branch2.localTransform, branch2.localTransform, -Math.PI / 4);
    mat4.rotateY(branch2.localTransform, branch2.localTransform, Math.PI / 3);
    mat4.scale(branch2.localTransform, branch2.localTransform, [0.15, 1.8, 0.15]);

    // Gabungkan semua bagian
    const treeRoot = new SceneNode();
    treeRoot.addChild(trunk);
    treeRoot.addChild(branch1);
    treeRoot.addChild(branch2);

    return treeRoot;
}