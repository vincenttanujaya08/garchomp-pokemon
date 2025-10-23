class GabiteSummonAnimator {
  constructor({
    pokeballTopNode,
    gabiteScaleNode,
    gabiteLiftNode,
    colorRootNode = null,
    config = {},
  }) {
    this.config = {
      startDelay: 0.4,
      openDuration: 1.0,
      postOpenDelay: 0.2,
      emergeDuration: 1.4,
      openAngle: Math.PI * 0.85,
      initialScale: 0.05,
      finalScale: 3.0,
      initialLift: -1.4,
      finalLift: 0.0,
      colorStartColor: [1, 1, 1, 1],
      ...config,
    };

    this.pokeballTopNode = pokeballTopNode || null;
    this.gabiteScaleNode = gabiteScaleNode;
    this.gabiteLiftNode = gabiteLiftNode;
    this.colorRootNode = colorRootNode;

    this._topClosedMatrix = this.pokeballTopNode
      ? mat4.clone(this.pokeballTopNode.localTransform)
      : null;
    this._scaleBaseMatrix = mat4.clone(this.gabiteScaleNode.localTransform);
    this._liftBaseMatrix = mat4.clone(this.gabiteLiftNode.localTransform);

    this._colorStartColor = Array.isArray(this.config.colorStartColor)
      ? this.config.colorStartColor
      : [1, 1, 1, 1];
    this._colorBindings = this.colorRootNode
      ? this._captureColorBindings(this.colorRootNode)
      : null;

    this.totalTime = 0;
    this.stateTime = 0;
    this.state = "DELAY";
    this._startColorApplied = false;
    this._colorsRestored = false;

    this._setTopAngle(0);
    this._setGabiteScale(this.config.initialScale);
    this._setGabiteLift(this.config.initialLift);
  }

  update(dt) {
    this.totalTime += dt;
    this.stateTime += dt;

    switch (this.state) {
      case "DELAY":
        if (this.stateTime >= this.config.startDelay) {
          this._transition("OPENING");
        }
        break;

      case "OPENING": {
        const t = Math.min(
          this.stateTime / Math.max(this.config.openDuration, 1e-3),
          1
        );
        const eased = this._easeOutCubic(t);
        const angle = -this.config.openAngle * eased;
        this._setTopAngle(angle);
        if (t >= 1) this._transition("POST_OPEN_DELAY");
        break;
      }

      case "POST_OPEN_DELAY":
        if (this.stateTime >= this.config.postOpenDelay) {
          this._transition("EMERGING");
        }
        break;

      case "EMERGING": {
        const t = Math.min(
          this.stateTime / Math.max(this.config.emergeDuration, 1e-3),
          1
        );
        const easedScale = this._easeOutBack(t);
        const easedLift = this._easeOutCubic(t);

        const s =
          this.config.initialScale +
          (this.config.finalScale - this.config.initialScale) * easedScale;
        const lift =
          this.config.initialLift +
          (this.config.finalLift - this.config.initialLift) * easedLift;

        this._setGabiteScale(s);
        this._setGabiteLift(lift);

        if (t >= 1) {
          this._transition("FINISHED");
        }
        break;
      }

      case "FINISHED":
      default:
        this._setTopAngle(-this.config.openAngle);
        this._setGabiteScale(this.config.finalScale);
        this._setGabiteLift(this.config.finalLift);
        this._restoreOriginalColors();
        break;
    }
  }

  isFinished() {
    return this.state === "FINISHED";
  }

  _transition(nextState) {
    this.state = nextState;
    this.stateTime = 0;
    if (nextState === "EMERGING") {
      this._setStartColor();
    }
    if (nextState === "FINISHED") {
      this._restoreOriginalColors();
    }
  }

  _setTopAngle(angle) {
    if (!this.pokeballTopNode || !this._topClosedMatrix) return;
    mat4.copy(this.pokeballTopNode.localTransform, this._topClosedMatrix);
    mat4.rotateX(
      this.pokeballTopNode.localTransform,
      this.pokeballTopNode.localTransform,
      angle
    );
  }

  _setGabiteScale(scale) {
    mat4.copy(this.gabiteScaleNode.localTransform, this._scaleBaseMatrix);
    mat4.scale(this.gabiteScaleNode.localTransform, this.gabiteScaleNode.localTransform, [
      scale,
      scale,
      scale,
    ]);
  }

  _setGabiteLift(lift) {
    mat4.copy(this.gabiteLiftNode.localTransform, this._liftBaseMatrix);
    mat4.translate(this.gabiteLiftNode.localTransform, this.gabiteLiftNode.localTransform, [
      0,
      lift,
      0,
    ]);
  }

  _setStartColor() {
    if (!this._colorBindings || this._startColorApplied) return;
    for (const binding of this._colorBindings) {
      const { node, startColor } = binding;
      node.color = startColor.slice();
    }
    this._startColorApplied = true;
    this._colorsRestored = false;
  }

  _restoreOriginalColors() {
    if (!this._colorBindings || this._colorsRestored) return;
    for (const binding of this._colorBindings) {
      const { node, originalColor } = binding;
      node.color = originalColor.slice();
    }
    this._colorsRestored = true;
  }

  _captureColorBindings(root) {
    const bindings = [];
    const stack = [root];
    while (stack.length) {
      const node = stack.pop();
      if (node.color) {
        const original = node.color.slice();
        const startColor = [
          this._colorStartColor[0] ?? original[0],
          this._colorStartColor[1] ?? original[1],
          this._colorStartColor[2] ?? original[2],
          this._colorStartColor[3] ?? original[3],
        ];
        bindings.push({ node, originalColor: original, startColor });
      }
      if (node.children) stack.push(...node.children);
    }
    return bindings.length ? bindings : null;
  }

  _easeOutCubic(t) {
    const inv = 1 - t;
    return 1 - inv * inv * inv;
  }

  _easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    const inv = t - 1;
    return 1 + c3 * inv * inv * inv + c1 * inv * inv;
  }
}

window.GabiteSummonAnimator = GabiteSummonAnimator;
