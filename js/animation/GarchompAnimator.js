/**
 * Garchomp Walking Animation with POWER UP
 * Start dari belakang, menghadap kamera
 * Extends AnimationController
 *
 * NEW: POWER_UP state after TURN_AROUND (Option A)
 */

// Animation states
const GarchompAnimState = {
  WALK_FORWARD: "WALK_FORWARD",
  IDLE_PAUSE: "IDLE_PAUSE",
  TURN_AROUND: "TURN_AROUND",
  POWER_UP: "POWER_UP", // ← NEW STATE
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
      powerUpDuration: 3.0, // ← INCREASED for smoother animation

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

      // Power up settings (IMPROVED)
      squatScale: 0.88, // Shrink to 88% (less extreme)
      roarScale: 1.22, // Grow to 122% (less extreme)
      squatDuration: 1.0, // Phase 1 (slower)
      growthDuration: 1.0, // Phase 2 (slower)
      settleDuration: 1.0, // Phase 3 (same)
    };

    super(garchompNode, { ...defaultConfig, ...config });

    // Copy config to instance
    Object.assign(this, this.config);

    // FIXED: Set initial position
    this.currentPos = [...this.startPos];
    this.currentRotation = this.startRotation;

    // ← NEW: Cycle counter untuk track roar timing
    this.idleCycleCount = 0;

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

      // ===== NEW: POWER UP STATE =====
      [GarchompAnimState.POWER_UP]: {
        onEnter: () => {
          console.log("🔥 Garchomp POWER UP!");
          // Reset scale to normal at start
          this.currentScale = [1, 1, 1];

          // ← IMPORTANT: Reset base position tracker for Y offset
          this._powerUpBasePos = null;

          // Store initial torso transform if exists
          if (this.rig.torso && this.rig.torso.localTransform) {
            this._initialTorsoTransform = mat4.clone(
              this.rig.torso.localTransform
            );
          }
        },
        onUpdate: (dt) => this.updatePowerUp(dt),
        duration: this.powerUpDuration,
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
        // ← FIXED: Increment counter AFTER idle
        this.idleCycleCount++;

        // Check if this is ODD cycle (1st, 3rd, 5th...)
        if (this.idleCycleCount % 2 === 1) {
          // ODD cycle → Do POWER UP roar!
          console.log(`🔥 Idle #${this.idleCycleCount} → POWER UP!`);
          this.transitionTo(GarchompAnimState.POWER_UP);
        } else {
          // EVEN cycle → Just turn without roar
          console.log(`⚪ Idle #${this.idleCycleCount} → TURN (no roar)`);
          this.transitionTo(GarchompAnimState.TURN_AROUND);
        }
        break;

      case GarchompAnimState.TURN_AROUND:
        // After turn (without roar), continue walking
        this.transitionTo(GarchompAnimState.WALK_FORWARD);
        break;

      case GarchompAnimState.POWER_UP:
        // After power up roar, turn around
        this.transitionTo(GarchompAnimState.TURN_AROUND);
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

  // ===== NEW: POWER UP ANIMATION =====
  updatePowerUp(deltaTime) {
    const totalTime = this.stateTime;
    const phase1End = this.squatDuration;
    const phase2End = phase1End + this.growthDuration;
    const phase3End = this.powerUpDuration;

    let scale = 1.0;
    let torsoLean = 0.0;
    let yOffset = 0.0; // ← NEW: Y translation untuk prevent ground penetration

    // ===== PHASE 1: SQUAT & INHALE (0.0 - 1.0s) =====
    if (totalTime < phase1End) {
      const t = totalTime / phase1End;
      const eased = this.easeInOutCubic(t);

      // Shrink body (smoother, less extreme)
      scale = this.lerp(1.0, this.squatScale, eased);

      // Lean forward slightly
      torsoLean = this.lerp(0, 0.22, eased); // ~12.6 degrees forward (reduced)

      // Lower body slightly as squatting
      yOffset = this.lerp(0, -0.15, eased); // Slight downward

      // ===== PHASE 2: EXPLOSIVE GROWTH (1.0 - 2.0s) =====
    } else if (totalTime < phase2End) {
      const t = (totalTime - phase1End) / this.growthDuration;

      // Use gentler easing for smoother growth
      const eased =
        t < 0.5
          ? 2 * t * t // Ease in quad (first half)
          : 1 - Math.pow(-2 * t + 2, 2) / 2; // Ease out quad (second half)

      // Explode to large size (smoother curve)
      scale = this.lerp(this.squatScale, this.roarScale, eased);

      // Lean back (chest out, dominant pose)
      torsoLean = this.lerp(0.22, -0.15, eased); // ~-8.6 degrees back (reduced)

      // ← CRITICAL FIX: Lift body up as it grows!
      // Calculate how much we're growing
      const growthAmount = scale - 1.0; // e.g., 1.22 - 1.0 = 0.22 (22% growth)

      // Lift Y by adjusted amount to keep feet grounded
      // ADJUST THIS NUMBER (1.2) to change lift height:
      // - 0.75 = default (kaki mungkin masih masuk sedikit)
      // - 1.0 = lift sedang
      // - 1.2 = lift lebih tinggi (recommended)
      // - 1.5 = lift sangat tinggi
      yOffset = growthAmount * 10; // ← UBAH ANGKA INI!

      // ===== PHASE 3: SETTLE & STABILIZE (2.0 - 3.0s) =====
    } else {
      const t = (totalTime - phase2End) / this.settleDuration;

      // Smoother elastic bounce (less bouncy)
      const eased =
        t < 0.5
          ? this.easeOutElastic(t * 2) * 0.5 // First half with dampened bounce
          : 0.5 + (t - 0.5) * 1.0; // Second half linear settle

      // Return to normal with gentle bounce
      scale = this.lerp(this.roarScale, 1.0, eased);

      // Return torso to neutral
      torsoLean = this.lerp(-0.15, 0, eased);

      // Return Y to original position smoothly
      const growthAmount = scale - 1.0;
      yOffset = growthAmount * 10; // ← MATCH dengan Phase 2!
    }

    // ← APPLY Y OFFSET to current position
    // Store base position if not stored yet
    if (!this._powerUpBasePos) {
      this._powerUpBasePos = [...this.currentPos];
    }

    // Apply offset to Y coordinate only
    this.currentPos[0] = this._powerUpBasePos[0];
    this.currentPos[1] = this._powerUpBasePos[1] + yOffset;
    this.currentPos[2] = this._powerUpBasePos[2];

    // Apply scale to root (affects whole body)
    this.currentScale = [scale, scale, scale];

    // Apply torso rotation if rig exists
    if (this.rig.torso && this._initialTorsoTransform) {
      // Start from initial transform
      mat4.copy(this.rig.torso.localTransform, this._initialTorsoTransform);

      // Apply lean rotation
      mat4.rotateX(
        this.rig.torso.localTransform,
        this.rig.torso.localTransform,
        torsoLean
      );
    }

    // Legs stay grounded (neutral during power up)
    this.setHipRotation(this.rig.leftHip, 0);
    this.setHipRotation(this.rig.rightHip, 0);
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

  // ===== TAIL ANIMATION (SMOOTH - NO GAPS!) + TWIST =====

  updateTailSway(time) {
    const joints = this.rig.tailJoints || []; // ← FIX: pakai this.rig.tailJoints
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

      // ← NEW: Twist effect (Z rotation)
      const twist =
        Math.sin(time * this.tailSwayFreq * Math.PI + phase) * 0.5 * t; // Subtle twist

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
      mat4.rotateZ(joint.localTransform, joint.localTransform, twist); // ← NEW: Twist

      // Store accumulated for debugging
      joint._currentRotY = accumulatedRotY;
      joint._currentRotX = accumulatedRotX;
      joint._currentRotZ = twist; // ← NEW: Store twist
    }
  }

  // ===== BODY MOTION =====

  updateBodyMotion() {
    const isWalking = this.currentState === GarchompAnimState.WALK_FORWARD;
    const isTurning = this.currentState === GarchompAnimState.TURN_AROUND;
    const isPoweringUp = this.currentState === GarchompAnimState.POWER_UP;

    // Skip body motion during power up (controlled by power up anim)
    if (isPoweringUp) return;

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

console.log("✅ GarchompAnimator v2.1 - POWER UP with Y-lift + Smooth easing");
console.log(
  "   Flow: WALK → IDLE#1 → 🔥ROAR🔥 → TURN → WALK → IDLE#2 → TURN → WALK → IDLE#3 → 🔥ROAR🔥..."
);
console.log(
  "   Fixes: ✓ Ground penetration fixed ✓ Smoother animation ✓ Roar on odd cycles"
);
