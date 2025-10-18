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
//  NEW: Start Fresh from the Torso
// ---------------------------------------------------------
function createMegaGarchompTorso(gl) {
  // --- COLORS ---
  const darkBlue = [0.11, 0.16, 0.34, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];
  const yellow = [1.0, 0.84, 0.0, 1.0];

  // --- MESHES ---

  // 1. Torso Parts
  const upperBodyMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 1.2, 0.7, 32, 32)
  );
  const lowerBodyMesh = new Mesh(
    gl,
    Primitives.createEllipsoid(0.8, 1, 0.7, 32, 32)
  );

  // 2. Shoulder Cones (Triangular Extrusions)
  const leftShoulderShape = [
    [0, 0, 0],
    [-1.5, 0, 0],
    [0, 1, 0],
  ];
  const rightShoulderShape = [
    [0, 0, 0],
    [0, 1, 0],
    [1.5, 0, 0],
  ];
  const leftShoulderMesh = new Mesh(
    gl,
    Primitives.createExtrudedShape(leftShoulderShape, 0.6)
  );
  const rightShoulderMesh = new Mesh(
    gl,
    Primitives.createExtrudedShape(rightShoulderShape, 0.6)
  );

  // 3. Connectors (Swept Surfaces)
  const connectorProfile = [
    [0.1, -0.2],
    [0.1, 0.2],
    [-0.1, 0.2],
    [-0.1, -0.2],
  ];
  const createConnectorMesh = (path) =>
    new Mesh(gl, Curves.createSweptSurface(connectorProfile, path, true));

  const frontPath = [
    [0, 0.2, 0.65],
    [0, 0, 0.8],
    [0, -0.3, 0.75],
    [0, -0.6, 0.7],
  ];
  const backPath = [
    [0, 0.2, -0.65],
    [0, 0, -0.8],
    [0, -0.3, -0.75],
    [0, -0.6, -0.7],
  ];
  const leftSidePath = [
    [-0.6, 0.2, 0],
    [-0.7, 0, 0],
    [-0.6, -0.6, 0],
  ];
  const rightSidePath = [
    [0.6, 0.2, 0],
    [0.7, 0, 0],
    [0.6, -0.6, 0],
  ];

  const frontConnectorMesh = createConnectorMesh(frontPath);
  const backConnectorMesh = createConnectorMesh(backPath);
  const leftConnectorMesh = createConnectorMesh(leftSidePath);
  const rightConnectorMesh = createConnectorMesh(rightSidePath);

  // --- SCENE NODES ---
  const torsoRoot = new SceneNode(null); // Root node for the entire torso

  const upperBodyNode = new SceneNode(upperBodyMesh, darkBlue);
  const lowerBodyNode = new SceneNode(lowerBodyMesh, red);
  const leftShoulderNode = new SceneNode(leftShoulderMesh, yellow);
  const rightShoulderNode = new SceneNode(rightShoulderMesh, yellow);
  const frontConnectorNode = new SceneNode(frontConnectorMesh, darkBlue);
  const backConnectorNode = new SceneNode(backConnectorMesh, darkBlue);
  const leftConnectorNode = new SceneNode(leftConnectorMesh, darkBlue);
  const rightConnectorNode = new SceneNode(rightConnectorMesh, darkBlue);

  // --- HIERARCHY ---
  torsoRoot.addChild(upperBodyNode);
  torsoRoot.addChild(lowerBodyNode);
  torsoRoot.addChild(leftShoulderNode);
  torsoRoot.addChild(rightShoulderNode);
  torsoRoot.addChild(frontConnectorNode);
  torsoRoot.addChild(backConnectorNode);
  torsoRoot.addChild(leftConnectorNode);
  torsoRoot.addChild(rightConnectorNode);

  // --- TRANSFORMATIONS ---

  // Position the main body parts
  mat4.translate(upperBodyNode.localTransform, upperBodyNode.localTransform, [
    0, 0.5, 0,
  ]);
  mat4.translate(lowerBodyNode.localTransform, lowerBodyNode.localTransform, [
    0, -1.5, 0,
  ]);

  // Position and orient the shoulder cones
  mat4.translate(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    [-0.7, 1.0, -0.3]
  );
  mat4.rotate(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    -Math.PI / 12,
    [0, 1, 0]
  ); // Slight rotation
  mat4.scale(leftShoulderNode.localTransform, leftShoulderNode.localTransform, [0.8, 0.8, 0.8]);

  mat4.translate(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    [0.7, 1.0, -0.3]
  );
  mat4.rotate(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    Math.PI / 12,
    [0, 1, 0]
  ); // Slight rotation
  mat4.scale(rightShoulderNode.localTransform, rightShoulderNode.localTransform, [0.8, 0.8, 0.8]);

  return torsoRoot;
}

// ---------------------------------------------------------
//  MAIN ENTRY
// ---------------------------------------------------------
function createMegaGarchomp(gl) {
  // Start from torso instead of head
  const torso = createMegaGarchompTorso(gl);

  // You can re-add the head later like this:
  // const head = createMegaGarchompHead(gl);
  // mat4.translate(head.localTransform, head.localTransform, [0, 2.0, 0]); // Adjust position
  // torso.addChild(head);

  return torso;
}
