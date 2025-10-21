/**
 * Mega Garchomp Walking + Attack + Roar Animation (Deterministic Flow)
 * Extends AnimationController
 */

const MegaGarchompAnimState = {
  PROWL_FORWARD: "PROWL_FORWARD",
  IDLE_STANCE: "IDLE_STANCE",
  ATTACK_SLASH: "ATTACK_SLASH",
  ROAR: "ROAR",
  TURN_AROUND: "TURN_AROUND",
  PROWL_BACK: "PROWL_BACK",
};

class MegaGarchompAnimator extends AnimationController {
  constructor(megaGarchompNode, config = {}) {
    const defaultConfig = {
      startPos: [0, -1, 5],
      endPos: [0, -1, -8],
      startRotation: Math.PI,

      prowlDuration: 4.0,
      idleDuration: 3.0,
      attackDuration: 2.0,
      roarDuration: 3.5,
      turnDuration: 1.2,

      prowlCycleFreq: 1.2,
      legSwingAngle: Math.PI / 8,

      bodySwayAmount: 0.1, // sedikit lebih kecil biar stabil
      headBobAmount: 0.08,
      tailDragAmount: 0.05,

      armWindupAngle: Math.PI / 3,
      armSlashSpeed: 8.0,

      roarLeanBack: Math.PI / 12,
      roarHeadTilt: Math.PI / 8,
      roarArmSpread: Math.PI / 4,
      jawOpenAngle: Math.PI / 6,

      comboMax: 2,

      // ★ FOOT-SETTLE params
      settleDuration: 0.35, // lama meratakan kaki saat berhenti
      settleCrouch: 0.12, // sudut jongkok kecil setelah rata (rad)
    };

    super(megaGarchompNode, { ...defaultConfig, ...config });
    Object.assign(this, this.config);
    this.rig = megaGarchompNode?.animationRig || this.rig;

    this.captureBindPose();

    this.currentPos = [...this.startPos];
    this.currentRotation = this.startRotation;
    this.targetRotation = this.startRotation;
    this.comboCount = 0;

    this.lastLeftAngle = 0;
    this.lastRightAngle = 0;

    this.states = {
      [MegaGarchompAnimState.PROWL_FORWARD]: {
        onEnter: () => {
          this.currentPos = [...this.startPos];
          this.currentRotation = Math.PI;
          this.targetRotation = Math.PI;
          this.comboCount = 0;
          this.lastLeftAngle = 0;
          this.lastRightAngle = 0;
        },
        onUpdate: (dt) => this.updateProwlForward(dt),
        duration: this.prowlDuration,
      },

      [MegaGarchompAnimState.IDLE_STANCE]: {
        onEnter: () => {
          this.idleSettleTime = 0;
          this.idleStartLeft = this.lastLeftAngle || 0;
          this.idleStartRight = this.lastRightAngle || 0;

          // ✅ RATAKAN KE BIND (0°), bukan crouch
          this.idleTargetLeft = 0;
          this.idleTargetRight = 0;

          this.idleSettled = false;
        },
        onUpdate: (dt) => this.updateIdleStance(dt),
        duration: this.idleDuration,
      },

      [MegaGarchompAnimState.ATTACK_SLASH]: {
        onEnter: () => {
          this.attackPhase = 0;
          this.attackTime = 0;
        },
        onUpdate: (dt) => this.updateAttackSlash(dt),
        duration: this.attackDuration,
      },

      [MegaGarchompAnimState.ROAR]: {
        onEnter: () => {},
        onUpdate: (dt) => this.updateRoar(dt),
        duration: this.roarDuration,
      },

      [MegaGarchompAnimState.TURN_AROUND]: {
        onEnter: () => {
          this.turnStartRot = this.currentRotation;
          this.targetRotation =
            Math.abs(this.currentRotation - Math.PI) < 0.1 ? 0 : Math.PI;
        },
        onUpdate: (dt) => this.updateTurn(dt),
        duration: this.turnDuration,
      },

      [MegaGarchompAnimState.PROWL_BACK]: {
        onEnter: () => {
          this.currentPos = [...this.endPos];
          this.currentRotation = 0;
          this.targetRotation = 0;
          this.comboCount = 0;
          this.lastLeftAngle = 0;
          this.lastRightAngle = 0;
        },
        onUpdate: (dt) => this.updateProwlBack(dt),
        duration: this.prowlDuration,
      },
    };

    this.transitionTo(MegaGarchompAnimState.PROWL_FORWARD);
  }

  captureBindPose() {
    this.bind = this.bind || {};
    const keys = [
      "leftThigh",
      "rightThigh",
      "leftShin",
      "rightShin",
      "leftFoot",
      "rightFoot",
      "torso",
      "neck",
      "jaw",
    ];
    for (const k of keys) {
      const n = this.rig?.[k];
      if (n && !this.bind[k]) this.bind[k] = mat4.clone(n.localTransform);
    }
    if (this.rig?.leftArm?.children?.[0]) {
      const upperArm = this.rig.leftArm.children[0];
      if (!upperArm._originalTransform) {
        upperArm._originalTransform = mat4.clone(upperArm.localTransform);
      }
    }
  }

