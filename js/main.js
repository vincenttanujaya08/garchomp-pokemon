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
  const ISLAND_CONFIG = [
    { name: "ISLAND_A", position: [-80, 0, 20], pokemonName: "Garchomp" },
    { name: "ISLAND_B", position: [80, 0, 20], pokemonName: "Gabite" },
    { name: "ISLAND_C", position: [0, 0, -100], pokemonName: "Mega Garchomp" },
  ];

  // ===== INTRO SYSTEM =====
  const introState = {
    isPlaying: false,
    type: null, // "CINEMATIC" or "QUICK"
    progress: 0,
    duration: 0,
    isSkippable: true,

    // Cinematic waypoints
    cinematicPath: [
      {
        target: [0, 0, -20],
        distance: 150,
        azimuth: 0,
        elevation: 0.8,
        duration: 1.5,
      },
      {
        target: [0, 0, -20],
        distance: 120,
        azimuth: Math.PI * 0.5,
        elevation: 0.6,
        duration: 1.5,
      },
      {
        target: [0, 0, -20],
        distance: 100,
        azimuth: Math.PI,
        elevation: 0.5,
        duration: 1.0,
      },
      {
        target: [-80, -6, 8],
        distance: 50,
        azimuth: 0,
        elevation: 0.4,
        duration: 1.0,
      },
    ],
    currentWaypoint: 0,
    waypointProgress: 0,

    // Quick zoom params
    quickZoomStart: {
      target: [0, 0, 0],
      distance: 80,
      azimuth: 0,
      elevation: 0.5,
    },
    quickZoomEnd: {
      target: [0, 0, 0],
      distance: 50,
      azimuth: 0,
      elevation: 0.4,
    },
  };

  // ===== CAMERA STATE =====
  const cameraState = {
    mode: "LOCKED",
    focusedIsland: 0,

    target: [0, -6, -12],
    distance: 50,
    azimuth: 0,
    elevation: 0.4,
    minElevation: -Math.PI / 3,
    maxElevation: Math.PI / 2.5,

    position: [0, 5, 40],
    yaw: -Math.PI / 2,
    pitch: 0,

    isTransitioning: false,
    transitionProgress: 0,
    transitionDuration: 1.5,
    transitionStartTarget: [0, 0, 0],
    transitionEndTarget: [0, 0, 0],
    transitionStartDistance: 50,
    transitionEndDistance: 50,
    transitionStartAzimuth: 0,
    transitionEndAzimuth: 0,
  };

  // ===== KEYBOARD STATE =====
  const keys = {};

  function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;

    // Skip intro
    if (introState.isPlaying && introState.isSkippable) {
      skipIntro();
      return;
    }

    // Island focus switching
    if (e.key === "1") switchToIsland(0);
    if (e.key === "2") switchToIsland(1);
    if (e.key === "3") switchToIsland(2);
  }

  function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // ===== MOUSE INTERACTION =====
  let isDragging = false;
  let lastMouseX = -1;
  let lastMouseY = -1;
  const skyboxRotationMatrix = mat4.create();

  function handleMouseDown(e) {
    // Skip intro on click
    if (introState.isPlaying && introState.isSkippable) {
      skipIntro();
      return;
    }

    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleMouseMove(e) {
    if (!isDragging || introState.isPlaying) return;

    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (cameraState.mode === "LOCKED") {
      cameraState.azimuth -= dx * 0.01;
      cameraState.elevation -= dy * 0.01;
      cameraState.elevation = Math.max(
        cameraState.minElevation,
        Math.min(cameraState.maxElevation, cameraState.elevation)
      );
    }
  }

  function handleWheel(e) {
    if (introState.isPlaying) return;

    e.preventDefault();
    if (cameraState.mode === "LOCKED") {
      cameraState.distance += e.deltaY * 0.05;
      cameraState.distance = Math.max(20, Math.min(100, cameraState.distance));
    }
  }

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("wheel", handleWheel);

  // ===== INTRO FUNCTIONS =====

  function startIntro() {
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");
    const lastIsland = parseInt(
      localStorage.getItem("lastFocusedIsland") || "0"
    );

    if (!hasSeenIntro) {
      // First time - Full cinematic
      startCinematicIntro();
    } else {
      // Return visit - Quick zoom
      startQuickIntro(lastIsland);
    }
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

  function startQuickIntro(islandIndex) {
    console.log(`⚡ Quick intro to Island ${islandIndex}...`);
    introState.isPlaying = true;
    introState.type = "QUICK";
    introState.progress = 0;
    introState.duration = 1.5;
    introState.isSkippable = true;

    const island = ISLAND_CONFIG[islandIndex];

    // Zoom out position
    introState.quickZoomStart = {
      target: [island.position[0], -6, island.position[2] - 12],
      distance: 80,
      azimuth: 0,
      elevation: 0.5,
    };

    // Final position
    introState.quickZoomEnd = {
      target: [island.position[0], -6, island.position[2] - 12],
      distance: 50,
      azimuth: 0,
      elevation: 0.4,
    };

    // Set camera to start position
    cameraState.target = [...introState.quickZoomStart.target];
    cameraState.distance = introState.quickZoomStart.distance;
    cameraState.azimuth = introState.quickZoomStart.azimuth;
    cameraState.elevation = introState.quickZoomStart.elevation;
    cameraState.focusedIsland = islandIndex;

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

  function updateQuickIntro(deltaTime) {
    introState.progress += deltaTime / introState.duration;

    if (introState.progress >= 1.0) {
      finishIntro();
      return;
    }

    const t = easeInOutCubic(introState.progress);
    const start = introState.quickZoomStart;
    const end = introState.quickZoomEnd;

    cameraState.target = lerpVec3(start.target, end.target, t);
    cameraState.distance = lerp(start.distance, end.distance, t);
    cameraState.azimuth = lerpAngle(start.azimuth, end.azimuth, t);
    cameraState.elevation = lerp(start.elevation, end.elevation, t);
  }

  function skipIntro() {
    console.log("⏭️ Intro skipped!");
    finishIntro();
  }

  function finishIntro() {
    introState.isPlaying = false;

    // Mark intro as seen
    localStorage.setItem("hasSeenIntro", "true");

    // Set camera to Island A (or last focused island for quick intro)
    const targetIsland =
      introState.type === "QUICK" ? cameraState.focusedIsland : 0;
    const island = ISLAND_CONFIG[targetIsland];

    cameraState.target = [island.position[0], -6, island.position[2] - 12];
    cameraState.distance = 50;
    cameraState.azimuth = 0;
    cameraState.elevation = 0.4;
    cameraState.focusedIsland = targetIsland;

    hideSkipUI();
    updateUIIndicator();

    console.log("✅ Intro finished!");
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

  function switchToIsland(index) {
    if (index < 0 || index >= ISLAND_CONFIG.length) return;
    if (cameraState.isTransitioning || introState.isPlaying) return;

    const island = ISLAND_CONFIG[index];
    cameraState.mode = "LOCKED";
    cameraState.focusedIsland = index;

    // Save to localStorage
    localStorage.setItem("lastFocusedIsland", index.toString());

    // Start transition animation
    cameraState.isTransitioning = true;
    cameraState.transitionProgress = 0;
    cameraState.transitionStartTarget = [...cameraState.target];
    cameraState.transitionEndTarget = [
      island.position[0],
      -6,
      island.position[2] - 12,
    ];
    cameraState.transitionStartDistance = cameraState.distance;
    cameraState.transitionEndDistance = 50;
    cameraState.transitionStartAzimuth = cameraState.azimuth;
    cameraState.transitionEndAzimuth = 0;

    updateUIIndicator();
  }

  function updateCameraTransition(deltaTime) {
    if (!cameraState.isTransitioning) return;

    cameraState.transitionProgress +=
      deltaTime / cameraState.transitionDuration;

    if (cameraState.transitionProgress >= 1.0) {
      cameraState.transitionProgress = 1.0;
      cameraState.isTransitioning = false;
    }

    const t = easeInOutCubic(cameraState.transitionProgress);

    cameraState.target = lerpVec3(
      cameraState.transitionStartTarget,
      cameraState.transitionEndTarget,
      t
    );

    cameraState.distance = lerp(
      cameraState.transitionStartDistance,
      cameraState.transitionEndDistance,
      t
    );

    cameraState.azimuth = lerpAngle(
      cameraState.transitionStartAzimuth,
      cameraState.transitionEndAzimuth,
      t
    );
  }

  function updateCameraMovement(deltaTime) {
    if (introState.isPlaying) return; // Disable movement during intro

    const moveSpeed = 30.0 * deltaTime;
    const panSpeed = 20.0 * deltaTime;

    if (cameraState.mode === "LOCKED") {
      if (keys["w"]) cameraState.target[2] -= panSpeed;
      if (keys["s"]) cameraState.target[2] += panSpeed;
      if (keys["a"]) cameraState.target[0] -= panSpeed;
      if (keys["d"]) cameraState.target[0] += panSpeed;
      if (keys["q"]) cameraState.target[1] -= panSpeed;
      if (keys["e"]) cameraState.target[1] += panSpeed;
    }
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
    if (introState.isPlaying) return; // Hide during intro

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

    const island = ISLAND_CONFIG[cameraState.focusedIsland];
    indicator.innerHTML = `
      <strong>🌅 WARM LIGHTING MODE</strong><br>
      Focus: ${island.name} (${island.pokemonName})<br>
      <small>1/2/3: Switch Island | WASD/QE: Pan | Drag: Orbit | Wheel: Zoom</small>
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
  const islands = [];
  ISLAND_CONFIG.forEach((config, i) => {
    const island = window.createIsland ? window.createIsland(gl) : null;
    if (island) {
      island.name = config.name;
      const pos = mat4.create();
      mat4.translate(pos, pos, config.position);
      mat4.multiply(island.localTransform, pos, island.localTransform);
      islands.push(island);
    }
  });

  // ===== CREATE POKEMON =====
  const pokemons = [];

  if (window.createGarchomp) {
    const garchompNode = window.createGarchomp(gl);
    garchompNode.name = "GARCHOMP";
    mat4.scale(
      garchompNode.localTransform,
      garchompNode.localTransform,
      [1.2, 1.2, 1.2]
    );

    const garchompAnimator = new GarchompAnimator(garchompNode, {
      startPos: [ISLAND_CONFIG[0].position[0], -2.5, 5],
      endPos: [ISLAND_CONFIG[0].position[0], -2.5, -5],
      startRotation: Math.PI,
      walkDuration: 3.0,
      pauseDuration: 5.0,
      turnDuration: 1.0,
      tailSwayAmount: 0.2,
      tailSwayFreq: 1.2,
    });

    pokemons.push({
      node: garchompNode,
      animator: garchompAnimator,
      islandIndex: 0,
    });
  }

  if (window.createMegaGarchomp) {
    const megaGarchompNode = window.createMegaGarchomp(gl);
    megaGarchompNode.name = "MEGA_GARCHOMP";

    // Posisi di Island C
    mat4.translate(
      megaGarchompNode.localTransform,
      megaGarchompNode.localTransform,
      [ISLAND_CONFIG[2].position[0] - 20, -6.5, -130]
    );

    // Scale lebih besar dari Garchomp biasa
    mat4.scale(
      megaGarchompNode.localTransform,
      megaGarchompNode.localTransform,
      [1.5, 1.5, 1.5]
    );

    mat4.rotateY(
      megaGarchompNode.localTransform,
      megaGarchompNode.localTransform,
      Math.PI / 5
    );

    // Push tanpa animator
    pokemons.push({
      node: megaGarchompNode,
      animator: null,
      islandIndex: 2,
    });
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
    updateIntro(deltaTime);
    updateCameraTransition(deltaTime);
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
