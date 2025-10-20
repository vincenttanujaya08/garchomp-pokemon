// File: js/models/gabite/gabite.js

function createGabite(gl) {
  // Node root untuk seluruh model Gabite
  const root = new SceneNode();

  // Buat torso
  const body = createGabiteBody(gl);

  // Tambahkan torso ke root scene
  root.addChild(body);

  // (Nantinya, bagian lain seperti kepala, lengan, kaki akan ditambahkan di sini)
  // const head = createGabiteHead(gl);
  // root.addChild(head);

  return root;
}