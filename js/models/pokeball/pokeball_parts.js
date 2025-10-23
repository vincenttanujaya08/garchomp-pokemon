(function () {
  const COLORS = {
    red: [0.9, 0.1, 0.12, 1.0],
    white: [0.96, 0.96, 0.96, 1.0],
    black: [0.05, 0.05, 0.07, 1.0],
    gray: [0.82, 0.82, 0.82, 1.0],
    darkGray: [0.25, 0.25, 0.28, 1.0],
  };

  function createEllipsoidHemisphere(
    radiusX = 1,
    radiusY = 1,
    radiusZ = 1,
    isTop = true,
    latitudeBands = 32,
    longitudeBands = 48
  ) {
    const vertices = [];
    const normals = [];
    const indices = [];

    const latStart = isTop ? 0 : latitudeBands / 2;
    const latEnd = isTop ? latitudeBands / 2 : latitudeBands;
    const rows = latEnd - latStart + 1; // inclusive

    for (let lat = latStart; lat <= latEnd; lat++) {
      const theta = (lat * Math.PI) / latitudeBands; // 0..PI
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= longitudeBands; lon++) {
        const phi = (lon * 2 * Math.PI) / longitudeBands; // 0..2PI
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = radiusX * cosPhi * sinTheta;
        const y = radiusY * cosTheta;
        const z = radiusZ * sinPhi * sinTheta;

        const nx = x / (radiusX * radiusX);
        const ny = y / (radiusY * radiusY);
        const nz = z / (radiusZ * radiusZ);
        const len = Math.hypot(nx, ny, nz) || 1;

        vertices.push(x, y, z);
        normals.push(nx / len, ny / len, nz / len);
      }
    }

    const stride = longitudeBands + 1;
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < longitudeBands; c++) {
        const a = r * stride + c;
        const b = a + stride;
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  }

  function createPokeballUpper(gl, radius = 1) {
    const upperRoot = new SceneNode();

    const topMesh = new Mesh(
      gl,
      createEllipsoidHemisphere(radius, radius, radius, true, 48, 64)
    );
    const topNode = new SceneNode(topMesh, COLORS.red);
    upperRoot.addChild(topNode);

    const bandRadius = radius * 1.005;
    const bandHeight = radius * 0.12;
    const bandMesh = new Mesh(gl, Primitives.createCylinder(bandRadius, bandHeight, 64));
    const bandNode = new SceneNode(bandMesh, COLORS.black);
    upperRoot.addChild(bandNode);

    const buttonGroup = new SceneNode();
    mat4.translate(buttonGroup.localTransform, buttonGroup.localTransform, [
      0,
      0,
      radius + bandHeight * 0.25,
    ]);
    mat4.rotate(buttonGroup.localTransform, buttonGroup.localTransform, Math.PI / 2, [1, 0, 0]);

    const outerMesh = new Mesh(gl, Primitives.createCylinder(radius * 0.28, bandHeight * 0.9, 48));
    const outerNode = new SceneNode(outerMesh, COLORS.black);
    buttonGroup.addChild(outerNode);

    
    const innerMesh = new Mesh(
      gl,
      Primitives.createEllipsoid(radius * 0.27, bandHeight * 0.32, radius * 0.27, 32, 48)
    );
    const innerNode = new SceneNode(innerMesh, COLORS.white);
    mat4.translate(innerNode.localTransform, innerNode.localTransform, [0, 0, bandHeight * 0.13]);
    buttonGroup.addChild(innerNode);

    const centerMesh = new Mesh(gl, Primitives.createCylinder(radius * 0.12, bandHeight * 0.55, 48));
    const centerNode = new SceneNode(centerMesh, COLORS.gray);
    mat4.translate(centerNode.localTransform, centerNode.localTransform, [0, 0, bandHeight * 0.28]);
    buttonGroup.addChild(centerNode);

    upperRoot.addChild(buttonGroup);

    return { upperRoot };
  }

  function createPokeballLower(gl, radius = 1) {
    const bottomMesh = new Mesh(
      gl,
      createEllipsoidHemisphere(radius, radius, radius, false, 48, 64)
    );
    const bottomNode = new SceneNode(bottomMesh, COLORS.white);
    mat4.translate(bottomNode.localTransform, bottomNode.localTransform, [0, -0.0005, 0]);
    return { bottomNode };
  }

  window.PokeballParts = {
    COLORS,
    createEllipsoidHemisphere,
    createPokeballUpper,
    createPokeballLower,
  };
})();

console.log("Pokeball parts loaded");