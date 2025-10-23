class GabiteSummonAnimator {
  /**
   * Controls the Pokéball opening + Gabite emergence sequence.
   * Supports optional colour groups so elements can flash white
   * and blend back to their palettes during the opening.
   */
  constructor({
    pokeballTopNode,
    gabiteScaleNode,
    gabiteLiftNode,
    gabiteOffsetNode = null,
    colorRootNode = null,
    colorGroups = [],
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
      pokeballMotionOffset: [0, 0, 0],
      pokeballTiltAngle: 0,
      pokeballMotionNode: null,
      gabiteOffsetStart: [0, 0, 0],
      gabiteOffsetTarget: [0, 0, 0],
      ...config,
    };

    this.pokeballTopNode = pokeballTopNode || null;
    this.gabiteScaleNode = gabiteScaleNode;
    this.gabiteLiftNode = gabiteLiftNode;
    this.gabiteOffsetNode = gabiteOffsetNode || null;

    this._topClosedMatrix = this.pokeballTopNode
      ? mat4.clone(this.pokeballTopNode.localTransform)
      : null;
    this._scaleBaseMatrix = mat4.clone(this.gabiteScaleNode.localTransform);
    this._liftBaseMatrix = mat4.clone(this.gabiteLiftNode.localTransform);
    this._offsetBaseMatrix = this.gabiteOffsetNode
      ? mat4.clone(this.gabiteOffsetNode.localTransform)
      : null;
    this._offsetStart = Array.isArray(this.config.gabiteOffsetStart)
      ? this.config.gabiteOffsetStart
      : [0, 0, 0];
    this._offsetTarget = Array.isArray(this.config.gabiteOffsetTarget)
      ? this.config.gabiteOffsetTarget
      : this._offsetStart;

    this.pokeballMotionNode = this.config.pokeballMotionNode || null;
    this._motionBaseMatrix = this.pokeballMotionNode
      ? mat4.clone(this.pokeballMotionNode.localTransform)
      : null;
    this._motionOffset = Array.isArray(this.config.pokeballMotionOffset)
      ? this.config.pokeballMotionOffset
      : [0, 0, 0];
    this._pokeballTiltAngle = this.config.pokeballTiltAngle || 0;

    this.totalTime = 0;
    this.stateTime = 0;
    this.state = "DELAY";

    this._colorGroups = [];
    this._initColorGroups(colorRootNode, colorGroups);

    this._setTopAngle(0);
    this._setGabiteScale(this.config.initialScale);
    this._setGabiteLift(this.config.initialLift);
    this._setGabiteOffset(0);
    this._setPokeballMotion(0);
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
        this._updateBlendGroups("opening", eased);
        this._setPokeballMotion(eased);
        if (t >= 1) this._transition("POST_OPEN_DELAY");
        break;
      }

      case "POST_OPEN_DELAY":
        this._updateBlendGroups("opening", 1);
        this._setPokeballMotion(1);
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
        this._setGabiteOffset(easedScale);

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
        this._setGabiteOffset(1);
        this._setPokeballMotion(1);
        this._restoreAllOriginalColors();
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
      this._applyInstantStartColors();
    }

    if (nextState === "FINISHED") {
      this._restoreAllOriginalColors();
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

  _setGabiteOffset(amount) {
    if (!this.gabiteOffsetNode || !this._offsetBaseMatrix) return;
    const t = Math.min(Math.max(amount, 0), 1);
    const sx = this._offsetStart[0] || 0;
    const sy = this._offsetStart[1] || 0;
    const sz = this._offsetStart[2] || 0;
    const tx = this._offsetTarget[0] || 0;
    const ty = this._offsetTarget[1] || 0;
    const tz = this._offsetTarget[2] || 0;

    mat4.copy(this.gabiteOffsetNode.localTransform, this._offsetBaseMatrix);
    mat4.translate(
      this.gabiteOffsetNode.localTransform,
      this.gabiteOffsetNode.localTransform,
      [
        sx + (tx - sx) * t,
        sy + (ty - sy) * t,
        sz + (tz - sz) * t,
      ]
    );
  }

  _setPokeballMotion(amount) {
    if (!this.pokeballMotionNode || !this._motionBaseMatrix) return;
    const t = Math.min(Math.max(amount, 0), 1);
    mat4.copy(this.pokeballMotionNode.localTransform, this._motionBaseMatrix);

    if (this._motionOffset) {
      mat4.translate(
        this.pokeballMotionNode.localTransform,
        this.pokeballMotionNode.localTransform,
        [
          (this._motionOffset[0] || 0) * t,
          (this._motionOffset[1] || 0) * t,
          (this._motionOffset[2] || 0) * t,
        ]
      );
    }

    if (this._pokeballTiltAngle) {
      mat4.rotateX(
        this.pokeballMotionNode.localTransform,
        this.pokeballMotionNode.localTransform,
        this._pokeballTiltAngle * t
      );
    }
  }

  _initColorGroups(legacyRoot, colorGroupsInput) {
    const groups = [];

    if (legacyRoot) {
      groups.push({
        root: legacyRoot,
        startColor: this.config.colorStartColor,
        mode: "instant",
        applyOn: "emerging",
      });
    }

    if (Array.isArray(colorGroupsInput)) {
      colorGroupsInput.forEach((entry) => {
        if (entry && entry.root) groups.push(entry);
      });
    }

    this._colorGroups = groups
      .map((entry) => this._createColorGroup(entry))
      .filter(Boolean);

    this._colorGroups.forEach((group) => {
      if (group.applyOn === "start" && !group.startApplied) {
        this._setGroupToStartColor(group);
        group.startApplied = true;
      }
    });
  }

  _createColorGroup({
    root,
    startColor,
    mode = "instant",
    applyOn,
    blendPhase,
  }) {
    const bindings = this._captureColorBindings(
      root,
      startColor || this.config.colorStartColor
    );
    if (!bindings || !bindings.length) return null;

    const normalizedMode = mode === "lerp" ? "lerp" : "instant";
    const normalizedApplyOn =
      applyOn || (normalizedMode === "lerp" ? "start" : "emerging");
    const normalizedBlendPhase =
      normalizedMode === "lerp" ? blendPhase || "opening" : null;

    return {
      bindings,
      mode: normalizedMode,
      applyOn: normalizedApplyOn,
      blendPhase: normalizedBlendPhase,
      startApplied: normalizedApplyOn === "start",
      blendComplete: normalizedMode !== "lerp",
      restored: false,
    };
  }

  _setGroupToStartColor(group) {
    group.bindings.forEach(({ node, startColor }) => {
      node.color = startColor.slice();
    });
  }

  _applyInstantStartColors() {
    this._colorGroups.forEach((group) => {
      if (group.mode === "instant" && !group.startApplied) {
        this._setGroupToStartColor(group);
        group.startApplied = true;
        group.restored = false;
      }
    });
  }

  _updateBlendGroups(phase, alpha) {
    const t = Math.min(Math.max(alpha, 0), 1);
    this._colorGroups.forEach((group) => {
      if (
        group.mode === "lerp" &&
        group.blendPhase === phase &&
        !group.restored
      ) {
        this._applyGroupBlend(group, t);
        if (t >= 1) group.blendComplete = true;
      }
    });
  }

  _applyGroupBlend(group, alpha) {
    group.bindings.forEach(({ node, startColor, originalColor }) => {
      const dst = node.color;
      dst[0] = startColor[0] + (originalColor[0] - startColor[0]) * alpha;
      dst[1] = startColor[1] + (originalColor[1] - startColor[1]) * alpha;
      dst[2] = startColor[2] + (originalColor[2] - startColor[2]) * alpha;
      dst[3] = startColor[3] + (originalColor[3] - startColor[3]) * alpha;
    });
  }

  _restoreAllOriginalColors() {
    this._colorGroups.forEach((group) => {
      if (group.restored) return;
      group.bindings.forEach(({ node, originalColor }) => {
        node.color = originalColor.slice();
      });
      group.restored = true;
      group.startApplied = false;
      group.blendComplete = true;
    });
  }

  _captureColorBindings(root, startColor) {
    const bindings = [];
    const stack = [root];
    while (stack.length) {
      const node = stack.pop();
      if (!node) continue;
      if (node.color) {
        bindings.push({
          node,
          originalColor: node.color.slice(),
          startColor: [
            startColor?.[0] ?? node.color[0],
            startColor?.[1] ?? node.color[1],
            startColor?.[2] ?? node.color[2],
            startColor?.[3] ?? node.color[3],
          ],
        });
      }
      if (node.children && node.children.length) {
        stack.push(...node.children);
      }
    }
    return bindings;
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
