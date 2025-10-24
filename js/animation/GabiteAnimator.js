const GabiteAnimState = {
  LOOK_AROUND: "LOOK_AROUND",
  CENTER_HEAD: "CENTER_HEAD",
  HOP_EXCITED: "HOP_EXCITED",
};

class GabiteAnimator extends AnimationController {
  constructor(gabiteNode, config = {}) {
    const defaults = {
      lookDuration: 2.0,
      neckTurnAngle: Math.PI / 4,
      centerDuration: 0.4,
      hopDuration: 2.0,
      hopCount: 2,
      hopHeight: 1.0,
      squatAmount: 0.15,
      tailSwayFreq: 0.5,
      tailSwayAmount: 0.12,
      tailBaseOffset: [0, -2.8, 1.0],
      tailRotationAxes: [
        {
          axis: [0, 1, 0],
          amplitudeMultiplier: 1,
          frequencyMultiplier: 1,
          wave: "sin",
          phase: 0,
          offset: 0,
        },
        {
          axis: [1, 0, 0],
          amplitudeMultiplier: 0.5,
          frequencyMultiplier: 0.7,
          wave: "cos",
          phase: 0,
          offset: 0,
        },
      ],
      bodyBobAmount: 0.06,
      armSwingAngle: Math.PI / 10,
    };
    super(gabiteNode, { ...defaults, ...config });
    Object.assign(this, this.config);
    this.tailBaseOffset = this._normalizeVec3(this.tailBaseOffset, 0);
    this.setTailRotationAxes(this.tailRotationAxes);
    this.rig = gabiteNode.animationRig || {};
    this.currentNeckRotation = 0;
    this._centerStart = 0;
    this._centerTarget = 0;
    this.captureBindPoses();

    this.states = {
      [GabiteAnimState.LOOK_AROUND]: {
        onEnter: () => {},
        onUpdate: (dt) => this.updateLookAround(dt),
        duration: this.lookDuration,
      },
      [GabiteAnimState.CENTER_HEAD]: {
        onEnter: () => {
          this._centerStart = this.currentNeckRotation || 0;
          this._centerTarget = 0;
        },
        onUpdate: (dt) => this.updateCenterHead(dt),
        duration: this.centerDuration,
      },
      [GabiteAnimState.HOP_EXCITED]: {
        onEnter: () => {
          this.resetToBind("leftThigh");
          this.resetToBind("rightThigh");
          this.resetToBind("leftArm");
          this.resetToBind("rightArm");
        },
        onUpdate: (dt) => this.updateHop(dt),
        duration: this.hopDuration,
      },
    };

    this.transitionTo(GabiteAnimState.LOOK_AROUND);
  }

  captureBindPoses() {
    this.bindPoses = {};
    [
      "body",
      "neck",
      "head",
      "leftThigh",
      "rightThigh",
      "leftShin",
      "rightShin",
      "leftFoot",
      "rightFoot",
      "tail",
      "leftArm",
      "rightArm",
    ].forEach((k) => {
      if (this.rig[k])
        this.bindPoses[k] = mat4.clone(this.rig[k].localTransform);
      if (k === "tail" && this.bindPoses.tail) {
        const m = this.bindPoses.tail;
        this._tailBindTranslation = [m[12] || 0, m[13] || 0, m[14] || 0];
      }
    });
  }

  resetToBind(k) {
    if (this.bindPoses[k] && this.rig[k])
      mat4.copy(this.rig[k].localTransform, this.bindPoses[k]);
  }

  setTailBaseOffset(offset) {
    this.tailBaseOffset = this._normalizeVec3(offset, 0);
  }

  setTailRotationAxes(axesConfig) {
    this.tailRotationAxes = axesConfig;
    this._tailRotationAxes = this._normalizeTailRotationAxes(axesConfig);
  }

  _normalizeTailRotationAxes(axesConfig) {
    if (axesConfig === false) return [];
    const entries = Array.isArray(axesConfig)
      ? axesConfig
      : axesConfig
      ? [axesConfig]
      : [];
    const normalized = entries
      .map((e) => this._createTailRotationEntry(e))
      .filter(Boolean);
    if (normalized.length) return normalized;
    return [
      {
        axis: [0, 1, 0],
        amplitude: this.tailSwayAmount,
        frequency: this.tailSwayFreq,
        wave: "sin",
        phase: 0,
        offset: 0,
        getAngle: null,
      },
      {
        axis: [1, 0, 0],
        amplitude: this.tailSwayAmount * 0.5,
        frequency: this.tailSwayFreq * 0.7,
        wave: "cos",
        phase: 0,
        offset: 0,
        getAngle: null,
      },
    ];
  }

