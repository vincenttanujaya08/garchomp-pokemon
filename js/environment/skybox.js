/**
 * @param {WebGLRenderingContext} GL Konteks WebGL.
 * @param {object} LIBS Objek pustaka untuk operasi matriks.
 * @returns {function(mat4, mat4, mat4): void} Sebuah fungsi untuk menggambar skybox.
 */
function setupSkybox(GL, LIBS) {
  /*========================= SHADERS ========================= */
  const shader_vertex_source = `
        attribute vec3 position;
        uniform mat4 Pmatrix, Vmatrix, Mmatrix;
        varying vec2 vUV; // vUV tidak digunakan di vertex shader, tapi perlu untuk meneruskan ke fragment
        attribute vec2 uv;

        void main(void) {
            // Trik untuk skybox: atur z = w agar selalu di latar belakang setelah transformasi
            vec4 pos = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
            gl_Position = pos.xyww; 
            vUV = uv;
        }`;

  const shader_fragment_source = `
        precision mediump float;
        uniform sampler2D sampler;
        varying vec2 vUV;

        void main(void) {
            gl_FragColor = texture2D(sampler, vUV);
        }`;

  const compile_shader = function (source, type, typeString) {
    const shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert(`ERROR IN ${typeString} SHADER: ${GL.getShaderInfoLog(shader)}`);
      return false;
    }
    return shader;
  };

  const shader_vertex = compile_shader(
    shader_vertex_source,
    GL.VERTEX_SHADER,
    "VERTEX"
  );
  const shader_fragment = compile_shader(
    shader_fragment_source,
    GL.FRAGMENT_SHADER,
    "FRAGMENT"
  );

  const SHADER_PROGRAM = GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);
  GL.linkProgram(SHADER_PROGRAM);

  const _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
  const _uv = GL.getAttribLocation(SHADER_PROGRAM, "uv");
  const _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
  const _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
  const _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");
  const _sampler = GL.getUniformLocation(SHADER_PROGRAM, "sampler");

  /*======================== KUBUS ======================== */
  const cube_vertex = [
    -1,
    -1,
    -1,
    1,
    1 / 3,
    1,
    -1,
    -1,
    3 / 4,
    1 / 3,
    1,
    1,
    -1,
    3 / 4,
    2 / 3,
    -1,
    1,
    -1,
    1,
    2 / 3,
    -1,
    -1,
    1,
    1 / 4,
    1 / 3,
    1,
    -1,
    1,
    2 / 4,
    1 / 3,
    1,
    1,
    1,
    2 / 4,
    2 / 3,
    -1,
    1,
    1,
    1 / 4,
    2 / 3,
    -1,
    -1,
    -1,
    0,
    1 / 3,
    -1,
    1,
    -1,
    0,
    2 / 3,
    -1,
    1,
    1,
    1 / 4,
    2 / 3,
    -1,
    -1,
    1,
    1 / 4,
    1 / 3,
    1,
    -1,
    -1,
    3 / 4,
    1 / 3,
    1,
    1,
    -1,
    3 / 4,
    2 / 3,
    1,
    1,
    1,
    2 / 4,
    2 / 3,
    1,
    -1,
    1,
    2 / 4,
    1 / 3,
    -1,
    -1,
    -1,
    1 / 4,
    0,
    -1,
    -1,
    1,
    1 / 4,
    1 / 3,
    1,
    -1,
    1,
    2 / 4,
    1 / 3,
    1,
    -1,
    -1,
    2 / 4,
    0,
    -1,
    1,
    -1,
    1 / 4,
    1,
    -1,
    1,
    1,
    1 / 4,
    2 / 3,
    1,
    1,
    1,
    2 / 4,
    2 / 3,
    1,
    1,
    -1,
    2 / 4,
    1,
  ];

  const cube_faces = [
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
    15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
  ];

  const CUBE_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cube_vertex), GL.STATIC_DRAW);

  const CUBE_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
  GL.bufferData(
    GL.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(cube_faces),
    GL.STATIC_DRAW
  );

  /*========================= TEKSTUR ========================= */
  const load_texture = function (image_URL) {
    const texture = GL.createTexture();
    const image = new Image();
    image.src = image_URL;
    image.onload = function () {
      GL.bindTexture(GL.TEXTURE_2D, texture);
      GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
      GL.texImage2D(
        GL.TEXTURE_2D,
        0,
        GL.RGBA,
        GL.RGBA,
        GL.UNSIGNED_BYTE,
        image
      );
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
      GL.bindTexture(GL.TEXTURE_2D, null);
    };
    return texture;
  };
  const cube_texture = load_texture("textures/skybox.png"); // Pastikan path ini benar

  // -------------------------------------------------------------------------
  // KEMBALIKAN FUNGSI UNTUK MENGGAMBAR (DRAW FUNCTION)
  // -------------------------------------------------------------------------
  return function drawSkybox(
    projectionMatrix,
    viewMatrix,
    modelRotationMatrix
  ) {
    GL.depthFunc(GL.LEQUAL); // Ganti depth function agar skybox tergambar di belakang objek lain
    GL.useProgram(SHADER_PROGRAM);

    // Buat view matrix khusus untuk skybox dengan menghapus informasi translasi (posisi)
    // Ini membuat skybox terlihat sangat jauh
    // Salin viewMatrix secara manual untuk kompatibilitas maksimum
    let skyboxViewMatrix = mat4.create();
    for (let i = 0; i < 16; i++) {
      skyboxViewMatrix[i] = viewMatrix[i];
    }
    skyboxViewMatrix[12] = 0; // x
    skyboxViewMatrix[13] = 0; // y
    skyboxViewMatrix[14] = 0; // z

    // Atur matriks uniform di shader
    GL.uniformMatrix4fv(_Pmatrix, false, projectionMatrix);
    GL.uniformMatrix4fv(_Vmatrix, false, skyboxViewMatrix);
    GL.uniformMatrix4fv(_Mmatrix, false, modelRotationMatrix); // Gunakan rotasi dari scene utama

    // Aktifkan dan bind buffer
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 4 * 5, 0);
    GL.vertexAttribPointer(_uv, 2, GL.FLOAT, false, 4 * 5, 4 * 3);
    GL.enableVertexAttribArray(_position);
    GL.enableVertexAttribArray(_uv);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);

    // Aktifkan tekstur
    GL.activeTexture(GL.TEXTURE0);
    GL.uniform1i(_sampler, 0);
    GL.bindTexture(GL.TEXTURE_2D, cube_texture);

    // Gambar kubus
    GL.drawElements(GL.TRIANGLES, cube_faces.length, GL.UNSIGNED_SHORT, 0);

    GL.depthFunc(GL.LESS); // Kembalikan depth function ke default untuk objek lain
  };
}
