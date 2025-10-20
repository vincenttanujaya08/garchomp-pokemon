function createIsland(gl) {
  const islandShape = [
    [-0.6852, 0, 0.48336],
    [0.22347, 0, 0.59186],
    [0.80664, 0, 0.34096],
    [0.92192, 0, -0.07269],
    [1, 0, -0.5],
    [0.49471, 0, -0.86608],
    [-0.11559, 0, -1.0017],
    [-0.51567, 0, -0.90677],
    [-1.08529, 0, -0.63552],
    [-1.22091, 0, -0.01844],
  ];

  const grassThickness = 0.05;
  const dirtThickness = 0.2;
  const rockThickness = 0.3;

  const grassMesh = new Mesh(
    gl,
    Primitives.createExtrudedShape(islandShape, grassThickness, 1.0, 1.0)
  );
  const dirtMesh = new Mesh(
    gl,
    Primitives.createExtrudedShape(islandShape, dirtThickness, 1.0, 0.8)
  );
  const rockMesh = new Mesh(
    gl,
    Primitives.createExtrudedShape(islandShape, rockThickness, 0.8, 0.5)
  );

  const sandNode = new SceneNode(grassMesh, [0.8, 0.7, 0.5, 1.0]);
  const earthNode = new SceneNode(dirtMesh, [0.6, 0.4, 0.2, 1.0]);
  const baseRockNode = new SceneNode(rockMesh, [0.5, 0.5, 0.5, 1.0]);

  const baseRockNode2 = new SceneNode(rockMesh, [0.5, 0.5, 0.5, 2.0]);

  mat4.translate(earthNode.localTransform, earthNode.localTransform, [
    0,
    -grassThickness,
    0,
  ]);
  mat4.translate(baseRockNode.localTransform, baseRockNode.localTransform, [
    0,
    -(grassThickness + dirtThickness),
    0,
  ]);

  const islandRoot = new SceneNode();
  islandRoot.addChild(sandNode);
  islandRoot.addChild(earthNode);
  islandRoot.addChild(baseRockNode);

  // --- Dekorasi ---
  const rock1 = createRock(gl);
  mat4.translate(rock1.localTransform, rock1.localTransform, [
    0.4,
    grassThickness,
    -0.2,
  ]);
  mat4.scale(rock1.localTransform, rock1.localTransform, [0.1, 0.1, 0.1]);
  islandRoot.addChild(rock1);

  const rock2 = createRock(gl);
  mat4.translate(rock2.localTransform, rock2.localTransform, [
    -0.6,
    grassThickness,
    -0.1,
  ]);
  mat4.rotate(
    rock2.localTransform,
    rock2.localTransform,
    Math.PI / 4,
    [0, 1, 0]
  );
  mat4.scale(rock2.localTransform, rock2.localTransform, [0.1, 0.1, 0.1]);
  islandRoot.addChild(rock2);

  const rock3 = createRock(gl);
  mat4.translate(rock3.localTransform, rock3.localTransform, [
    -0.9,
    grassThickness,
    -0.6,
  ]);
  mat4.rotate(
    rock3.localTransform,
    rock3.localTransform,
    Math.PI / 4,
    [0, 1, 0]
  );
  mat4.scale(rock3.localTransform, rock3.localTransform, [0.1, 0.1, 0.1]);
  islandRoot.addChild(rock3);

  const tree1 = createDeadTree(gl);
  mat4.translate(tree1.localTransform, tree1.localTransform, [
    -0.2,
    grassThickness,
    -0.5,
  ]);
  mat4.scale(tree1.localTransform, tree1.localTransform, [0.08, 0.08, 0.08]);
  islandRoot.addChild(tree1);

  const tree2 = createDeadTree(gl);
  mat4.translate(tree2.localTransform, tree2.localTransform, [
    0.8,
    grassThickness,
    -0.5,
  ]);
  mat4.rotate(
    tree2.localTransform,
    tree2.localTransform,
    Math.PI / 2,
    [0, 1, 0]
  );
  mat4.scale(tree2.localTransform, tree2.localTransform, [0.12, 0.12, 0.12]);
  islandRoot.addChild(tree2);

  // Atur skala dan posisi keseluruhan pulau
  mat4.scale(
    islandRoot.localTransform,
    islandRoot.localTransform,
    [30, 30, 30]
  );
  mat4.translate(
    islandRoot.localTransform,
    islandRoot.localTransform,
    [0, -0.4, -0.4]
  );

  window.createIsland = createIsland;

  return islandRoot;
}