  _createTailRotationEntry(entry) {
    if (!entry) return null;
    if (Array.isArray(entry)) entry = { axis: entry };
    const axis = entry.axis;
    if (!axis || axis.length < 3) return null;
    const [ax, ay, az] = axis;
    const length = Math.hypot(ax, ay, az);
    if (!isFinite(length) || length === 0) return null;

    const amplitude =
      entry.amplitude ??
      this.tailSwayAmount *
        (entry.amplitudeMultiplier !== undefined
          ? entry.amplitudeMultiplier
          : 1);
    const frequency =
      entry.frequency ??
      this.tailSwayFreq *
        (entry.frequencyMultiplier !== undefined
          ? entry.frequencyMultiplier
          : 1);

    const wave = (entry.wave || "sin").toLowerCase();
    const phase = entry.phase ?? 0;
    const offset = entry.offset ?? 0;
    const getAngle =
      typeof entry.getAngle === "function" ? entry.getAngle : null;

    return {
      axis: [ax / length, ay / length, az / length],
      amplitude,
      frequency,
      wave,
      phase,
      offset,
      getAngle,
    };
  }

  _computeTailRotationAngle(def, time) {
    if (def.getAngle) return def.getAngle(time, this) || 0;
    const base = time * def.frequency * Math.PI + def.phase;
    const waveValue = def.wave === "cos" ? Math.cos(base) : Math.sin(base);
    return waveValue * def.amplitude + def.offset;
  }

  _normalizeVec3(v, fallback = 0) {
    if (Array.isArray(v))
      return [
        Number.isFinite(v[0]) ? v[0] : fallback,
        Number.isFinite(v[1]) ? v[1] : fallback,
        Number.isFinite(v[2]) ? v[2] : fallback,
      ];
    return [fallback, fallback, fallback];
  }

  _ensureTailBindTranslation() {
    if (this._tailBindTranslation || !this.bindPoses || !this.bindPoses.tail)
      return;
    const m = this.bindPoses.tail;
    this._tailBindTranslation = [m[12] || 0, m[13] || 0, m[14] || 0];
  }

  _getTailAnchor() {
    this._ensureTailBindTranslation();
    if (!this._tailBindTranslation) return null;
    const offset = this.tailBaseOffset || [0, 0, 0];
    const anchor = this._tailAnchor || (this._tailAnchor = [0, 0, 0]);
    anchor[0] = this._tailBindTranslation[0] + offset[0];
    anchor[1] = this._tailBindTranslation[1] + offset[1];
    anchor[2] = this._tailBindTranslation[2] + offset[2];
    return anchor;
  }

  updateStateMachine(dt) {
    const s = this.states[this.currentState];
    if (!s) return;
    if (s.onUpdate) s.onUpdate.call(this, dt);
    this.updateTailSway(this.totalTime);
    if (this.stateTime >= s.duration) this.handleStateTransition();
  }

  handleStateTransition() {
    switch (this.currentState) {
      case GabiteAnimState.LOOK_AROUND:
        this.transitionTo(GabiteAnimState.CENTER_HEAD);
        break;
      case GabiteAnimState.CENTER_HEAD:
        this.transitionTo(GabiteAnimState.HOP_EXCITED);
        break;
      case GabiteAnimState.HOP_EXCITED:
        this.transitionTo(GabiteAnimState.LOOK_AROUND);
        break;
    }
  }

  updateLookAround(dt) {
    const half = this.lookDuration / 2;
    let target = 0;
    if (this.stateTime < half) {
      const t = this.stateTime / half;
      target = this.easeInOutCubic(t) * this.neckTurnAngle;
    } else {
      const t = (this.stateTime - half) / half;
      target =
        this.neckTurnAngle - this.easeInOutCubic(t) * this.neckTurnAngle * 2;
    }

    this.currentNeckRotation += (target - this.currentNeckRotation) * 8.0 * dt;

    if (this.rig.neck && this.bindPoses.neck) {
      mat4.copy(this.rig.neck.localTransform, this.bindPoses.neck);
      mat4.rotate(
        this.rig.neck.localTransform,
        this.rig.neck.localTransform,
        this.currentNeckRotation,
        [0, 1, 0]
      );
    }

    if (this.rig.body && this.bindPoses.body) {
      const bob =
        Math.abs(Math.sin(this.totalTime * Math.PI * 2)) *
        this.bodyBobAmount *
        0.4;
      mat4.copy(this.rig.body.localTransform, this.bindPoses.body);
      mat4.translate(
        this.rig.body.localTransform,
        this.rig.body.localTransform,
        [0, bob, 0]
      );
    }

    this.resetToBind("leftThigh");
    this.resetToBind("rightThigh");
    this.resetToBind("leftArm");
    this.resetToBind("rightArm");
  }