  // ✅ Pastikan kedua kaki benar-benar kembali ke bind (sejajar & “menapak”)
  snapLegsToBind() {
    if (this.rig.leftThigh && this.bind.leftThigh)
      mat4.copy(this.rig.leftThigh.localTransform, this.bind.leftThigh);
    if (this.rig.rightThigh && this.bind.rightThigh)
      mat4.copy(this.rig.rightThigh.localTransform, this.bind.rightThigh);

    if (this.rig.leftShin && this.bind.leftShin)
      mat4.copy(this.rig.leftShin.localTransform, this.bind.leftShin);
    if (this.rig.rightShin && this.bind.rightShin)
      mat4.copy(this.rig.rightShin.localTransform, this.bind.rightShin);

    if (this.rig.leftFoot && this.bind.leftFoot)
      mat4.copy(this.rig.leftFoot.localTransform, this.bind.leftFoot);
    if (this.rig.rightFoot && this.bind.rightFoot)
      mat4.copy(this.rig.rightFoot.localTransform, this.bind.rightFoot);
  }

  updateStateMachine(deltaTime) {
    const state = this.states[this.currentState];
    if (!state) return;

    if (state.onUpdate) state.onUpdate.call(this, deltaTime);
    if (this.stateTime >= state.duration) this.handleStateTransition();

    this.updateBodySway();
    this.updateTailDrag();
  }

  handleStateTransition() {
    switch (this.currentState) {
      case MegaGarchompAnimState.PROWL_FORWARD:
        this.comboCount = 0;
        this.transitionTo(MegaGarchompAnimState.ATTACK_SLASH);
        break;
      case MegaGarchompAnimState.ATTACK_SLASH:
        this.transitionTo(MegaGarchompAnimState.ROAR);
        break;
      case MegaGarchompAnimState.ROAR:
        this.comboCount += 1;
        if (this.comboCount < this.comboMax) {
          this.transitionTo(MegaGarchompAnimState.ATTACK_SLASH);
        } else {
          this.transitionTo(MegaGarchompAnimState.TURN_AROUND);
        }
        break;
      case MegaGarchompAnimState.TURN_AROUND:
        if (Math.abs(this.currentRotation - Math.PI) < 0.1) {
          this.transitionTo(MegaGarchompAnimState.PROWL_FORWARD);
        } else {
          this.transitionTo(MegaGarchompAnimState.PROWL_BACK);
        }
        break;
      case MegaGarchompAnimState.PROWL_BACK:
        this.comboCount = 0;
        this.transitionTo(MegaGarchompAnimState.ATTACK_SLASH);
        break;
    }
  }

  // ===== PROWL =====
  updateProwlForward(dt) {
    const t = this.stateTime / this.prowlDuration;
    this.currentPos = this.lerpVec3(this.startPos, this.endPos, t);
    this.updateLegCycle(this.stateTime);
  }
  updateProwlBack(dt) {
    const t = this.stateTime / this.prowlDuration;
    this.currentPos = this.lerpVec3(this.endPos, this.startPos, t);
    this.updateLegCycle(this.stateTime);
  }

  updateLegCycle(time) {
    const cycle = Math.sin(time * this.prowlCycleFreq * Math.PI * 2);
    const leftAngle = cycle * this.legSwingAngle;
    const rightAngle = -cycle * this.legSwingAngle;

    if (this.rig.leftThigh && this.bind?.leftThigh) {
      mat4.copy(this.rig.leftThigh.localTransform, this.bind.leftThigh);
      mat4.rotate(
        this.rig.leftThigh.localTransform,
        this.rig.leftThigh.localTransform,
        leftAngle,
        [1, 0, 0]
      );
    }
    if (this.rig.rightThigh && this.bind?.rightThigh) {
      mat4.copy(this.rig.rightThigh.localTransform, this.bind.rightThigh);
      mat4.rotate(
        this.rig.rightThigh.localTransform,
        this.rig.rightThigh.localTransform,
        rightAngle,
        [1, 0, 0]
      );
    }

    this.lastLeftAngle = leftAngle;
    this.lastRightAngle = rightAngle;
  }

