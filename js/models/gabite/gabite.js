/**
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

  const body = createGabiteBody(gl);
  body.name = "Body";
  root.addChild(body);

  const dorsalFin = createGabiteFin(gl);
  dorsalFin.name = "DorsalFin";
  body.addChild(dorsalFin);

  const neck = createGabiteNeck(gl);
  neck.name = "Neck";
  body.addChild(neck);

  const head = createGabiteHead(gl);
  head.name = "Head";
  neck.addChild(head);

  root.animationRig = {
    body: body,
    neck: neck,
    head: head,
    dorsalFin: dorsalFin,
  };

  if (body._rigRefs) {
    Object.assign(root.animationRig, body._rigRefs);
  }

  console.log("✅ Gabite hierarchy created");
  console.log("📋 Animation Rig:", root.animationRig);
  return root;
}

window.createGabite = createGabite;