  updateCenterHead(dt) {
    const t = Math.min(this.stateTime / Math.max(this.centerDuration, 1e-4), 1);
    const eased = this.easeOutCubic(t);
    const neck =
      this._centerStart + (this._centerTarget - this._centerStart) * eased;
    this.currentNeckRotation = neck;

    if (this.rig.neck && this.bindPoses.neck) {
      mat4.copy(this.rig.neck.localTransform, this.bindPoses.neck);
      mat4.rotate(
        this.rig.neck.localTransform,
        this.rig.neck.localTransform,
        neck,
        [0, 1, 0]
      );
    }

    if (this.rig.body && this.bindPoses.body) {
      const bob =
        Math.abs(Math.sin(this.totalTime * Math.PI * 2)) *
        this.bodyBobAmount *
        0.25;
      mat4.copy(this.rig.body.localTransform, this.bindPoses.body);
      mat4.translate(
        this.rig.body.localTransform,
        this.rig.body.localTransform,
        [0, bob, 0]
      );
    }

    this.resetToBind("leftThigh");
    this.resetToBind("rightThigh");
    this.resetToBind("leftArm");
    this.resetToBind("rightArm");
  }

  updateHop(dt) {
    const totalT = this.stateTime / this.hopDuration;
    const hopProgress = (totalT * this.hopCount) % 1.0;
    let bodyY = 0,
      legAngle = 0,
      armAngle = 0;

    if (hopProgress < 0.25) {
      const t = hopProgress / 0.25;
      const eased = this.easeInOutQuad(t);
      bodyY = -eased * this.squatAmount;
      legAngle = eased * (Math.PI / 8);
    } else if (hopProgress < 0.75) {
      const t = (hopProgress - 0.25) / 0.5;
      const arc = Math.sin(t * Math.PI);
      bodyY = arc * this.hopHeight;
      armAngle = Math.sin(t * Math.PI) * this.armSwingAngle;
      legAngle = 0;
    } else {
      const t = (hopProgress - 0.75) / 0.25;
      const eased = this.easeOutQuad(t);
      bodyY = (1 - eased) * this.hopHeight * Math.sin(0) * 0.1;
      legAngle = 0;
      armAngle = 0;
    }

    if (this.rig.body && this.bindPoses.body) {
      mat4.copy(this.rig.body.localTransform, this.bindPoses.body);
      mat4.translate(
        this.rig.body.localTransform,
        this.rig.body.localTransform,
        [0, bodyY, 0]
      );
    }

    if (this.rig.leftThigh && this.bindPoses.leftThigh) {
      mat4.copy(this.rig.leftThigh.localTransform, this.bindPoses.leftThigh);
      mat4.rotate(
        this.rig.leftThigh.localTransform,
        this.rig.leftThigh.localTransform,
        legAngle,
        [1, 0, 0]
      );
    }

    if (this.rig.rightThigh && this.bindPoses.rightThigh) {
      mat4.copy(this.rig.rightThigh.localTransform, this.bindPoses.rightThigh);
      mat4.rotate(
        this.rig.rightThigh.localTransform,
        this.rig.rightThigh.localTransform,
        legAngle,
        [1, 0, 0]
      );
    }

    if (this.rig.leftArm && this.bindPoses.leftArm) {
      mat4.copy(this.rig.leftArm.localTransform, this.bindPoses.leftArm);
      mat4.rotate(
        this.rig.leftArm.localTransform,
        this.rig.leftArm.localTransform,
        -armAngle,
        [1, 0, 0]
      );
    }

    if (this.rig.rightArm && this.bindPoses.rightArm) {
      mat4.copy(this.rig.rightArm.localTransform, this.bindPoses.rightArm);
      mat4.rotate(
        this.rig.rightArm.localTransform,
        this.rig.rightArm.localTransform,
        -armAngle,
        [1, 0, 0]
      );
    }

    this.resetToBind("neck");
  }

  updateTailSway(time) {
    if (!this.rig.tail || !this.bindPoses.tail) return;
    const target = this.rig.tail.localTransform;
    mat4.copy(target, this.bindPoses.tail);
    const rotations = this._tailRotationAxes || [];
    const anchor = this._getTailAnchor();

    if (!rotations.length) {
      if (anchor) {
        target[12] = anchor[0];
        target[13] = anchor[1];
        target[14] = anchor[2];
      }
      return;
    }

    let neg = null;
    if (anchor) {
      mat4.translate(target, target, anchor);
      neg = this._tailAnchorNeg || (this._tailAnchorNeg = [0, 0, 0]);
      neg[0] = -anchor[0];
      neg[1] = -anchor[1];
      neg[2] = -anchor[2];
    }

    for (const def of rotations) {
      const angle = this._computeTailRotationAngle(def, time);
      if (!isFinite(angle) || Math.abs(angle) < 1e-6) continue;
      mat4.rotate(target, target, angle, def.axis);
    }

    if (anchor) mat4.translate(target, target, neg);
  }

  applyTransforms() {}

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
  }

  easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
  }

  easeInCubic(t) {
    return t ** 3;
  }

  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t ** 2 : 1 - (-2 * t + 2) ** 2 / 2;
  }

  easeInQuad(t) {
    return t ** 2;
  }

  easeOutQuad(t) {
    return 1 - (1 - t) ** 2;
  }
}

if (typeof module !== "undefined" && module.exports)
  module.exports = GabiteAnimator;
window.GabiteAnimator = GabiteAnimator;
console.log("GabiteAnimator loaded");