  // ===== IDLE + FOOT-SETTLE =====
  updateIdleStance(dt) {
    // --- settle paha ke 0° ---
    this.idleSettleTime = Math.min(
      this.idleSettleTime + dt,
      this.settleDuration
    );
    const p = this.easeInOutCubic(this.idleSettleTime / this.settleDuration);

    const lAngle = this.lerp(this.idleStartLeft, this.idleTargetLeft, p);
    const rAngle = this.lerp(this.idleStartRight, this.idleTargetRight, p);

    if (this.rig.leftThigh && this.bind?.leftThigh) {
      mat4.copy(this.rig.leftThigh.localTransform, this.bind.leftThigh);
      if (lAngle !== 0)
        mat4.rotate(
          this.rig.leftThigh.localTransform,
          this.rig.leftThigh.localTransform,
          lAngle,
          [1, 0, 0]
        );
    }
    if (this.rig.rightThigh && this.bind?.rightThigh) {
      mat4.copy(this.rig.rightThigh.localTransform, this.bind.rightThigh);
      if (rAngle !== 0)
        mat4.rotate(
          this.rig.rightThigh.localTransform,
          this.rig.rightThigh.localTransform,
          rAngle,
          [1, 0, 0]
        );
    }

    // --- setelah selesai settle, kunci shin & foot ke bind, lalu berhenti ubah kaki ---
    if (
      !this.idleSettled &&
      this.idleSettleTime >= this.settleDuration - 1e-3
    ) {
      this.snapLegsToBind(); // ✅ <— fungsi baru di bawah
      this.lastLeftAngle = 0; // reset tracker
      this.lastRightAngle = 0;
      this.idleSettled = true;
    }

    // napas ringan pada torso (tidak memutar/condong)
    if (this.rig.torso && this.bind?.torso) {
      const breathe = Math.sin(this.stateTime * 2) * 0.02;
      const t = mat4.clone(this.bind.torso);
      const s = mat4.create();
      mat4.scale(s, s, [1, 1 + breathe, 1]);
      mat4.multiply(t, t, s);
      mat4.copy(this.rig.torso.localTransform, t);
    }
  }

  // ===== ATTACK SLASH =====
  updateAttackSlash(deltaTime) {
    const t = this.stateTime / this.attackDuration;
    let armAngle = 0;
    if (t < 0.3) {
      const windupT = t / 0.3;
      armAngle = this.easeInOutCubic(windupT) * this.armWindupAngle;
    } else if (t < 0.5) {
      armAngle = this.armWindupAngle;
    } else {
      const recoveryT = (t - 0.5) / 0.5;
      armAngle = this.lerp(
        this.armWindupAngle,
        0,
        this.easeInOutCubic(recoveryT)
      );
    }

    if (this.rig.leftArm) {
      const upperArm = this.rig.leftArm.children?.[0];
      if (upperArm) {
        if (!upperArm._originalTransform) {
          upperArm._originalTransform = mat4.clone(upperArm.localTransform);
        }
        mat4.copy(upperArm.localTransform, upperArm._originalTransform);
        mat4.rotate(
          upperArm.localTransform,
          upperArm.localTransform,
          -armAngle,
          [0, 0, 1]
        );
      }
    }
  }

  // ===== ROAR =====
  updateRoar(deltaTime) {
    const t = this.stateTime / this.roarDuration;
    let intensity = 0;
    if (t < 0.2) intensity = this.easeInOutCubic(t / 0.2);
    else if (t < 0.7) intensity = 1.0;
    else intensity = this.easeInOutCubic(1 - (t - 0.7) / 0.3);

    if (this.rig.torso && this.bind?.torso) {
      const leanAngle = -this.roarLeanBack * intensity;
      mat4.copy(this.rig.torso.localTransform, this.bind.torso);
      mat4.rotate(
        this.rig.torso.localTransform,
        this.rig.torso.localTransform,
        leanAngle,
        [1, 0, 0]
      );
    }

    if (this.rig.neck && this.bind?.neck) {
      const tiltAngle = -this.roarHeadTilt * intensity;
      mat4.copy(this.rig.neck.localTransform, this.bind.neck);
      mat4.rotate(
        this.rig.neck.localTransform,
        this.rig.neck.localTransform,
        tiltAngle,
        [1, 0, 0]
      );
    }

    if (this.rig.jaw && this.bind?.jaw) {
      mat4.copy(this.rig.jaw.localTransform, this.bind.jaw);
      mat4.rotate(
        this.rig.jaw.localTransform,
        this.rig.jaw.localTransform,
        this.jawOpenAngle * intensity,
        [1, 0, 0]
      );
    }
  }

  // ===== TURN =====
  updateTurn(deltaTime) {
    const t = this.stateTime / this.turnDuration;
    const eased = this.easeInOutCubic(t);
    this.currentRotation = this.lerp(
      this.turnStartRot,
      this.targetRotation,
      eased
    );
  }

  // ===== BODY EFFECTS =====
  updateBodySway() {
    const walking =
      this.currentState === MegaGarchompAnimState.PROWL_FORWARD ||
      this.currentState === MegaGarchompAnimState.PROWL_BACK;
    if (!walking) return;
    if (!this.rig.torso || !this.bind?.torso) return;

    const sway =
      Math.sin(this.totalTime * this.prowlCycleFreq * Math.PI) *
      this.bodySwayAmount;

    // yaw (bukan roll) supaya pinggul tidak beda tinggi
    const t = mat4.clone(this.bind.torso);
    mat4.rotate(t, t, sway, [0, 1, 0]);
    mat4.copy(this.rig.torso.localTransform, t);
  }

  updateTailDrag() {
    if (!this.rig.tail) return;
    const drag = Math.sin(this.totalTime * 0.8) * this.tailDragAmount;
    mat4.identity(this.rig.tail.localTransform);
    mat4.translate(this.rig.tail.localTransform, this.rig.tail.localTransform, [
      0,
      drag,
      0,
    ]);
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = MegaGarchompAnimator;
}
window.MegaGarchompAnimator = MegaGarchompAnimator;
