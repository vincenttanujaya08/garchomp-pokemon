function createIsland(gl) {
    // Denah 2D pulau (dari referensi Anda)
    const islandShape = [
        [-0.6852, 0, 0.48336], [0.22347, 0, 0.59186], [0.80664, 0,0.34096],
        [0.92192, 0 ,-0.07269], [1, 0, -0.5], [0.49471, 0,-0.86608],
        [-0.11559, 0, -1.0017], [-0.51567, 0,-0.90677], [-1.08529, 0,-0.63552],
        [-1.22091, 0,-0.01844]

    ];

    // Buat mesh untuk setiap lapisan
    const grassMesh = new Mesh(gl, Primitives.createExtrudedShape(islandShape, 0.05, 1.0, 1.0));
    const dirtMesh = new Mesh(gl, Primitives.createExtrudedShape(islandShape, 0.2, 1.0, 0.8));
    const rockMesh = new Mesh(gl, Primitives.createExtrudedShape(islandShape, 0.3, 0.8, 0.5));

    // Buat SceneNode untuk setiap lapisan
    const grassNode = new SceneNode(grassMesh, [0.8, 0.7, 0.5, 1.0]); // Hijau
    const dirtNode = new SceneNode(dirtMesh, [0.6, 0.4, 0.2, 1.0]);  // Coklat
    const rockNode = new SceneNode(rockMesh, [0.5, 0.5, 0.5, 1.0]);  // Abu-abu

    // Atur posisi vertikal setiap lapisan
    mat4.translate(dirtNode.localTransform, dirtNode.localTransform, [0, -0.05, 0]); 
    mat4.translate(rockNode.localTransform, rockNode.localTransform, [0, -0.25, 0]);

    // Gabungkan semua lapisan ke dalam satu node utama
    const islandRoot = new SceneNode();
    islandRoot.addChild(grassNode);
    islandRoot.addChild(dirtNode);
    islandRoot.addChild(rockNode);
    
    const rock1 = createRock(gl);
    mat4.translate(rock1.localTransform, rock1.localTransform, [2.5, grassThickness, 1.0]);
    mat4.scale(rock1.localTransform, rock1.localTransform, [1.5, 1.5, 1.5]);
    islandRoot.addChild(rock1);

    const rock2 = createRock(gl);
    mat4.translate(rock2.localTransform, rock2.localTransform, [-3, grassThickness, -2]);
    mat4.rotateY(rock2.localTransform, rock2.localTransform, Math.PI / 4);
    islandRoot.addChild(rock2);
    
    // Buat beberapa pohon kering
    const tree1 = createDeadTree(gl);
    mat4.translate(tree1.localTransform, tree1.localTransform, [-2.5, grassThickness, 2.0]);
    mat4.scale(tree1.localTransform, tree1.localTransform, [0.8, 0.8, 0.8]);
    islandRoot.addChild(tree1);

    const tree2 = createDeadTree(gl);
    mat4.translate(tree2.localTransform, tree2.localTransform, [3, grassThickness, -3.5]);
    mat4.rotateY(tree2.localTransform, tree2.localTransform, Math.PI / 2);
    mat4.scale(tree2.localTransform, tree2.localTransform, [1.2, 1.2, 1.2]);
    islandRoot.addChild(tree2);
    // --- Akhir dari blok dekorasi ---

    mat4.translate(islandRoot.localTransform, islandRoot.localTransform, [0, -1, 0]);

    return islandRoot;
}


