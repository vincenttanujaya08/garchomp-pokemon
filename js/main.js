function main() {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl", { antialias: true });
  if (!gl) {
    alert("WebGL tidak tersedia.");
    return;
  }

  let isDragging = false;
  let lastMouseX = -1;
  let lastMouseY = -1;
  const modelRotationMatrix = mat4.create();

  canvas.addEventListener("mousedown", function (event) {
    isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  });
  canvas.addEventListener("mouseup", function (event) {
    isDragging = false;
  });
  canvas.addEventListener("mousemove", function (event) {
    if (!isDragging) return;
    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    const newRotation = mat4.create();
    mat4.rotate(newRotation, newRotation, deltaX * 0.01, [0, 1, 0]);
    mat4.rotate(newRotation, newRotation, deltaY * 0.01, [1, 0, 0]);
    mat4.multiply(modelRotationMatrix, newRotation, modelRotationMatrix);
  });

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

  // BARU: Buat objek LIBS untuk kompatibilitas dengan skybox.js
   const LIBS = {
      get_I4: () => mat4.create(),
      rotateX: (mat, rad) => mat4.rotateX(mat, mat, rad),
      rotateY: (mat, rad) => mat4.rotateY(mat, mat, rad),
      // Anda bisa menambahkan fungsi lain jika skybox membutuhkannya
  };

  // BARU: Panggil fungsi setup skybox dari file environment/skybox.js
  // Pastikan Anda sudah mengganti nama fungsi di skybox.js menjadi setupSkybox
  // dan fungsi itu me-return fungsi untuk menggambar (draw function)
  const drawSkybox = setupSkybox(gl, LIBS); // Asumsi setupSkybox me-return fungsi draw

  const garchompNode = createGarchomp(gl);

  const projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    (45 * Math.PI) / 180,
    gl.canvas.clientWidth / gl.canvas.clientHeight,
    0.1,
    100.0
  );

  const cameraPosition = [0, 1, 12];
  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, cameraPosition, [0, 0, 0], [0, 1, 0]);

  function render() {
    if (resizeCanvasToDisplaySize(gl.canvas)) {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      mat4.perspective(
        projectionMatrix,
        (45 * Math.PI) / 180,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        0.1,
        100.0
      );
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.1, 0.1, 0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // BARU: Gambar skybox terlebih dahulu
    // Teruskan matriks yang relevan dari scene utama Anda
    drawSkybox(projectionMatrix, viewMatrix, modelRotationMatrix);

    drawScene(
      gl,
      programInfo,
      garchompNode,
      projectionMatrix,
      viewMatrix,
      modelRotationMatrix,
      cameraPosition
    );

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function drawScene(
  gl,
  programInfo,
  node,
  projectionMatrix,
  viewMatrix,
  parentTransform,
  cameraPosition
) {
  const modelMatrix = mat4.create();
  mat4.multiply(modelMatrix, parentTransform, node.localTransform);

  if (node.mesh) {
    // --- BLOK SETUP ATRIBUT MANUAL (CARA WEBGL 1) ---
    // Setup buffer posisi
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

    // Setup buffer normal
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
    // --------------------------------------------------

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

    // Bind buffer index dan gambar
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

main();
