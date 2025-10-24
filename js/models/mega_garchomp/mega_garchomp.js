function createMegaGarchompNeck(gl) {
  const darkBlue = [0.18, 0.22, 0.38, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const reds = [0.8, 0.15, 0.1, 1.0];
  const redOrange = [0.8, 0.15, 0.1, 1.0];

  const neckMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(
      0.6, // radiusX
      0.6, // radiusZ
      0.4, // pinchY
      1.0, // height
      16, // latitudeBands
      16 // longitudeBands
    )
  );

  const neckMesh2 = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.6, 0.6, 0.4, 1.0, 16, 16)
  );

  const neckNode = new SceneNode(neckMesh, darkBlue);
  const neckNode2 = new SceneNode(neckMesh2, redOrange);

  neckNode.addChild(neckNode2);

  mat4.rotate(
    neckNode.localTransform,
    neckNode.localTransform,
    Math.PI / 10,
    [1, 0, 0]
  );
  mat4.scale(neckNode.localTransform, neckNode.localTransform, [0.6, 1, 0.5]);
  mat4.translate(
    neckNode.localTransform,
    neckNode.localTransform,
    [0, 2, -0.7]
  );

  mat4.rotate(
    neckNode2.localTransform,
    neckNode2.localTransform,
    Math.PI / 12,
    [1, 0, 0]
  );
  mat4.scale(
    neckNode2.localTransform,
    neckNode2.localTransform,
    [0.6, 0.7, 0.5]
  );
  mat4.translate(
    neckNode2.localTransform,
    neckNode2.localTransform,
    [0, 0.1, 1.4]
  );

  return neckNode;
}

function createMegaGarchompJaw(gl) {
  const redOrange = [0.8, 0.15, 0.1, 1.0];
  const white = [1.0, 1.0, 1.0, 1.0];
  const black = [0.1, 0.1, 0.1, 1.0];

  const jawBaseMesh = new Mesh(gl, Prm.createCuboid(1, 1, 1));
  const toothMesh = new Mesh(gl, Prm.createCone(0.1, 0.3, 8));

  const chinCoverMesh = new Mesh(gl, Prm.createTriangularPrism(1, 1, 1));
  const innerMouthMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));

  const jawRoot = new SceneNode(null);
  const jawCenter = new SceneNode(jawBaseMesh, redOrange);
  const leftJawBlock = new SceneNode(jawBaseMesh, redOrange);
  const rightJawBlock = new SceneNode(jawBaseMesh, redOrange);

  const leftJawCover = new SceneNode(jawBaseMesh, redOrange);
  const rightJawCover = new SceneNode(jawBaseMesh, redOrange);

  const chinCoverNode = new SceneNode(chinCoverMesh, redOrange);
  const innerMouthNode = new SceneNode(innerMouthMesh, black);

  const lowerToothL1 = new SceneNode(toothMesh, white);
  const lowerToothL2 = new SceneNode(toothMesh, white);
  const lowerToothL3 = new SceneNode(toothMesh, white);
  const lowerToothR1 = new SceneNode(toothMesh, white);
  const lowerToothR2 = new SceneNode(toothMesh, white);
  const lowerToothR3 = new SceneNode(toothMesh, white);

  jawRoot.addChild(jawCenter);
  jawRoot.addChild(leftJawBlock);
  jawRoot.addChild(rightJawBlock);

  jawRoot.addChild(leftJawCover);
  jawRoot.addChild(rightJawCover);

  jawRoot.addChild(chinCoverNode);
  jawRoot.addChild(innerMouthNode);

  jawRoot.addChild(lowerToothL1);
  jawRoot.addChild(lowerToothL2);
  jawRoot.addChild(lowerToothL3);
  jawRoot.addChild(lowerToothR1);
  jawRoot.addChild(lowerToothR2);
  jawRoot.addChild(lowerToothR3);

  mat4.translate(
    jawRoot.localTransform,
    jawRoot.localTransform,
    [0, 0.25, 1.1]
  );

  mat4.translate(
    jawCenter.localTransform,
    jawCenter.localTransform,
    [0, 0.4, 1]
  );
  mat4.rotate(
    jawCenter.localTransform,
    jawCenter.localTransform,
    -Math.PI / 12,
    [-1, 0, 0]
  );
  mat4.scale(
    jawCenter.localTransform,
    jawCenter.localTransform,
    [0.4, 0.2, 0.6]
  );

  mat4.translate(
    leftJawBlock.localTransform,
    leftJawBlock.localTransform,
    [-0.3, 0.45, 0.3]
  );
  mat4.rotate(
    leftJawBlock.localTransform,
    leftJawBlock.localTransform,
    Math.PI / 6,
    [0, 1, 0]
  );
  mat4.scale(
    leftJawBlock.localTransform,
    leftJawBlock.localTransform,
    [0.3, 0.2, 1.5]
  );

  mat4.translate(
    rightJawBlock.localTransform,
    rightJawBlock.localTransform,
    [0.3, 0.45, 0.3]
  );
  mat4.rotate(
    rightJawBlock.localTransform,
    rightJawBlock.localTransform,
    -Math.PI / 6,
    [0, 1, 0]
  );
  mat4.scale(
    rightJawBlock.localTransform,
    rightJawBlock.localTransform,
    [0.3, 0.2, 1.5]
  );

  mat4.translate(
    leftJawCover.localTransform,
    leftJawCover.localTransform,
    [-0.8, 0.6, -0.4]
  );
  mat4.scale(
    leftJawCover.localTransform,
    leftJawCover.localTransform,
    [0.2, 0.5, 0.3]
  );

  mat4.translate(
    rightJawCover.localTransform,
    rightJawCover.localTransform,
    [0.8, 0.6, -0.4]
  );
  mat4.scale(
    rightJawCover.localTransform,
    rightJawCover.localTransform,
    [0.2, 0.5, 0.3]
  );

  mat4.translate(
    innerMouthNode.localTransform,
    innerMouthNode.localTransform,
    [0, 0.6, -0.6]
  );
  mat4.scale(
    innerMouthNode.localTransform,
    innerMouthNode.localTransform,
    [0.7, 0.2, 1]
  );

  mat4.translate(
    chinCoverNode.localTransform,
    chinCoverNode.localTransform,
    [0, 0.3, 0.3]
  );
  mat4.rotate(
    chinCoverNode.localTransform,
    chinCoverNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(
    chinCoverNode.localTransform,
    chinCoverNode.localTransform,
    [1.4, 1.4, 0.05]
  );

  mat4.translate(
    lowerToothL1.localTransform,
    lowerToothL1.localTransform,
    [-0.15, 0.65, 0.58]
  );
  mat4.scale(
    lowerToothL1.localTransform,
    lowerToothL1.localTransform,
    [1, 0.7, 1]
  );

  mat4.translate(
    lowerToothL2.localTransform,
    lowerToothL2.localTransform,
    [-0.36, 0.65, 0.28]
  );
  mat4.scale(
    lowerToothL2.localTransform,
    lowerToothL2.localTransform,
    [1, 0.7, 1]
  );

  mat4.translate(
    lowerToothL3.localTransform,
    lowerToothL3.localTransform,
    [-0.6, 0.65, -0.02]
  );
  mat4.scale(
    lowerToothL3.localTransform,
    lowerToothL3.localTransform,
    [1, 0.7, 1]
  );

  mat4.translate(
    lowerToothR1.localTransform,
    lowerToothR1.localTransform,
    [0.15, 0.65, 0.58]
  );
  mat4.scale(
    lowerToothR1.localTransform,
    lowerToothR1.localTransform,
    [1, 0.7, 1]
  );

  mat4.translate(
    lowerToothR2.localTransform,
    lowerToothR2.localTransform,
    [0.4, 0.65, 0.28]
  );
  mat4.scale(
    lowerToothR2.localTransform,
    lowerToothR2.localTransform,
    [1, 0.7, 1]
  );

  mat4.translate(
    lowerToothR3.localTransform,
    lowerToothR3.localTransform,
    [0.6, 0.65, -0.02]
  );
  mat4.scale(
    lowerToothR3.localTransform,
    lowerToothR3.localTransform,
    [1, 0.7, 1]
  );

  return jawRoot;
}

