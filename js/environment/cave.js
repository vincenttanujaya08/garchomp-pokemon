function createCave(gl) {
  const caveRoot = new SceneNode();
  caveRoot.name = "CAVE_ROOT";

  // warna batu & interior
  const colors = {
    bodyDark: [0.4, 0.4, 0.4, 1],
    interiorDark: [0.3, 0.28, 0.25, 1],
    stoneMedium: [0.45, 0.35, 0.25, 1],
    rockBrown1: [0.5, 0.35, 0.2, 1],
    rockBrown2: [0.4, 0.3, 0.2, 1],
    rockBrown3: [0.3, 0.22, 0.15, 1],
  };

  // badan utama gua
  const bodyGeometry = CaveGeometry.createHollowCaveBody(15, 12, 14, 64);
  const bodyMesh = new Mesh(gl, bodyGeometry);
  const bodyNode = new SceneNode(bodyMesh, colors.rockBrown3);
  bodyNode.name = "CAVE_BODY";
  caveRoot.addChild(bodyNode);

  // stalaktit di langit-langit
  const stalactitePositions = [
    { pos: [-5.5, 11, 6], height: 2.5, radius: 0.3 },
    { pos: [-4.8, 10.5, 4.5], height: 2.2, radius: 0.28 },
    { pos: [-4.2, 11.5, 3], height: 2.8, radius: 0.32 },
    { pos: [-5, 10.8, 1.5], height: 2.4, radius: 0.29 },
    { pos: [-4.5, 11.2, 0], height: 2.6, radius: 0.3 },
    { pos: [-5.2, 10.5, -1.5], height: 2.9, radius: 0.33 },
    { pos: [-4.8, 11, -3], height: 3.1, radius: 0.35 },
    { pos: [5.5, 11, 6], height: 2.4, radius: 0.29 },
    { pos: [4.8, 10.5, 4.5], height: 2.3, radius: 0.28 },
    { pos: [4.2, 11.5, 3], height: 2.7, radius: 0.31 },
    { pos: [5, 10.8, 1.5], height: 2.5, radius: 0.3 },
    { pos: [4.5, 11.2, 0], height: 2.6, radius: 0.3 },
    { pos: [5.2, 10.5, -1.5], height: 2.8, radius: 0.32 },
    { pos: [4.8, 11, -3], height: 3.0, radius: 0.34 },
    { pos: [-2.5, 11, 5], height: 2.0, radius: 0.26 },
    { pos: [2.5, 11, 5], height: 2.1, radius: 0.27 },
    { pos: [-1.5, 10.8, 3.5], height: 2.3, radius: 0.28 },
    { pos: [1.5, 10.8, 3.5], height: 2.2, radius: 0.27 },
    { pos: [-2, 11.2, 2], height: 2.5, radius: 0.29 },
    { pos: [2, 11.2, 2], height: 2.4, radius: 0.28 },
    { pos: [-1, 10.5, 0.5], height: 2.7, radius: 0.31 },
    { pos: [1, 10.5, 0.5], height: 2.6, radius: 0.3 },
    { pos: [-1.8, 11, -1], height: 2.8, radius: 0.32 },
    { pos: [1.8, 11, -1], height: 2.7, radius: 0.31 },
    { pos: [-2.2, 10.8, -2.5], height: 3.0, radius: 0.34 },
    { pos: [2.2, 10.8, -2.5], height: 2.9, radius: 0.33 },
    { pos: [-3.5, 9.8, -4], height: 3.5, radius: 0.38 },
    { pos: [3.5, 9.8, -4], height: 3.4, radius: 0.37 },
    { pos: [0, 10.2, -4.5], height: 3.8, radius: 0.4 },
    { pos: [-2, 9.5, -5], height: 3.6, radius: 0.39 },
    { pos: [2, 9.5, -5], height: 3.7, radius: 0.39 },
    { pos: [-3, 12, 8], height: 1.8, radius: 0.24 },
    { pos: [0, 12.5, 8], height: 2.0, radius: 0.26 },
    { pos: [3, 12, 8], height: 1.9, radius: 0.25 },
  ];

  stalactitePositions.forEach((cfg, i) => {
    const geo = CaveGeometry.createStalactites(1, cfg.radius, cfg.height);
    const mesh = new Mesh(gl, geo);
    const node = new SceneNode(mesh, colors.stoneMedium);
    node.name = `STALACTITE_${i}`;
    mat4.translate(node.localTransform, node.localTransform, cfg.pos);
    mat4.rotateY(
      node.localTransform,
      node.localTransform,
      Math.random() * 0.3 - 0.15
    );
    caveRoot.addChild(node);
  });

  // stalagmit di pinggir
  const stalagmitePositions = [
    { pos: [-8.2, 0, 9.3], height: 1.9, radius: 0.39 },
    { pos: [-9.1, 0, 7.8], height: 2.3, radius: 0.43 },
    { pos: [-7.8, 0, 8.1], height: 1.5, radius: 0.34 },
    { pos: [-8.9, 0, 6.2], height: 1.7, radius: 0.37 },
    { pos: [-8.3, 0, 4.7], height: 2.1, radius: 0.41 },
    { pos: [-9.3, 0, 3.5], height: 2.6, radius: 0.46 },
    { pos: [-7.9, 0, 2.8], height: 1.4, radius: 0.33 },
    { pos: [-8.7, 0, 1.2], height: 2.0, radius: 0.4 },
    { pos: [-9.5, 0, -0.3], height: 2.9, radius: 0.49 },
    { pos: [-8.1, 0, -1.8], height: 1.8, radius: 0.38 },
    { pos: [-8.9, 0, -2.7], height: 2.4, radius: 0.44 },
    { pos: [8.4, 0, 9.7], height: 2.0, radius: 0.4 },
    { pos: [9.2, 0, 8.3], height: 1.6, radius: 0.35 },
    { pos: [7.7, 0, 7.5], height: 1.9, radius: 0.39 },
    { pos: [8.8, 0, 6.1], height: 2.2, radius: 0.42 },
    { pos: [9.0, 0, 4.9], height: 1.7, radius: 0.36 },
    { pos: [8.2, 0, 3.6], height: 2.5, radius: 0.45 },
    { pos: [9.4, 0, 2.2], height: 1.5, radius: 0.34 },
    { pos: [8.6, 0, 1.0], height: 2.1, radius: 0.41 },
    { pos: [9.1, 0, -0.5], height: 2.7, radius: 0.47 },
    { pos: [8.3, 0, -1.9], height: 1.8, radius: 0.38 },
    { pos: [8.9, 0, -3.1], height: 2.3, radius: 0.43 },
    { pos: [-7.3, 0, -4.8], height: 3.2, radius: 0.52 },
    { pos: [-5.8, 0, -5.5], height: 2.7, radius: 0.47 },
    { pos: [-3.9, 0, -5.9], height: 2.4, radius: 0.44 },
    { pos: [4.1, 0, -5.8], height: 2.5, radius: 0.45 },
    { pos: [6.2, 0, -5.3], height: 2.9, radius: 0.49 },
    { pos: [7.5, 0, -4.6], height: 3.0, radius: 0.5 },
    { pos: [-7.2, 0, 10.1], height: 1.1, radius: 0.27 },
    { pos: [-6.5, 0, 9.8], height: 1.3, radius: 0.29 },
    { pos: [-6.9, 0, 8.9], height: 0.9, radius: 0.25 },
    { pos: [6.8, 0, 10.3], height: 1.2, radius: 0.28 },
    { pos: [7.4, 0, 9.6], height: 1.0, radius: 0.26 },
    { pos: [7.1, 0, 8.8], height: 1.4, radius: 0.3 },
    { pos: [-7.5, 0, 5.3], height: 1.6, radius: 0.35 },
    { pos: [7.8, 0, 5.7], height: 1.8, radius: 0.37 },
    { pos: [-8.0, 0, 0.4], height: 1.5, radius: 0.34 },
    { pos: [8.5, 0, 0.8], height: 1.7, radius: 0.36 },
  ];

  stalagmitePositions.forEach((cfg, i) => {
    const geo = CaveGeometry.createStalagmites(1, cfg.radius, cfg.height);
    const mesh = new Mesh(gl, geo);
    const node = new SceneNode(mesh, colors.stoneMedium);
    node.name = `STALAGMITE_${i}`;
    mat4.translate(node.localTransform, node.localTransform, cfg.pos);
    mat4.rotateY(
      node.localTransform,
      node.localTransform,
      Math.random() * Math.PI * 2
    );
    caveRoot.addChild(node);
  });

  // batu samping & belakang
  const rockPositions = [
    { pos: [-7, 0.5, 6], size: 1.2, color: colors.rockBrown1 },
    { pos: [-8, 0.4, 4], size: 1.0, color: colors.rockBrown2 },
    { pos: [-7.5, 0.6, 2], size: 1.3, color: colors.rockBrown3 },
    { pos: [-8.5, 0.3, 0], size: 0.9, color: colors.rockBrown1 },
    { pos: [-7, 0.5, -2], size: 1.1, color: colors.rockBrown2 },
    { pos: [-8, 0.4, -4], size: 1.0, color: colors.rockBrown3 },
    { pos: [7, 0.5, 6], size: 1.1, color: colors.rockBrown2 },
    { pos: [8, 0.4, 4], size: 1.0, color: colors.rockBrown3 },
    { pos: [7.5, 0.6, 2], size: 1.2, color: colors.rockBrown1 },
    { pos: [8.5, 0.3, 0], size: 0.8, color: colors.rockBrown2 },
    { pos: [7, 0.5, -2], size: 1.0, color: colors.rockBrown3 },
    { pos: [8, 0.4, -4], size: 0.9, color: colors.rockBrown1 },
    { pos: [-4, 0.7, -5], size: 1.4, color: colors.rockBrown1 },
    { pos: [0, 0.5, -6], size: 1.3, color: colors.rockBrown2 },
    { pos: [4, 0.7, -5], size: 1.5, color: colors.rockBrown3 },
  ];

  rockPositions.forEach((cfg, i) => {
    const geo = CaveGeometry.createRockFormation(cfg.size, i * 123.456);
    const mesh = new Mesh(gl, geo);
    const node = new SceneNode(mesh, cfg.color);
    node.name = `ROCK_FORMATION_${i}`;
    mat4.translate(node.localTransform, node.localTransform, cfg.pos);
    mat4.rotateY(
      node.localTransform,
      node.localTransform,
      Math.random() * Math.PI * 2
    );
    mat4.rotateX(
      node.localTransform,
      node.localTransform,
      (Math.random() - 0.5) * 0.3
    );
    mat4.rotateZ(
      node.localTransform,
      node.localTransform,
      (Math.random() - 0.5) * 0.3
    );
    caveRoot.addChild(node);
  });

  return caveRoot;
}

window.createCave = createCave;
