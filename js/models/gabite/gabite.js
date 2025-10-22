/**
 * ============================================================
 * GABITE MODEL - FIXED HIERARCHY
 * ============================================================
 *
 * CORRECT STRUCTURE:
 * Gabite Root
 * └── Body
 *     ├── Tail (dengan fin)
 *     ├── Left Leg (thigh → shin → foot)
 *     ├── Right Leg (thigh → shin → foot)
 *     ├── Arms (left/right upper → forearm → sails/fins)
 *     ├── Dorsal Fin (sirip punggung)
 *     └── Neck
 *         └── Head (dengan jet fins & eyes)
 */

function createGabite(gl) {
  const root = new SceneNode();
  root.name = "GABITE_ROOT";

  // 1. CREATE BODY (includes legs, arms, tail)
  const body = createGabiteBody(gl);
  body.name = "Body";
  root.addChild(body);

  // 2. CREATE DORSAL FIN - child of body
  const dorsalFin = createGabiteFin(gl);
  dorsalFin.name = "DorsalFin";
  body.addChild(dorsalFin);

  // 3. CREATE NECK - child of body
  const neck = createGabiteNeck(gl);
  neck.name = "Neck";
  body.addChild(neck);

  // 4. CREATE HEAD - child of neck
  const head = createGabiteHead(gl);
  head.name = "Head";
  neck.addChild(head);

  // 5. SETUP ANIMATION RIG
  root.animationRig = {
    body: body,
    neck: neck,
    head: head,
    dorsalFin: dorsalFin,
  };

  // Add references from body's rig
  if (body._rigRefs) {
    Object.assign(root.animationRig, body._rigRefs);
  }

  console.log("✅ Gabite hierarchy created");
  console.log("📋 Animation Rig:", root.animationRig);
  return root;
}

// Export to window
window.createGabite = createGabite;
