/**
 * Main Application Entry Point
 * Clean & Modular - Teman bisa tambah Pokemon baru dengan mudah
 *
 * ORBIT CAMERA CONTROLS:
 * - Drag mouse: Rotate camera around scene
 * - Mouse wheel: Zoom in/out
 * - Camera always looks at island center
 */

function main() {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl", { antialias: true });
  if (!gl) {
    alert("WebGL tidak tersedia.");
    return;
  }

  // ===== ORBIT CAMERA SETUP =====
  const orbitCamera = {
    target: [0, -6, -12], // Fokus ke tengah scene (antara pulau & Garchomp)
    distance: 45, // Jarak camera dari target
    azimuth: 0, // Rotasi horizontal (kiri-kanan) dalam radian
    elevation: 0.3, // Rotasi vertikal (atas-bawah) dalam radian
    minElevation: -Math.PI / 3, // Limit bawah (-60 derajat)
    maxElevation: Math.PI / 3, // Limit atas (60 derajat)
  };

  // ===== MOUSE INTERACTION (ORBIT CAMERA) =====
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

    // Update orbit angles
    orbitCamera.azimuth -= dx * 0.01; // Horizontal rotation
    orbitCamera.elevation -= dy * 0.01; // Vertical rotation

    // Clamp elevation untuk prevent flipping
    orbitCamera.elevation = Math.max(
      orbitCamera.minElevation,
      Math.min(orbitCamera.maxElevation, orbitCamera.elevation)
    );
  });

  // Mouse wheel untuk zoom in/out
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    orbitCamera.distance += e.deltaY * 0.01;
    orbitCamera.distance = Math.max(20, Math.min(100, orbitCamera.distance)); // Limit zoom
  });

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

  // Create Garchomp
  const garchompNode = window.createGarchomp(gl);

  // ===== ANIMATION SETUP =====
  const garchompAnimator = new GarchompAnimator(garchompNode, {
    // POSITION FIX: Turunkan Y agar tidak ngambang
    startPos: [0, -3, -5], // Y dari 1.5 → 0.2 (lebih rendah!)
    endPos: [0, -3, -15], // Y dari 1.5 → 0.2
    startRotation: Math.PI, // Face forward

    // Timing (custom sesuai kebutuhan)
    walkDuration: 3.0,
    pauseDuration: 5.0,
    turnDuration: 1.0,

    // Tail sway (reduce untuk smoother motion)
    tailSwayAmount: 0.2, // Reduced dari 0.3
    tailSwayFreq: 1.2, // Reduced dari 1.5
  });

  // Create Island (opsional)
  const islandNode = window.createIsland ? window.createIsland(gl) : null;
  if (islandNode) islandNode.name = "ISLAND";

  // ===== CAMERA SETUP =====
  const projectionMatrix = mat4.create();
  const viewMatrix = mat4.create();

  // Function untuk update camera position dari orbit parameters
  function updateOrbitCamera() {
    // Calculate camera position based on spherical coordinates
    const camX =
      orbitCamera.target[0] +
      orbitCamera.distance *
        Math.cos(orbitCamera.elevation) *
        Math.sin(orbitCamera.azimuth);
    const camY =
      orbitCamera.target[1] +
      orbitCamera.distance * Math.sin(orbitCamera.elevation);
    const camZ =
      orbitCamera.target[2] +
      orbitCamera.distance *
        Math.cos(orbitCamera.elevation) *
        Math.cos(orbitCamera.azimuth);

    const cameraPosition = [camX, camY, camZ];

    // Update view matrix to look at target
    mat4.lookAt(viewMatrix, cameraPosition, orbitCamera.target, [0, 1, 0]);

    return cameraPosition;
  }

  // ===== TIMING =====
  let lastTime = 0;

  // ===== RENDER LOOP =====
  function render(currentTime) {
    currentTime *= 0.001; // Convert to seconds
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Resize handling
    if (resizeCanvasToDisplaySize(gl.canvas)) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    // Update projection
    mat4.perspective(
      projectionMatrix,
      (45 * Math.PI) / 180,
      gl.canvas.clientWidth / gl.canvas.clientHeight,
      0.1,
      100.0
    );

    // Update orbit camera position
    const cameraPosition = updateOrbitCamera();

    // Skybox rotation
    mat4.rotate(skyboxRotationMatrix, skyboxRotationMatrix, 0.0005, [0, 1, 0]);

    // Clear
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.1, 0.1, 0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL); // Fix z-fighting

    // ===== UPDATE ANIMATIONS =====
    garchompAnimator.update(deltaTime);

    // TODO: Teman bisa tambah animator lain di sini
    // pikachuAnimator.update(deltaTime);
    // charizardAnimator.update(deltaTime);

    // ===== RENDER SCENE =====

    // 1. Skybox (always first, disable depth write)
    gl.depthMask(false); // CRITICAL: Jangan tulis ke depth buffer
    drawSkybox(projectionMatrix, viewMatrix, skyboxRotationMatrix);
    gl.depthMask(true); // Re-enable depth write untuk objek lain

    // 2. Garchomp (animated - SKIP config dari entityConfig)
    const identityMatrix = mat4.create();
    drawScene(
      gl,
      programInfo,
      garchompNode,
      projectionMatrix,
      viewMatrix,
      identityMatrix, // No rotation - camera yang gerak!
      cameraPosition
    );

    // 3. Island (static)
    if (islandNode) {
      drawScene(
        gl,
        programInfo,
        islandNode,
        projectionMatrix,
        viewMatrix,
        identityMatrix, // No rotation - camera yang gerak!
        cameraPosition
      );
    }

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

  // CRITICAL: Skip entityConfig untuk animated entities
  const isAnimated = node.name === "GARCHOMP"; // Add more names here

  if (cfg && !isAnimated) {
    // Apply config untuk non-animated entities
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

  // Compute model matrix
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

  // Draw mesh if exists
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

    const lightPosition = [5, 10, 7];

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

  // Recursive draw children
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
