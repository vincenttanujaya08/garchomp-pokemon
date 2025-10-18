function createMegaGarchomp(gl) {
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

  const darkBlue = [0.11, 0.16, 0.34, 1.0];
  const yellow = [1.0, 0.8, 0.2, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];

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

  mat4.scale(
    pangkalKepala.localTransform,
    pangkalKepala.localTransform,
    [0.4, 0.2, 0.3]
  );
  mat4.translate(
    pangkalKepala.localTransform,
    pangkalKepala.localTransform,
    [0, -1, 0]
  );

  mat4.translate(
    crestNode.localTransform,
    crestNode.localTransform,
    [0, 0.5, -0.2]
  );
  mat4.rotate(
    crestNode.localTransform,
    crestNode.localTransform,
    Math.PI,
    [1.5, 0, 0]
  );
  mat4.scale(
    crestNode.localTransform,
    crestNode.localTransform,
    [0.5, 0.5, 0.5]
  );

  mat4.translate(moncong.localTransform, moncong.localTransform, [0, 0.6, 0.5]);
  mat4.rotate(moncong.localTransform, moncong.localTransform, 1.57, [1, 0, 0]);
  mat4.scale(moncong.localTransform, moncong.localTransform, [3.5, 3, 3]);

  mat4.translate(
    tandukKiri.localTransform,
    tandukKiri.localTransform,
    [-1.7, -1.0, -0.1]
  );
  mat4.scale(
    tandukKiri.localTransform,
    tandukKiri.localTransform,
    [0.4, 1, 0.3]
  );

  mat4.translate(
    tandukKanan.localTransform,
    tandukKanan.localTransform,
    [1.6, -0.8, -0.1]
  );
  mat4.scale(
    tandukKanan.localTransform,
    tandukKanan.localTransform,
    [0.4, 1, 0.3]
  );

  mat4.translate(
    hidung.localTransform,
    hidung.localTransform,
    [-0.0, 0.6, 0.3]
  );
  mat4.scale(hidung.localTransform, hidung.localTransform, [3.5, 8.16, 8.16]);
  mat4.rotate(hidung.localTransform, hidung.localTransform, -0.5, [1, 0, 0]);

  mat4.translate(
    surfaceNode.localTransform,
    surfaceNode.localTransform,
    [0, -1.3, 2.5]
  );
  mat4.rotate(
    surfaceNode.localTransform,
    surfaceNode.localTransform,
    1.9,
    [1, 0, 0]
  );
  mat4.scale(
    surfaceNode.localTransform,
    surfaceNode.localTransform,
    [1.5, 2.5, 1.5]
  );

  mat4.translate(
    surfaceNode2.localTransform,
    surfaceNode2.localTransform,
    [0, -1, 0.4]
  );

  mat4.scale(
    surfaceNode2.localTransform,
    surfaceNode2.localTransform,
    [1.5, 1.2, 0.5]
  );
  mat4.rotate(
    surfaceNode2.localTransform,
    surfaceNode2.localTransform,
    1.8,
    [1, 0, 0]
  );

  mat4.translate(
    surfaceNode3.localTransform,
    surfaceNode3.localTransform,
    [0, -0.5, 0.1]
  );

  mat4.scale(
    surfaceNode3.localTransform,
    surfaceNode3.localTransform,
    [1.1, 1.0, 0.5]
  );
  mat4.rotate(
    surfaceNode3.localTransform,
    surfaceNode3.localTransform,
    -0,
    [1, 0, 0]
  );

  mat4.translate(
    telinga1.localTransform,
    telinga1.localTransform,
    [0.8, -0.9, 0.5]
  );

  mat4.scale(telinga1.localTransform, telinga1.localTransform, [3.1, 3.0, 4.5]);
  mat4.rotate(
    telinga1.localTransform,
    telinga1.localTransform,
    -1.4,
    [1, 0, 1]
  );

  mat4.translate(
    telinga2.localTransform,
    telinga2.localTransform,
    [-0.9, -0.9, 0.3]
  );

  mat4.scale(telinga2.localTransform, telinga2.localTransform, [3.1, 3.0, 4.5]);
  mat4.rotate(
    telinga2.localTransform,
    telinga2.localTransform,
    1.4,
    [-1, 0, 1]
  );

  return pangkalKepala;
}

function createGarchomp(gl) {
  const headNode = createHead(gl);
  return headNode;
}
