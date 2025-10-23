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
  const allCloudAnimators = []; // ← NEW: Array untuk cloud animators

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
      // Calculate island world center AFTER transforms applied
      const islandWorldCenter = [
        island.localTransform[12],
        island.localTransform[13],
        island.localTransform[14],
      ];

      const CLOUD_Y_OFFSET = 150; // <<— atur sesuka kamu
      islandWorldCenter[1] += CLOUD_Y_OFFSET;

      island.cloudAnimators.forEach((animator) => {
        // Set island center for orbital reference
        animator.setIslandCenter(islandWorldCenter);

        // Add to global list
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

  // === GARCHOMP ===
  if (window.createGarchomp) {
    const garchompNode = window.createGarchomp(gl);
    garchompNode.name = "GARCHOMP";

    const garchompScaleNode = new SceneNode();
    garchompScaleNode.name = "GARCHOMP_SCALE_NODE";
    garchompScaleNode.addChild(garchompNode);

    const garchompFrontOffsetNode = new SceneNode();
    garchompFrontOffsetNode.name = "GARCHOMP_FRONT_OFFSET_NODE";
    garchompFrontOffsetNode.addChild(garchompScaleNode);

    const garchompLiftNode = new SceneNode();
    garchompLiftNode.name = "GARCHOMP_LIFT_NODE";
    garchompLiftNode.addChild(garchompFrontOffsetNode);

    const garchompOrientationNode = new SceneNode();
    garchompOrientationNode.name = "GARCHOMP_ORIENTATION_NODE";
    garchompOrientationNode.addChild(garchompLiftNode);

    const garchompWrapper = new SceneNode();
    garchompWrapper.name = "GARCHOMP_WRAPPER";
    mat4.scale(
      garchompWrapper.localTransform,
      garchompWrapper.localTransform,
      [3, 3, 3]
    );
    mat4.translate(
      garchompWrapper.localTransform,
      garchompWrapper.localTransform,
      [-10, 0.75, -2]
    );
    garchompWrapper.addChild(garchompOrientationNode);

    let garchompSummonAnimator = null;
    let garchompPokeballPlacementNode = null;

    if (window.createPokeball) {
      const pokeballData = window.createPokeball(gl, 1.0);
      if (pokeballData && pokeballData.root) {
        garchompPokeballPlacementNode = new SceneNode();
        garchompPokeballPlacementNode.name = "GARCHOMP_POKEBALL_PLACEMENT_NODE";
        mat4.translate(
          garchompPokeballPlacementNode.localTransform,
          garchompPokeballPlacementNode.localTransform,
          [35, -1.2, -40]
        );
        mat4.rotate(
          garchompPokeballPlacementNode.localTransform,
          garchompPokeballPlacementNode.localTransform,
          Math.PI,
          [0, 1, 0]
        );

        const pbScaleNode = new SceneNode();
        pbScaleNode.name = "GARCHOMP_POKEBALL_SCALE_NODE";
        mat4.scale(
          pbScaleNode.localTransform,
          pbScaleNode.localTransform,
          [2, 2, 2]
        );

        pbScaleNode.addChild(pokeballData.root);
        garchompPokeballPlacementNode.addChild(pbScaleNode);
        garchompOrientationNode.addChild(garchompPokeballPlacementNode);

        garchompSummonAnimator = new GabiteSummonAnimator({
          pokeballTopNode: pokeballData.topHinge,
          gabiteScaleNode: garchompScaleNode,
          gabiteLiftNode: garchompLiftNode,
          gabiteOffsetNode: garchompFrontOffsetNode,
          colorGroups: [
            {
              root: garchompNode,
              startColor: [1, 1, 1, 1],
              mode: "instant",
              applyOn: "emerging",
            },
            {
              root: pokeballData.root,
              startColor: [1, 1, 1, 1],
              mode: "lerp",
              applyOn: "start",
              blendPhase: "opening",
            },
          ],
          config: {
            initialScale: 0,
            finalScale: 1.0,
            initialLift: -1.6,
            finalLift: 0.0,
            openAngle: Math.PI * 0.35,
            openDuration: 1.0,
            postOpenDelay: 0.25,
            emergeDuration: 1.5,
            pokeballMotionNode: garchompPokeballPlacementNode,
            pokeballMotionOffset: [0, 0.9, 3.4],
            pokeballTiltAngle: -Math.PI * 0.35,
            gabiteOffsetStart: [35, 0, -40],
            gabiteOffsetTarget: [0, 0, 0],
          },
        });
      }
    }

    const garchompAnimator = new GarchompAnimator(garchompNode, {
      startPos: [30, -2.5, -25],
      endPos: [30, -2.5, -15],
      walkDuration: 3.0,
      pauseDuration: 5.0,
      turnDuration: 1.0,
      tailSwayAmount: 0.2,
      tailSwayFreq: 1.2,
    });

    const garchompCombinedAnimator = {
      update(dt) {
        if (garchompSummonAnimator) {
          garchompSummonAnimator.update(dt);
          if (
            garchompPokeballPlacementNode &&
            garchompSummonAnimator.isFinished()
          ) {
            const idx = garchompOrientationNode.children.indexOf(
              garchompPokeballPlacementNode
            );
            if (idx !== -1) garchompOrientationNode.children.splice(idx, 1);
            garchompPokeballPlacementNode = null;
          }
        }
        garchompAnimator.update(dt);
      },
    };

    pokemons.push({
      node: garchompWrapper,
      pokemonNode: garchompNode,
      animator: garchompCombinedAnimator,
      islandIndex: 0,
    });
  }

  // === MEGA GARCHOMP ===
  if (window.createMegaGarchomp) {
    const megaNode = window.createMegaGarchomp(gl);
    megaNode.name = "MEGA_GARCHOMP";

    const megaScaleNode = new SceneNode();
    megaScaleNode.name = "MEGA_GARCHOMP_SCALE_NODE";
    megaScaleNode.addChild(megaNode);

    const megaFrontOffsetNode = new SceneNode();
    megaFrontOffsetNode.name = "MEGA_GARCHOMP_FRONT_OFFSET_NODE";
    megaFrontOffsetNode.addChild(megaScaleNode);

    const megaLiftNode = new SceneNode();
    megaLiftNode.name = "MEGA_GARCHOMP_LIFT_NODE";
    megaLiftNode.addChild(megaFrontOffsetNode);

    const megaOrientationNode = new SceneNode();
    megaOrientationNode.name = "MEGA_GARCHOMP_ORIENTATION_NODE";
    megaOrientationNode.addChild(megaLiftNode);

    const megaWrapper = new SceneNode();
    megaWrapper.name = "MEGA_GARCHOMP_WRAPPER";
    mat4.scale(
      megaWrapper.localTransform,
      megaWrapper.localTransform,
      [7, 7, 7]
    );
    mat4.translate(
      megaWrapper.localTransform,
      megaWrapper.localTransform,
      [-2, 7.5, 30]
    );
    megaWrapper.addChild(megaOrientationNode);

    let megaSummonAnimator = null;
    let megaPokeballPlacementNode = null;

    if (window.createPokeball) {
      const pokeballData = window.createPokeball(gl, 1.0);
      if (pokeballData && pokeballData.root) {
        megaPokeballPlacementNode = new SceneNode();
        megaPokeballPlacementNode.name =
          "MEGA_GARCHOMP_POKEBALL_PLACEMENT_NODE";
        mat4.translate(
          megaPokeballPlacementNode.localTransform,
          megaPokeballPlacementNode.localTransform,
          [5, -5, -80]
        );
        mat4.rotate(
          megaPokeballPlacementNode.localTransform,
          megaPokeballPlacementNode.localTransform,
          Math.PI,
          [0, 1, 0]
        );

        const pbScaleNode = new SceneNode();
        pbScaleNode.name = "MEGA_GARCHOMP_POKEBALL_SCALE_NODE";
        mat4.scale(
          pbScaleNode.localTransform,
          pbScaleNode.localTransform,
          [1.5, 1.5, 1.5]
        );

        pbScaleNode.addChild(pokeballData.root);
        megaPokeballPlacementNode.addChild(pbScaleNode);
        megaOrientationNode.addChild(megaPokeballPlacementNode);

        megaSummonAnimator = new GabiteSummonAnimator({
          pokeballTopNode: pokeballData.topHinge,
          gabiteScaleNode: megaScaleNode,
          gabiteLiftNode: megaLiftNode,
          gabiteOffsetNode: megaFrontOffsetNode,
          colorGroups: [
            {
              root: megaNode,
              startColor: [1, 1, 1, 1],
              mode: "instant",
              applyOn: "emerging",
            },
            {
              root: pokeballData.root,
              startColor: [1, 1, 1, 1],
              mode: "lerp",
              applyOn: "start",
              blendPhase: "opening",
            },
          ],
          config: {
            initialScale: 0,
            finalScale: 1.0,
            initialLift: -1.6,
            finalLift: 0.0,
            openAngle: Math.PI * 0.35,
            openDuration: 1.0,
            postOpenDelay: 0.25,
            emergeDuration: 1.5,
            pokeballMotionNode: megaPokeballPlacementNode,
            pokeballMotionOffset: [0, 0.9, 3.4],
            pokeballTiltAngle: -Math.PI * 0.35,
            gabiteOffsetStart: [5, 0, -80],
            gabiteOffsetTarget: [0, 0, 0],
          },
        });
      }
    }

    const megaAnimator = new MegaGarchompAnimator(megaNode, {
      startPos: [0, -8, -55],
      endPos: [0, -8, -65],
      startRotation: Math.PI,
      prowlDuration: 4.5,
      idleDuration: 3.0,
      attackDuration: 2.5,
      roarDuration: 3.5,
      turnDuration: 1.2,
    });

    const megaCombinedAnimator = {
      update(dt) {
        if (megaSummonAnimator) {
          megaSummonAnimator.update(dt);
          if (megaPokeballPlacementNode && megaSummonAnimator.isFinished()) {
            const idx = megaOrientationNode.children.indexOf(
              megaPokeballPlacementNode
            );
            if (idx !== -1) megaOrientationNode.children.splice(idx, 1);
            megaPokeballPlacementNode = null;
          }
        }
        megaAnimator.update(dt);
      },
    };

    pokemons.push({
      node: megaWrapper,
      pokemonNode: megaNode,
      animator: megaCombinedAnimator,
      islandIndex: 2,
    });
  }

  // === GABITE WITH POKEBALL SUMMON ===
  if (window.createGabite) {
    const gabiteNode = window.createGabite(gl);
    gabiteNode.name = "GABITE";

    const gabiteScaleNode = new SceneNode();
    gabiteScaleNode.name = "GABITE_SCALE_NODE";
    gabiteScaleNode.addChild(gabiteNode);

    const gabiteFrontOffsetNode = new SceneNode();
    gabiteFrontOffsetNode.name = "GABITE_FRONT_OFFSET_NODE";
    gabiteFrontOffsetNode.addChild(gabiteScaleNode);

    const gabiteLiftNode = new SceneNode();
    gabiteLiftNode.name = "GABITE_LIFT_NODE";
    gabiteLiftNode.addChild(gabiteFrontOffsetNode);

    const gabiteOrientationNode = new SceneNode();
    gabiteOrientationNode.name = "GABITE_ORIENTATION_NODE";
    mat4.rotateY(
      gabiteOrientationNode.localTransform,
      gabiteOrientationNode.localTransform,
      Math.PI
    );
    gabiteOrientationNode.addChild(gabiteLiftNode);

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
    gabiteWrapper.addChild(gabiteOrientationNode);

    let gabiteSummonAnimator = null;
    let pokeballPlacementNode = null;

    if (window.createPokeball) {
      const pokeballData = window.createPokeball(gl, 1.0);
      if (pokeballData && pokeballData.root) {
        pokeballPlacementNode = new SceneNode();
        pokeballPlacementNode.name = "POKEBALL_PLACEMENT_NODE";
        mat4.translate(
          pokeballPlacementNode.localTransform,
          pokeballPlacementNode.localTransform,
          [0, -1.2, 0]
        );

        const pokeballScaleNode = new SceneNode();
        pokeballScaleNode.name = "POKEBALL_SCALE_NODE";
        mat4.scale(
          pokeballScaleNode.localTransform,
          pokeballScaleNode.localTransform,
          [1.5, 1.5, 1.5]
        );

        pokeballScaleNode.addChild(pokeballData.root);
        pokeballPlacementNode.addChild(pokeballScaleNode);
        gabiteOrientationNode.addChild(pokeballPlacementNode);

        gabiteSummonAnimator = new GabiteSummonAnimator({
          pokeballTopNode: pokeballData.topHinge,
          gabiteScaleNode,
          gabiteLiftNode,
          gabiteOffsetNode: gabiteFrontOffsetNode,
          colorGroups: [
            {
              root: gabiteNode,
              startColor: [1, 1, 1, 1],
              mode: "instant",
              applyOn: "emerging",
            },
            {
              root: pokeballData.root,
              startColor: [1, 1, 1, 1],
              mode: "lerp",
              applyOn: "start",
              blendPhase: "opening",
            },
          ],
          config: {
            initialScale: 0,
            finalScale: 1.0,
            initialLift: -1.6,
            finalLift: 0.0,
            openAngle: Math.PI * 0.35,
            openDuration: 1.0,
            postOpenDelay: 0.25,
            emergeDuration: 1.5,
            pokeballMotionNode: pokeballPlacementNode,
            pokeballMotionOffset: [0, 0.9, 3.4],
            pokeballTiltAngle: -Math.PI * 0.35,
            gabiteOffsetStart: [0, 0, 0],
            gabiteOffsetTarget: [0, 0, 0],
          },
        });
      }
    }

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

    const combinedAnimator = {
      update(dt) {
        if (gabiteSummonAnimator) {
          gabiteSummonAnimator.update(dt);
          if (pokeballPlacementNode && gabiteSummonAnimator.isFinished()) {
            const idx = gabiteOrientationNode.children.indexOf(
              pokeballPlacementNode
            );
            if (idx !== -1) gabiteOrientationNode.children.splice(idx, 1);
            pokeballPlacementNode = null;
          }
        }
        gabiteAnimator.update(dt);
      },
    };

    pokemons.push({
      node: gabiteWrapper,
      pokemonNode: gabiteNode,
      animator: combinedAnimator,
      islandIndex: 1,
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

    // ===== 2) UPDATE CLOUD ANIMATORS ===== ← CRITICAL: This makes clouds move!
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
