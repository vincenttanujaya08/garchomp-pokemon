function createIsland(gl) {
    // Denah 2D pulau (dari referensi Anda)
    const islandShape = [
        [-0.406, 0, 0.346], [0.020, 0, 0.502], [0.316, 0, 0.372],
        [0.449, 0, 0.086], [0.558, 0, -0.269], [0.404, 0, -0.622],
        [-0.142, 0, -0.823], [-0.293, 0, -0.584], [-0.526, 0, -0.260],
        [-0.490, 0, 0.192]
    ];

    // Buat mesh untuk setiap lapisan
    const grassMesh = new Mesh(gl, Primitives.createExtrudedShape(islandShape, 0.1, 1.0, 1.0));
    const dirtMesh = new Mesh(gl, Primitives.createExtrudedShape(islandShape, 0.5, 1.0, 0.8));
    const rockMesh = new Mesh(gl, Primitives.createExtrudedShape(islandShape, 0.8, 0.8, 0.5));

    // Buat SceneNode untuk setiap lapisan
    const grassNode = new SceneNode(grassMesh, [0.4, 0.7, 0.3, 1.0]); // Hijau
    const dirtNode = new SceneNode(dirtMesh, [0.5, 0.4, 0.3, 1.0]);  // Coklat
    const rockNode = new SceneNode(rockMesh, [0.4, 0.4, 0.4, 1.0]);  // Abu-abu

    // Atur posisi vertikal setiap lapisan
    mat4.translate(dirtNode.localTransform, dirtNode.localTransform, [0, -0.1, 0]); 
    mat4.translate(rockNode.localTransform, rockNode.localTransform, [0, -0.6, 0]);

    // Gabungkan semua lapisan ke dalam satu node utama
    const islandRoot = new SceneNode();
    islandRoot.addChild(grassNode);
    islandRoot.addChild(dirtNode);
    islandRoot.addChild(rockNode);
    
    // Atur skala dan posisi keseluruhan pulau
    mat4.scale(islandRoot.localTransform, islandRoot.localTransform, [4, 4, 4]);
    mat4.translate(islandRoot.localTransform, islandRoot.localTransform, [0, -1, 0]);

    return islandRoot;
}