function createMegaGarchompUpperHead(gl) {
  const darkBlue = [0.18, 0.22, 0.38, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const yellow = [1.0, 0.84, 0.0, 1.0];
  const black = [0.1, 0.1, 0.1, 1.0];
  const white = [1.0, 1.0, 1.0, 1.0];

  const rugbyProfile = [];
  const smoothness = 10;

  const p0 = [0.0, 1.8, 0];
  const p1 = [0.4, 1.2, 0];
  const p2 = [0.7, 0.5, 0];
  const p3 = [0.7, 0.0, 0];

  for (let i = 0; i <= smoothness; i++) {
    const t = i / smoothness;
    const pt = Crv.getBezierPoint(t, p0, p1, p2, p3);
    rugbyProfile.push([pt[0], pt[1]]);
  }

  for (let i = smoothness - 1; i >= 0; i--) {
    const pt = rugbyProfile[i];
    if (Math.abs(pt[1]) > 0.0001) {
      rugbyProfile.push([pt[0], -pt[1]]);
    }
  }

  const rugbyMesh = new Mesh(
    gl,
    Crv.createSurfaceOfRevolution(rugbyProfile, 32)
  );

  const connectorMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.5, 0.5, 0.4, 1.0, 16, 16)
  );

  const nosePrismMesh = new Mesh(gl, Prm.createTriangularPrism(0.4, 0.7, 0.2));

  const underJawMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));

  const eyeMesh = new Mesh(gl, Prm.createTrapezoidalPrism(0.5, 0.3, 0.8, 0.2));

  const pupilMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 16, 16));

  const retinaMesh = pupilMesh;

  const toothMesh = new Mesh(gl, Prm.createCone(0.1, 0.3, 8));

  const hornMesh = new Mesh(gl, Prm.createCone(0.6, 1, 4));

  const upperHeadRoot = new SceneNode(null);
  upperHeadRoot.name = "UpperHead";

  const centerRugbyNode = new SceneNode(rugbyMesh, darkBlue);
  const leftRugbyNode = new SceneNode(rugbyMesh, darkBlue);
  const rightRugbyNode = new SceneNode(rugbyMesh, darkBlue);

  const leftConnectorNode = new SceneNode(connectorMesh, darkBlue);
  const rightConnectorNode = new SceneNode(connectorMesh, darkBlue);

  const noseLeftNode = new SceneNode(nosePrismMesh, darkBlue);
  const noseRightNode = new SceneNode(nosePrismMesh, darkBlue);

  const underJawNode = new SceneNode(underJawMesh, darkBlue);

  const leftEyeNode = new SceneNode(eyeMesh, black);
  const rightEyeNode = new SceneNode(eyeMesh, black);

  const leftPupilNode = new SceneNode(pupilMesh, yellow);
  const rightPupilNode = new SceneNode(pupilMesh, yellow);

  const leftRetinaNode = new SceneNode(retinaMesh, black);
  const rightRetinaNode = new SceneNode(retinaMesh, black);

  const toothL1 = new SceneNode(toothMesh, white);
  const toothL2 = new SceneNode(toothMesh, white);
  const toothL3 = new SceneNode(toothMesh, white);
  const toothR1 = new SceneNode(toothMesh, white);
  const toothR2 = new SceneNode(toothMesh, white);
  const toothR3 = new SceneNode(toothMesh, white);

  const centerHornNode = new SceneNode(hornMesh, yellow);

  upperHeadRoot.addChild(centerRugbyNode);
  upperHeadRoot.addChild(leftRugbyNode);
  upperHeadRoot.addChild(rightRugbyNode);
  upperHeadRoot.addChild(leftConnectorNode);
  upperHeadRoot.addChild(rightConnectorNode);

  centerRugbyNode.addChild(noseLeftNode);
  centerRugbyNode.addChild(noseRightNode);

  centerRugbyNode.addChild(underJawNode);
  centerRugbyNode.addChild(leftEyeNode);
  centerRugbyNode.addChild(rightEyeNode);

  centerRugbyNode.addChild(centerHornNode);

  leftEyeNode.addChild(leftPupilNode);
  rightEyeNode.addChild(rightPupilNode);

  leftPupilNode.addChild(leftRetinaNode);
  rightPupilNode.addChild(rightRetinaNode);

  underJawNode.addChild(toothL1);
  underJawNode.addChild(toothL2);
  underJawNode.addChild(toothL3);
  underJawNode.addChild(toothR1);
  underJawNode.addChild(toothR2);
  underJawNode.addChild(toothR3);

  mat4.translate(
    upperHeadRoot.localTransform,
    upperHeadRoot.localTransform,
    [0, 1.5, 0.5]
  );
  mat4.scale(
    upperHeadRoot.localTransform,
    upperHeadRoot.localTransform,
    [1, 0.7, 1.2]
  );

  mat4.scale(
    centerRugbyNode.localTransform,
    centerRugbyNode.localTransform,
    [1.3, 1, 1]
  );

  mat4.translate(
    leftRugbyNode.localTransform,
    leftRugbyNode.localTransform,
    [-1.7, 0, 0]
  );
  mat4.scale(
    leftRugbyNode.localTransform,
    leftRugbyNode.localTransform,
    [0.6, 0.6, 0.6]
  );

  mat4.translate(
    rightRugbyNode.localTransform,
    rightRugbyNode.localTransform,
    [1.7, 0, 0]
  );
  mat4.scale(
    rightRugbyNode.localTransform,
    rightRugbyNode.localTransform,
    [0.6, 0.6, 0.6]
  );

  mat4.translate(
    leftConnectorNode.localTransform,
    leftConnectorNode.localTransform,
    [-0.9, 0, 0]
  );
  mat4.rotate(
    leftConnectorNode.localTransform,
    leftConnectorNode.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  mat4.scale(
    leftConnectorNode.localTransform,
    leftConnectorNode.localTransform,
    [0.8, 1, 0.25]
  );

  mat4.translate(
    rightConnectorNode.localTransform,
    rightConnectorNode.localTransform,
    [0.9, 0, 0]
  );
  mat4.rotate(
    rightConnectorNode.localTransform,
    rightConnectorNode.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  mat4.scale(
    rightConnectorNode.localTransform,
    rightConnectorNode.localTransform,
    [0.8, 1, 0.25]
  );

  mat4.translate(
    noseLeftNode.localTransform,
    noseLeftNode.localTransform,
    [-0.08, 1, 0.6]
  );
  mat4.rotate(
    noseLeftNode.localTransform,
    noseLeftNode.localTransform,
    Math.PI / 50,
    [0, 1, 0]
  );
  mat4.rotate(
    noseLeftNode.localTransform,
    noseLeftNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.rotate(
    noseLeftNode.localTransform,
    noseLeftNode.localTransform,
    6.07,
    [0, 0, 1]
  );
  mat4.scale(
    noseLeftNode.localTransform,
    noseLeftNode.localTransform,
    [1, 1.2, 0.3]
  );

  mat4.translate(
    noseRightNode.localTransform,
    noseRightNode.localTransform,
    [0.1, 1, 0.6]
  );
  mat4.rotate(
    noseRightNode.localTransform,
    noseRightNode.localTransform,
    -Math.PI / 50,
    [0, 1, 0]
  );
  mat4.rotate(
    noseRightNode.localTransform,
    noseRightNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.rotate(
    noseRightNode.localTransform,
    noseRightNode.localTransform,
    6.1,
    [0, 0, -1]
  );
  mat4.scale(
    noseRightNode.localTransform,
    noseRightNode.localTransform,
    [1, 1.2, 0.3]
  );

  mat4.translate(
    underJawNode.localTransform,
    underJawNode.localTransform,
    [0, -0.03, 0.35]
  );
  mat4.rotate(
    underJawNode.localTransform,
    underJawNode.localTransform,
    Math.PI / 10,
    [1, 0, 0]
  );
  mat4.scale(
    underJawNode.localTransform,
    underJawNode.localTransform,
    [0.6, 1.1, 0.5]
  );

  mat4.translate(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    [-0.45, 0.6, 0.6]
  );
  mat4.rotate(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.rotate(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    Math.PI / 2,
    [0, 0, -1]
  );
  mat4.rotate(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    2,
    [1, 0, 0]
  );
  mat4.rotate(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    3,
    [0, 0, 1]
  );
  mat4.scale(
    leftEyeNode.localTransform,
    leftEyeNode.localTransform,
    [0.8, 0.7, 0.3]
  );

  mat4.translate(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    [0.45, 0.6, 0.6]
  );
  mat4.rotate(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.rotate(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );
  mat4.rotate(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    2,
    [1, 0, 0]
  );
  mat4.rotate(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    3,
    [0, 0, -1]
  );
  mat4.scale(
    rightEyeNode.localTransform,
    rightEyeNode.localTransform,
    [0.8, 0.7, 0.3]
  );

  mat4.translate(
    leftPupilNode.localTransform,
    leftPupilNode.localTransform,
    [-0.04, 0.3, 0.11]
  );
  mat4.scale(
    leftPupilNode.localTransform,
    leftPupilNode.localTransform,
    [0.15, 0.2, 0.05]
  );

  mat4.translate(
    rightPupilNode.localTransform,
    rightPupilNode.localTransform,
    [0.04, 0.3, 0.11]
  );
  mat4.scale(
    rightPupilNode.localTransform,
    rightPupilNode.localTransform,
    [0.15, 0.2, 0.05]
  );

  mat4.translate(
    leftRetinaNode.localTransform,
    leftRetinaNode.localTransform,
    [0, 0.5, 1]
  );
  mat4.scale(
    leftRetinaNode.localTransform,
    leftRetinaNode.localTransform,
    [0.9, 0.2, 0.1]
  );

  mat4.translate(
    rightRetinaNode.localTransform,
    rightRetinaNode.localTransform,
    [0, 0.5, 1]
  );
  mat4.scale(
    rightRetinaNode.localTransform,
    rightRetinaNode.localTransform,
    [0.9, 0.2, 0.1]
  );

  mat4.translate(
    toothL1.localTransform,
    toothL1.localTransform,
    [-0.3, 0.9, 0.5]
  );
  mat4.rotate(toothL1.localTransform, toothL1.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothL1.localTransform, toothL1.localTransform, [1.6, 1.6, 1.6]);

  mat4.translate(
    toothL2.localTransform,
    toothL2.localTransform,
    [-0.55, 0.75, 0.6]
  );
  mat4.rotate(toothL2.localTransform, toothL2.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothL2.localTransform, toothL2.localTransform, [1.6, 1.6, 1.6]);

  mat4.translate(
    toothL3.localTransform,
    toothL3.localTransform,
    [-0.74, 0.6, 0.6]
  );
  mat4.rotate(toothL3.localTransform, toothL3.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothL3.localTransform, toothL3.localTransform, [1.6, 1.6, 1.6]);

  mat4.translate(
    toothR1.localTransform,
    toothR1.localTransform,
    [0.3, 0.9, 0.5]
  );
  mat4.rotate(toothR1.localTransform, toothR1.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothR1.localTransform, toothR1.localTransform, [1.6, 1.6, 1.6]);

  mat4.translate(
    toothR2.localTransform,
    toothR2.localTransform,
    [0.55, 0.75, 0.6]
  );
  mat4.rotate(toothR2.localTransform, toothR2.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothR2.localTransform, toothR2.localTransform, [1.6, 1.6, 1.6]);

  mat4.translate(
    toothR3.localTransform,
    toothR3.localTransform,
    [0.74, 0.6, 0.6]
  );
  mat4.rotate(toothR3.localTransform, toothR3.localTransform, 1.1, [1, 0, 0]);
  mat4.scale(toothR3.localTransform, toothR3.localTransform, [1.6, 1.6, 1.6]);

  mat4.translate(
    centerHornNode.localTransform,
    centerHornNode.localTransform,
    [0, 1.6, 0]
  );
  mat4.scale(
    centerHornNode.localTransform,
    centerHornNode.localTransform,
    [0.65, 0.7, 0.8]
  );

  mat4.rotate(
    upperHeadRoot.localTransform,
    upperHeadRoot.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );

  return upperHeadRoot;
}

function createMegaGarchompHead(gl) {
  const headRoot = new SceneNode(null);
  headRoot.name = "HeadRoot";
  const upperHead = (function createMegaGarchompUpperHead(gl) {
    const lightBlue = [0.6, 0.6, 1.0, 1.0];
    const yellow = [1.0, 0.84, 0.0, 1.0];
    const black = [0.1, 0.1, 0.1, 1.0];
    const white = [1.0, 1.0, 1.0, 1.0];
    const darkBlue = [0.18, 0.22, 0.38, 1.0];

    const rugbyProfile = [];
    const smoothness = 10;
    const p0 = [0.0, 1.8, 0],
      p1 = [0.4, 1.2, 0],
      p2 = [0.7, 0.5, 0],
      p3 = [0.7, 0.0, 0];
    for (let i = 0; i <= smoothness; i++) {
      const t = i / smoothness;
      rugbyProfile.push(Crv.getBezierPoint(t, p0, p1, p2, p3).slice(0, 2));
    }
    for (let i = smoothness - 1; i >= 0; i--) {
      const pt = rugbyProfile[i];
      if (Math.abs(pt[1]) > 0.0001) rugbyProfile.push([pt[0], -pt[1]]);
    }

    const rugbyMesh = new Mesh(
      gl,
      Crv.createSurfaceOfRevolution(rugbyProfile, 32)
    );
    const connectorMesh = new Mesh(
      gl,
      Prm.createHyperboloidOneSheet(0.5, 0.5, 0.4, 1.0, 16, 16)
    );
    const nosePrismMesh = new Mesh(
      gl,
      Prm.createTriangularPrism(0.4, 0.7, 0.2)
    );
    const underJawMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));
    const eyeMesh = new Mesh(
      gl,
      Prm.createTrapezoidalPrism(0.5, 0.3, 0.8, 0.2)
    );
    const pupilMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 16, 16));
    const retinaMesh = pupilMesh;
    const toothMesh = new Mesh(gl, Prm.createCone(0.1, 0.3, 8));
    const hornMesh = new Mesh(gl, Prm.createCone(0.6, 1, 4));

    const upperHeadRoot = new SceneNode(null);
    const centerRugbyNode = new SceneNode(rugbyMesh, darkBlue);
    const leftRugbyNode = new SceneNode(rugbyMesh, darkBlue);
    const rightRugbyNode = new SceneNode(rugbyMesh, darkBlue);
    const leftConnectorNode = new SceneNode(connectorMesh, darkBlue);
    const rightConnectorNode = new SceneNode(connectorMesh, darkBlue);
    const noseLeftNode = new SceneNode(nosePrismMesh, darkBlue);
    const noseRightNode = new SceneNode(nosePrismMesh, darkBlue);
    const underJawNode = new SceneNode(underJawMesh, darkBlue);
    const leftEyeNode = new SceneNode(eyeMesh, black);
    const rightEyeNode = new SceneNode(eyeMesh, black);
    const leftPupilNode = new SceneNode(pupilMesh, yellow);
    const rightPupilNode = new SceneNode(pupilMesh, yellow);
    const leftRetinaNode = new SceneNode(retinaMesh, black);
    const rightRetinaNode = new SceneNode(retinaMesh, black);
    const toothL1 = new SceneNode(toothMesh, white),
      toothL2 = new SceneNode(toothMesh, white),
      toothL3 = new SceneNode(toothMesh, white);
    const toothR1 = new SceneNode(toothMesh, white),
      toothR2 = new SceneNode(toothMesh, white),
      toothR3 = new SceneNode(toothMesh, white);
    const centerHornNode = new SceneNode(hornMesh, yellow);

    upperHeadRoot.addChild(centerRugbyNode);
    upperHeadRoot.addChild(leftRugbyNode);
    upperHeadRoot.addChild(rightRugbyNode);
    upperHeadRoot.addChild(leftConnectorNode);
    upperHeadRoot.addChild(rightConnectorNode);
    centerRugbyNode.addChild(noseLeftNode);
    centerRugbyNode.addChild(noseRightNode);
    centerRugbyNode.addChild(underJawNode);
    centerRugbyNode.addChild(leftEyeNode);
    centerRugbyNode.addChild(rightEyeNode);
    centerRugbyNode.addChild(centerHornNode);
    leftEyeNode.addChild(leftPupilNode);
    rightEyeNode.addChild(rightPupilNode);
    leftPupilNode.addChild(leftRetinaNode);
    rightPupilNode.addChild(rightRetinaNode);
    underJawNode.addChild(toothL1);
    underJawNode.addChild(toothL2);
    underJawNode.addChild(toothL3);
    underJawNode.addChild(toothR1);
    underJawNode.addChild(toothR2);
    underJawNode.addChild(toothR3);

    mat4.translate(
      upperHeadRoot.localTransform,
      upperHeadRoot.localTransform,
      [0, 1.5, 0.5]
    );
    mat4.scale(
      upperHeadRoot.localTransform,
      upperHeadRoot.localTransform,
      [1, 0.7, 1.2]
    );
    mat4.scale(
      centerRugbyNode.localTransform,
      centerRugbyNode.localTransform,
      [1.3, 0.9, 1]
    );
    mat4.translate(
      leftRugbyNode.localTransform,
      leftRugbyNode.localTransform,
      [-1.7, 0, 0]
    );
    mat4.scale(
      leftRugbyNode.localTransform,
      leftRugbyNode.localTransform,
      [0.6, 0.6, 0.6]
    );
    mat4.translate(
      rightRugbyNode.localTransform,
      rightRugbyNode.localTransform,
      [1.7, 0, 0]
    );
    mat4.scale(
      rightRugbyNode.localTransform,
      rightRugbyNode.localTransform,
      [0.6, 0.6, 0.6]
    );
    mat4.translate(
      leftConnectorNode.localTransform,
      leftConnectorNode.localTransform,
      [-0.9, 0, 0]
    );
    mat4.rotate(
      leftConnectorNode.localTransform,
      leftConnectorNode.localTransform,
      Math.PI / 2,
      [0, 0, 1]
    );
    mat4.scale(
      leftConnectorNode.localTransform,
      leftConnectorNode.localTransform,
      [0.8, 1, 0.25]
    );
    mat4.translate(
      rightConnectorNode.localTransform,
      rightConnectorNode.localTransform,
      [0.9, 0, 0]
    );
    mat4.rotate(
      rightConnectorNode.localTransform,
      rightConnectorNode.localTransform,
      Math.PI / 2,
      [0, 0, 1]
    );
    mat4.scale(
      rightConnectorNode.localTransform,
      rightConnectorNode.localTransform,
      [0.8, 1, 0.25]
    );
    mat4.translate(
      noseLeftNode.localTransform,
      noseLeftNode.localTransform,
      [-0.08, 1, 0.6]
    );
    mat4.rotate(
      noseLeftNode.localTransform,
      noseLeftNode.localTransform,
      Math.PI / 50,
      [0, 1, 0]
    );
    mat4.rotate(
      noseLeftNode.localTransform,
      noseLeftNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.rotate(
      noseLeftNode.localTransform,
      noseLeftNode.localTransform,
      6.07,
      [0, 0, 1]
    );
    mat4.scale(
      noseLeftNode.localTransform,
      noseLeftNode.localTransform,
      [1, 1.2, 0.3]
    );
    mat4.translate(
      noseRightNode.localTransform,
      noseRightNode.localTransform,
      [0.1, 1, 0.6]
    );
    mat4.rotate(
      noseRightNode.localTransform,
      noseRightNode.localTransform,
      -Math.PI / 50,
      [0, 1, 0]
    );
    mat4.rotate(
      noseRightNode.localTransform,
      noseRightNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.rotate(
      noseRightNode.localTransform,
      noseRightNode.localTransform,
      6.1,
      [0, 0, -1]
    );
    mat4.scale(
      noseRightNode.localTransform,
      noseRightNode.localTransform,
      [1, 1.2, 0.3]
    );
    mat4.translate(
      underJawNode.localTransform,
      underJawNode.localTransform,
      [0, -0.03, 0.35]
    );
    mat4.rotate(
      underJawNode.localTransform,
      underJawNode.localTransform,
      Math.PI / 10,
      [1, 0, 0]
    );
    mat4.scale(
      underJawNode.localTransform,
      underJawNode.localTransform,
      [0.6, 1.1, 0.5]
    );
    mat4.translate(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      [-0.45, 0.6, 0.6]
    );
    mat4.rotate(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.rotate(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      Math.PI / 2,
      [0, 0, -1]
    );
    mat4.rotate(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      2,
      [1, 0, 0]
    );
    mat4.rotate(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      3,
      [0, 0, 1]
    );
    mat4.scale(
      leftEyeNode.localTransform,
      leftEyeNode.localTransform,
      [0.8, 0.7, 0.3]
    );
    mat4.translate(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      [0.45, 0.6, 0.6]
    );
    mat4.rotate(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.rotate(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      Math.PI / 2,
      [0, 0, 1]
    );
    mat4.rotate(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      2,
      [1, 0, 0]
    );
    mat4.rotate(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      3,
      [0, 0, -1]
    );
    mat4.scale(
      rightEyeNode.localTransform,
      rightEyeNode.localTransform,
      [0.8, 0.7, 0.3]
    );
    mat4.translate(
      leftPupilNode.localTransform,
      leftPupilNode.localTransform,
      [-0.04, 0.3, 0.11]
    );
    mat4.scale(
      leftPupilNode.localTransform,
      leftPupilNode.localTransform,
      [0.15, 0.2, 0.05]
    );
    mat4.translate(
      rightPupilNode.localTransform,
      rightPupilNode.localTransform,
      [0.04, 0.3, 0.11]
    );
    mat4.scale(
      rightPupilNode.localTransform,
      rightPupilNode.localTransform,
      [0.15, 0.2, 0.05]
    );
    mat4.translate(
      leftRetinaNode.localTransform,
      leftRetinaNode.localTransform,
      [0, 0.5, 1]
    );
    mat4.scale(
      leftRetinaNode.localTransform,
      leftRetinaNode.localTransform,
      [0.9, 0.2, 0.1]
    );
    mat4.translate(
      rightRetinaNode.localTransform,
      rightRetinaNode.localTransform,
      [0, 0.5, 1]
    );
    mat4.scale(
      rightRetinaNode.localTransform,
      rightRetinaNode.localTransform,
      [0.9, 0.2, 0.1]
    );
    mat4.translate(
      toothL1.localTransform,
      toothL1.localTransform,
      [-0.3, 0.9, 0.5]
    );
    mat4.rotate(toothL1.localTransform, toothL1.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothL1.localTransform, toothL1.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      toothL2.localTransform,
      toothL2.localTransform,
      [-0.55, 0.75, 0.6]
    );
    mat4.rotate(toothL2.localTransform, toothL2.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothL2.localTransform, toothL2.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      toothL3.localTransform,
      toothL3.localTransform,
      [-0.74, 0.6, 0.6]
    );
    mat4.rotate(toothL3.localTransform, toothL3.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothL3.localTransform, toothL3.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      toothR1.localTransform,
      toothR1.localTransform,
      [0.3, 0.9, 0.5]
    );
    mat4.rotate(toothR1.localTransform, toothR1.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothR1.localTransform, toothR1.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      toothR2.localTransform,
      toothR2.localTransform,
      [0.55, 0.75, 0.6]
    );
    mat4.rotate(toothR2.localTransform, toothR2.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothR2.localTransform, toothR2.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      toothR3.localTransform,
      toothR3.localTransform,
      [0.74, 0.6, 0.6]
    );
    mat4.rotate(toothR3.localTransform, toothR3.localTransform, 1.1, [1, 0, 0]);
    mat4.scale(toothR3.localTransform, toothR3.localTransform, [1.6, 1.6, 1.6]);
    mat4.translate(
      centerHornNode.localTransform,
      centerHornNode.localTransform,
      [0, 1.6, 0]
    );
    mat4.scale(
      centerHornNode.localTransform,
      centerHornNode.localTransform,
      [0.65, 0.7, 0.8]
    );
    mat4.rotate(
      upperHeadRoot.localTransform,
      upperHeadRoot.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    return upperHeadRoot;
  })(gl);

  const lowerJaw = (function createMegaGarchompJaw(gl) {
    const redOrange = [0.8, 0.15, 0.1, 1.0];
    const white = [1.0, 1.0, 1.0, 1.0];
    const black = [0.1, 0.1, 0.1, 1.0];

    const jawBaseMesh = new Mesh(gl, Prm.createCuboid(1, 1, 1));
    const toothMesh = new Mesh(gl, Prm.createCone(0.1, 0.3, 8));
    const chinCoverMesh = new Mesh(gl, Prm.createTriangularPrism(1, 1, 1));
    const innerMouthMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));

    const jawRoot = new SceneNode(null);
    jawRoot.name = "LowerJaw";
    const jawCenter = new SceneNode(jawBaseMesh, redOrange);
    const leftJawBlock = new SceneNode(jawBaseMesh, redOrange);
    const rightJawBlock = new SceneNode(jawBaseMesh, redOrange);
    const leftJawCover = new SceneNode(jawBaseMesh, redOrange);
    const rightJawCover = new SceneNode(jawBaseMesh, redOrange);
    const chinCoverNode = new SceneNode(chinCoverMesh, redOrange);
    const innerMouthNode = new SceneNode(innerMouthMesh, black);
    const lowerToothL1 = new SceneNode(toothMesh, white),
      lowerToothL2 = new SceneNode(toothMesh, white),
      lowerToothL3 = new SceneNode(toothMesh, white);
    const lowerToothR1 = new SceneNode(toothMesh, white),
      lowerToothR2 = new SceneNode(toothMesh, white),
      lowerToothR3 = new SceneNode(toothMesh, white);

    jawRoot.addChild(jawCenter);
    jawRoot.addChild(leftJawBlock);
    jawRoot.addChild(rightJawBlock);
    jawRoot.addChild(leftJawCover);
    jawRoot.addChild(rightJawCover);
    jawRoot.addChild(chinCoverNode);
    jawRoot.addChild(innerMouthNode);
    jawRoot.addChild(lowerToothL1);
    jawRoot.addChild(lowerToothL2);
    jawRoot.addChild(lowerToothL3);
    jawRoot.addChild(lowerToothR1);
    jawRoot.addChild(lowerToothR2);
    jawRoot.addChild(lowerToothR3);

    mat4.translate(
      jawRoot.localTransform,
      jawRoot.localTransform,
      [0, 0.25, 1.1]
    );

    mat4.translate(
      jawCenter.localTransform,
      jawCenter.localTransform,
      [0, 0.4, 1]
    );
    mat4.rotate(
      jawCenter.localTransform,
      jawCenter.localTransform,
      -Math.PI / 12,
      [-1, 0, 0]
    );
    mat4.scale(
      jawCenter.localTransform,
      jawCenter.localTransform,
      [0.4, 0.2, 0.6]
    );

    mat4.translate(
      leftJawBlock.localTransform,
      leftJawBlock.localTransform,
      [-0.3, 0.45, 0.3]
    );
    mat4.rotate(
      leftJawBlock.localTransform,
      leftJawBlock.localTransform,
      Math.PI / 6,
      [0, 1, 0]
    );
    mat4.scale(
      leftJawBlock.localTransform,
      leftJawBlock.localTransform,
      [0.3, 0.2, 1.5]
    );

    mat4.translate(
      rightJawBlock.localTransform,
      rightJawBlock.localTransform,
      [0.3, 0.45, 0.3]
    );
    mat4.rotate(
      rightJawBlock.localTransform,
      rightJawBlock.localTransform,
      -Math.PI / 6,
      [0, 1, 0]
    );
    mat4.scale(
      rightJawBlock.localTransform,
      rightJawBlock.localTransform,
      [0.3, 0.2, 1.5]
    );

    mat4.translate(
      leftJawCover.localTransform,
      leftJawCover.localTransform,
      [-0.7, 0.6, -0.4]
    );
    mat4.scale(
      leftJawCover.localTransform,
      leftJawCover.localTransform,
      [0.2, 0.5, 0.3]
    );

    mat4.translate(
      rightJawCover.localTransform,
      rightJawCover.localTransform,
      [0.7, 0.6, -0.4]
    );
    mat4.scale(
      rightJawCover.localTransform,
      rightJawCover.localTransform,
      [0.2, 0.5, 0.3]
    );

    mat4.translate(
      innerMouthNode.localTransform,
      innerMouthNode.localTransform,
      [0, 0.6, -0.6]
    );
    mat4.scale(
      innerMouthNode.localTransform,
      innerMouthNode.localTransform,
      [0.45, 0.2, 1]
    );

    mat4.translate(
      chinCoverNode.localTransform,
      chinCoverNode.localTransform,
      [0, 0.3, 0.3]
    );
    mat4.rotate(
      chinCoverNode.localTransform,
      chinCoverNode.localTransform,
      Math.PI / 2,
      [1, 0, 0]
    );
    mat4.scale(
      chinCoverNode.localTransform,
      chinCoverNode.localTransform,
      [1.4, 1.4, 0.05]
    );

    mat4.translate(
      lowerToothL1.localTransform,
      lowerToothL1.localTransform,
      [-0.15, 0.65, 0.58]
    );
    mat4.scale(
      lowerToothL1.localTransform,
      lowerToothL1.localTransform,
      [1, 0.7, 1]
    );
    mat4.translate(
      lowerToothL2.localTransform,
      lowerToothL2.localTransform,
      [-0.36, 0.65, 0.28]
    );
    mat4.scale(
      lowerToothL2.localTransform,
      lowerToothL2.localTransform,
      [1, 0.7, 1]
    );
    mat4.translate(
      lowerToothL3.localTransform,
      lowerToothL3.localTransform,
      [-0.6, 0.65, -0.02]
    );
    mat4.scale(
      lowerToothL3.localTransform,
      lowerToothL3.localTransform,
      [1, 0.7, 1]
    );
    mat4.translate(
      lowerToothR1.localTransform,
      lowerToothR1.localTransform,
      [0.15, 0.65, 0.58]
    );
    mat4.scale(
      lowerToothR1.localTransform,
      lowerToothR1.localTransform,
      [1, 0.7, 1]
    );
    mat4.translate(
      lowerToothR2.localTransform,
      lowerToothR2.localTransform,
      [0.4, 0.65, 0.28]
    );
    mat4.scale(
      lowerToothR2.localTransform,
      lowerToothR2.localTransform,
      [1, 0.7, 1]
    );
    mat4.translate(
      lowerToothR3.localTransform,
      lowerToothR3.localTransform,
      [0.6, 0.65, -0.02]
    );
    mat4.scale(
      lowerToothR3.localTransform,
      lowerToothR3.localTransform,
      [1, 0.7, 1]
    );
    return jawRoot;
  })(gl);

  headRoot.addChild(upperHead);
  headRoot.addChild(lowerJaw);
  mat4.translate(
    headRoot.localTransform,
    headRoot.localTransform,
    [0, -0.78, 0]
  );

  return headRoot;
}

function createMegaGarchompTorso(gl) {
  const darkBlue = [0.18, 0.22, 0.38, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];
  const redOrange = [0.8, 0.15, 0.1, 1.0];
  const yellow = [1.0, 0.84, 0.0, 1.0];
  const white = [0.9, 0.9, 0.9, 1.0];

  const upperBodyMesh = new Mesh(
    gl,
    Prm.createEllipsoid(0.8, 1.2, 0.7, 32, 32)
  );
  const lowerBodyMesh = new Mesh(
    gl,
    Prm.createEllipsoid(0.81, 0.9, 0.73, 32, 32)
  );
  const shoulderMesh = new Mesh(
    gl,
    Prm.createEllipticParaboloid(0.8, 0.7, 1.5, 16)
  );
  const connectorMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.6, 0.5, 0.8, 1.8, 32, 32)
  );
  const chestPlateMesh = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));
  const waistPlateMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.6, 0.5, 0.8, 1.8, 32, 32)
  );
  const stomachPlateMesh1 = new Mesh(
    gl,
    Prm.createEllipsoid(1, 1, 1, 2.9, 100)
  );
  const stomachPlateMesh2 = new Mesh(gl, Prm.createEllipsoid(1, 1, 1, 32, 32));
  const spikeMesh = new Mesh(gl, Prm.createTriangularPrism(0.4, 0.6, 0.1));

  const torsoRoot = new SceneNode(null);
  const upperBodyNode = new SceneNode(upperBodyMesh, darkBlue);
  const lowerBodyNode = new SceneNode(lowerBodyMesh, darkBlue);
  const leftShoulderNode = new SceneNode(shoulderMesh, darkBlue);
  const rightShoulderNode = new SceneNode(shoulderMesh, darkBlue);
  const connectorNode = new SceneNode(connectorMesh, darkBlue);
  const chestPlateNode = new SceneNode(chestPlateMesh, redOrange);
  const waistPlateNode = new SceneNode(waistPlateMesh, redOrange);
  const stomachPlateNode1 = new SceneNode(stomachPlateMesh1, yellow);
  const stomachPlateNode2 = new SceneNode(stomachPlateMesh2, redOrange);
  const ChestSpikeNode1 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode2 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode3 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode4 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode5 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode6 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode7 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode8 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode9 = new SceneNode(spikeMesh, white);
  const ChestSpikeNode10 = new SceneNode(spikeMesh, white);

  torsoRoot.addChild(upperBodyNode);
  torsoRoot.addChild(lowerBodyNode);
  torsoRoot.addChild(leftShoulderNode);
  torsoRoot.addChild(rightShoulderNode);
  torsoRoot.addChild(connectorNode);
  torsoRoot.addChild(chestPlateNode);
  torsoRoot.addChild(waistPlateNode);
  torsoRoot.addChild(stomachPlateNode1);
  torsoRoot.addChild(stomachPlateNode2);
  torsoRoot.addChild(ChestSpikeNode1);
  torsoRoot.addChild(ChestSpikeNode2);
  torsoRoot.addChild(ChestSpikeNode3);
  torsoRoot.addChild(ChestSpikeNode4);
  torsoRoot.addChild(ChestSpikeNode5);
  torsoRoot.addChild(ChestSpikeNode6);
  torsoRoot.addChild(ChestSpikeNode7);
  torsoRoot.addChild(ChestSpikeNode8);
  torsoRoot.addChild(ChestSpikeNode9);
  torsoRoot.addChild(ChestSpikeNode10);

  mat4.translate(
    upperBodyNode.localTransform,
    upperBodyNode.localTransform,
    [0, 0.5, 0]
  );
  mat4.translate(
    lowerBodyNode.localTransform,
    lowerBodyNode.localTransform,
    [0, -1.5, 0]
  );
  mat4.translate(
    connectorNode.localTransform,
    connectorNode.localTransform,
    [0, -0.6, 0]
  );
  mat4.scale(
    connectorNode.localTransform,
    connectorNode.localTransform,
    [0.64, 0.3, 0.65]
  );
  mat4.translate(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    [-1.4, 1.36, 0]
  );
  mat4.rotate(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    Math.PI / 2.2,
    [0, 0, -1]
  );
  mat4.rotate(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    Math.PI / 8,
    [0, 1, -3]
  );
  mat4.scale(
    leftShoulderNode.localTransform,
    leftShoulderNode.localTransform,
    [0.78, 0.8, 0.75]
  );
  mat4.translate(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    [1.4, 1.36, 0]
  );
  mat4.rotate(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    -Math.PI / 2.2,
    [0, 0, -1]
  );
  mat4.rotate(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    -Math.PI / 8,
    [0, 1, -3]
  );
  mat4.scale(
    rightShoulderNode.localTransform,
    rightShoulderNode.localTransform,
    [0.78, 0.8, 0.75]
  );
  mat4.translate(
    chestPlateNode.localTransform,
    chestPlateNode.localTransform,
    [0, 0.5, 0.15]
  );
  mat4.scale(
    chestPlateNode.localTransform,
    chestPlateNode.localTransform,
    [0.64, 1.2, 0.75]
  );
  mat4.translate(
    waistPlateNode.localTransform,
    waistPlateNode.localTransform,
    [0, -0.6, 0.05]
  );
  mat4.scale(
    waistPlateNode.localTransform,
    waistPlateNode.localTransform,
    [0.6, 1.2, 0.65]
  );
  mat4.translate(
    stomachPlateNode1.localTransform,
    stomachPlateNode1.localTransform,
    [0, -1.26, 0.29]
  );
  mat4.scale(
    stomachPlateNode1.localTransform,
    stomachPlateNode1.localTransform,
    [0.5, 0.65, 0.5]
  );
  mat4.translate(
    stomachPlateNode2.localTransform,
    stomachPlateNode2.localTransform,
    [0, -1.26, 0.12]
  );
  mat4.scale(
    stomachPlateNode2.localTransform,
    stomachPlateNode2.localTransform,
    [0.62, 0.68, 0.5]
  );
  mat4.translate(
    ChestSpikeNode1.localTransform,
    ChestSpikeNode1.localTransform,
    [0.65, 1.1, 0.45]
  );
  mat4.scale(
    ChestSpikeNode1.localTransform,
    ChestSpikeNode1.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode1.localTransform,
    ChestSpikeNode1.localTransform,
    -Math.PI / 2.6,
    [0, 0, 1]
  );

  mat4.translate(
    ChestSpikeNode2.localTransform,
    ChestSpikeNode2.localTransform,
    [-0.65, 1.1, 0.45]
  );
  mat4.scale(
    ChestSpikeNode2.localTransform,
    ChestSpikeNode2.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode2.localTransform,
    ChestSpikeNode2.localTransform,
    -Math.PI / 2.6,
    [0, 0, -1]
  );

  mat4.translate(
    ChestSpikeNode3.localTransform,
    ChestSpikeNode3.localTransform,
    [0.7, 0.55, 0.47]
  );
  mat4.scale(
    ChestSpikeNode3.localTransform,
    ChestSpikeNode3.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode3.localTransform,
    ChestSpikeNode3.localTransform,
    -Math.PI / 2.2,
    [0, 0, 1]
  );

  mat4.translate(
    ChestSpikeNode4.localTransform,
    ChestSpikeNode4.localTransform,
    [-0.7, 0.55, 0.47]
  );
  mat4.scale(
    ChestSpikeNode4.localTransform,
    ChestSpikeNode4.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode4.localTransform,
    ChestSpikeNode4.localTransform,
    -Math.PI / 2.2,
    [0, 0, -1]
  );

  mat4.translate(
    ChestSpikeNode5.localTransform,
    ChestSpikeNode5.localTransform,
    [0.6, 0.03, 0.45]
  );
  mat4.scale(
    ChestSpikeNode5.localTransform,
    ChestSpikeNode5.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode5.localTransform,
    ChestSpikeNode5.localTransform,
    -Math.PI / 2,
    [0, 0, 1]
  );

  mat4.translate(
    ChestSpikeNode6.localTransform,
    ChestSpikeNode6.localTransform,
    [-0.6, 0.03, 0.45]
  );
  mat4.scale(
    ChestSpikeNode6.localTransform,
    ChestSpikeNode6.localTransform,
    [0.6, 1.5, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode6.localTransform,
    ChestSpikeNode6.localTransform,
    -Math.PI / 2,
    [0, 0, -1]
  );

  mat4.translate(
    ChestSpikeNode7.localTransform,
    ChestSpikeNode7.localTransform,
    [0.45, -0.45, 0.3]
  );
  mat4.scale(
    ChestSpikeNode7.localTransform,
    ChestSpikeNode7.localTransform,
    [0.4, 0.9, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode7.localTransform,
    ChestSpikeNode7.localTransform,
    -Math.PI / 1.7,
    [0, 0, 1]
  );

  mat4.translate(
    ChestSpikeNode8.localTransform,
    ChestSpikeNode8.localTransform,
    [-0.45, -0.45, 0.3]
  );
  mat4.scale(
    ChestSpikeNode8.localTransform,
    ChestSpikeNode8.localTransform,
    [0.4, 0.9, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode8.localTransform,
    ChestSpikeNode8.localTransform,
    -Math.PI / 1.7,
    [0, 0, -1]
  );

  mat4.translate(
    ChestSpikeNode9.localTransform,
    ChestSpikeNode9.localTransform,
    [0.4, -0.63, 0.23]
  );
  mat4.scale(
    ChestSpikeNode9.localTransform,
    ChestSpikeNode9.localTransform,
    [0.4, 0.4, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode9.localTransform,
    ChestSpikeNode9.localTransform,
    -Math.PI / 2,
    [0, 0, 1]
  );

  mat4.translate(
    ChestSpikeNode10.localTransform,
    ChestSpikeNode10.localTransform,
    [-0.4, -0.63, 0.23]
  );
  mat4.scale(
    ChestSpikeNode10.localTransform,
    ChestSpikeNode10.localTransform,
    [0.4, 0.4, 0.2]
  );
  mat4.rotate(
    ChestSpikeNode10.localTransform,
    ChestSpikeNode10.localTransform,
    -Math.PI / 2,
    [0, 0, -1]
  );

  const tailData = createMegaGarchompAnimatedTail(gl);
  torsoRoot.addChild(tailData.root);

  mat4.translate(
    tailData.root.localTransform,
    tailData.root.localTransform,
    [0, -1.5, 0.5]
  );

  torsoRoot.tailJoints = tailData.joints;
  torsoRoot.tailSegmentLength = tailData.segmentLength;

  return torsoRoot;
}

function createMegaGarchompAnimatedTail(gl) {
  const cfg = GarchompAnatomy;
  const tailRoot = new SceneNode(null);
  tailRoot.name = "MegaTailRoot";

  const numSegments = 12;
  const segmentLength = 0.6;

  const tailProfile = [
    [0.0, 0.9],
    [0.6, 0.6],
    [0.9, 0.0],
    [0.6, -0.6],
    [0.0, -0.9],
    [-0.6, -0.6],
    [-0.9, 0.0],
    [-0.6, 0.6],
  ];

  const joints = [];
  let previousJoint = tailRoot;

  for (let i = 0; i < numSegments; i++) {
    const t = i / numSegments;
    const scaleStart = 1.0 - t;
    const scaleEnd = 1.0 - (i + 1) / numSegments;

    const segPath = [
      [0, 0, 0],
      [0, 0, -segmentLength],
    ];
    const segScales = [scaleStart, scaleEnd];

    const segmentGeom = Curves.createTaperedSweptSurface(
      tailProfile,
      segPath,
      segScales,
      true
    );
    const segmentMesh = new Mesh(gl, segmentGeom);

    const jointNode = new SceneNode(null);
    jointNode.name = `MegaTailJoint${i}`;

    jointNode._segmentLength = segmentLength;
    jointNode._segmentIndex = i;

    const segmentNode = new SceneNode(segmentMesh, cfg.colors.darkBlue);
    jointNode.addChild(segmentNode);

    if (i > 0) {
      mat4.translate(jointNode.localTransform, jointNode.localTransform, [
        0,
        0,
        -segmentLength,
      ]);
    }

    previousJoint.addChild(jointNode);
    joints.push(jointNode);
    previousJoint = jointNode;
  }

  const finProfile = [
    [0, 0.45],
    [0.2, 0],
    [0, -0.45],
    [-0.15, 0],
  ];

  const leftFin_p0 = [0, 0, 0];
  const leftFin_p1 = [0.7, 0.15, -0.7];
  const leftFin_p2 = [1.3, 0.0, -1.3];
  const leftFin_p3 = [1.9, -0.25, -1.9];

  const leftFinPath = [];
  const leftFinScales = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    leftFinPath.push(
      Curves.getBezierPoint(t, leftFin_p0, leftFin_p1, leftFin_p2, leftFin_p3)
    );
    leftFinScales.push(1.0 - t);
  }

  const leftFinMesh = new Mesh(
    gl,
    Curves.createTaperedSweptSurface(
      finProfile,
      leftFinPath,
      leftFinScales,
      true
    )
  );
  const leftFinNode = new SceneNode(leftFinMesh, cfg.colors.darkBlue);

  const rightFin_p0 = [0, 0, 0];
  const rightFin_p1 = [-0.7, 0.15, -0.7];
  const rightFin_p2 = [-1.3, 0.0, -1.3];
  const rightFin_p3 = [-1.9, -0.25, -1.9];

  const rightFinPath = [];
  const rightFinScales = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    rightFinPath.push(
      Curves.getBezierPoint(
        t,
        rightFin_p0,
        rightFin_p1,
        rightFin_p2,
        rightFin_p3
      )
    );
    rightFinScales.push(1.0 - t);
  }

  const rightFinMesh = new Mesh(
    gl,
    Curves.createTaperedSweptSurface(
      finProfile,
      rightFinPath,
      rightFinScales,
      true
    )
  );
  const rightFinNode = new SceneNode(rightFinMesh, cfg.colors.darkBlue);

  if (joints.length > 6) {
    const midJoint = joints[6];

    // Left fin
    midJoint.addChild(leftFinNode);
    mat4.translate(
      leftFinNode.localTransform,
      leftFinNode.localTransform,
      [0, 0.1, -0.5]
    );
    mat4.rotate(
      leftFinNode.localTransform,
      leftFinNode.localTransform,
      -Math.PI / 2.2,
      [-1, -1, 0]
    );
    mat4.scale(
      leftFinNode.localTransform,
      leftFinNode.localTransform,
      [1.1, 1.1, 0.5]
    );

    // Right fin
    midJoint.addChild(rightFinNode);
    mat4.translate(
      rightFinNode.localTransform,
      rightFinNode.localTransform,
      [0, 0.1, -0.5]
    );
    mat4.rotate(
      rightFinNode.localTransform,
      rightFinNode.localTransform,
      Math.PI / 1.25,
      [1, 1, 1]
    );
    mat4.scale(
      rightFinNode.localTransform,
      rightFinNode.localTransform,
      [1.1, 1.1, 0.12]
    );
  }

  return { root: tailRoot, joints: joints, segmentLength: segmentLength };
}

function createMegaGarchompLeftLeg(gl) {
  const darkBlue = [0.18, 0.22, 0.38, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];
  const white = [0.9, 0.9, 0.9, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];
  const redOrange = [0.8, 0.15, 0.1, 1.0];

  const thighMesh = new Mesh(gl, Prm.createEllipsoid(0.5, 0.8, 0.5, 32, 32));
  const shinMesh = new Mesh(gl, Prm.createEllipsoid(0.5, 0.5, 0.5, 32, 32));
  const shinConnectorMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.3, 0.3, 0.5, 0.4, 16, 16)
  );
  const footMesh = new Mesh(gl, Prm.createTrapezoidalPrism(0.8, 0.6, 0.3, 0.9));
  const spikeMesh = new Mesh(gl, Prm.createCone(0.2, 0.8, 16));

  const legRoot = new SceneNode(null);
  legRoot.name = "LeftLegRoot";

  const thighNode = new SceneNode(thighMesh, darkBlue);
  thighNode.name = "LeftThigh";

  const shinConnectorNode = new SceneNode(shinConnectorMesh, darkBlue);
  const shinNode = new SceneNode(shinMesh, darkBlue);
  shinNode.name = "LeftShin";

  const footNode = new SceneNode(footMesh, darkBlue);
  footNode.name = "LeftFoot";

  const thighSpikeNode = new SceneNode(spikeMesh, white);
  const thighSpikeNode2 = new SceneNode(spikeMesh, white);
  const thighSpikeNode3 = new SceneNode(spikeMesh, redOrange);
  const footSpikeNode = new SceneNode(spikeMesh, white);
  const footSpikeNode2 = new SceneNode(spikeMesh, white);
  const footSpikeNode3 = new SceneNode(spikeMesh, white);

  legRoot.addChild(thighNode);
  thighNode.addChild(shinConnectorNode);
  thighNode.addChild(thighSpikeNode);
  thighNode.addChild(thighSpikeNode2);
  thighNode.addChild(thighSpikeNode3);
  shinConnectorNode.addChild(shinNode);

  shinNode.addChild(footNode);

  footNode.addChild(footSpikeNode);
  footNode.addChild(footSpikeNode2);
  footNode.addChild(footSpikeNode3);

  mat4.scale(
    thighNode.localTransform,
    thighNode.localTransform,
    [1.15, 1.5, 1.5]
  );
  mat4.translate(
    thighNode.localTransform,
    thighNode.localTransform,
    [1.1, 0, 0]
  );
  mat4.rotate(
    thighNode.localTransform,
    thighNode.localTransform,
    Math.PI / 6,
    [-1, 0, 1]
  );

  mat4.translate(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    [0, -0.4, -0.5]
  );
  mat4.rotate(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    [1, 1, 0.75]
  );

  mat4.translate(
    shinNode.localTransform,
    shinNode.localTransform,
    [0, -0.3, 0.22]
  );
  mat4.scale(shinNode.localTransform, shinNode.localTransform, [0.8, 0.4, 1.2]);

  mat4.translate(
    footNode.localTransform,
    footNode.localTransform,
    [0, -0.5, -0.2]
  );
  mat4.scale(footNode.localTransform, footNode.localTransform, [1, 1, 1]);
  mat4.rotate(footNode.localTransform, footNode.localTransform, 5, [1, 0, 0]);
  mat4.rotate(
    footNode.localTransform,
    footNode.localTransform,
    0.35,
    [0, 0, -1]
  );
  mat4.translate(
    footNode.localTransform,
    footNode.localTransform,
    [0, -0.4, 1]
  );

  mat4.translate(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    [0.2, 0.2, 0.6]
  );
  mat4.rotate(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    -Math.PI / 1.2,
    [0, 1, 1]
  );
  mat4.scale(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    [0.4, 0.4, 0.7]
  );

  mat4.translate(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    [0.1, -0.3, 0.6]
  );
  mat4.rotate(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    -Math.PI / 1.2,
    [0, 1, 1]
  );
  mat4.scale(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    [0.4, 0.4, 0.7]
  );

  mat4.translate(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    [0, -0.93, 0.2]
  );
  mat4.rotate(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    Math.PI / 1.2,
    [1, 0, 0]
  );
  mat4.scale(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    [0.7, 0.7, 1]
  );

  mat4.translate(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    [0.2, -0.01, 0.8]
  );
  mat4.rotate(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.scale(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    [0.8, 1, 0.8]
  );

  mat4.translate(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    [-0.01, -0.01, 0.8]
  );
  mat4.rotate(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.scale(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    [0.8, 1, 0.8]
  );

  mat4.translate(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    [-0.2, -0.01, 0.8]
  );
  mat4.rotate(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.scale(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    [0.8, 1, 0.8]
  );

  legRoot.joints = {
    thigh: thighNode,
    shin: shinNode,
    foot: footNode,
  };

  return legRoot;
}

function createMegaGarchompRightLeg(gl) {
  const darkBlue = [0.18, 0.22, 0.38, 1.0];
  const white = [0.9, 0.9, 0.9, 1.0];
  const redOrange = [0.8, 0.15, 0.1, 1.0];

  const thighMesh = new Mesh(gl, Prm.createEllipsoid(0.5, 0.8, 0.5, 32, 32));
  const shinMesh = new Mesh(gl, Prm.createEllipsoid(0.5, 0.5, 0.5, 32, 32));
  const shinConnectorMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.3, 0.3, 0.5, 0.4, 16, 16)
  );
  const footMesh = new Mesh(gl, Prm.createTrapezoidalPrism(0.8, 0.6, 0.3, 0.9));
  const spikeMesh = new Mesh(gl, Prm.createCone(0.2, 0.8, 16));

  const legRoot = new SceneNode(null);
  legRoot.name = "RightLegRoot";

  const thighNode = new SceneNode(thighMesh, darkBlue);
  thighNode.name = "RightThigh";

  const shinConnectorNode = new SceneNode(shinConnectorMesh, darkBlue);
  const shinNode = new SceneNode(shinMesh, darkBlue);
  shinNode.name = "RightShin";

  const footNode = new SceneNode(footMesh, darkBlue);
  footNode.name = "RightFoot";

  const thighSpikeNode = new SceneNode(spikeMesh, white);
  const thighSpikeNode2 = new SceneNode(spikeMesh, white);
  const thighSpikeNode3 = new SceneNode(spikeMesh, redOrange);
  const footSpikeNode = new SceneNode(spikeMesh, white);
  const footSpikeNode2 = new SceneNode(spikeMesh, white);
  const footSpikeNode3 = new SceneNode(spikeMesh, white);

  legRoot.addChild(thighNode);
  thighNode.addChild(shinConnectorNode);
  thighNode.addChild(thighSpikeNode);
  thighNode.addChild(thighSpikeNode2);
  thighNode.addChild(thighSpikeNode3);
  shinConnectorNode.addChild(shinNode);

  shinNode.addChild(footNode);

  footNode.addChild(footSpikeNode);
  footNode.addChild(footSpikeNode2);
  footNode.addChild(footSpikeNode3);

  mat4.scale(
    thighNode.localTransform,
    thighNode.localTransform,
    [1.15, 1.5, 1.5]
  );
  mat4.translate(
    thighNode.localTransform,
    thighNode.localTransform,
    [-1.1, 0, 0]
  );
  mat4.rotate(
    thighNode.localTransform,
    thighNode.localTransform,
    Math.PI / 5,
    [-1, 0, -1]
  );

  mat4.translate(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    [0, -0.4, -0.5]
  );
  mat4.rotate(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(
    shinConnectorNode.localTransform,
    shinConnectorNode.localTransform,
    [1, 1, 0.75]
  );

  mat4.translate(
    shinNode.localTransform,
    shinNode.localTransform,
    [0, -0.3, 0.22]
  );
  mat4.scale(shinNode.localTransform, shinNode.localTransform, [0.8, 0.4, 1.2]);

  mat4.translate(
    footNode.localTransform,
    footNode.localTransform,
    [0, -0.5, -0.2]
  ); // ADJUSTED
  mat4.scale(footNode.localTransform, footNode.localTransform, [1, 1, 1]);
  mat4.rotate(footNode.localTransform, footNode.localTransform, 5, [1, 0, 0]);
  mat4.rotate(
    footNode.localTransform,
    footNode.localTransform,
    0.35,
    [0, 0, 1]
  );
  mat4.translate(
    footNode.localTransform,
    footNode.localTransform,
    [0, -0.4, 1]
  );

  mat4.translate(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    [-0.2, 0.2, 0.6]
  );
  mat4.rotate(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    Math.PI / 1.2,
    [0, 1, 1]
  );
  mat4.scale(
    thighSpikeNode.localTransform,
    thighSpikeNode.localTransform,
    [0.4, 0.4, 0.7]
  );

  mat4.translate(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    [-0.1, -0.3, 0.6]
  );
  mat4.rotate(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    Math.PI / 1.2,
    [0, 1, 1]
  );
  mat4.scale(
    thighSpikeNode2.localTransform,
    thighSpikeNode2.localTransform,
    [0.4, 0.4, 0.7]
  );

  mat4.translate(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    [0, -0.93, 0.2]
  );
  mat4.rotate(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    Math.PI / 1.2,
    [1, 0, 0]
  );
  mat4.scale(
    thighSpikeNode3.localTransform,
    thighSpikeNode3.localTransform,
    [0.7, 0.7, 1]
  );

  mat4.translate(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    [-0.2, -0.01, 0.8]
  );
  mat4.rotate(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.scale(
    footSpikeNode.localTransform,
    footSpikeNode.localTransform,
    [0.8, 1, 0.8]
  );

  mat4.translate(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    [0.01, -0.01, 0.8]
  );
  mat4.rotate(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.scale(
    footSpikeNode2.localTransform,
    footSpikeNode2.localTransform,
    [0.8, 1, 0.8]
  );

  mat4.translate(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    [0.2, -0.01, 0.8]
  );
  mat4.rotate(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    -Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.scale(
    footSpikeNode3.localTransform,
    footSpikeNode3.localTransform,
    [0.8, 1, 0.8]
  );

  legRoot.joints = {
    thigh: thighNode,
    shin: shinNode,
    foot: footNode,
  };

  return legRoot;
}

function createDorsalFin(gl) {
  const darkBlue = [0.18, 0.22, 0.38, 1.0];
  const lightBlue = [0.6, 0.6, 1.0, 1.0];

  const finShapePoints = [
    [0.06, 0, 2.87], // A
    [1.6, 0, 2.97], // D
    [3.32, 0, 3.17], // E
    [4.4, 0, 3.09], // F
    [5.38, 0, 2.91], // G
    [6.5, 0, 2.57], // H
    [7.56, 0, 2.19], // I

    [6.08, 0, 1.65], // J
    [5.14, 0, 1.93], // K
    [4.24, 0, 2.03], // L
    [5.22, 0, 1.41], // M
    [3.86, 0, 0.91], // N
    [3.02, 0, 1.23], // O
    [2.22, 0, 1.41], // P
    [3.02, 0, 0.63], // Q
    [1.78, 0, 0.17], // R
    [0.02, 0, 0.71], // S
  ];

  const finMesh = new Mesh(gl, Prm.createExtrudedShape(finShapePoints, 0.2));

  const dorsalFinRoot = new SceneNode(finMesh, darkBlue);

  mat4.rotate(
    dorsalFinRoot.localTransform,
    dorsalFinRoot.localTransform,
    Math.PI / 2,
    [-1, 0, 0]
  );
  mat4.rotate(
    dorsalFinRoot.localTransform,
    dorsalFinRoot.localTransform,
    Math.PI / 2,
    [0, 0, 1]
  );

  mat4.scale(
    dorsalFinRoot.localTransform,
    dorsalFinRoot.localTransform,
    [0.4, 0.4, 0.4]
  );
  mat4.translate(
    dorsalFinRoot.localTransform,
    dorsalFinRoot.localTransform,
    [1, 0, 0]
  );

  return dorsalFinRoot;
}

function createMegaGarchompRightArm(gl) {
  const darkBlue = [0.18, 0.22, 0.38, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];

  const armProfile = [];
  const armRadius = 0.3;
  const armSides = 16;
  for (let i = 0; i <= armSides; i++) {
    const angle = (i / armSides) * 2 * Math.PI;
    armProfile.push([Math.cos(angle) * armRadius, Math.sin(angle) * armRadius]);
  }

  const arm_p0 = [0, 0, 0];
  const arm_p1 = [-0.1, -0.4, 0];
  const arm_p2 = [-0.1, -1.0, 0];
  const arm_p3 = [-0.2, -1.5, 0];
  const armPath = [];
  const armSegments = 10;
  for (let i = 0; i <= armSegments; i++) {
    const t = i / armSegments;
    armPath.push(Crv.getBezierPoint(t, arm_p0, arm_p1, arm_p2, arm_p3));
  }
  const upperArmMesh = new Mesh(
    gl,
    Crv.createSweptSurface(armProfile, armPath, true)
  );
  const elbowMesh = new Mesh(gl, Prm.createEllipsoid(0.4, 0.25, 0.35, 16, 16));
  const forearmMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.2, 0.2, 0.3, 0.5, 16, 16)
  );
  const wristJointMesh = new Mesh(
    gl,
    Prm.createEllipsoid(0.26, 0.1, 0.3, 16, 16)
  );

  const finW = 0.6,
    finH = 0.7,
    topBulge = 0.12,
    bottomBulge = 0.18,
    leftBulge = 0.1;
  const finSegU = 24,
    finSegV = 10,
    finT = 0.2;
  const finGeom = Prm.createSailCoons3D(
    finW,
    finH,
    topBulge,
    bottomBulge,
    leftBulge,
    finSegU,
    finSegV,
    finT
  );
  const finMesh = new Mesh(gl, finGeom);

  // --- NODES & HIERARCHY ---
  const armRoot = new SceneNode(null);
  const upperArmNode = new SceneNode(upperArmMesh, darkBlue);
  const elbowNode = new SceneNode(elbowMesh, darkBlue);
  const rightFore = new SceneNode(forearmMesh, darkBlue);
  const wristJointNode = new SceneNode(wristJointMesh, darkBlue);
  const rightFin = new SceneNode(finMesh, darkBlue);
  const finInnerNode = new SceneNode(finMesh, red);

  armRoot.addChild(upperArmNode);
  upperArmNode.addChild(elbowNode);
  elbowNode.addChild(rightFore);
  rightFore.addChild(wristJointNode);
  wristJointNode.addChild(rightFin);
  wristJointNode.addChild(finInnerNode);

  mat4.translate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    [1, 1, 0]
  );
  mat4.rotate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    Math.PI / 3.6,
    [0, 0, 1]
  );
  mat4.rotate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    Math.PI / 8,
    [0, 1, 0]
  );
  mat4.scale(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    [0.7, 0.7, 0.7]
  );
  mat4.translate(elbowNode.localTransform, elbowNode.localTransform, arm_p3);

  mat4.translate(
    rightFore.localTransform,
    rightFore.localTransform,
    [0, 0, 0.8]
  );
  mat4.rotate(
    rightFore.localTransform,
    rightFore.localTransform,
    -Math.PI / 6,
    [0, 0, 1]
  );
  mat4.rotate(
    rightFore.localTransform,
    rightFore.localTransform,
    -Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(rightFore.localTransform, rightFore.localTransform, [0.8, 2.5, 1]);

  mat4.translate(
    wristJointNode.localTransform,
    wristJointNode.localTransform,
    [0, -0.25, 0]
  );

  mat4.translate(rightFin.localTransform, rightFin.localTransform, [0, 0, 0]);
  mat4.rotate(rightFin.localTransform, rightFin.localTransform, -4, [0, 1, 0]);
  mat4.rotate(rightFin.localTransform, rightFin.localTransform, -2, [0, 0, -1]);
  mat4.scale(rightFin.localTransform, rightFin.localTransform, [-2.5, 2, 0.9]);

  mat4.translate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    [0, 0.23, 0]
  );
  mat4.rotate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    -4,
    [0, 1, 0]
  );
  mat4.rotate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    -2,
    [0, 0, -1]
  );
  mat4.scale(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    [-3.2, 3.2, 0.1]
  );

  return armRoot;
}

