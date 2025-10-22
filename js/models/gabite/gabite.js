function createGabite(gl) {
  // Node root untuk seluruh model Gabite
  const root = new SceneNode();

  // Buat torso
  const body = createGabiteBody(gl);

  // Tambahkan torso ke root scene
  root.addChild(body);

  // (Nantinya, bagian lain seperti kepala, lengan, kaki akan ditambahkan di sini)
  const head = createGabiteHead(gl);
  root.addChild(head);

  const neck = createGabiteNeck(gl);
  root.addChild(neck);

  const fin = createGabiteFin(gl);
  root.addChild(fin);

  return root;
}
