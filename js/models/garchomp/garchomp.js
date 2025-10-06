function createGarchomp(gl) {
  const root = new SceneNode();
  const neck = createGarchompNeck(gl);
  const head = createGarchompHead(gl);

  // Hierarchy: root -> neck -> head
  root.addChild(neck);
  root.addChild(head);

  // Posisi kepala di atas leher
  mat4.translate(head.localTransform, head.localTransform, [0, 0, 0]);

  return root;
}
