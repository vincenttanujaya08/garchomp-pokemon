function createRock(gl) {
  const rockMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 0.5, 0.7, 16, 16)
  );
  const rockNode = new SceneNode(rockMesh, [0.5, 0.5, 0.55, 1.0]);
  return rockNode;
}

function createDeadTree(gl) {
  const brown = [0.4, 0.25, 0.15, 1.0];
  const cylinderMesh = new Mesh(gl, Primitives.createCylinder(1, 1, 8));

  const trunk = new SceneNode(cylinderMesh, brown);
  mat4.scale(trunk.localTransform, trunk.localTransform, [0.3, 2.5, 0.3]);

  const branch1 = new SceneNode(cylinderMesh, brown);
  mat4.translate(branch1.localTransform, branch1.localTransform, [0, 1.5, 0]);
  mat4.rotate(
    branch1.localTransform,
    branch1.localTransform,
    Math.PI / 5,
    [0, 0, 1]
  );
  mat4.scale(branch1.localTransform, branch1.localTransform, [0.2, 1.5, 0.2]);

  const branch2 = new SceneNode(cylinderMesh, brown);
  mat4.translate(branch2.localTransform, branch2.localTransform, [0, 0.8, 0]);
  mat4.rotate(
    branch2.localTransform,
    branch2.localTransform,
    -Math.PI / 4,
    [0, 0, 1]
  );
  mat4.rotate(
    branch2.localTransform,
    branch2.localTransform,
    Math.PI / 3,
    [0, 1, 0]
  );
  mat4.scale(branch2.localTransform, branch2.localTransform, [0.15, 1.8, 0.15]);

  const treeRoot = new SceneNode();
  treeRoot.addChild(trunk);
  treeRoot.addChild(branch1);
  treeRoot.addChild(branch2);

  return treeRoot;
}

