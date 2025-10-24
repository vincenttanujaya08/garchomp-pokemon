function setupSkybox(GL, LIBS) {
  const vs = `
    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 Pmatrix, Vmatrix, Mmatrix;
    varying vec2 vUV;
    void main(void) {
      vec4 pos = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
      gl_Position = pos.xyww; // z = w → selalu di belakang
      vUV = uv;
    }`;

  const fs = `
    precision mediump float;
    uniform sampler2D sampler;
    varying vec2 vUV;
    void main(void) {
      gl_FragColor = texture2D(sampler, vUV);
    }`;

  const compile = (src, type, name) => {
    const sh = GL.createShader(type);
    GL.shaderSource(sh, src);
    GL.compileShader(sh);
    if (!GL.getShaderParameter(sh, GL.COMPILE_STATUS))
      throw new Error(`Shader ${name}: ${GL.getShaderInfoLog(sh)}`);
    return sh;
  };
  const vsObj = compile(vs, GL.VERTEX_SHADER, "VERTEX");
  const fsObj = compile(fs, GL.FRAGMENT_SHADER, "FRAGMENT");

  const prog = GL.createProgram();
  GL.attachShader(prog, vsObj);
  GL.attachShader(prog, fsObj);
  GL.linkProgram(prog);

  const aPos = GL.getAttribLocation(prog, "position");
  const aUV = GL.getAttribLocation(prog, "uv");
  const uP = GL.getUniformLocation(prog, "Pmatrix");
  const uV = GL.getUniformLocation(prog, "Vmatrix");
  const uM = GL.getUniformLocation(prog, "Mmatrix");
  const uSampler = GL.getUniformLocation(prog, "sampler");

  const cubeVertex = [
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

  const cubeFaces = [
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
    15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
  ];

  const bufV = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, bufV);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeVertex), GL.STATIC_DRAW);

  const bufI = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bufI);
  GL.bufferData(
    GL.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(cubeFaces),
    GL.STATIC_DRAW
  );

  const loadTex = (url) => {
    const tex = GL.createTexture();
    const img = new Image();
    img.src = url;
    img.onload = () => {
      GL.bindTexture(GL.TEXTURE_2D, tex);
      GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
      GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
      GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
      GL.bindTexture(GL.TEXTURE_2D, null);
    };
    return tex;
  };
  const tex = loadTex("textures/skybox2.png");

  return function drawSkybox(P, V, Mrot) {
    GL.depthFunc(GL.LEQUAL);
    GL.useProgram(prog);

    // Hilangkan translasi dari viewMatrix
    const Vsky = mat4.clone(V);
    Vsky[12] = Vsky[13] = Vsky[14] = 0;

    // Set uniform
    GL.uniformMatrix4fv(uP, false, P);
    GL.uniformMatrix4fv(uV, false, Vsky);
    GL.uniformMatrix4fv(uM, false, Mrot);

    // Bind buffer dan atribut
    GL.bindBuffer(GL.ARRAY_BUFFER, bufV);
    GL.vertexAttribPointer(aPos, 3, GL.FLOAT, false, 4 * 5, 0);
    GL.vertexAttribPointer(aUV, 2, GL.FLOAT, false, 4 * 5, 4 * 3);
    GL.enableVertexAttribArray(aPos);
    GL.enableVertexAttribArray(aUV);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bufI);

    // Tekstur
    GL.activeTexture(GL.TEXTURE0);
    GL.uniform1i(uSampler, 0);
    GL.bindTexture(GL.TEXTURE_2D, tex);

    // Gambar kubus
    GL.drawElements(GL.TRIANGLES, cubeFaces.length, GL.UNSIGNED_SHORT, 0);
    GL.depthFunc(GL.LESS);
  };
}
