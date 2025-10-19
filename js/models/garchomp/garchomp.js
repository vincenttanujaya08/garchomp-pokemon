function createGarchomp(gl) {
  const root = new SceneNode();
  const neck = createGarchompNeck(gl);
  const head = createGarchompHead(gl);
  const torso = createMegaGarchompTorso(gl);
  const leg = createGarchompLeg(gl); // Tambahkan leg
  const arm = createGarchompArm(gl); // Tambahkan arm

  // Hierarchy: root -> torso -> neck -> head
  root.addChild(torso); // PERBAIKI: 'body' -> 'torso'
  torso.addChild(neck);
  torso.addChild(leg); // Leg menempel di torso
  neck.addChild(head);
  torso.addChild(arm);

  return root;
}
