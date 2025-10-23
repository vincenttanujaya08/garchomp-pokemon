/**
 * Main Application Entry Point
 * CAVE TEST VERSION - Dual Shader System
 * - Cave: Static rocky lighting (tidak terpengaruh zoom)
 * - Other objects: Dynamic hot daylight
 */

function main() {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl", { antialias: true });
  if (!gl) {
    alert("WebGL tidak tersedia.");
    return;
  }

  // ===== CAMERA STATE =====
  const cameraState = {
    target: [0, 0, -30],
    distance: 40,
    azimuth: 0,
    elevation: 0.3,
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

  // ===== MOUSE CONTROLS =====
  let isDragging = false,
    lastMouseX = -1,
    lastMouseY = -1;

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
    cameraState.distance = Math.max(10, Math.min(100, cameraState.distance));
  });

  // ===== CAMERA HELPERS =====
  function updateCameraMovement(dt) {
    const speed = (keys["shift"] ? 100 : 40) * dt;
    const vSpeed = 30 * dt;
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

  // ===== SHADER SETUP - DUAL SYSTEM =====
  console.log("Initializing dual shader system...");

  // 1. General shader (untuk Pokemon, Island, dll - nanti)
  const generalShaderProgram = initShaderProgram(
    gl,
    vertexShaderSource,
    fragmentShaderSource
  );
  const generalProgramInfo = {
    program: generalShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(generalShaderProgram, "a_position"),
      vertexNormal: gl.getAttribLocation(generalShaderProgram, "a_normal"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        generalShaderProgram,
        "u_projectionMatrix"
      ),
      viewMatrix: gl.getUniformLocation(generalShaderProgram, "u_viewMatrix"),
      modelMatrix: gl.getUniformLocation(generalShaderProgram, "u_modelMatrix"),
      normalMatrix: gl.getUniformLocation(
        generalShaderProgram,
        "u_normalMatrix"
      ),
      color: gl.getUniformLocation(generalShaderProgram, "u_color"),
      lightDirection: gl.getUniformLocation(
        generalShaderProgram,
        "u_lightDirection"
      ),
      viewPosition: gl.getUniformLocation(
        generalShaderProgram,
        "u_viewPosition"
      ),
    },
  };

  // 2. Cave shader (khusus untuk cave - STATIC LIGHTING)
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

  console.log("✅ Dual shader system initialized");
  console.log("   - General shader ready for Pokemon/Island");
  console.log("   - Cave shader ready with static lighting");

  // ===== SKYBOX =====
  const skyboxRotationMatrix = mat4.create();
  const drawSkybox = window.setupSkybox ? window.setupSkybox(gl) : null;

  // ===== CAVE SETUP =====
  console.log("Creating cave...");
  const cave = window.createCave ? window.createCave(gl) : null;

  if (!cave) {
    console.error(
      "❌ Cave creation failed! Make sure cave.js files are loaded."
    );
    alert("Cave creation failed! Check console for errors.");
    return;
  }

  console.log("✅ Cave created successfully!");

  // Transform cave
  mat4.translate(cave.localTransform, cave.localTransform, [0, -8, -35]);
  mat4.scale(cave.localTransform, cave.localTransform, [2.5, 2.5, 2.5]);

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
      500.0
    );

    updateCameraMovement(dt);
    const cameraPosition = updateCamera(viewMatrix);

    // Rotate skybox
    if (drawSkybox) {
      mat4.rotate(
        skyboxRotationMatrix,
        skyboxRotationMatrix,
        0.0003,
        [0, 1, 0]
      );
    }

    gl.clearColor(0.1, 0.1, 0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // 1) Draw skybox
    if (drawSkybox) {
      gl.depthMask(false);
      drawSkybox(projectionMatrix, viewMatrix, skyboxRotationMatrix);
      gl.depthMask(true);
    }

    // 2) Draw cave (dengan CAVE SHADER - static lighting)
    const identityMatrix = mat4.create();
    if (cave) {
      drawScene(
        gl,
        caveProgramInfo, // ← CAVE SHADER (rocky, static)
        cave,
        projectionMatrix,
        viewMatrix,
        identityMatrix,
        cameraPosition
      );
    }

    // 3) Draw other objects nanti (Pokemon, Island, dll)
    // Contoh untuk nanti:
    // if (island) {
    //   drawScene(gl, generalProgramInfo, island, projectionMatrix, viewMatrix, identityMatrix, cameraPosition);
    // }
    // if (pokemon) {
    //   drawScene(gl, generalProgramInfo, pokemon, projectionMatrix, viewMatrix, identityMatrix, cameraPosition);
    // }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  console.log("🎬 Cave test started with dual shader!");
  console.log("Controls:");
  console.log("- WASD: Move camera target");
  console.log("- Q/E: Move up/down");
  console.log("- Mouse drag: Rotate view");
  console.log("- Mouse wheel: Zoom in/out (cave brightness STATIS!)");
  console.log("- Shift: Faster movement");
}

// ===== DRAW SCENE =====
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

  if (node.localTransform) {
    mat4.copy(local, node.localTransform);
  } else {
    mat4.identity(local);
  }

  let modelMatrix = mat4.create();
  mat4.multiply(modelMatrix, parentTransform, local);

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

    // Light position (untuk general shader)
    // Cave shader tidak memakai ini (pakai static direction internal)
    const lightPosition = [
      cameraPosition[0] + 10,
      cameraPosition[1] + 20,
      cameraPosition[2] - 5,
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

  // Recursively draw children
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

// ===== SHADER HELPERS =====
function initShaderProgram(gl, vsSource, fsSource) {
  const vs = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  if (!vs || !fs) {
    console.error("❌ Shader compilation failed!");
    return null;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("❌ Shader link failed:", gl.getProgramInfoLog(prog));
    alert("Gagal link shader: " + gl.getProgramInfoLog(prog));
    return null;
  }

  return prog;
}

function loadShader(gl, type, source) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);

  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const shaderType = type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT";
    console.error(
      `❌ ${shaderType} shader compilation failed:`,
      gl.getShaderInfoLog(sh)
    );
    alert(`Gagal kompilasi ${shaderType} shader: ` + gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }

  return sh;
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

// ===== START APP =====
window.addEventListener("DOMContentLoaded", main);

console.log("🗻 Cave Test Mode - Dual Shader System");
console.log("   Cave: STATIC lighting (brightness konsisten zoom in/out)");
console.log("   Other objects: Dynamic lighting (siap untuk Pokemon/Island)");
