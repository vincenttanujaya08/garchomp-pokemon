/**
 * Garchomp Walking Animation - FIXED
 * Start dari belakang, menghadap kamera
 * Extends AnimationController
 */

// Animation states
const GarchompAnimState = {
  WALK_FORWARD: "WALK_FORWARD",
  IDLE_PAUSE: "IDLE_PAUSE",
  TURN_AROUND: "TURN_AROUND",
};

class GarchompAnimator extends AnimationController {
  constructor(garchompNode, config = {}) {
    // Default config - Garchomp START dari belakang, menghadap kamera
    const defaultConfig = {
      startPos: [0, 1.5, -20], // Start dari JAUH (Z negatif)
      endPos: [0, 1.5, -10], // End di DEKAT (Z lebih positif = mendekat)
      startRotation: 0, // FIXED: 0° = menghadap +Z (arah jalan!)

      // Durations
      walkDuration: 3.0,
      pauseDuration: 5.0,
      turnDuration: 1.0,

      // Walk cycle
      walkCycleFreq: 2.0,
      hipSwingAngle: Math.PI / 6,

      // Tail
      tailSwayFreq: 1.5,
      tailSwayAmount: 0.3,

      // Body motion
      headBobAmount: 0.15,
      torsoLeanAmount: 0.1,
      bodySwayAmount: 0.05,
    };

    super(garchompNode, { ...defaultConfig, ...config });

    // Copy config to instance
    Object.assign(this, this.config);

    // FIXED: Set initial position
    this.currentPos = [...this.startPos];
    this.currentRotation = this.startRotation;

    // Initialize state machine
    this.states = {
      [GarchompAnimState.WALK_FORWARD]: {
        onEnter: () => {
          // Tentukan arah jalan berdasarkan posisi sekarang
          const distToStart = Math.abs(this.currentPos[2] - this.startPos[2]);
          const distToEnd = Math.abs(this.currentPos[2] - this.endPos[2]);

          if (distToStart < distToEnd) {
            // Lebih dekat ke start → jalan ke end
            this._walkFrom = [...this.startPos];
            this._walkTo = [...this.endPos];
          } else {
            // Lebih dekat ke end → jalan ke start
            this._walkFrom = [...this.endPos];
            this._walkTo = [...this.startPos];
          }

          // Rotation tetap dari TURN sebelumnya
          this.targetRotation = this.currentRotation;
        },
        onUpdate: (dt) => this.updateWalkForward(dt),
        duration: this.walkDuration,
      },

      [GarchompAnimState.IDLE_PAUSE]: {
        onEnter: () => {},
        onUpdate: (dt) => this.updateIdle(dt),
        duration: this.pauseDuration,
      },

      [GarchompAnimState.TURN_AROUND]: {
        onEnter: () => {
          // Toggle antara 0° (hadap kamera) dan 180° (hadap belakang)
          this.turnStartRot = this.currentRotation;

          if (Math.abs(this.currentRotation) < 0.5) {
            // Sekarang ~0° (hadap kamera) → putar ke 180° (hadap belakang)
            this.targetRotation = Math.PI;
          } else {
            // Sekarang ~180° (hadap belakang) → putar ke 0° (hadap kamera)
            this.targetRotation = 0;
          }
        },
        onUpdate: (dt) => this.updateTurn(dt),
        duration: this.turnDuration,
      },
    };

    // Start state
    this.transitionTo(GarchompAnimState.WALK_FORWARD);
  }

  updateStateMachine(deltaTime) {
    const state = this.states[this.currentState];
    if (!state) return;

    // Update current state
    if (state.onUpdate) {
      state.onUpdate.call(this, deltaTime);
    }

    // Check transition
    if (this.stateTime >= state.duration) {
      this.handleStateTransition();
    }

    // Always update continuous animations
    this.updateTailSway(this.totalTime);
    this.updateBodyMotion();
  }

