/**
 * Main Application Entry Point
 * Multi-Island Setup with FREE CAMERA, Animated Pokemon & ANIMATED CLOUDS
 */

function main() {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl", { antialias: true });
  if (!gl) {
    alert("WebGL tidak tersedia.");
    return;
  }

  // ===== ISLAND CONFIGURATION =====
  const ISLAND_CONFIG = [
    {
      name: "ISLAND_A",
      position: [30, -5, -20],
      scale: 2.0,
      pokemonName: "Garchomp",
    },
    {
      name: "ISLAND_B",
      position: [-30, -5, -20],
      scale: 2.0,
      pokemonName: "Gabite",
    },
    {
      name: "ISLAND_C",
      position: [0, 0, -40],
      scale: 2.5,
      pokemonName: "Mega Garchomp",
    },
  ];

  // ===== CAMERA STATE =====
  const cameraState = {
    target: [-3, 0, 0],
    distance: 80,
    azimuth: 0,
    elevation: 0.1,
    minElevation: -Math.PI / 3,
    maxElevation: Math.PI / 2.5,
  };

  // ===== INPUT =====
  const keys = {};
  window.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
  window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));
  window.addEventListener("blur", () => {
    for (const k in keys) keys[k] = false;
  });

  // ===== MOUSE / SKYBOX =====
  let isDragging = false,
    lastMouseX = -1,
    lastMouseY = -1;
  const skyboxRotationMatrix = mat4.create();

  const canvasEl = document.querySelector("#glCanvas");
  canvasEl.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });
  canvasEl.addEventListener("mouseup", () => {
    isDragging = false;
  });
  canvasEl.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    cameraState.azimuth -= dx * 0.01;
    cameraState.elevation -= dy * 0.01;
    cameraState.elevation = Math.max(
      cameraState.minElevation,
      Math.min(cameraState.maxElevation, cameraState.elevation)
    );
  });
  canvasEl.addEventListener("wheel", (e) => {
    e.preventDefault();
    cameraState.distance += e.deltaY * 0.05;
    cameraState.distance = Math.max(20, Math.min(150, cameraState.distance));
  });

  // ===== CAMERA HELPERS =====
  function updateCameraMovement(dt) {
    const speed = (keys["shift"] ? 125 : 50) * dt;
    const vSpeed = 50 * dt;
    const fX = Math.sin(cameraState.azimuth),
      fZ = Math.cos(cameraState.azimuth);
    const rX = Math.cos(cameraState.azimuth),
      rZ = -Math.sin(cameraState.azimuth);

    let dx = 0,
      dy = 0,
      dz = 0;
    if (keys["w"]) {
      dx -= fX * speed;
      dz -= fZ * speed;
    }
    if (keys["s"]) {
      dx += fX * speed;
      dz += fZ * speed;
    }
    if (keys["a"]) {
      dx -= rX * speed;
      dz -= rZ * speed;
    }
    if (keys["d"]) {
      dx += rX * speed;
      dz += rZ * speed;
    }
    if (keys["q"]) {
      dy -= vSpeed;
    }
    if (keys["e"]) {
      dy += vSpeed;
    }

    cameraState.target[0] += dx;
    cameraState.target[1] += dy;
    cameraState.target[2] += dz;
  }
  function calculateOrbitPosition() {
    const camX =
      cameraState.target[0] +
      cameraState.distance *
        Math.cos(cameraState.elevation) *
        Math.sin(cameraState.azimuth);
    const camY =
      cameraState.target[1] +
      cameraState.distance * Math.sin(cameraState.elevation);
    const camZ =
      cameraState.target[2] +
      cameraState.distance *
        Math.cos(cameraState.elevation) *
        Math.cos(cameraState.azimuth);
    return [camX, camY, camZ];
  }
  function updateCamera(viewMatrix) {
    const cameraPosition = calculateOrbitPosition();
    mat4.lookAt(viewMatrix, cameraPosition, cameraState.target, [0, 1, 0]);
    return cameraPosition;
  }

  // ===== SHADER =====
  const shaderProgram = initShaderProgram(
    gl,
    vertexShaderSource,
    fragmentShaderSource
  );
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
      vertexNormal: gl.getAttribLocation(shaderProgram, "a_normal"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "u_projectionMatrix"
      ),
      viewMatrix: gl.getUniformLocation(shaderProgram, "u_viewMatrix"),
      modelMatrix: gl.getUniformLocation(shaderProgram, "u_modelMatrix"),
      normalMatrix: gl.getUniformLocation(shaderProgram, "u_normalMatrix"),
      color: gl.getUniformLocation(shaderProgram, "u_color"),
      lightDirection: gl.getUniformLocation(shaderProgram, "u_lightDirection"),
      viewPosition: gl.getUniformLocation(shaderProgram, "u_viewPosition"),
    },
  };

  const caveShaderProgram = initShaderProgram(
    gl,
    caveVertexShaderSource,
    caveFragmentShaderSource
  );
  const caveProgramInfo = {
    program: caveShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(caveShaderProgram, "a_position"),
      vertexNormal: gl.getAttribLocation(caveShaderProgram, "a_normal"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        caveShaderProgram,
        "u_projectionMatrix"
      ),
      viewMatrix: gl.getUniformLocation(caveShaderProgram, "u_viewMatrix"),
      modelMatrix: gl.getUniformLocation(caveShaderProgram, "u_modelMatrix"),
      normalMatrix: gl.getUniformLocation(caveShaderProgram, "u_normalMatrix"),
      color: gl.getUniformLocation(caveShaderProgram, "u_color"),
      lightDirection: gl.getUniformLocation(
        caveShaderProgram,
        "u_lightDirection"
      ),
      viewPosition: gl.getUniformLocation(caveShaderProgram, "u_viewPosition"),
    },
  };

  // ===== SCENE SETUP =====
  const drawSkybox = window.setupSkybox(gl);

  // ===== ISLANDS WITH CLOUD ANIMATORS =====
  const islands = [];
  const waterBodies = [];
  const allCloudAnimators = []; // <<< COLLECT ALL CLOUD ANIMATORS

  ISLAND_CONFIG.forEach((cfg) => {
    const island = window.createIsland ? window.createIsland(gl) : null;
    if (!island) return;
    island.name = cfg.name;

    const islandWorldPosition = [...cfg.position];
    const islandScaleFactor = cfg.scale || 1.0;

    const T = mat4.create();
    mat4.translate(T, T, cfg.position);
    const S = mat4.create();
    mat4.scale(S, S, [cfg.scale || 1, cfg.scale || 1, cfg.scale || 1]);

    mat4.multiply(island.localTransform, T, island.localTransform);
    mat4.multiply(island.localTransform, S, island.localTransform);
    islands.push(island);

    // ===== COLLECT CLOUD ANIMATORS FROM ISLAND =====
    if (island.cloudAnimators && Array.isArray(island.cloudAnimators)) {
      // Update island center in world coordinates for each animator
      const islandWorldCenter = [
        island.localTransform[12],
        island.localTransform[13],
        island.localTransform[14],
      ];

      island.cloudAnimators.forEach((animator) => {
        animator.islandCenter = islandWorldCenter;
        allCloudAnimators.push(animator);
      });

      console.log(
        `   ${cfg.name}: ${island.cloudAnimators.length} cloud animators registered`
      );
    }
  });

  console.log(`✅ Total cloud animators: ${allCloudAnimators.length}`);

  let mainWaterNode = null;
  if (window.createWaterBody && window.Primitives?.createHalfEllipsoid) {
    console.log("🌊 Creating main water body...");

    const waterWorldPosition = [0, -50, -190];
    const waterScaleFactor = 150;

    const waterRadiusX = 1.5 * waterScaleFactor;
    const waterRadiusZ = 1.2 * waterScaleFactor;
    const waterDepth = 0.5 * waterScaleFactor;

    const waterMesh = new Mesh(
      gl,
      Primitives.createHalfEllipsoid(
        waterRadiusX,
        waterDepth,
        waterRadiusZ,
        32,
        32
      )
    );
    const waterColor = [0.2, 0.5, 0.8, 0.7];
    mainWaterNode = new SceneNode(waterMesh, waterColor);
    mainWaterNode.name = "MainWaterBody";

    mat4.identity(mainWaterNode.localTransform);
    mat4.translate(
      mainWaterNode.localTransform,
      mainWaterNode.localTransform,
      waterWorldPosition
    );

    console.log(
      `   Water positioned at [${waterWorldPosition
        .map((n) => n.toFixed(1))
        .join(", ")}] with scale factor ${waterScaleFactor}`
    );
  } else {
    console.warn(
      "createWaterBody or Primitives.createHalfEllipsoid not found. Skipping main water creation."
    );
  }

  // ===== SNOW GLOBE ENCLOSURE =====
  let snowGlobeNode = null;
  if (window.Primitives?.createEllipsoid) {
    console.log("🔮 Creating snow globe enclosure...");
    const globeRadiusX = 100;
    const globeRadiusY = 80;
    const globeRadiusZ = 100;
    const globeWorldPosition = [0, 20, -40];

    const globeMesh = new Mesh(
      gl,
      Primitives.createEllipsoid(
        globeRadiusX,
        globeRadiusY,
        globeRadiusZ,
        64,
        64
      )
    );
    const globeColor = [0.7, 0.85, 1.0, 0.25];
    snowGlobeNode = new SceneNode(globeMesh, globeColor);
    snowGlobeNode.name = "SnowGlobe";

    mat4.identity(snowGlobeNode.localTransform);
    mat4.translate(
      snowGlobeNode.localTransform,
      snowGlobeNode.localTransform,
      globeWorldPosition
    );

    console.log(
      `   Globe positioned at [${globeWorldPosition
        .map((n) => n.toFixed(1))
        .join(", ")}]`
    );
  } else {
    console.warn("Primitives.createEllipsoid not found. Skipping globe.");
  }

  // ===== CAVE SETUP =====
  console.log("Creating cave...");
  const cave = window.createCave ? window.createCave(gl) : null;
  if (cave) {
    console.log("✅ Cave created successfully!");
    mat4.translate(cave.localTransform, cave.localTransform, [-10, -34, -320]);
    mat4.scale(cave.localTransform, cave.localTransform, [10, 10, 10]);
  } else {
    console.error("❌ Cave creation failed!");
  }

  // ===== POKEMONS =====
  const pokemons = [];

  // GARCHOMP
  if (window.createGarchomp) {
    const g = window.createGarchomp(gl);
    g.name = "GARCHOMP";
    const wrap = new SceneNode();
    wrap.name = "GARCHOMP_WRAPPER";
    mat4.scale(wrap.localTransform, wrap.localTransform, [3, 3, 3]);
    mat4.translate(wrap.localTransform, wrap.localTransform, [-10, 0.75, -2]);
    wrap.addChild(g);

    const anim = new GarchompAnimator(g, {
      startPos: [30, -2.5, -25],
      endPos: [30, -2.5, -15],
      walkDuration: 3.0,
      pauseDuration: 5.0,
      turnDuration: 1.0,
      tailSwayAmount: 0.2,
      tailSwayFreq: 1.2,
    });

    pokemons.push({
      node: wrap,
      pokemonNode: g,
      animator: anim,
      islandIndex: 0,
    });
  }

  // GABITE
  if (window.createGabite) {
    const gabiteNode = window.createGabite(gl);
    gabiteNode.name = "GABITE";
    const gabiteWrapper = new SceneNode();
    gabiteWrapper.name = "GABITE_WRAPPER";

    mat4.scale(
      gabiteWrapper.localTransform,
      gabiteWrapper.localTransform,
      [3, 3, 3]
    );
    mat4.translate(
      gabiteWrapper.localTransform,
      gabiteWrapper.localTransform,
      [-20, -6.5, -24]
    );

    const MODEL_LOCAL_FORWARD_IS_POS_Z = true;
    if (MODEL_LOCAL_FORWARD_IS_POS_Z) {
      mat4.rotateY(
        gabiteWrapper.localTransform,
        gabiteWrapper.localTransform,
        Math.PI
      );
    }

    gabiteWrapper.addChild(gabiteNode);

    const gabiteAnimator = new GabiteAnimator(gabiteNode, {
      lookDuration: 2.0,
      neckTurnAngle: Math.PI / 4,
      hopDuration: 2.0,
      hopCount: 2,
      hopHeight: 1.0,
      squatAmount: 0.15,
      tailSwayAmount: 0.25,
      tailSwayFreq: 2.0,
      bodyBobAmount: 0.06,
      armSwingAngle: Math.PI / 10,
    });

    gabiteAnimator.currentRotation = 0;

    pokemons.push({
      node: gabiteWrapper,
      pokemonNode: gabiteNode,
      animator: gabiteAnimator,
      islandIndex: 1,
    });
  }

  // MEGA GARCHOMP
  if (window.createMegaGarchomp) {
    const m = window.createMegaGarchomp(gl);
    m.name = "MEGA_GARCHOMP";
    const wrap = new SceneNode();
    wrap.name = "MEGA_GARCHOMP_WRAPPER";
    mat4.scale(wrap.localTransform, wrap.localTransform, [7, 7, 7]);
    mat4.translate(wrap.localTransform, wrap.localTransform, [-2, 7.5, 30]);
    wrap.addChild(m);

    const anim = new MegaGarchompAnimator(m, {
      startPos: [0, -8, -55],
      endPos: [0, -8, -65],
      startRotation: Math.PI,
      prowlDuration: 4.5,
      idleDuration: 3.0,
      attackDuration: 2.5,
      roarDuration: 3.5,
      turnDuration: 1.2,
    });

    pokemons.push({
      node: wrap,
      pokemonNode: m,
      animator: anim,
      islandIndex: 2,
    });
  }

  // ===== GIANT ROCK FORMATIONS =====
  const rockFormations = [];

  const rockFormation1 = createLayeredMesa(gl, 6, 12, 10, 15, 0.2);
  mat4.translate(
    rockFormation1.localTransform,
    rockFormation1.localTransform,
    [-75, -5, -90]
  );
  mat4.scale(
    rockFormation1.localTransform,
    rockFormation1.localTransform,
    [3, 3, 3]
  );
  mat4.rotateY(
    rockFormation1.localTransform,
    rockFormation1.localTransform,
    Math.PI / 2
  );
  rockFormations.push(rockFormation1);

  const rockFormation2 = createLayeredMesa(gl, 8, 15, 12, 20, 0.7);
  mat4.translate(
    rockFormation2.localTransform,
    rockFormation2.localTransform,
    [82, 1, -120]
  );
  mat4.scale(
    rockFormation2.localTransform,
    rockFormation2.localTransform,
    [3, 3, 3]
  );
  mat4.rotateY(
    rockFormation2.localTransform,
    rockFormation2.localTransform,
    -Math.PI / 6
  );
  rockFormations.push(rockFormation2);

  // ===== PROJECTION / VIEW =====
  const projectionMatrix = mat4.create();
  const viewMatrix = mat4.create();

  // ===== RENDER LOOP =====
  let lastTime = 0;
  function animate(nowMs) {
    const t = nowMs * 0.001;
    const dt = Math.min(Math.max(t - lastTime, 0), 0.1);
    lastTime = t;

    if (resizeCanvasToDisplaySize(gl.canvas)) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    mat4.perspective(
      projectionMatrix,
      (50 * Math.PI) / 180,
      gl.canvas.clientWidth / gl.canvas.clientHeight,
      0.1,
      1000.0
    );

    updateCameraMovement(dt);
    const cameraPosition = updateCamera(viewMatrix);

    mat4.rotate(skyboxRotationMatrix, skyboxRotationMatrix, 0.0003, [0, 1, 0]);

    gl.clearColor(0.1, 0.1, 0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // ===== 1) UPDATE POKEMON ANIMATORS =====
    pokemons.forEach((p) => {
      if (p.animator) p.animator.update(dt);
    });

    // ===== 2) UPDATE CLOUD ANIMATORS =====
    allCloudAnimators.forEach((animator) => {
      animator.update(dt);
    });

    // ===== 3) SKYBOX =====
    gl.depthMask(false);
    drawSkybox(projectionMatrix, viewMatrix, skyboxRotationMatrix);
    gl.depthMask(true);

    // ===== 4) CAVE =====
    const identityMatrix = mat4.create();
    if (cave) {
      drawScene(
        gl,
        caveProgramInfo,
        cave,
        projectionMatrix,
        viewMatrix,
        identityMatrix,
        cameraPosition
      );
    }

    // ===== 5) DRAW ISLANDS (with animated clouds) =====
    const I = mat4.create();
    islands.forEach((island) => {
      if (island)
        drawScene(
          gl,
          programInfo,
          island,
          projectionMatrix,
          viewMatrix,
          I,
          cameraPosition
        );
    });

    // ===== 6) DRAW POKEMONS =====
    pokemons.forEach((p) => {
      if (p.node)
        drawScene(
          gl,
          programInfo,
          p.node,
          projectionMatrix,
          viewMatrix,
          I,
          cameraPosition
        );
    });

    // ===== 7) DRAW ROCK FORMATIONS =====
    rockFormations.forEach((rock) => {
      drawScene(
        gl,
        programInfo,
        rock,
        projectionMatrix,
        viewMatrix,
        I,
        cameraPosition
      );
    });

    // ===== 8) DRAW WATER (transparent) =====
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    if (mainWaterNode) {
      drawScene(
        gl,
        programInfo,
        mainWaterNode,
        projectionMatrix,
        viewMatrix,
        I,
        cameraPosition
      );
    }

    gl.disable(gl.BLEND);

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

// ===== DRAW SCENE / HELPERS =====
function drawScene(
  gl,
  programInfo,
  node,
  projectionMatrix,
  viewMatrix,
  parentTransform,
  cameraPosition
) {
  let local = mat4.create();
  const cfgTable = window.entityConfig || {};
  const cfg = node.name ? cfgTable[node.name] : null;

  const isAnimated = [
    "GARCHOMP",
    "GABITE",
    "MEGA_GARCHOMP",
    "PIKACHU",
    "CHARIZARD",
  ].includes(node.name);

  if (cfg && !isAnimated) {
    const p = cfg.position || [0, 0, 0];
    const s = cfg.scale || [1, 1, 1];
    const e = cfg.rotationEuler || [0, 0, 0];

    const T = mat4.create();
    mat4.fromTranslation(T, p);
    const S = mat4.create();
    Array.isArray(s) ? mat4.fromScaling(S, s) : mat4.fromScaling(S, [s, s, s]);
    const R = mat4.create();
    mat4.identity(R);
    mat4.rotateZ(R, R, e[2] || 0);
    mat4.rotateY(R, R, e[1] || 0);
    mat4.rotateX(R, R, e[0] || 0);

    local = mat4.create();
    mat4.multiply(local, T, R);
    mat4.multiply(local, local, S);
  } else if (node.localTransform) {
    mat4.copy(local, node.localTransform);
  } else {
    mat4.identity(local);
  }

  let modelMatrix = mat4.create();
  const worldSpace =
    (cfg && cfg.worldSpace === true) || node.worldSpace === true;

  if (worldSpace) {
    const Tonly = mat4.create();
    mat4.identity(Tonly);
    Tonly[12] = local[12];
    Tonly[13] = local[13];
    Tonly[14] = local[14];
    const RS = mat4.clone(local);
    RS[12] = RS[13] = RS[14] = 0;
    const tmp = mat4.create();
    mat4.multiply(tmp, parentTransform, RS);
    mat4.multiply(modelMatrix, Tonly, tmp);
  } else {
    mat4.multiply(modelMatrix, parentTransform, local);
  }

  if (node.mesh) {
    gl.bindBuffer(gl.ARRAY_BUFFER, node.mesh.vertexBuffer);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, node.mesh.normalBuffer);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    gl.useProgram(programInfo.program);

    const lightPosition = [
      cameraPosition[0] + 12,
      cameraPosition[1] + 25,
      cameraPosition[2] - 8,
    ];

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.viewMatrix,
      false,
      viewMatrix
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelMatrix,
      false,
      modelMatrix
    );
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix
    );
    gl.uniform4fv(programInfo.uniformLocations.color, node.color);
    gl.uniform3fv(programInfo.uniformLocations.lightDirection, lightPosition);
    gl.uniform3fv(programInfo.uniformLocations.viewPosition, cameraPosition);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, node.mesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, node.mesh.indicesCount, gl.UNSIGNED_SHORT, 0);
  }

  for (const child of node.children) {
    drawScene(
      gl,
      programInfo,
      child,
      projectionMatrix,
      viewMatrix,
      modelMatrix,
      cameraPosition
    );
  }
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vs = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    alert("Gagal link shader: " + gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}
function resizeCanvasToDisplaySize(canvas) {
  const w = canvas.clientWidth,
    h = canvas.clientHeight;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    return true;
  }
  return false;
}
function loadShader(gl, type, source) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    alert("Gagal kompilasi shader: " + gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

// ===== START APP =====
window.addEventListener("DOMContentLoaded", main);
