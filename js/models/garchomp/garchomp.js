function createGarchomp(gl) {
  const root = new SceneNode();
  const neck = createGarchompNeck(gl);
  const head = createGarchompHead(gl);
  const body = createGarchompBody(gl);

  // Hierarchy: root -> body -> neck -> head
  root.addChild(body);
  body.addChild(neck);
  neck.addChild(head);

  return root;
}