  handleStateTransition() {
    switch (this.currentState) {
      case GarchompAnimState.WALK_FORWARD:
        this.transitionTo(GarchompAnimState.IDLE_PAUSE);
        break;
      case GarchompAnimState.IDLE_PAUSE:
        this.transitionTo(GarchompAnimState.TURN_AROUND);
        break;
      case GarchompAnimState.TURN_AROUND:
        // Setelah putar, jalan lagi
        this.transitionTo(GarchompAnimState.WALK_FORWARD);
        break;
    }
  }

  // ===== STATE UPDATES =====

  updateWalkForward(deltaTime) {
    const t = this.stateTime / this.walkDuration;
    this.currentPos = this.lerpVec3(this._walkFrom, this._walkTo, t);
    this.updateWalkCycle(this.stateTime);
  }

  updateIdle(deltaTime) {
    // Smoothly return legs to neutral
    const t = Math.min(this.stateTime / 0.5, 1.0);
    const leftAngle = this.lerp(this.rig.leftHip._currentAngle || 0, 0, t);
    const rightAngle = this.lerp(this.rig.rightHip._currentAngle || 0, 0, t);

    this.setHipRotation(this.rig.leftHip, leftAngle);
    this.setHipRotation(this.rig.rightHip, rightAngle);

    this.rig.leftHip._currentAngle = leftAngle;
    this.rig.rightHip._currentAngle = rightAngle;
  }

  updateTurn(deltaTime) {
    const t = this.stateTime / this.turnDuration;
    const eased = this.easeInOutCubic(t);
    this.currentRotation = this.lerp(
      this.turnStartRot,
      this.targetRotation,
      eased
    );
  }

  // ===== WALK CYCLE =====

  updateWalkCycle(time) {
    const cycle = Math.sin(time * this.walkCycleFreq * Math.PI * 2);

    const leftAngle = cycle * this.hipSwingAngle;
    const rightAngle = -cycle * this.hipSwingAngle;

    this.setHipRotation(this.rig.leftHip, leftAngle);
    this.setHipRotation(this.rig.rightHip, rightAngle);

    this.rig.leftHip._currentAngle = leftAngle;
    this.rig.rightHip._currentAngle = rightAngle;
  }

  setHipRotation(hipJoint, angle) {
    if (!hipJoint) return;

    mat4.identity(hipJoint.localTransform);

    const isLeft = hipJoint.name === "LeftHip";
    const xPos = isLeft ? -1.5 : 1.5;
    mat4.translate(hipJoint.localTransform, hipJoint.localTransform, [
      xPos,
      -2.5,
      -0.2,
    ]);

    mat4.rotate(
      hipJoint.localTransform,
      hipJoint.localTransform,
      angle,
      [1, 0, 0]
    );
  }

  // ===== TAIL ANIMATION (SMOOTH - NO GAPS!) =====

  updateTailSway(time) {
    const joints = this.rig.tailJoints || [];
    if (joints.length === 0) return;

    // Accumulated rotation untuk smooth compound motion
    let accumulatedRotY = 0;
    let accumulatedRotX = 0;

    for (let i = 0; i < joints.length; i++) {
      const joint = joints[i];
      if (!joint) continue;

      // Get stored properties
      const segmentLength = joint._segmentLength || 0.8;
      const segmentIndex = joint._segmentIndex || i;

      // Wave parameters - reduce amplitude per segment untuk smoother bend
      const phase = (i / joints.length) * Math.PI * 0.5; // Reduced phase
      const t = i / joints.length; // Normalized position

      // Sine wave dengan easing
      const swayY =
        Math.sin(time * this.tailSwayFreq * Math.PI * 2 + phase) *
        this.tailSwayAmount *
        (0.3 + 0.7 * t); // Gradual increase

      const swayX =
        Math.sin(time * this.tailSwayFreq * Math.PI * 2 + phase + Math.PI / 2) *
        this.tailSwayAmount *
        0.2 *
        t; // Gradual increase

      // Accumulate rotations for compound effect
      accumulatedRotY += swayY * 0.3; // Reduce per-segment rotation
      accumulatedRotX += swayX * 0.3;

      // CRITICAL: Build transform in correct order
      mat4.identity(joint.localTransform);

      // 1. Position first (if not root)
      if (segmentIndex > 0) {
        mat4.translate(joint.localTransform, joint.localTransform, [
          0,
          0,
          -segmentLength,
        ]);
      }

      // 2. Apply LOCAL rotation (small per segment)
      mat4.rotateY(joint.localTransform, joint.localTransform, swayY * 0.3);
      mat4.rotateX(joint.localTransform, joint.localTransform, swayX * 0.3);

      // Store accumulated for debugging
      joint._currentRotY = accumulatedRotY;
      joint._currentRotX = accumulatedRotX;
    }
  }

