function createGarchomp(gl) {
  const root = new SceneNode();
  root.name = "GARCHOMP";

  const neck = createGarchompNeck(gl);
  const head = createGarchompHead(gl);
  const torso = createMegaGarchompTorsoAnimated(gl);
  const legData = createAnimatedLegs(gl);
  const arm = createGarchompArm(gl);

  root.addChild(torso);
  torso.addChild(neck);
  torso.addChild(legData.root);
  torso.addChild(arm);
  neck.addChild(head);

  root.animationRig = {
    torso: torso,
    neck: neck,
    head: head,
    arms: arm,

    leftHip: legData.leftHip,
    rightHip: legData.rightHip,
    leftKnee: legData.leftKnee,
    rightKnee: legData.rightKnee,

    tailJoints: torso.tailJoints || [],
    tailSegmentLength: torso.tailSegmentLength || 0.8,
  };

  return root;
}

window.createGarchomp = createGarchomp;
