/**
 * Main Application Entry Point
 * Multi-Island Setup with Cinematic Intro & Warm Golden Lighting
 *
 * INTRO SYSTEM:
 * =============
 * FIRST VISIT: 4-5 second cinematic flyover of all 3 islands
 * RETURN VISITS: 1-2 second quick zoom animation from last island
 * - Press ANY KEY or CLICK to skip intro
 * - localStorage tracks: hasSeenIntro, lastFocusedIsland
 *
 * CONTROLS:
 * =========
 * - Press 1/2/3: Focus on Island A/B/C with smooth transition
 * - Mouse Drag: Orbit around focused island
 * - Mouse Wheel: Zoom in/out
 * - WASD/QE: Pan camera
 *
 * LAYOUT: Triangle Formation
 * 🏝️ Island A (Left)  🏝️ Island B (Right)  🏝️ Island C (Center Back)
 */

function main() {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl", { antialias: true });
  if (!gl) {
    alert("WebGL tidak tersedia.");
    return;
  }

  // ===== ISLAND CONFIGURATION =====
  // ===== ISLAND CONFIGURATION =====
  const ISLAND_CONFIG = [
    {
      name: "ISLAND_A",
      position: [30, -5, -20],
      scale: 2.0,
      pokemonName: "Garchomp",
    }, // Kanan depan
    {
      name: "ISLAND_B",
      position: [-30, -5, -20],
      scale: 2.0,
      pokemonName: "Gabite",
    }, // Kiri depan
    {
      name: "ISLAND_C",
      position: [0, 0, -40],
      scale: 2.5,
      pokemonName: "Mega Garchomp",
    }, // Tengah belakang
  ];

  // ===== INTRO SYSTEM =====
  // ===== INTRO SYSTEM =====
  const introState = {
    isPlaying: false,
    isSkippable: false,
  };

  // ===== CAMERA STATE =====
  // ===== CAMERA STATE =====
  // ===== CAMERA STATE (SIMPLIFIED - NO POKEMON LOCK) =====
  const cameraState = {
    target: [0, -5, -30],
    distance: 80,
    azimuth: 0,
    elevation: 0.5,
    minElevation: -Math.PI / 3,
    maxElevation: Math.PI / 2.5,
  };

  // ===== KEYBOARD STATE =====
  const keys = {};
  function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;

    // HAPUS semua switch camera (1/2/3)
    // Tidak ada lagi lock/unlock Pokemon
  }
  function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // ===== BLUR EVENT (Reset Keys on Focus Loss) =====
  function handleBlur() {
    // Reset semua state tombol ketika jendela kehilangan fokus
    for (const key in keys) {
      if (keys.hasOwnProperty(key)) {
        keys[key] = false;
      }
    }
    console.log("Window lost focus, keys reset."); // Optional: for debugging
  }

  // Tambahkan event listener untuk blur
  window.addEventListener("blur", handleBlur);
  // ===== MOUSE INTERACTION =====
  let isDragging = false;
  let lastMouseX = -1;
  let lastMouseY = -1;
  const skyboxRotationMatrix = mat4.create();

  function handleMouseDown(e) {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleMouseMove(e) {
    if (!isDragging) return;

    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    // FIX: Orbit tetap jalan baik locked maupun free
    cameraState.azimuth -= dx * 0.01;
    cameraState.elevation -= dy * 0.01;
    cameraState.elevation = Math.max(
      cameraState.minElevation,
      Math.min(cameraState.maxElevation, cameraState.elevation)
    );

    // Drag mouse TIDAK unlock dari Pokemon
  }

  function handleWheel(e) {
    e.preventDefault();

    // Zoom in/out - selalu jalan (locked atau free)
    cameraState.distance += e.deltaY * 0.05;
    cameraState.distance = Math.max(20, Math.min(150, cameraState.distance));
  }

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("wheel", handleWheel);

  // ===== INTRO FUNCTIONS =====
  function startIntro() {
    // Direct to free mode - no intro
    introState.isPlaying = false;

    // Set initial camera position (overview dari depan atas)
    cameraState.target = [0, -5, -30];
    cameraState.distance = 80;
    cameraState.azimuth = 0;
    cameraState.elevation = 0.5;

    updateUIIndicator(); // <-- Panggil sekali
    console.log("✅ Started in FREE MODE");
  }
  function startCinematicIntro() {
    console.log("🎬 Starting cinematic intro...");
    introState.isPlaying = true;
    introState.type = "CINEMATIC";
    introState.progress = 0;
    introState.currentWaypoint = 0;
    introState.waypointProgress = 0;
    introState.isSkippable = true;

    // Start from first waypoint
    const firstWaypoint = introState.cinematicPath[0];
    cameraState.target = [...firstWaypoint.target];
    cameraState.distance = firstWaypoint.distance;
    cameraState.azimuth = firstWaypoint.azimuth;
    cameraState.elevation = firstWaypoint.elevation;

    showSkipUI();
  }

  function updateIntro(deltaTime) {
    if (!introState.isPlaying) return;

    if (introState.type === "CINEMATIC") {
      updateCinematicIntro(deltaTime);
    } else if (introState.type === "QUICK") {
      updateQuickIntro(deltaTime);
    }
  }

  function updateCinematicIntro(deltaTime) {
    const waypoints = introState.cinematicPath;
    const currentIdx = introState.currentWaypoint;

    if (currentIdx >= waypoints.length) {
      finishIntro();
      return;
    }

    const currentWaypoint = waypoints[currentIdx];
    introState.waypointProgress += deltaTime / currentWaypoint.duration;

    if (introState.waypointProgress >= 1.0) {
      // Move to next waypoint
      introState.currentWaypoint++;
      introState.waypointProgress = 0;

      if (introState.currentWaypoint >= waypoints.length) {
        finishIntro();
        return;
      }
    }

    // Interpolate to current waypoint
    const t = easeInOutCubic(introState.waypointProgress);
    const nextIdx = introState.currentWaypoint;
    const nextWaypoint = waypoints[nextIdx];

    if (currentIdx > 0) {
      const prevWaypoint = waypoints[currentIdx - 1];
      cameraState.target = lerpVec3(
        prevWaypoint.target,
        currentWaypoint.target,
        t
      );
      cameraState.distance = lerp(
        prevWaypoint.distance,
        currentWaypoint.distance,
        t
      );
      cameraState.azimuth = lerpAngle(
        prevWaypoint.azimuth,
        currentWaypoint.azimuth,
        t
      );
      cameraState.elevation = lerp(
        prevWaypoint.elevation,
        currentWaypoint.elevation,
        t
      );
    }
  }

  function skipIntro() {
    console.log("⏭️ Intro skipped!");

    // Keep current camera position (don't snap)
    introState.isPlaying = false;

    // Set to free mode (not locked to any Pokemon)
    cameraState.mode = "LOCKED";
    cameraState.lockedToPokemon = false;
    cameraState.targetPokemon = null;

    hideSkipUI();
    updateUIIndicator();
  }

  function finishIntro() {
    introState.isPlaying = false;

    // End at final overview position (depan atas)
    const finalWaypoint =
      introState.cinematicPath[introState.cinematicPath.length - 1];
    cameraState.target = [...finalWaypoint.target];
    cameraState.distance = finalWaypoint.distance;
    cameraState.azimuth = finalWaypoint.azimuth;
    cameraState.elevation = finalWaypoint.elevation;

    // Free mode (not locked)
    cameraState.mode = "LOCKED";
    cameraState.lockedToPokemon = false;
    cameraState.targetPokemon = null;

    hideSkipUI();
    updateUIIndicator();

    console.log("✅ Intro finished - Free camera mode");
  }

  function showSkipUI() {
    let skipUI = document.getElementById("skip-intro-ui");
    if (!skipUI) {
      skipUI = document.createElement("div");
      skipUI.id = "skip-intro-ui";
      skipUI.style.position = "fixed";
      skipUI.style.bottom = "30px";
      skipUI.style.left = "50%";
      skipUI.style.transform = "translateX(-50%)";
      skipUI.style.padding = "12px 20px";
      skipUI.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      skipUI.style.color = "white";
      skipUI.style.fontFamily = "monospace";
      skipUI.style.fontSize = "14px";
      skipUI.style.borderRadius = "8px";
      skipUI.style.border = "2px solid rgba(255, 255, 255, 0.3)";
      skipUI.style.zIndex = "2000";
      skipUI.style.animation = "pulse 2s ease-in-out infinite";
      skipUI.innerHTML = "⏭️ Press any key or click to skip";
      document.body.appendChild(skipUI);

      // Add pulse animation
      const style = document.createElement("style");
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    skipUI.style.display = "block";
  }

  function hideSkipUI() {
    const skipUI = document.getElementById("skip-intro-ui");
    if (skipUI) {
      skipUI.style.display = "none";
    }
  }

  // ===== CAMERA FUNCTIONS =====

  // function switchToIsland(index) {
  //   if (index < 0 || index >= ISLAND_CONFIG.length) return;

  //   // FIX: Boleh switch meskipun sedang transition (cancel transition lama)
  //   // if (cameraState.isTransitioning) return; // <-- HAPUS INI

  //   const island = ISLAND_CONFIG[index];
  //   cameraState.focusedIsland = index;

  //   // Save to localStorage
  //   localStorage.setItem("lastFocusedIsland", index.toString());

  //   // Lock camera to Pokemon
  //   const targetPokemon = pokemons.find((p) => p.islandIndex === index);
  //   if (targetPokemon) {
  //     cameraState.lockedToPokemon = true;
  //     cameraState.targetPokemon = targetPokemon;
  //     console.log(`🔒 Camera locked to ${targetPokemon.node.name}`);
  //   }

  //   // Get Pokemon position
  //   let targetPos = [0, 0, 0];
  //   if (targetPokemon && targetPokemon.animator) {
  //     targetPos = [...targetPokemon.animator.currentPos];
  //   } else if (targetPokemon) {
  //     targetPos = [
  //       targetPokemon.node.localTransform[12],
  //       targetPokemon.node.localTransform[13],
  //       targetPokemon.node.localTransform[14],
  //     ];
  //   }

  //   // Start smooth transition - DARI POSISI SEKARANG
  //   cameraState.isTransitioning = true;
  //   cameraState.transitionProgress = 0;

  //   cameraState.transitionStartTarget = [...cameraState.target];
  //   cameraState.transitionStartDistance = cameraState.distance;
  //   cameraState.transitionStartAzimuth = cameraState.azimuth;
  //   cameraState.transitionStartElevation = cameraState.elevation;

  //   cameraState.transitionEndTarget = targetPos;
  //   cameraState.transitionEndDistance = 40;
  //   cameraState.transitionEndAzimuth = 0; // Reset ke depan
  //   cameraState.transitionEndElevation = 0.4; // Reset angle

  //   updateUIIndicator();
  // }

  // function updateCameraTransition(deltaTime) {
  //   if (!cameraState.isTransitioning) return;

  //   cameraState.transitionProgress +=
  //     deltaTime / cameraState.transitionDuration;

  //   if (cameraState.transitionProgress >= 1.0) {
  //     cameraState.transitionProgress = 1.0;
  //     cameraState.isTransitioning = false;
  //   }

  //   const t = easeInOutCubic(cameraState.transitionProgress);

  //   // Smooth interpolation dari posisi sekarang ke target
  //   cameraState.target = lerpVec3(
  //     cameraState.transitionStartTarget,
  //     cameraState.transitionEndTarget,
  //     t
  //   );

  //   cameraState.distance = lerp(
  //     cameraState.transitionStartDistance,
  //     cameraState.transitionEndDistance,
  //     t
  //   );

  //   cameraState.azimuth = lerpAngle(
  //     cameraState.transitionStartAzimuth,
  //     cameraState.transitionEndAzimuth,
  //     t
  //   );

  //   // NEW: Interpolate elevation juga
  //   cameraState.elevation = lerp(
  //     cameraState.transitionStartElevation,
  //     cameraState.transitionEndElevation,
  //     t
  //   );
  // }

  // function updatePokemonTracking(deltaTime) {
  //   if (!cameraState.lockedToPokemon || !cameraState.targetPokemon) return;

  //   const pokemon = cameraState.targetPokemon;
  //   let targetPos = [0, 0, 0];

  //   // Get Pokemon position
  //   if (pokemon.animator) {
  //     // Animated Pokemon
  //     targetPos = [...pokemon.animator.currentPos];
  //   } else {
  //     // Static Pokemon
  //     targetPos = [
  //       pokemon.node.localTransform[12],
  //       pokemon.node.localTransform[13],
  //       pokemon.node.localTransform[14],
  //     ];
  //   }

  //   // FIX: Hanya smooth interpolate TARGET position (pusat orbit)
  //   // JANGAN touch azimuth/elevation - biar user bebas orbit!
  //   const lerpFactor = 0.1;

  //   cameraState.target[0] +=
  //     (targetPos[0] - cameraState.target[0]) * lerpFactor;
  //   cameraState.target[1] +=
  //     (targetPos[1] - cameraState.target[1]) * lerpFactor;
  //   cameraState.target[2] +=
  //     (targetPos[2] - cameraState.target[2]) * lerpFactor;

  //   // HAPUS semua code tentang azimuth rotation!
  //   // User bebas orbit manual dengan drag mouse
  // }

  function updateCameraMovement(deltaTime) {
    // PERCEPAT: Ubah dari 20.0 → 50.0 (2.5x lebih cepat)
    const normalPanSpeed = 50.0 * deltaTime; // <-- UBAH INI
    const sprintMultiplier = 2.5; // Sprint jadi 125 total
    const currentPanSpeed = keys["shift"]
      ? normalPanSpeed * sprintMultiplier
      : normalPanSpeed;

    const verticalPanSpeed = 50.0 * deltaTime; // <-- UBAH INI JUGA

    // Hitung vektor arah berdasarkan azimuth kamera
    const forwardX = Math.sin(cameraState.azimuth);
    const forwardZ = Math.cos(cameraState.azimuth);
    const rightX = Math.cos(cameraState.azimuth);
    const rightZ = -Math.sin(cameraState.azimuth);

    let deltaX = 0;
    let deltaZ = 0;
    let deltaY = 0;

    if (keys["w"]) {
      deltaX -= forwardX * currentPanSpeed;
      deltaZ -= forwardZ * currentPanSpeed;
    }
    if (keys["s"]) {
      deltaX += forwardX * currentPanSpeed;
      deltaZ += forwardZ * currentPanSpeed;
    }
    if (keys["a"]) {
      deltaX -= rightX * currentPanSpeed;
      deltaZ -= rightZ * currentPanSpeed;
    }
    if (keys["d"]) {
      deltaX += rightX * currentPanSpeed;
      deltaZ += rightZ * currentPanSpeed;
    }
    if (keys["q"]) {
      deltaY -= verticalPanSpeed;
    }
    if (keys["e"]) {
      deltaY += verticalPanSpeed;
    }

    // Apply movement
    cameraState.target[0] += deltaX;
    cameraState.target[1] += deltaY;
    cameraState.target[2] += deltaZ;
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

  // ===== UI INDICATOR =====
  function updateUIIndicator() {
    let indicator = document.getElementById("camera-indicator");
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.id = "camera-indicator";
      indicator.style.position = "fixed";
      indicator.style.top = "10px";
      indicator.style.left = "10px";
      indicator.style.padding = "10px 15px";
      indicator.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      indicator.style.color = "white";
      indicator.style.fontFamily = "monospace";
      indicator.style.fontSize = "14px";
      indicator.style.borderRadius = "5px";
      indicator.style.zIndex = "1000";
      document.body.appendChild(indicator);
    }

    indicator.innerHTML = `
      <strong>🌅 FREE CAMERA MODE</strong><br>
      <small>WASD/QE: Move (Shift: Sprint) | Drag: Rotate | Wheel: Zoom</small>
    `;
    indicator.style.display = "block";
  }
  // ===== HELPER FUNCTIONS =====
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpVec3(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  }

  function lerpAngle(a, b, t) {
    let diff = b - a;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    return a + diff * t;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // ===== SHADER SETUP =====
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

  // ===== SCENE SETUP =====
  const drawSkybox = window.setupSkybox(gl);

  // ===== CREATE ISLANDS =====
  // ===== CREATE ISLANDS =====
  const islands = [];
  ISLAND_CONFIG.forEach((config, i) => {
    const island = window.createIsland ? window.createIsland(gl) : null;
    if (island) {
      island.name = config.name;
      const pos = mat4.create();
      mat4.translate(pos, pos, config.position);

      // NEW: Apply scale dari config
      const scaleValue = config.scale || 1.0;
      const scaleMat = mat4.create();
      mat4.scale(scaleMat, scaleMat, [scaleValue, scaleValue, scaleValue]);

      mat4.multiply(island.localTransform, pos, island.localTransform);
      mat4.multiply(island.localTransform, scaleMat, island.localTransform);

      islands.push(island);
    }
  });

  // ===== CREATE POKEMON =====
  // ===== CREATE POKEMON =====
  const pokemons = [];

  if (window.createGarchomp) {
    const garchompNode = window.createGarchomp(gl);
    garchompNode.name = "GARCHOMP";

    const garchompWrapper = new SceneNode();
    garchompWrapper.name = "GARCHOMP_WRAPPER";
    mat4.scale(
      garchompWrapper.localTransform,
      garchompWrapper.localTransform,
      [2.0, 2.0, 2.0]
    );
    mat4.translate(
      garchompWrapper.localTransform,
      garchompWrapper.localTransform,
      [0, -5, -11]
    );
    garchompWrapper.addChild(garchompNode);

    const garchompAnimator = new GarchompAnimator(garchompNode, {
      startPos: [30, -2.5, -15],
      endPos: [30, -2.5, -25],
      walkDuration: 3.0,
      pauseDuration: 5.0,
      turnDuration: 1.0,
      tailSwayAmount: 0.2,
      tailSwayFreq: 1.2,
    });

    pokemons.push({
      node: garchompWrapper,
      pokemonNode: garchompNode, // NEW: reference ke node asli
      animator: garchompAnimator,
      islandIndex: 0,
    });
  }

  // ===== GABITE =====
  if (window.createGabite) {
    const gabiteNode = window.createGabite(gl);
    gabiteNode.name = "GABITE";

    const gabiteWrapper = new SceneNode();
    gabiteWrapper.name = "GABITE_WRAPPER";

    mat4.scale(
      gabiteWrapper.localTransform,
      gabiteWrapper.localTransform,
      [1.5, 1.5, 1.5]
    );

    mat4.translate(
      gabiteWrapper.localTransform,
      gabiteWrapper.localTransform,
      [-30, -18, -40]
    );

    mat4.rotate(
      gabiteWrapper.localTransform,
      gabiteWrapper.localTransform,
      Math.PI - Math.PI / 6,
      [0, 1, 0]
    );

    gabiteWrapper.addChild(gabiteNode);

    pokemons.push({
      node: gabiteWrapper,
      pokemonNode: gabiteNode, // NEW: reference ke node asli
      animator: null,
      islandIndex: 1,
    });

    console.log("✅ Gabite loaded on Island B");
  }

  if (window.createMegaGarchomp) {
    const megaNode = window.createMegaGarchomp(gl);
    megaNode.name = "MEGA_GARCHOMP";

    const megaWrapper = new SceneNode();
    megaWrapper.name = "MEGA_GARCHOMP_WRAPPER";
    mat4.scale(
      megaWrapper.localTransform,
      megaWrapper.localTransform,
      [4, 4, 4]
    );

    mat4.translate(
      megaWrapper.localTransform,
      megaWrapper.localTransform,
      [-2, 4, 30]
    );
    megaWrapper.addChild(megaNode);

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

    pokemons.push({
      node: megaWrapper,
      pokemonNode: megaNode, // NEW: reference ke node asli
      animator: megaAnimator,
      islandIndex: 2,
    });

    console.log("✅ Mega Garchomp loaded on Island C");
  }
  // ===== INITIALIZE =====
  const projectionMatrix = mat4.create();
  const viewMatrix = mat4.create();
  let lastTime = 0;

  // Start intro system
  startIntro();

  // ===== RENDER LOOP =====
  function render(currentTime) {
    currentTime *= 0.001;
    const deltaTime = Math.min(currentTime - lastTime, 0.1);
    lastTime = currentTime;

    if (resizeCanvasToDisplaySize(gl.canvas)) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    mat4.perspective(
      projectionMatrix,
      (50 * Math.PI) / 180,
      gl.canvas.clientWidth / gl.canvas.clientHeight,
      0.1,
      500.0
    );

    // Update intro or normal camera
    // updateIntro(deltaTime);
    // updateCameraTransition(deltaTime);
    // updatePokemonTracking(deltaTime);
    updateCameraMovement(deltaTime);
    const cameraPosition = updateCamera(viewMatrix);

    mat4.rotate(skyboxRotationMatrix, skyboxRotationMatrix, 0.0003, [0, 1, 0]);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.1, 0.1, 0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    pokemons.forEach((pokemon) => {
      if (pokemon.animator) pokemon.animator.update(deltaTime);
    });

    gl.depthMask(false);
    drawSkybox(projectionMatrix, viewMatrix, skyboxRotationMatrix);
    gl.depthMask(true);

    const identityMatrix = mat4.create();

    islands.forEach((island) => {
      if (island) {
        drawScene(
          gl,
          programInfo,
          island,
          projectionMatrix,
          viewMatrix,
          identityMatrix,
          cameraPosition
        );
      }
    });

    pokemons.forEach((pokemon) => {
      if (pokemon.node) {
        drawScene(
          gl,
          programInfo,
          pokemon.node,
          projectionMatrix,
          viewMatrix,
          identityMatrix,
          cameraPosition
        );
      }
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// ===== DRAW SCENE FUNCTION =====
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

  const isAnimated =
    node.name === "GARCHOMP" ||
    node.name === "PIKACHU" ||
    node.name === "CHARIZARD";

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

// ===== HELPER FUNCTIONS =====

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Gagal link shader: " + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

function resizeCanvasToDisplaySize(canvas) {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    return true;
  }
  return false;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("Gagal kompilasi shader: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

// ===== START APP =====
window.addEventListener("DOMContentLoaded", main);
