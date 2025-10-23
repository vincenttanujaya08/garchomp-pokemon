function createPokeball(gl, radius = 1.0) {
  const rootGroup = new SceneNode();
  rootGroup.name = "POKEBALL_ROOT";

  const { upperRoot } = PokeballParts.createPokeballUpper(gl, radius);
  upperRoot.name = "POKEBALL_TOP_ASSEMBLY";

  const topHingeNode = new SceneNode();
  topHingeNode.name = "POKEBALL_TOP_HINGE";
  topHingeNode.addChild(upperRoot);

  const { bottomNode } = PokeballParts.createPokeballLower(gl, radius);
  bottomNode.name = "POKEBALL_BOTTOM";

  rootGroup.addChild(bottomNode);
  rootGroup.addChild(topHingeNode);

  mat4.rotate(rootGroup.localTransform, rootGroup.localTransform, Math.PI, [0, 1, 0]);

  return {
    root: rootGroup,
    topHinge: topHingeNode,
    topAssembly: upperRoot,
    bottom: bottomNode,
    radius,
  };
}

window.createPokeball = createPokeball;

console.log("createPokeball() ready");