function createMegaGarchompLeftArm(gl) {
  const darkBlue = [0.18, 0.22, 0.38, 1.0];
  const white = [0.9, 0.9, 0.9, 1.0];
  const red = [0.8, 0.15, 0.1, 1.0];

  const armProfile = [];
  const armRadius = 0.3;
  const armSides = 16;
  for (let i = 0; i <= armSides; i++) {
    const angle = (i / armSides) * 2 * Math.PI;
    armProfile.push([Math.cos(angle) * armRadius, Math.sin(angle) * armRadius]);
  }

  const arm_p0 = [0, 0, 0];
  const arm_p1 = [0.1, -0.4, 0];
  const arm_p2 = [0.1, -1.0, 0];
  const arm_p3 = [0.2, -1.5, 0];
  const armPath = [];
  const armSegments = 10;
  for (let i = 0; i <= armSegments; i++) {
    const t = i / armSegments;
    armPath.push(Crv.getBezierPoint(t, arm_p0, arm_p1, arm_p2, arm_p3));
  }
  const upperArmMesh = new Mesh(
    gl,
    Crv.createSweptSurface(armProfile, armPath, true)
  );
  const elbowMesh = new Mesh(gl, Prm.createEllipsoid(0.4, 0.25, 0.35, 16, 16));
  const forearmMesh = new Mesh(
    gl,
    Prm.createHyperboloidOneSheet(0.2, 0.2, 0.3, 0.5, 16, 16)
  );

  const wristJointMesh = new Mesh(
    gl,
    Prm.createEllipsoid(0.26, 0.1, 0.3, 16, 16)
  );

  const finW = 0.6,
    finH = 0.7,
    topBulge = 0.12,
    bottomBulge = 0.18,
    leftBulge = 0.1;
  const finSegU = 24,
    finSegV = 10,
    finT = 0.2;
  const finGeom = Prm.createSailCoons3D(
    finW,
    finH,
    topBulge,
    bottomBulge,
    leftBulge,
    finSegU,
    finSegV,
    finT
  );
  const finMesh = new Mesh(gl, finGeom);

  const armRoot = new SceneNode(null);
  const upperArmNode = new SceneNode(upperArmMesh, darkBlue);
  const elbowNode = new SceneNode(elbowMesh, darkBlue);
  const leftFore = new SceneNode(forearmMesh, darkBlue);

  const wristJointNode = new SceneNode(wristJointMesh, darkBlue);

  const leftFin = new SceneNode(finMesh, darkBlue);
  const finInnerNode = new SceneNode(finMesh, red);

  armRoot.addChild(upperArmNode);
  upperArmNode.addChild(elbowNode);
  elbowNode.addChild(leftFore);

  leftFore.addChild(wristJointNode);
  wristJointNode.addChild(leftFin);
  wristJointNode.addChild(finInnerNode);

  mat4.translate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    [-1, 1, 0]
  );
  mat4.rotate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    -Math.PI / 3.6,
    [0, 0, 1]
  );
  mat4.rotate(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    -Math.PI / 8,
    [0, 1, 0]
  );
  mat4.scale(
    upperArmNode.localTransform,
    upperArmNode.localTransform,
    [0.7, 0.7, 0.7]
  );
  mat4.translate(elbowNode.localTransform, elbowNode.localTransform, arm_p3);

  mat4.translate(leftFore.localTransform, leftFore.localTransform, [0, 0, 0.8]);
  mat4.rotate(
    leftFore.localTransform,
    leftFore.localTransform,
    Math.PI / 6,
    [0, 0, 1]
  );
  mat4.rotate(
    leftFore.localTransform,
    leftFore.localTransform,
    -Math.PI / 2,
    [1, 0, 0]
  );
  mat4.scale(leftFore.localTransform, leftFore.localTransform, [0.8, 2.5, 1]);

  mat4.translate(
    wristJointNode.localTransform,
    wristJointNode.localTransform,
    [0, -0.25, 0]
  );

  mat4.translate(leftFin.localTransform, leftFin.localTransform, [0, 0, 0]);
  mat4.rotate(leftFin.localTransform, leftFin.localTransform, 4, [0, 1, 0]);
  mat4.rotate(leftFin.localTransform, leftFin.localTransform, 2, [0, 0, -1]);
  mat4.scale(leftFin.localTransform, leftFin.localTransform, [2.5, 2, 0.9]);

  mat4.translate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    [0, 0.23, 0]
  );
  mat4.rotate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    4,
    [0, 1, 0]
  );
  mat4.rotate(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    2,
    [0, 0, -1]
  );
  mat4.scale(
    finInnerNode.localTransform,
    finInnerNode.localTransform,
    [3.2, 3.2, 0.1]
  );
  return armRoot;
}