  // ===== BODY MOTION =====

  updateBodyMotion() {
    const isWalking = this.currentState === GarchompAnimState.WALK_FORWARD;
    const isTurning = this.currentState === GarchompAnimState.TURN_AROUND;

    // Head bob
    if (isWalking) {
      this.applyHeadBob();
      this.applyBodySway();
    } else {
      this.resetNeck();
      this.resetTorso();
    }

    // Torso lean during turn
    if (isTurning) {
      this.applyTorsoLean();
    }
  }

  applyHeadBob() {
    if (!this.rig.neck) return;

    const bobCycle = Math.sin(
      this.stateTime * this.walkCycleFreq * Math.PI * 4
    );
    const bobOffset = bobCycle * this.headBobAmount;

    mat4.identity(this.rig.neck.localTransform);
    mat4.translate(
      this.rig.neck.localTransform,
      this.rig.neck.localTransform,
      [0, 5, 2.0]
    );
    mat4.rotate(
      this.rig.neck.localTransform,
      this.rig.neck.localTransform,
      Math.PI,
      [0, 1, 0]
    );
    mat4.translate(this.rig.neck.localTransform, this.rig.neck.localTransform, [
      0,
      bobOffset,
      0,
    ]);
  }

  applyBodySway() {
    if (!this.rig.torso) return;

    const swayCycle = Math.sin(
      this.stateTime * this.walkCycleFreq * Math.PI * 2
    );
    const swayAngle = swayCycle * this.bodySwayAmount;

    mat4.identity(this.rig.torso.localTransform);
    mat4.translate(
      this.rig.torso.localTransform,
      this.rig.torso.localTransform,
      [0, -3, 5]
    );
    mat4.rotateY(
      this.rig.torso.localTransform,
      this.rig.torso.localTransform,
      swayAngle
    );
  }

  applyTorsoLean() {
    if (!this.rig.torso) return;

    const t = this.stateTime / this.turnDuration;
    const leanAngle = Math.sin(t * Math.PI) * this.torsoLeanAmount;

    mat4.identity(this.rig.torso.localTransform);
    mat4.translate(
      this.rig.torso.localTransform,
      this.rig.torso.localTransform,
      [0, -3, 5]
    );
    mat4.rotateZ(
      this.rig.torso.localTransform,
      this.rig.torso.localTransform,
      leanAngle
    );
  }

  resetNeck() {
    if (!this.rig.neck) return;
    mat4.identity(this.rig.neck.localTransform);
    mat4.translate(
      this.rig.neck.localTransform,
      this.rig.neck.localTransform,
      [0, 5, 2.0]
    );
    mat4.rotate(
      this.rig.neck.localTransform,
      this.rig.neck.localTransform,
      Math.PI,
      [0, 1, 0]
    );
  }

  resetTorso() {
    if (!this.rig.torso) return;
    mat4.identity(this.rig.torso.localTransform);
    mat4.translate(
      this.rig.torso.localTransform,
      this.rig.torso.localTransform,
      [0, -3, 5]
    );
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = GarchompAnimator;
}

window.GarchompAnimator = GarchompAnimator;

console.log(
  "✅ GarchompAnimator FIXED - Start dari belakang, menghadap kamera, toggle rotation"
);
