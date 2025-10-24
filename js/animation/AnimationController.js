class AnimationController {
  constructor(entityNode, config = {}) {
    this.entity = entityNode;
    this.rig = entityNode.animationRig || {};

    this.totalTime = 0;
    this.stateTime = 0;

    this.currentState = null;
    this.states = {};

    this.currentPos = config.startPos ? [...config.startPos] : [0, 0, 0];
    this.currentRotation = config.startRotation || 0;
    this.currentScale = [1, 1, 1];

    this.config = {
      startPos: [0, 0, 0],
      endPos: [0, 0, -10],
      ...config,
    };
  }

  update(deltaTime) {
    this.totalTime += deltaTime;
    this.stateTime += deltaTime;

    this.updateStateMachine(deltaTime);
    this.applyTransforms();
  }

  updateStateMachine(deltaTime) {
    console.warn("AnimationController.updateStateMachine() not implemented");
  }

  transitionTo(newState) {
    if (this.currentState) {
      console.log(`${this.entity.name}: ${this.currentState} -> ${newState}`);
    }
    this.currentState = newState;
    this.stateTime = 0;

    const stateHandler = this.states[newState];
    if (stateHandler?.onEnter) stateHandler.onEnter.call(this);
  }

  applyTransforms() {
    mat4.identity(this.entity.localTransform);

    mat4.translate(
      this.entity.localTransform,
      this.entity.localTransform,
      this.currentPos
    );
    mat4.rotateY(
      this.entity.localTransform,
      this.entity.localTransform,
      this.currentRotation
    );
    mat4.scale(
      this.entity.localTransform,
      this.entity.localTransform,
      this.currentScale
    );

    const cfg = window.entityConfig?.[this.entity.name];
    if (cfg?.scale) {
      mat4.scale(
        this.entity.localTransform,
        this.entity.localTransform,
        cfg.scale
      );
    }
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
  }

  lerpVec3(a, b, t) {
    return [
      this.lerp(a[0], b[0], t),
      this.lerp(a[1], b[1], t),
      this.lerp(a[2], b[2], t),
    ];
  }

  easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
  }

  easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = AnimationController;
}

window.AnimationController = AnimationController;

console.log("AnimationController v2.0 loaded");
