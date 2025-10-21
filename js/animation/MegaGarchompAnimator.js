/**
 * Mega Garchomp Walking + Attack + Roar Animation
 * Extends AnimationController
 */

// Animation states
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
    // Default config - Mega Garchomp START dari belakang island
    const defaultConfig = {
      startPos: [0, -1, 5], // Mulai dari belakang
      endPos: [0, -1, -8], // Jalan ke depan
      startRotation: Math.PI, // Menghadap ke depan

      // Durations
      prowlDuration: 4.0, // Lebih lambat dari Garchomp
      idleDuration: 3.0,
      attackDuration: 2.0,
      roarDuration: 3.5,
      turnDuration: 1.2,

      // Prowl cycle (jalan lambat)
      prowlCycleFreq: 1.2, // Lebih lambat
      legSwingAngle: Math.PI / 8, // Lebih kecil (heavy walk)

      // Body motion
      bodySwayAmount: 0.15, // Side-to-side swagger
      headBobAmount: 0.08,
      tailDragAmount: 0.05,

      // Attack
      armWindupAngle: Math.PI / 3,
      armSlashSpeed: 8.0,

      // Roar
      roarLeanBack: Math.PI / 12,
      roarHeadTilt: Math.PI / 8,
      roarArmSpread: Math.PI / 4,
      jawOpenAngle: Math.PI / 6,
    };

    super(megaGarchompNode, { ...defaultConfig, ...config });
    Object.assign(this, this.config);

    // State machine
    this.states = {
      [MegaGarchompAnimState.PROWL_FORWARD]: {
        onEnter: () => {
          this.currentPos = [...this.startPos];
          this.targetRotation = Math.PI;
        },
        onUpdate: (dt) => this.updateProwlForward(dt),
        duration: this.prowlDuration,
      },
      [MegaGarchompAnimState.IDLE_STANCE]: {
        onEnter: () => {},
        onUpdate: (dt) => this.updateIdleStance(dt),
        duration: this.idleDuration,
      },
      [MegaGarchompAnimState.ATTACK_SLASH]: {
        onEnter: () => {
          this.attackPhase = 0; // 0=windup, 1=slash, 2=recovery
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
          this.targetRotation = 0;
        },
        onUpdate: (dt) => this.updateProwlBack(dt),
        duration: this.prowlDuration,
      },
    };

    this.transitionTo(MegaGarchompAnimState.PROWL_FORWARD);
  }

  updateStateMachine(deltaTime) {
    const state = this.states[this.currentState];
    if (!state) return;

    if (state.onUpdate) {
      state.onUpdate.call(this, deltaTime);
    }

    if (this.stateTime >= state.duration) {
      this.handleStateTransition();
    }

    // Continuous animations
    this.updateBodySway();
    this.updateTailDrag();
  }

  handleStateTransition() {
    switch (this.currentState) {
      case MegaGarchompAnimState.PROWL_FORWARD:
        this.transitionTo(MegaGarchompAnimState.IDLE_STANCE);
        break;
      case MegaGarchompAnimState.IDLE_STANCE:
        // Random: 50% attack, 50% roar
        const action = Math.random() > 0.5 ? "ATTACK_SLASH" : "ROAR";
        this.transitionTo(MegaGarchompAnimState[action]);
        break;
      case MegaGarchompAnimState.ATTACK_SLASH:
      case MegaGarchompAnimState.ROAR:
        this.transitionTo(MegaGarchompAnimState.TURN_AROUND);
        break;
      case MegaGarchompAnimState.TURN_AROUND:
        if (Math.abs(this.currentRotation - Math.PI) < 0.1) {
          this.transitionTo(MegaGarchompAnimState.PROWL_FORWARD);
        } else {
          this.transitionTo(MegaGarchompAnimState.PROWL_BACK);
        }
        break;
      case MegaGarchompAnimState.PROWL_BACK:
        this.transitionTo(MegaGarchompAnimState.IDLE_STANCE);
        break;
    }
  }

  // ===== PROWL ANIMATION (Heavy Walk) =====
  updateProwlForward(deltaTime) {
    const t = this.stateTime / this.prowlDuration;
    this.currentPos = this.lerpVec3(this.startPos, this.endPos, t);
    this.updateLegCycle(this.stateTime);
  }

  updateProwlBack(deltaTime) {
    const t = this.stateTime / this.prowlDuration;
    this.currentPos = this.lerpVec3(this.endPos, this.startPos, t);
    this.updateLegCycle(this.stateTime);
  }

  updateLegCycle(time) {
    const cycle = Math.sin(time * this.prowlCycleFreq * Math.PI * 2);
    const leftAngle = cycle * this.legSwingAngle;
    const rightAngle = -cycle * this.legSwingAngle;

    if (this.rig.leftLeg) {
      mat4.identity(this.rig.leftLeg.localTransform);
      mat4.translate(
        this.rig.leftLeg.localTransform,
        this.rig.leftLeg.localTransform,
        [-0.5, -1.8, 0]
      );
      mat4.rotate(
        this.rig.leftLeg.localTransform,
        this.rig.leftLeg.localTransform,
        leftAngle,
        [1, 0, 0]
      );
    }

    if (this.rig.rightLeg) {
      mat4.identity(this.rig.rightLeg.localTransform);
      mat4.translate(
        this.rig.rightLeg.localTransform,
        this.rig.rightLeg.localTransform,
        [0.5, -1.8, 0]
      );
      mat4.rotate(
        this.rig.rightLeg.localTransform,
        this.rig.rightLeg.localTransform,
        rightAngle,
        [1, 0, 0]
      );
    }
  }

  // ===== IDLE STANCE =====
  updateIdleStance(deltaTime) {
    // Breathing effect
    const breathe = Math.sin(this.stateTime * 2) * 0.02;

    if (this.rig.torso) {
      mat4.identity(this.rig.torso.localTransform);
      mat4.scale(this.rig.torso.localTransform, this.rig.torso.localTransform, [
        1,
        1 + breathe,
        1,
      ]);
    }

    // Reset legs to neutral
    if (this.rig.leftLeg) {
      mat4.identity(this.rig.leftLeg.localTransform);
      mat4.translate(
        this.rig.leftLeg.localTransform,
        this.rig.leftLeg.localTransform,
        [-0.5, -1.8, 0]
      );
    }
    if (this.rig.rightLeg) {
      mat4.identity(this.rig.rightLeg.localTransform);
      mat4.translate(
        this.rig.rightLeg.localTransform,
        this.rig.rightLeg.localTransform,
        [0.5, -1.8, 0]
      );
    }
  }

  // ===== ATTACK SLASH ANIMATION =====
  updateAttackSlash(deltaTime) {
    const t = this.stateTime / this.attackDuration;

    // Phase timing: 30% windup, 20% slash, 50% recovery
    if (t < 0.3) {
      // Windup
      const windupT = t / 0.3;
      const angle = this.easeInOutCubic(windupT) * this.armWindupAngle;

      if (this.rig.leftArm) {
        mat4.identity(this.rig.leftArm.localTransform);
        mat4.translate(
          this.rig.leftArm.localTransform,
          this.rig.leftArm.localTransform,
          [-1, 1, 0]
        );
        mat4.rotate(
          this.rig.leftArm.localTransform,
          this.rig.leftArm.localTransform,
          -angle,
          [0, 0, 1]
        );
      }
    } else if (t < 0.5) {
      // Slash (fast!)
      const slashT = (t - 0.3) / 0.2;
      const angle = -this.armWindupAngle * (1 - slashT * this.armSlashSpeed);

      if (this.rig.leftArm) {
        mat4.identity(this.rig.leftArm.localTransform);
        mat4.translate(
          this.rig.leftArm.localTransform,
          this.rig.leftArm.localTransform,
          [-1, 1, 0]
        );
        mat4.rotate(
          this.rig.leftArm.localTransform,
          this.rig.leftArm.localTransform,
          angle,
          [0, 0, 1]
        );
      }
    } else {
      // Recovery
      const recoveryT = (t - 0.5) / 0.5;
      const angle = this.lerp(
        -this.armWindupAngle * 2,
        0,
        this.easeInOutCubic(recoveryT)
      );

      if (this.rig.leftArm) {
        mat4.identity(this.rig.leftArm.localTransform);
        mat4.translate(
          this.rig.leftArm.localTransform,
          this.rig.leftArm.localTransform,
          [-1, 1, 0]
        );
        mat4.rotate(
          this.rig.leftArm.localTransform,
          this.rig.leftArm.localTransform,
          angle,
          [0, 0, 1]
        );
      }
    }
  }

  // ===== ROAR ANIMATION =====
  updateRoar(deltaTime) {
    const t = this.stateTime / this.roarDuration;

    // Phase: 20% buildup, 50% hold, 30% release
    let intensity = 0;
    if (t < 0.2) {
      intensity = this.easeInOutCubic(t / 0.2);
    } else if (t < 0.7) {
      intensity = 1.0; // Hold roar
    } else {
      intensity = this.easeInOutCubic(1 - (t - 0.7) / 0.3);
    }

    // Torso lean back
    if (this.rig.torso) {
      mat4.identity(this.rig.torso.localTransform);
      mat4.rotate(
        this.rig.torso.localTransform,
        this.rig.torso.localTransform,
        -this.roarLeanBack * intensity,
        [1, 0, 0]
      );
    }

    // Head tilt up
    if (this.rig.neck) {
      mat4.identity(this.rig.neck.localTransform);
      mat4.translate(
        this.rig.neck.localTransform,
        this.rig.neck.localTransform,
        [0, 1.5, 0.5]
      );
      mat4.rotate(
        this.rig.neck.localTransform,
        this.rig.neck.localTransform,
        -this.roarHeadTilt * intensity,
        [1, 0, 0]
      );
    }

    // Arms spread wide
    if (this.rig.leftArm) {
      mat4.identity(this.rig.leftArm.localTransform);
      mat4.translate(
        this.rig.leftArm.localTransform,
        this.rig.leftArm.localTransform,
        [-1, 1, 0]
      );
      mat4.rotate(
        this.rig.leftArm.localTransform,
        this.rig.leftArm.localTransform,
        -this.roarArmSpread * intensity,
        [0, 0, 1]
      );
    }

    if (this.rig.rightArm) {
      mat4.identity(this.rig.rightArm.localTransform);
      mat4.translate(
        this.rig.rightArm.localTransform,
        this.rig.rightArm.localTransform,
        [1, 1, 0]
      );
      mat4.rotate(
        this.rig.rightArm.localTransform,
        this.rig.rightArm.localTransform,
        this.roarArmSpread * intensity,
        [0, 0, 1]
      );
    }

    // JAW OPEN (CRITICAL!)
    if (this.rig.jaw) {
      mat4.identity(this.rig.jaw.localTransform);
      mat4.translate(
        this.rig.jaw.localTransform,
        this.rig.jaw.localTransform,
        [0, 0.25, 1.1]
      );
      mat4.rotate(
        this.rig.jaw.localTransform,
        this.rig.jaw.localTransform,
        this.jawOpenAngle * intensity,
        [1, 0, 0]
      ); // Open jaw downward
    }
  }

  // ===== TURN AROUND =====
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
    if (
      this.currentState !== MegaGarchompAnimState.PROWL_FORWARD &&
      this.currentState !== MegaGarchompAnimState.PROWL_BACK
    )
      return;

    const sway =
      Math.sin(this.totalTime * this.prowlCycleFreq * Math.PI) *
      this.bodySwayAmount;

    if (this.rig.torso) {
      const currentTransform = mat4.clone(this.rig.torso.localTransform);
      mat4.rotate(currentTransform, currentTransform, sway, [0, 0, 1]);
      mat4.copy(this.rig.torso.localTransform, currentTransform);
    }
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