function createCactus(gl) {
  const green = [0.3, 0.6, 0.3, 1.0]; // Warna hijau kaktus
  const cylinderMesh = new Mesh(gl, Primitives.createCylinder(1, 1, 16));
  const ellipsoidMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(1, 1, 1, 16, 16)
  );

  const mainTrunk = new SceneNode(cylinderMesh, green);
  mat4.scale(
    mainTrunk.localTransform,
    mainTrunk.localTransform,
    [0.4, 3.0, 0.4]
  );

  const mainTrunkTop = new SceneNode(ellipsoidMesh, green);
  mat4.translate(
    mainTrunkTop.localTransform,
    mainTrunkTop.localTransform,
    [0, 1.5, 0]
  );
  mat4.scale(
    mainTrunkTop.localTransform,
    mainTrunkTop.localTransform,
    [0.4, 0.5, 0.4]
  );

  const leftArmVertical = new SceneNode(cylinderMesh, green);
  mat4.translate(
    leftArmVertical.localTransform,
    leftArmVertical.localTransform,
    [-0.8, 1.2, 0]
  );
  mat4.scale(
    leftArmVertical.localTransform,
    leftArmVertical.localTransform,
    [0.3, 1.3, 0.3]
  );

  const leftArmTop = new SceneNode(ellipsoidMesh, green);
  mat4.translate(
    leftArmTop.localTransform,
    leftArmTop.localTransform,
    [-0.8, 1.85, 0]
  );
  mat4.scale(
    leftArmTop.localTransform,
    leftArmTop.localTransform,
    [0.3, 0.3, 0.3]
  );

  const leftArmHorizontal = new SceneNode(cylinderMesh, green);
  mat4.translate(
    leftArmHorizontal.localTransform,
    leftArmHorizontal.localTransform,
    [-0.3, 0.8, 0]
  );
  mat4.rotate(
    leftArmHorizontal.localTransform,
    leftArmHorizontal.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  mat4.scale(
    leftArmHorizontal.localTransform,
    leftArmHorizontal.localTransform,
    [0.3, 0.6, 0.3]
  );

  const rightArmVertical = new SceneNode(cylinderMesh, green);
  mat4.translate(
    rightArmVertical.localTransform,
    rightArmVertical.localTransform,
    [0.75, 0.8, 0]
  );
  mat4.scale(
    rightArmVertical.localTransform,
    rightArmVertical.localTransform,
    [0.3, 1.1, 0.3]
  );

  const rightArmTop = new SceneNode(ellipsoidMesh, green);
  mat4.translate(
    rightArmTop.localTransform,
    rightArmTop.localTransform,
    [0.75, 1.35, 0]
  );
  mat4.scale(
    rightArmTop.localTransform,
    rightArmTop.localTransform,
    [0.3, 0.35, 0.3]
  );

  const rightArmHorizontal = new SceneNode(cylinderMesh, green);
  mat4.translate(
    rightArmHorizontal.localTransform,
    rightArmHorizontal.localTransform,
    [0.3, 0.5, 0]
  );
  mat4.rotate(
    rightArmHorizontal.localTransform,
    rightArmHorizontal.localTransform,
    -Math.PI / 2,
    [0, 0, 1]
  );
  mat4.scale(
    rightArmHorizontal.localTransform,
    rightArmHorizontal.localTransform,
    [0.3, 0.6, 0.3]
  );

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

function createBoxGeometry() {
  const vertices = new Float32Array([
    // Front face
    -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
    // Back face
    -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
    // Top face
    -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
    // Bottom face
    -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
    // Right face
    0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,
    // Left face
    -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
  ]);

  const indices = new Uint16Array([
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
  ]);

  const normals = new Float32Array([
    // Front
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    // Back
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    // Top
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    // Bottom
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    // Right
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    // Left
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ]);

  return {
    vertices: vertices,
    indices: indices,
    normals: normals,
  };
}

function createAngularRock(gl, seed = 0.5) {
  const brownShades = [
    [0.55, 0.45, 0.35, 1.0],
    [0.45, 0.35, 0.25, 1.0],
    [0.35, 0.25, 0.18, 1.0],
    [0.5, 0.4, 0.3, 1.0],
  ];

  const rockRoot = new SceneNode();

  function createFacet(v1, v2, v3, color) {
    const vertices = new Float32Array([
      v1[0],
      v1[1],
      v1[2],
      v2[0],
      v2[1],
      v2[2],
      v3[0],
      v3[1],
      v3[2],
    ]);

    const u = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
    const v = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
    const nx = u[1] * v[2] - u[2] * v[1];
    const ny = u[2] * v[0] - u[0] * v[2];
    const nz = u[0] * v[1] - u[1] * v[0];

    const normals = new Float32Array([nx, ny, nz, nx, ny, nz, nx, ny, nz]);

    const indices = new Uint16Array([0, 1, 2]);

    const geometry = {
      vertices: vertices,
      indices: indices,
      normals: normals,
    };

    const facetMesh = new Mesh(gl, geometry);
    return new SceneNode(facetMesh, color);
  }

  const height = 1.0 + seed * 0.3;
  const baseSize = 0.9 + seed * 0.2;

  const points = [
    [-baseSize, 0, -baseSize],
    [baseSize, 0, -baseSize],
    [baseSize, 0, baseSize],
    [-baseSize, 0, baseSize],

    [-baseSize * 0.7, height * 0.4, -baseSize * 0.7],
    [baseSize * 0.7, height * 0.4, -baseSize * 0.7],
    [baseSize * 0.7, height * 0.4, baseSize * 0.7],
    [-baseSize * 0.7, height * 0.4, baseSize * 0.7],

    [-baseSize * 0.3, height * 0.8, -baseSize * 0.3],
    [baseSize * 0.3, height * 0.8, -baseSize * 0.3],
    [baseSize * 0.3, height * 0.8, baseSize * 0.3],
    [-baseSize * 0.3, height * 0.8, baseSize * 0.3],

    [0, height, 0],
  ];

  rockRoot.addChild(
    createFacet(points[0], points[2], points[1], brownShades[2])
  );
  rockRoot.addChild(
    createFacet(points[0], points[3], points[2], brownShades[2])
  );

  rockRoot.addChild(
    createFacet(points[0], points[1], points[5], brownShades[1])
  );
  rockRoot.addChild(
    createFacet(points[0], points[5], points[4], brownShades[1])
  );

  rockRoot.addChild(
    createFacet(points[1], points[2], points[6], brownShades[0])
  );
  rockRoot.addChild(
    createFacet(points[1], points[6], points[5], brownShades[0])
  );

  rockRoot.addChild(
    createFacet(points[2], points[3], points[7], brownShades[1])
  );
  rockRoot.addChild(
    createFacet(points[2], points[7], points[6], brownShades[1])
  );

  rockRoot.addChild(
    createFacet(points[3], points[0], points[4], brownShades[2])
  );
  rockRoot.addChild(
    createFacet(points[3], points[4], points[7], brownShades[2])
  );

  rockRoot.addChild(
    createFacet(points[4], points[5], points[9], brownShades[1])
  );
  rockRoot.addChild(
    createFacet(points[4], points[9], points[8], brownShades[1])
  );

  rockRoot.addChild(
    createFacet(points[5], points[6], points[10], brownShades[0])
  );
  rockRoot.addChild(
    createFacet(points[5], points[10], points[9], brownShades[0])
  );

  rockRoot.addChild(
    createFacet(points[6], points[7], points[11], brownShades[1])
  );
  rockRoot.addChild(
    createFacet(points[6], points[11], points[10], brownShades[1])
  );

  rockRoot.addChild(
    createFacet(points[7], points[4], points[8], brownShades[2])
  );
  rockRoot.addChild(
    createFacet(points[7], points[8], points[11], brownShades[2])
  );

  rockRoot.addChild(
    createFacet(points[8], points[9], points[12], brownShades[0])
  );
  rockRoot.addChild(
    createFacet(points[9], points[10], points[12], brownShades[0])
  );
  rockRoot.addChild(
    createFacet(points[10], points[11], points[12], brownShades[1])
  );
  rockRoot.addChild(
    createFacet(points[11], points[8], points[12], brownShades[2])
  );

  return rockRoot;
}

function createSimpleAngularRock(gl) {
  const brownLight = [0.55, 0.45, 0.35, 1.0];
  const brownMid = [0.45, 0.35, 0.25, 1.0];
  const brownDark = [0.35, 0.25, 0.18, 1.0];

  const rockRoot = new SceneNode();
  const boxGeometry = createBoxGeometry();
  const boxMesh = new Mesh(gl, boxGeometry);

  const base = new SceneNode(boxMesh, brownDark);
  mat4.rotate(base.localTransform, base.localTransform, 0.2, [0, 1, 0]);
  mat4.scale(base.localTransform, base.localTransform, [1.0, 0.3, 0.9]);
  rockRoot.addChild(base);

  const middle = new SceneNode(boxMesh, brownMid);
  mat4.translate(middle.localTransform, middle.localTransform, [0, 0.2, 0]);
  mat4.rotate(middle.localTransform, middle.localTransform, -0.3, [0, 1, 0]);
  mat4.rotate(middle.localTransform, middle.localTransform, 0.1, [1, 0, 0]);
  mat4.scale(middle.localTransform, middle.localTransform, [0.7, 0.4, 0.7]);
  rockRoot.addChild(middle);

  const top = new SceneNode(boxMesh, brownLight);
  mat4.translate(top.localTransform, top.localTransform, [0, 0.6, 0]);
  mat4.rotate(top.localTransform, top.localTransform, 0.4, [0, 1, 0]);
  mat4.rotate(top.localTransform, top.localTransform, -0.15, [0, 0, 1]);
  mat4.scale(top.localTransform, top.localTransform, [0.5, 0.5, 0.5]);
  rockRoot.addChild(top);

  return rockRoot;
}

function createCloud1(gl) {
  const cloudWhite = [0.95, 0.95, 0.98, 1.0];
  const cloudShadow = [0.75, 0.78, 0.85, 1.0];
  const cloudRoot = new SceneNode();

  const mainClump = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const mainNode = new SceneNode(mainClump, cloudWhite);
  mat4.scale(mainNode.localTransform, mainNode.localTransform, [1.5, 0.6, 0.8]);
  cloudRoot.addChild(mainNode);

  const leftClump = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const leftNode = new SceneNode(leftClump, cloudWhite);
  mat4.translate(
    leftNode.localTransform,
    leftNode.localTransform,
    [-1.0, 0.1, 0.3]
  );
  mat4.scale(leftNode.localTransform, leftNode.localTransform, [0.7, 0.5, 0.6]);
  cloudRoot.addChild(leftNode);

  const rightClump = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const rightNode = new SceneNode(rightClump, cloudShadow);
  mat4.translate(
    rightNode.localTransform,
    rightNode.localTransform,
    [0.9, -0.15, -0.2]
  );
  mat4.scale(
    rightNode.localTransform,
    rightNode.localTransform,
    [0.8, 0.6, 0.6]
  );
  cloudRoot.addChild(rightNode);

  const topClump = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const topNode = new SceneNode(topClump, cloudWhite);
  mat4.translate(
    topNode.localTransform,
    topNode.localTransform,
    [-0.2, 0.5, 0.1]
  );
  mat4.scale(topNode.localTransform, topNode.localTransform, [0.9, 0.5, 0.7]);
  cloudRoot.addChild(topNode);

  return cloudRoot;
}

function createCloud2(gl) {
  const cloudWhite = [0.95, 0.95, 0.98, 1.0];
  const cloudLight = [0.88, 0.9, 0.95, 1.0];
  const cloudShadow = [0.75, 0.78, 0.85, 1.0];
  const cloudRoot = new SceneNode();

  const leftClump = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const leftNode = new SceneNode(leftClump, cloudShadow);
  mat4.translate(
    leftNode.localTransform,
    leftNode.localTransform,
    [-1.4, -0.1, 0]
  );
  mat4.scale(leftNode.localTransform, leftNode.localTransform, [0.6, 0.5, 0.5]);
  cloudRoot.addChild(leftNode);

  const centerBottom = new Mesh(
    gl,
    Primitives.createEllipsoid(1, 1, 1, 16, 16)
  );
  const centerBottomNode = new SceneNode(centerBottom, cloudWhite);
  mat4.translate(
    centerBottomNode.localTransform,
    centerBottomNode.localTransform,
    [-0.2, -0.15, 0.1]
  );
  mat4.scale(
    centerBottomNode.localTransform,
    centerBottomNode.localTransform,
    [1.8, 0.7, 0.9]
  );
  cloudRoot.addChild(centerBottomNode);

  const centerTop = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const centerTopNode = new SceneNode(centerTop, cloudWhite);
  mat4.translate(
    centerTopNode.localTransform,
    centerTopNode.localTransform,
    [-0.4, 0.4, 0.15]
  );
  mat4.scale(
    centerTopNode.localTransform,
    centerTopNode.localTransform,
    [1.2, 0.6, 0.8]
  );
  cloudRoot.addChild(centerTopNode);

  const rightFront = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const rightFrontNode = new SceneNode(rightFront, cloudLight);
  mat4.translate(
    rightFrontNode.localTransform,
    rightFrontNode.localTransform,
    [1.1, 0.0, 0.3]
  );
  mat4.scale(
    rightFrontNode.localTransform,
    rightFrontNode.localTransform,
    [0.9, 0.65, 0.7]
  );
  cloudRoot.addChild(rightFrontNode);

  const rightBack = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const rightBackNode = new SceneNode(rightBack, cloudShadow);
  mat4.translate(
    rightBackNode.localTransform,
    rightBackNode.localTransform,
    [1.5, -0.1, -0.2]
  );
  mat4.scale(
    rightBackNode.localTransform,
    rightBackNode.localTransform,
    [0.75, 0.6, 0.6]
  );
  cloudRoot.addChild(rightBackNode);

  const smallLeft = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const smallLeftNode = new SceneNode(smallLeft, cloudWhite);
  mat4.translate(
    smallLeftNode.localTransform,
    smallLeftNode.localTransform,
    [-1.0, 0.35, 0.1]
  );
  mat4.scale(
    smallLeftNode.localTransform,
    smallLeftNode.localTransform,
    [0.6, 0.45, 0.55]
  );
  cloudRoot.addChild(smallLeftNode);

  const smallRight = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const smallRightNode = new SceneNode(smallRight, cloudLight);
  mat4.translate(
    smallRightNode.localTransform,
    smallRightNode.localTransform,
    [0.7, 0.5, 0.2]
  );
  mat4.scale(
    smallRightNode.localTransform,
    smallRightNode.localTransform,
    [0.7, 0.5, 0.6]
  );
  cloudRoot.addChild(smallRightNode);

  const middleSmall = new Mesh(gl, Primitives.createEllipsoid(1, 1, 1, 16, 16));
  const middleSmallNode = new SceneNode(middleSmall, cloudLight);
  mat4.translate(
    middleSmallNode.localTransform,
    middleSmallNode.localTransform,
    [0.3, 0.2, 0.05]
  );
  mat4.scale(
    middleSmallNode.localTransform,
    middleSmallNode.localTransform,
    [0.8, 0.55, 0.65]
  );
  cloudRoot.addChild(middleSmallNode);

  return cloudRoot;
}

function createLayeredMesa(
  gl,
  layers = 5,
  baseWidth = 10,
  baseDepth = 8,
  totalHeight = 12,
  seed = Math.random()
) {
  const mesaRoot = new SceneNode();
  mesaRoot.name = "LayeredMesa_" + seed.toFixed(3);

  const canyonColors = [
    [0.76, 0.48, 0.32, 1.0],
    [0.65, 0.4, 0.28, 1.0],
    [0.85, 0.65, 0.45, 1.0],
    [0.55, 0.35, 0.25, 1.0],
    [0.7, 0.55, 0.4, 1.0],
    [0.88, 0.7, 0.55, 1.0],
  ];

  const layerHeight = totalHeight / layers;
  let currentY = -totalHeight / 2 + layerHeight / 2;

  const layerMesh = new Mesh(gl, Prm.createCuboid(1, 1, 1));

  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1 || 1);
    const width = baseWidth * (1.0 - t * (0.3 + seed * 0.2));
    const depth = baseDepth * (1.0 - t * (0.4 + seed * 0.1));

    const offsetX = (Math.random() - 0.5) * baseWidth * 0.05 * t;
    const offsetZ = (Math.random() - 0.5) * baseDepth * 0.05 * t;

    const layerColor =
      canyonColors[Math.floor(Math.random() * canyonColors.length)];

    const layerNode = new SceneNode(layerMesh, layerColor);

    const randomTiltX = (Math.random() - 0.5) * 0.15;
    const randomTiltZ = (Math.random() - 0.5) * 0.15;

    mat4.translate(layerNode.localTransform, layerNode.localTransform, [
      offsetX,
      currentY,
      offsetZ,
    ]);
    mat4.rotateY(
      layerNode.localTransform,
      layerNode.localTransform,
      (Math.random() - 0.5) * 0.1
    );
    mat4.rotateX(
      layerNode.localTransform,
      layerNode.localTransform,
      randomTiltX
    );
    mat4.rotateZ(
      layerNode.localTransform,
      layerNode.localTransform,
      randomTiltZ
    );
    mat4.scale(layerNode.localTransform, layerNode.localTransform, [
      width,
      layerHeight,
      depth,
    ]);

    mesaRoot.addChild(layerNode);

    currentY += layerHeight;
  }

  mat4.scale(mesaRoot.localTransform, mesaRoot.localTransform, [1.5, 1.5, 1.5]);

  return mesaRoot;
}
