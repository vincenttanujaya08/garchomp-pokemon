/**
 * Garchomp Model Assembly
 * Returns node dengan animationRig untuk animator
 */

function createGarchomp(gl) {
  const root = new SceneNode();
  root.name = "GARCHOMP";

  // Build parts
  const neck = createGarchompNeck(gl);
  const head = createGarchompHead(gl);
  const torso = createMegaGarchompTorsoAnimated(gl); // Use animated version
  const legData = createAnimatedLegs(gl);
  const arm = createGarchompArm(gl);

  // Hierarchy
  root.addChild(torso);
  torso.addChild(neck);
  torso.addChild(legData.root);
  torso.addChild(arm);
  neck.addChild(head);

  // ===== ANIMATION RIG =====
  // Export references untuk animator
  root.animationRig = {
    // Body parts
    torso: torso,
    neck: neck,
    head: head,
    arms: arm,

    // Leg joints
    leftHip: legData.leftHip,
    rightHip: legData.rightHip,
    leftKnee: legData.leftKnee,
    rightKnee: legData.rightKnee,

    // Tail data (CRITICAL!)
    tailJoints: torso.tailJoints || [],
    tailSegmentLength: torso.tailSegmentLength || 0.8,
  };

  return root;
}

// Export
window.createGarchomp = createGarchomp;
