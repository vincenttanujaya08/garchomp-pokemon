// /**
//  * Mega Garchomp Walking + Attack + Roar Animation (Deterministic Flow)
//  * FIXED: Start menghadap kamera, bukan membelakangi
//  * Extends AnimationController
//  */

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
      // Pos/rot global
      startPos: [0, -1, -8], // FIXED: Start dari jauh (Z negatif)
      endPos: [0, -1, 5], // FIXED: End di dekat (Z positif = mendekat kamera)
      startRotation: 0, // 0° = menghadap -Z (ke arah kamera)

      // Durations
      prowlDuration: 4.0,
      idleDuration: 1.2,
      attackDuration: 2.0,
      roarDuration: 3.0,
      turnDuration: 1.2,

      // Walk cycle
      prowlCycleFreq: 1.2,
      legSwingAngle: Math.PI / 8,

      // Body
      bodySwayAmount: 0.1,
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

      // Deterministic combo
      comboMax: 2,

      // Foot settle
      settleDuration: 0.35,
    };

    super(megaGarchompNode, { ...defaultConfig, ...config });
    Object.assign(this, this.config);
    this.rig = megaGarchompNode?.animationRig || this.rig;

    // Simpan bind-pose sekali
    this.captureBindPose();

    // Runtime
    this.currentPos = [...this.startPos];
    this.currentRotation = this.startRotation; // Start = 0°
    this.targetRotation = this.startRotation;
    this.comboCount = 0;

    // Track sudut paha terakhir
    this.lastLeftAngle = 0;
    this.lastRightAngle = 0;

    // ====== STATES ======
    this.states = {
      [MegaGarchompAnimState.PROWL_FORWARD]: {
        onEnter: () => {
          // Tentukan arah jalan berdasarkan posisi sekarang
          const distToStart = Math.abs(this.currentPos[2] - this.startPos[2]);
          const distToEnd = Math.abs(this.currentPos[2] - this.endPos[2]);

          if (distToStart < distToEnd) {
            // Lebih dekat ke start → jalan ke end
            this._prowlFrom = [...this.startPos];
            this._prowlTo = [...this.endPos];
          } else {
            // Lebih dekat ke end → jalan ke start
            this._prowlFrom = [...this.endPos];
            this._prowlTo = [...this.startPos];
          }

          // FIXED: Rotation tetap dari TURN sebelumnya
          // Jangan override currentRotation!
          this.targetRotation = this.currentRotation;
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
          this._snappedThisIdle = false;
          this.snapShinFootToBind();
        },
        onUpdate: (dt) => this.updateIdleStance(dt),
        duration: this.idleDuration,
      },

      [MegaGarchompAnimState.ATTACK_SLASH]: {
        onEnter: () => {
          this.snapLegsToBind();
          this.attackPhase = 0;
          this.attackTime = 0;
        },
        onUpdate: (dt) => this.updateAttackSlash(dt),
        duration: this.attackDuration,
      },

      [MegaGarchompAnimState.ROAR]: {
        onEnter: () => {
          this.snapLegsToBind();
        },
        onUpdate: (dt) => this.updateRoar(dt),
        duration: this.roarDuration,
      },

      [MegaGarchompAnimState.TURN_AROUND]: {
        onEnter: () => {
          this.snapLegsToBind();
          this.turnStartRot = this.currentRotation;
          // Toggle: kalau sekarang ~0° → putar ke 180°, kalau ~180° → putar ke 0°
          if (Math.abs(this.currentRotation) < 0.5) {
            this.targetRotation = Math.PI; // 0° → 180°
          } else {
            this.targetRotation = 0; // 180° → 0°
          }
        },
        onUpdate: (dt) => this.updateTurn(dt),
        duration: this.turnDuration,
      },

      [MegaGarchompAnimState.PROWL_BACK]: {
        onEnter: () => {
          this.currentPos = [...this.endPos];
          this.currentRotation = Math.PI; // Tetap membelakangi
          this.targetRotation = Math.PI;
          this.comboCount = 0;
          this.lastLeftAngle = 0;
          this.lastRightAngle = 0;
        },
        onUpdate: (dt) => this.updateProwlBack(dt),
        duration: this.prowlDuration,
      },
    };

    // FIXED: Mulai dari IDLE (menghadap kamera), bukan PROWL
    this.currentRotation = 0; // Start menghadap kamera
    this.transitionTo(MegaGarchompAnimState.IDLE_STANCE);
  }

  // ====== BIND POSE ======
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
      "head", // ✅ ADD THIS
      "jaw",
    ];
    for (const k of keys) {
      const n = this.rig?.[k];
      if (n && !this.bind[k]) this.bind[k] = mat4.clone(n.localTransform);
    }

    // Simpan upper arm kiri original buat slash
    if (this.rig?.leftArm?.children?.[0]) {
      const upperArm = this.rig.leftArm.children[0];
      if (!upperArm._originalTransform) {
        upperArm._originalTransform = mat4.clone(upperArm.localTransform);
      }
    }
  }

  // Snap helper
  snapLegsToBind() {
    if (this.rig.leftThigh && this.bind.leftThigh)
      mat4.copy(this.rig.leftThigh.localTransform, this.bind.leftThigh);
    if (this.rig.rightThigh && this.bind.rightThigh)
      mat4.copy(this.rig.rightThigh.localTransform, this.bind.rightThigh);
    this.snapShinFootToBind();
    this.lastLeftAngle = 0;
    this.lastRightAngle = 0;
  }
  snapShinFootToBind() {
    if (this.rig.leftShin && this.bind.leftShin)
      mat4.copy(this.rig.leftShin.localTransform, this.bind.leftShin);
    if (this.rig.rightShin && this.bind.rightShin)
      mat4.copy(this.rig.rightShin.localTransform, this.bind.rightShin);
    if (this.rig.leftFoot && this.bind.leftFoot)
      mat4.copy(this.rig.leftFoot.localTransform, this.bind.leftFoot);
    if (this.rig.rightFoot && this.bind.rightFoot)
      mat4.copy(this.rig.rightFoot.localTransform, this.bind.rightFoot);
  }

  // ====== STATE MACHINE TICK ======
  updateStateMachine(deltaTime) {
    const state = this.states[this.currentState];
    if (!state) return;

    if (state.onUpdate) state.onUpdate.call(this, deltaTime);
    if (this.stateTime >= state.duration) this.handleStateTransition();

    // Body effects
    this.updateBodySway();
    this.updateTailDrag();
  }

  // Di dalam class MegaGarchompAnimator, tambahkan method ini:

  // Di class MegaGarchompAnimator
  updateTailSway(time) {
    const joints = this.rig.tailJoints || [];
    if (joints.length === 0) return;

    // ✅ TUNING PARAMETERS untuk smoothness
    const swayFrequency = 0.8; // ← Lebih lambat (dari 1.2)
    const swayAmount = 0.25; // ← Lebih besar amplitude
    const phaseShift = Math.PI * 0.8; // ← Lebih smooth phase shift

    let accumulatedRotY = 0;
    let accumulatedRotX = 0;

    for (let i = 0; i < joints.length; i++) {
      const joint = joints[i];
      if (!joint) continue;

      const segmentLength = joint._segmentLength || 0.6;
      const segmentIndex = joint._segmentIndex || i;

      // ✅ SMOOTH: Phase shift yang lebih gradual
      const phase = (i / joints.length) * phaseShift;
      const t = i / joints.length;

      // ✅ SMOOTH: Easing untuk amplitude (lebih smooth di base, lebih besar di tip)
      const amplitudeCurve = 0.2 + 0.8 * this.easeInOutCubic(t);

      // ✅ Primary sway (horizontal)
      const swayY =
        Math.sin(time * swayFrequency * Math.PI * 2 + phase) *
        swayAmount *
        amplitudeCurve;

      // ✅ Secondary sway (vertical, lebih kecil)
      const swayX =
        Math.sin(time * swayFrequency * Math.PI * 2 + phase + Math.PI / 2) *
        swayAmount *
        0.3 * // ← Lebih kecil dari Y sway
        amplitudeCurve;

      // ✅ Twist (subtle)
      const twist =
        Math.sin(time * swayFrequency * Math.PI + phase) *
        0.15 * // ← Reduced dari 0.3
        t;

      // ✅ SMOOTH: Rotasi per-segment yang lebih kecil
      const rotationDamping = 0.35; // ← Lebih kecil = lebih smooth

      accumulatedRotY += swayY * rotationDamping;
      accumulatedRotX += swayX * rotationDamping;

      mat4.identity(joint.localTransform);

      // Position
      if (segmentIndex > 0) {
        mat4.translate(joint.localTransform, joint.localTransform, [
          0,
          0,
          -segmentLength,
        ]);
      }

      // ✅ Apply rotations dengan smooth blending
      mat4.rotateY(
        joint.localTransform,
        joint.localTransform,
        swayY * rotationDamping
      );
      mat4.rotateX(
        joint.localTransform,
        joint.localTransform,
        swayX * rotationDamping
      );
      mat4.rotateZ(joint.localTransform, joint.localTransform, twist);

      // Store for debugging
      joint._currentRotY = accumulatedRotY;
      joint._currentRotX = accumulatedRotX;
      joint._currentRotZ = twist;
    }
  }

  // Dan panggil di updateStateMachine():
  updateStateMachine(deltaTime) {
    const state = this.states[this.currentState];
    if (!state) return;

    if (state.onUpdate) state.onUpdate.call(this, deltaTime);
    if (this.stateTime >= state.duration) this.handleStateTransition();

    // Body effects
    this.updateBodySway();
    this.updateTailSway(this.totalTime); // ✅ ADD THIS
  }
  handleStateTransition() {
    switch (this.currentState) {
      case MegaGarchompAnimState.PROWL_FORWARD:
        this.transitionTo(MegaGarchompAnimState.IDLE_STANCE);
        break;

      case MegaGarchompAnimState.IDLE_STANCE:
        // Kalau baru pertama kali (comboCount=0), langsung attack
        // Kalau habis jalan, langsung attack juga
        this.transitionTo(MegaGarchompAnimState.ATTACK_SLASH);
        break;

      case MegaGarchompAnimState.ATTACK_SLASH:
        this.transitionTo(MegaGarchompAnimState.ROAR);
        break;

      case MegaGarchompAnimState.ROAR:
        // Selesai roar → langsung putar balik
        this.transitionTo(MegaGarchompAnimState.TURN_AROUND);
        break;

      case MegaGarchompAnimState.TURN_AROUND:
        // Setelah putar → jalan
        this.transitionTo(MegaGarchompAnimState.PROWL_FORWARD);
        break;

      case MegaGarchompAnimState.PROWL_BACK:
        // Tidak dipakai lagi
        this.transitionTo(MegaGarchompAnimState.IDLE_STANCE);
        break;
    }
  }

  // ====== PROWL ======
  updateProwlForward(dt) {
    const t = this.stateTime / this.prowlDuration;
    this.currentPos = this.lerpVec3(this._prowlFrom, this._prowlTo, t);
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

    this.setThighFromBind(this.rig.leftThigh, this.bind.leftThigh, leftAngle);
    this.setThighFromBind(
      this.rig.rightThigh,
      this.bind.rightThigh,
      rightAngle
    );

    this.lastLeftAngle = leftAngle;
    this.lastRightAngle = rightAngle;
  }

  setThighFromBind(thighNode, bindMat, angle) {
    if (!thighNode || !bindMat) return;
    mat4.copy(thighNode.localTransform, bindMat);
    if (Math.abs(angle) > 1e-4) {
      mat4.rotate(
        thighNode.localTransform,
        thighNode.localTransform,
        angle,
        [1, 0, 0]
      );
    }

    // Reset anak-anaknya ke bind
    const shin = thighNode.children?.find((c) => c.name?.includes("Shin"));
    const foot = shin?.children?.find((c) => c.name?.includes("Foot"));
    if (shin) {
      const key = thighNode.name?.includes("Left") ? "leftShin" : "rightShin";
      if (this.bind[key]) mat4.copy(shin.localTransform, this.bind[key]);
    }
    if (foot) {
      const key = thighNode.name?.includes("Left") ? "leftFoot" : "rightFoot";
      if (this.bind[key]) mat4.copy(foot.localTransform, this.bind[key]);
    }
  }

  // ====== IDLE + FOOT SETTLE ======
  updateIdleStance(dt) {
    this.idleSettleTime = Math.min(
      this.idleSettleTime + dt,
      this.settleDuration
    );
    const t = this.easeInOutCubic(this.idleSettleTime / this.settleDuration);

    const lAngle = this.lerp(this.idleStartLeft, 0, t);
    const rAngle = this.lerp(this.idleStartRight, 0, t);

    this.setThighFromBind(this.rig.leftThigh, this.bind.leftThigh, lAngle);
    this.setThighFromBind(this.rig.rightThigh, this.bind.rightThigh, rAngle);

    this.lastLeftAngle = lAngle;
    this.lastRightAngle = rAngle;

    if (
      !this._snappedThisIdle &&
      this.idleSettleTime >= this.settleDuration - 1e-4
    ) {
      this.snapLegsToBind();
      this._snappedThisIdle = true;
    }

    // Napas ringan di torso
    if (this.rig.torso && this.bind?.torso) {
      const breathe = Math.sin(this.stateTime * 2) * 0.02;
      const m = mat4.clone(this.bind.torso);
      const s = mat4.create();
      mat4.scale(s, s, [1, 1 + breathe, 1]);
      mat4.multiply(m, m, s);
      mat4.copy(this.rig.torso.localTransform, m);
    }
  }

  // ====== ATTACK SLASH ======
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

  // ====== ROAR ======
  // ====== ROAR ======
  updateRoar(deltaTime) {
    const t = this.stateTime / this.roarDuration;
    let intensity = 0;
    if (t < 0.2) intensity = this.easeInOutCubic(t / 0.2);
    else if (t < 0.7) intensity = 1.0;
    else intensity = this.easeInOutCubic(1 - (t - 0.7) / 0.3);

    // ===== TORSO LEAN =====
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

    // ===== NECK TILT =====
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

    // ===== HEAD SCALE (NEW!) =====
    if (this.rig.head && this.bind?.head) {
      // Scale curve: grow slightly during roar peak
      let headScale = 1.0;

      if (t < 0.3) {
        // Phase 1: Quick grow (0.0 - 0.3s)
        const growT = t / 0.3;
        headScale = this.lerp(1.0, 1.08, this.easeOutBack(growT)); // 8% bigger
      } else if (t < 0.7) {
        // Phase 2: Hold at max (0.3 - 0.7s)
        headScale = 1.08;
      } else {
        // Phase 3: Settle back (0.7 - 1.0s)
        const settleT = (t - 0.7) / 0.3;
        headScale = this.lerp(1.08, 1.0, this.easeInOutCubic(settleT));
      }

      // Apply scale to head
      mat4.copy(this.rig.head.localTransform, this.bind.head);
      mat4.scale(this.rig.head.localTransform, this.rig.head.localTransform, [
        headScale,
        headScale,
        headScale,
      ]);
    }

    // ===== JAW OPEN =====
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

  // ====== TURN ======
  updateTurn(deltaTime) {
    const t = this.stateTime / this.turnDuration;
    const eased = this.easeInOutCubic(t);
    this.currentRotation = this.lerp(
      this.turnStartRot,
      this.targetRotation,
      eased
    );

    // Lean saat putar
    if (this.rig.torso && this.bind?.torso) {
      const lean = Math.sin(eased * Math.PI) * 0.06;
      const m = mat4.clone(this.bind.torso);
      mat4.rotateZ(m, m, lean);
      mat4.copy(this.rig.torso.localTransform, m);
    }
  }

  // ====== BODY EFFECTS ======
  updateBodySway() {
    const walking =
      this.currentState === MegaGarchompAnimState.PROWL_FORWARD ||
      this.currentState === MegaGarchompAnimState.PROWL_BACK;
    if (!walking) return;
    if (!this.rig.torso || !this.bind?.torso) return;

    const sway =
      Math.sin(this.totalTime * this.prowlCycleFreq * Math.PI) *
      this.bodySwayAmount;

    const m = mat4.clone(this.bind.torso);
    mat4.rotateY(m, m, sway);
    mat4.copy(this.rig.torso.localTransform, m);
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
