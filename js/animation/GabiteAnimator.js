/**
 * Gabite Animator — Idle Look + Tail Sway + Hop (Stay Put)
 * Tambahan: CENTER_HEAD (leher balik ke tengah secara smooth sebelum lompat)
 */

const GabiteAnimState = {
  LOOK_AROUND: "LOOK_AROUND",
  CENTER_HEAD: "CENTER_HEAD", // NEW: halusin balik ke tengah
  HOP_EXCITED: "HOP_EXCITED",
};

class GabiteAnimator extends AnimationController {
  constructor(gabiteNode, config = {}) {
    const defaults = {
      // Look
      lookDuration: 2.0, // 1s kiri, 1s kanan
      neckTurnAngle: Math.PI / 4, // 45°

      // Center (baru)
      centerDuration: 0.4, // durasi balik ke tengah (smooth)

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
        onEnter: () => {
          /* mulai dari angle terakhir */
        },
        onUpdate: (dt) => this.updateLookAround(dt),
        duration: this.lookDuration,
      },
      [GabiteAnimState.CENTER_HEAD]: {
        onEnter: () => {
          // simpan dari mana mau balik → 0
          this._centerStart = this.currentNeckRotation || 0;
          this._centerTarget = 0;
        },
        onUpdate: (dt) => this.updateCenterHead(dt),
        duration: this.centerDuration,
      },
      [GabiteAnimState.HOP_EXCITED]: {
        onEnter: () => {
          /* neck tetap netral saat hop */
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
        // habis noleh → smoothe ke tengah dulu
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
      // ke kiri
      const t = this.stateTime / half;
      target = this.easeInOutCubic(t) * this.neckTurnAngle;
    } else {
      // ke kanan
      const t = (this.stateTime - half) / half;
      target =
        this.neckTurnAngle - this.easeInOutCubic(t) * this.neckTurnAngle * 2;
    }

    // lerp halus
    this.currentNeckRotation += (target - this.currentNeckRotation) * 8.0 * dt;

    // apply ke neck
    if (this.rig.neck && this.bindPoses.neck) {
      mat4.copy(this.rig.neck.localTransform, this.bindPoses.neck);
      mat4.rotate(
        this.rig.neck.localTransform,
        this.rig.neck.localTransform,
        this.currentNeckRotation,
        [0, 1, 0]
      );
    }

    // bob ringan
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

    // netralin kaki/arm saat look
    this.resetToBind("leftThigh");
    this.resetToBind("rightThigh");
    this.resetToBind("leftArm");
    this.resetToBind("rightArm");
  }

  // ===== CENTER HEAD (baru) — ease balik ke tengah sebelum hop =====
  updateCenterHead(dt) {
    const t = Math.min(this.stateTime / Math.max(this.centerDuration, 1e-4), 1);
    const eased = this.easeOutCubic(t); // cepat di awal, halus di akhir

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

    // bob kecil supaya tidak “mati”
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

    // anggota badan kembali netral
    this.resetToBind("leftThigh");
    this.resetToBind("rightThigh");
    this.resetToBind("leftArm");
    this.resetToBind("rightArm");
  }

  // ===== HOP (2x) =====
  updateHop(dt) {
    const single = this.hopDuration / this.hopCount;
    const hopTime = this.stateTime % single;
    const t = hopTime / single;

    let v = 0,
      leg = 0,
      arm = 0;
    if (t < 0.3) {
      const e = this.easeInOutQuad(t / 0.3);
      v = -e * this.squatAmount;
      leg = e * (Math.PI / 6);
    } else if (t < 0.7) {
      const jt = (t - 0.3) / 0.4;
      const parabola = 4 * jt * (1 - jt);
      v = parabola * this.hopHeight;
      arm = parabola * this.armSwingAngle;
      leg = 0;
    } else {
      const e = this.easeOutCubic((t - 0.7) / 0.3);
      v = (1 - e) * this.squatAmount * 0.5;
      leg = (1 - e) * (Math.PI / 8);
    }

    // body naik-turun
    if (this.rig.body && this.bindPoses.body) {
      mat4.copy(this.rig.body.localTransform, this.bindPoses.body);
      mat4.translate(
        this.rig.body.localTransform,
        this.rig.body.localTransform,
        [0, v, 0]
      );
    }

    // legs
    if (this.rig.leftThigh && this.bindPoses.leftThigh) {
      mat4.copy(this.rig.leftThigh.localTransform, this.bindPoses.leftThigh);
      mat4.rotate(
        this.rig.leftThigh.localTransform,
        this.rig.leftThigh.localTransform,
        leg,
        [1, 0, 0]
      );
    }
    if (this.rig.rightThigh && this.bindPoses.rightThigh) {
      mat4.copy(this.rig.rightThigh.localTransform, this.bindPoses.rightThigh);
      mat4.rotate(
        this.rig.rightThigh.localTransform,
        this.rig.rightThigh.localTransform,
        leg,
        [1, 0, 0]
      );
    }

    // arms
    if (this.rig.leftArm && this.bindPoses.leftArm) {
      mat4.copy(this.rig.leftArm.localTransform, this.bindPoses.leftArm);
      mat4.rotate(
        this.rig.leftArm.localTransform,
        this.rig.leftArm.localTransform,
        -arm,
        [1, 0, 0]
      );
    }
    if (this.rig.rightArm && this.bindPoses.rightArm) {
      mat4.copy(this.rig.rightArm.localTransform, this.bindPoses.rightArm);
      mat4.rotate(
        this.rig.rightArm.localTransform,
        this.rig.rightArm.localTransform,
        -arm,
        [1, 0, 0]
      );
    }

    // neck tetap netral selama hop
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

  // tetapkan statis (no root motion)
  applyTransforms() {}

  // ===== Easing =====
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}

if (typeof module !== "undefined" && module.exports)
  module.exports = GabiteAnimator;
window.GabiteAnimator = GabiteAnimator;

console.log(
  "✅ GabiteAnimator (Idle) loaded — look-around → center (smooth) → hop"
);
