/**
 * Gabite Animator — Idle Look + Tail Sway + Hop (Stay Put)
 * FIXED VERSION - Smooth 2x hop tanpa snap/jitter
 */

const GabiteAnimState = {
  LOOK_AROUND: "LOOK_AROUND",
  CENTER_HEAD: "CENTER_HEAD",
  HOP_EXCITED: "HOP_EXCITED",
};

class GabiteAnimator extends AnimationController {
  constructor(gabiteNode, config = {}) {
    const defaults = {
      // Look
      lookDuration: 2.0,
      neckTurnAngle: Math.PI / 4,

      // Center
      centerDuration: 0.4,

      // Hop
      hopDuration: 2.0,
      hopCount: 2,
      hopHeight: 1.0,
      squatAmount: 0.15,

      // Tail
      tailSwayFreq: 1.5,
      tailSwayAmount: 0.25,

      // Body
      bodyBobAmount: 0.06,
      armSwingAngle: Math.PI / 10,
    };
    super(gabiteNode, { ...defaults, ...config });
    Object.assign(this, this.config);

    this.rig = gabiteNode.animationRig || {};
    this.currentNeckRotation = 0;

    // untuk CENTER_HEAD
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
          // PENTING: Reset ke bind pose dulu sebelum hop
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

  // ===== Bind poses =====
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
    });
  }

  resetToBind(k) {
    if (this.bindPoses[k] && this.rig[k])
      mat4.copy(this.rig[k].localTransform, this.bindPoses[k]);
  }

  // ===== State machine tick =====
  updateStateMachine(dt) {
    const s = this.states[this.currentState];
    if (!s) return;

    if (s.onUpdate) s.onUpdate.call(this, dt);

    // Tail sway jalan terus
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

  // ===== LOOK AROUND (neck yaw kiri-kanan) =====
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

  // ===== CENTER HEAD =====
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

  // ===== HOP (SIMPLE & SMOOTH - NO GLITCHY LEG) =====
  updateHop(dt) {
    const totalT = this.stateTime / this.hopDuration;
    const hopProgress = (totalT * this.hopCount) % 1.0;

    let bodyY = 0;
    let legAngle = 0;
    let armAngle = 0;

    if (hopProgress < 0.25) {
      // Phase 1: Squat (0% → 25%)
      const t = hopProgress / 0.25;
      const eased = this.easeInOutQuad(t);
      bodyY = -eased * this.squatAmount;
      legAngle = eased * (Math.PI / 8); // Bengkok sedang (22.5°)
    } else if (hopProgress < 0.75) {
      // Phase 2: Jump (25% → 75%)
      const t = (hopProgress - 0.25) / 0.5;

      // Body: smooth parabolic jump
      const arc = Math.sin(t * Math.PI);
      bodyY = arc * this.hopHeight;

      // Arms: swing
      armAngle = Math.sin(t * Math.PI) * this.armSwingAngle;

      // Legs: LURUS selama di udara
      legAngle = 0;
    } else {
      // Phase 3: Landing (75% → 100%)
      const t = (hopProgress - 0.75) / 0.25;
      const eased = this.easeOutQuad(t);

      // Body: turun smooth
      bodyY = (1 - eased) * this.hopHeight * Math.sin(0) * 0.1; // Minimal bounce

      // Legs: TETAP LURUS! Ga usah bengkok lagi
      legAngle = 0;

      // Arms: settle
      armAngle = 0;
    }

    // ===== APPLY TRANSFORMS (SMOOTH) =====

    // Body Y movement
    if (this.rig.body && this.bindPoses.body) {
      mat4.copy(this.rig.body.localTransform, this.bindPoses.body);
      mat4.translate(
        this.rig.body.localTransform,
        this.rig.body.localTransform,
        [0, bodyY, 0]
      );
    }

    // Leg rotations (both legs move together symmetrically)
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

    // Arm swing
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

    // Neck stays neutral during hop
    this.resetToBind("neck");
  }

  // ===== Tail sway (continuous) =====
  updateTailSway(time) {
    if (!this.rig.tail || !this.bindPoses.tail) return;
    const swayY =
      Math.sin(time * this.tailSwayFreq * Math.PI) * this.tailSwayAmount;
    const swayX =
      Math.cos(time * this.tailSwayFreq * Math.PI * 0.7) *
      this.tailSwayAmount *
      0.5;

    mat4.copy(this.rig.tail.localTransform, this.bindPoses.tail);
    mat4.rotate(
      this.rig.tail.localTransform,
      this.rig.tail.localTransform,
      swayY,
      [0, 1, 0]
    );
    mat4.rotate(
      this.rig.tail.localTransform,
      this.rig.tail.localTransform,
      swayX,
      [1, 0, 0]
    );
  }

  // Stay put (no root motion)
  applyTransforms() {}

  // ===== Easing Functions =====
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInCubic(t) {
    return t * t * t;
  }

  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  easeInQuad(t) {
    return t * t;
  }

  easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
  }
}

if (typeof module !== "undefined" && module.exports)
  module.exports = GabiteAnimator;
window.GabiteAnimator = GabiteAnimator;

console.log("✅ GabiteAnimator FIXED - Smooth 2x hop without snap/jitter");
