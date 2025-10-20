/**
 * Main Application Entry Point
 * Multi-Island Setup with Hybrid Camera System & Warm Golden Lighting
 *
 * HYBRID CAMERA CONTROLS:
 * ========================
 * LOCKED MODE (Default):
 *   - Press 1/2/3: Focus on Island A/B/C with smooth transition
 *   - Mouse Drag: Orbit around focused island
 *   - Mouse Wheel: Zoom in/out
 *   - WASD: Pan camera (free movement but orbit center stays on island)
 *   - Q/E: Move camera up/down
 *
 * LAYOUT: 3 Islands Linear
 * 🏝️ Island A (X=0)  ──────→  🏝️ Island B (X=100)  ──────→  🏝️ Island C (X=200)
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
    { name: "ISLAND_A", position: [0, 0, 0], pokemonName: "Garchomp" },
    { name: "ISLAND_B", position: [100, 0, 0], pokemonName: "Gabite" },
    { name: "ISLAND_C", position: [200, 0, 0], pokemonName: "Mega Garchomp" },
  ];

  // ===== CAMERA STATE =====
  const cameraState = {
    mode: "LOCKED", // "LOCKED" or "FREE"
    focusedIsland: 0, // Index 0, 1, 2

    // Orbit parameters (for LOCKED mode)
    target: [0, -6, -12],
    distance: 50,
    azimuth: 0,
    elevation: 0.4,
    minElevation: -Math.PI / 3,
    maxElevation: Math.PI / 2.5,

    // Free camera parameters (for FREE mode)
    position: [0, 5, 40],
    yaw: -Math.PI / 2,
    pitch: 0,

    // Transition animation
    isTransitioning: false,
    transitionProgress: 0,
    transitionDuration: 1.5, // seconds
    transitionStartTarget: [0, 0, 0],
    transitionEndTarget: [0, 0, 0],
    transitionStartDistance: 50,
    transitionEndDistance: 50,
    transitionStartAzimuth: 0,
    transitionEndAzimuth: 0,
  };

  // ===== KEYBOARD STATE =====
  const keys = {};
  window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;

    // Island focus switching (1, 2, 3)
    if (e.key === "1") switchToIsland(0);
    if (e.key === "2") switchToIsland(1);
    if (e.key === "3") switchToIsland(2);
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  // ===== MOUSE INTERACTION =====
  let isDragging = false;
  let lastMouseX = -1;
  let lastMouseY = -1;
  const skyboxRotationMatrix = mat4.create();

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (cameraState.mode === "LOCKED") {
      // Orbit mode
      cameraState.azimuth -= dx * 0.01;
      cameraState.elevation -= dy * 0.01;
      cameraState.elevation = Math.max(
        cameraState.minElevation,
        Math.min(cameraState.maxElevation, cameraState.elevation)
      );
    }
  });

  // Mouse wheel
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (cameraState.mode === "LOCKED") {
      cameraState.distance += e.deltaY * 0.05;
      cameraState.distance = Math.max(20, Math.min(100, cameraState.distance));
    }
  });

  // ===== CAMERA FUNCTIONS =====

  function switchToIsland(index) {
    if (index < 0 || index >= ISLAND_CONFIG.length) return;
    if (cameraState.isTransitioning) return; // Don't interrupt transition

    const island = ISLAND_CONFIG[index];
    cameraState.mode = "LOCKED";
    cameraState.focusedIsland = index;

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
    cameraState.transitionEndAzimuth = 0; // Reset to front view

    updateUIIndicator();
  }

  function toggleCameraMode() {
    if (cameraState.mode === "LOCKED") {
      // Switch to FREE mode
      cameraState.mode = "FREE";
      // Set free camera position to current orbit position
      const currentPos = calculateOrbitPosition();
      cameraState.position = currentPos;
      cameraState.yaw = cameraState.azimuth;
      cameraState.pitch = -cameraState.elevation;
    } else {
      // Switch back to LOCKED mode
      cameraState.mode = "LOCKED";
    }
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

    // Smooth easing (ease-in-out)
    const t = easeInOutCubic(cameraState.transitionProgress);

    // Lerp target
    cameraState.target = [
      lerp(
        cameraState.transitionStartTarget[0],
        cameraState.transitionEndTarget[0],
        t
      ),
      lerp(
        cameraState.transitionStartTarget[1],
        cameraState.transitionEndTarget[1],
        t
      ),
      lerp(
        cameraState.transitionStartTarget[2],
        cameraState.transitionEndTarget[2],
        t
      ),
    ];

    // Lerp distance
    cameraState.distance = lerp(
      cameraState.transitionStartDistance,
      cameraState.transitionEndDistance,
      t
    );

    // Lerp azimuth
    cameraState.azimuth = lerpAngle(
      cameraState.transitionStartAzimuth,
      cameraState.transitionEndAzimuth,
      t
    );
  }

  function updateCameraMovement(deltaTime) {
    const moveSpeed = 30.0 * deltaTime; // Units per second
    const panSpeed = 20.0 * deltaTime;

    if (cameraState.mode === "LOCKED") {
      // WASD pan in world space
      if (keys["w"]) cameraState.target[2] -= panSpeed;
      if (keys["s"]) cameraState.target[2] += panSpeed;
      if (keys["a"]) cameraState.target[0] -= panSpeed;
      if (keys["d"]) cameraState.target[0] += panSpeed;
      if (keys["q"]) cameraState.target[1] -= panSpeed;
      if (keys["e"]) cameraState.target[1] += panSpeed;
    } else {
      // FREE mode - fly camera
      const forward = [
        Math.sin(cameraState.yaw) * Math.cos(cameraState.pitch),
        Math.sin(cameraState.pitch),
        Math.cos(cameraState.yaw) * Math.cos(cameraState.pitch),
      ];
      const right = [
        Math.sin(cameraState.yaw + Math.PI / 2),
        0,
        Math.cos(cameraState.yaw + Math.PI / 2),
      ];

      if (keys["w"]) {
        cameraState.position[0] += forward[0] * moveSpeed;
        cameraState.position[1] += forward[1] * moveSpeed;
        cameraState.position[2] += forward[2] * moveSpeed;
      }
      if (keys["s"]) {
        cameraState.position[0] -= forward[0] * moveSpeed;
        cameraState.position[1] -= forward[1] * moveSpeed;
        cameraState.position[2] -= forward[2] * moveSpeed;
      }
      if (keys["a"]) {
        cameraState.position[0] -= right[0] * moveSpeed;
        cameraState.position[2] -= right[2] * moveSpeed;
      }
      if (keys["d"]) {
        cameraState.position[0] += right[0] * moveSpeed;
        cameraState.position[2] += right[2] * moveSpeed;
      }
      if (keys["q"]) cameraState.position[1] -= moveSpeed;
      if (keys["e"]) cameraState.position[1] += moveSpeed;
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
    if (cameraState.mode === "LOCKED") {
      const cameraPosition = calculateOrbitPosition();
      mat4.lookAt(viewMatrix, cameraPosition, cameraState.target, [0, 1, 0]);
      return cameraPosition;
    } else {
      // FREE mode
      const lookTarget = [
        cameraState.position[0] +
          Math.sin(cameraState.yaw) * Math.cos(cameraState.pitch),
        cameraState.position[1] + Math.sin(cameraState.pitch),
        cameraState.position[2] +
          Math.cos(cameraState.yaw) * Math.cos(cameraState.pitch),
      ];
      mat4.lookAt(viewMatrix, cameraState.position, lookTarget, [0, 1, 0]);
      return cameraState.position;
    }
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

    if (cameraState.mode === "LOCKED") {
      const island = ISLAND_CONFIG[cameraState.focusedIsland];
      indicator.innerHTML = `
        <strong>🌅 WARM LIGHTING MODE</strong><br>
        Focus: ${island.name} (${island.pokemonName})<br>
        <small>1/2/3: Switch Island | WASD/QE: Pan | Drag: Orbit | Wheel: Zoom</small>
      `;
    } else {
      indicator.innerHTML = `
        <strong>FREE MODE</strong><br>
        <small>1/2/3: Lock to Island | F: Back to Locked | WASD/QE: Fly | Drag: Look</small>
      `;
    }
  }

  // ===== HELPER FUNCTIONS =====
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpAngle(a, b, t) {
    // Handle angle wrapping
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
  // Structure: { node, animator, islandIndex }
  const pokemons = [];

  // Pokemon 1: Garchomp on Island A
  if (window.createGarchomp) {
    const garchompNode = window.createGarchomp(gl);
    garchompNode.name = "GARCHOMP";
    mat4.scale(
      garchompNode.localTransform,
      garchompNode.localTransform,
      [1.2, 1.2, 1.2]
    );

    const garchompAnimator = new GarchompAnimator(garchompNode, {
      startPos: [ISLAND_CONFIG[0].position[0], -2, -5],
      endPos: [ISLAND_CONFIG[0].position[0], -2, -15],
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

  // ===== INITIALIZE =====
  const projectionMatrix = mat4.create();
  const viewMatrix = mat4.create();
  let lastTime = 0;

  // Initialize UI
  updateUIIndicator();
  switchToIsland(0); // Start at Island A

  // ===== RENDER LOOP =====
  function render(currentTime) {
    currentTime *= 0.001;
    const deltaTime = Math.min(currentTime - lastTime, 0.1); // Cap delta for stability
    lastTime = currentTime;

    // Resize handling
    if (resizeCanvasToDisplaySize(gl.canvas)) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    // Update projection
    mat4.perspective(
      projectionMatrix,
      (50 * Math.PI) / 180,
      gl.canvas.clientWidth / gl.canvas.clientHeight,
      0.1,
      500.0
    );

    // Update camera
    updateCameraTransition(deltaTime);
    updateCameraMovement(deltaTime);
    const cameraPosition = updateCamera(viewMatrix);

    // Skybox rotation
    mat4.rotate(skyboxRotationMatrix, skyboxRotationMatrix, 0.0003, [0, 1, 0]);

    // Clear
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.1, 0.1, 0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Update animations
    pokemons.forEach((pokemon) => {
      if (pokemon.animator) pokemon.animator.update(deltaTime);
    });

    // Render skybox
    gl.depthMask(false);
    drawSkybox(projectionMatrix, viewMatrix, skyboxRotationMatrix);
    gl.depthMask(true);

    const identityMatrix = mat4.create();

    // Render islands
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

    // Render pokemons
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

    // 🌅 DYNAMIC WARM LIGHT - Follows camera for beautiful golden lighting
    // Light positioned to create cinematic warm glow from above and side
    const lightPosition = [
      cameraPosition[0] + 12, // Side-front offset (golden rim lighting)
      cameraPosition[1] + 25, // High above (soft cascading light)
      cameraPosition[2] - 8, // Forward (front-lit warmth)
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