function createMegaGarchomp(gl) {
  const torso = createMegaGarchompTorso(gl);

  const leftLeg = createMegaGarchompLeftLeg(gl);
  const rightLeg = createMegaGarchompRightLeg(gl);
  const DorsalFin = createDorsalFin(gl);
  const rightArm = createMegaGarchompRightArm(gl);
  const leftArm = createMegaGarchompLeftArm(gl);
  const neck = createMegaGarchompNeck(gl);
  const head = createMegaGarchompHead(gl);

  neck.addChild(head);
  torso.addChild(DorsalFin);

  torso.addChild(rightArm);
  torso.addChild(leftArm);
  torso.addChild(neck);
  torso.addChild(leftLeg);
  torso.addChild(rightLeg);

  mat4.translate(
    leftLeg.localTransform,
    leftLeg.localTransform,
    [-0.5, -1.8, 0]
  );
  mat4.translate(
    rightLeg.localTransform,
    rightLeg.localTransform,
    [0.5, -1.8, 0]
  );
  mat4.rotate(
    rightLeg.localTransform,
    rightLeg.localTransform,
    Math.PI / 60,
    [1, 0, 0]
  );

  torso.name = "MEGA_GARCHOMP";
  torso.animationRig = {
    torso: torso,
    neck: neck,
    head: head,
    leftArm: leftArm,
    rightArm: rightArm,
    leftLeg: leftLeg,
    rightLeg: rightLeg,
    leftThigh: leftLeg.joints ? leftLeg.joints.thigh : null,
    leftShin: leftLeg.joints ? leftLeg.joints.shin : null,
    leftFoot: leftLeg.joints ? leftLeg.joints.foot : null,
    rightThigh: rightLeg.joints ? rightLeg.joints.thigh : null,
    rightShin: rightLeg.joints ? rightLeg.joints.shin : null,
    rightFoot: rightLeg.joints ? rightLeg.joints.foot : null,

    tailJoints: torso.tailJoints || [],
    tailSegmentLength: torso.tailSegmentLength || 0.7,

    dorsalFin: DorsalFin,
    jaw: head.children.find((child) => child.name === "LowerJaw"),
  };

  return torso;
}
