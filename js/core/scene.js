class Mesh {
  constructor(gl, geometryData) {
    this.gl = gl;
    this.indicesCount = geometryData.indices.length;

    // Hanya buat dan isi buffer, jangan di-setup di sini
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometryData.vertices, gl.STATIC_DRAW);

    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometryData.normals, gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      geometryData.indices,
      gl.STATIC_DRAW
    );
  }
}

class SceneNode {
  constructor(mesh = null, color = [1, 1, 1, 1]) {
    this.mesh = mesh;
    this.color = color;
    this.localTransform = mat4.create();
    this.children = [];
    // ❌ JANGAN taruh window.SceneNode di sini!
  }

  addChild(node) {
    this.children.push(node);
  }
}

// ✅ TARUH DI SINI - di luar class!
window.SceneNode = SceneNode;
window.Mesh = Mesh;

console.log("✅ scene.js fixed - SceneNode properly exported");
