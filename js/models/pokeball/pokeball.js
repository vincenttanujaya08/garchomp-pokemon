function createPokeball(gl) {
  const radius = 1.0;

  const rootGroup = new SceneNode();
  rootGroup.name = "POKEBALL";

  const { upperRoot } = PokeballParts.createPokeballUpper(gl, radius);
  rootGroup.addChild(upperRoot);

  const { bottomNode } = PokeballParts.createPokeballLower(gl, radius);
  upperRoot.addChild(bottomNode);

  mat4.rotate(rootGroup.localTransform, rootGroup.localTransform, Math.PI, [0, 1, 0]);

  return rootGroup;
}

window.createPokeball = createPokeball;

console.log("createPokeball() ready");
