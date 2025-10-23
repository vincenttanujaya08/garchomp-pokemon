/**
 * Garchomp Walking + Overlay Eye Blink (NO ROAR)
 * Blink berjalan sebagai OVERLAY (independen dari state mesin utama).
 * Visual blink: scaleY -> 0, sambil squash X agar proses terlihat jelas.
 */

const GarchompAnimState = {
  WALK_FORWARD: "WALK_FORWARD",
  IDLE_PAUSE: "IDLE_PAUSE",
  TURN_AROUND: "TURN_AROUND",
};

class GarchompAnimator extends AnimationController {
  constructor(garchompNode, config = {}) {
    const defaultConfig = {
      startPos: [0, 1.5, -20],
      endPos: [0, 1.5, -10],
      startRotation: 0,

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

      // === BLINK CONFIG (overlay) ===
      // Durasi yang lebih pelan supaya “proses” scaling terlihat
      blinkClose: 0.35, // tutup
      blinkHold: 0.12, // tahan
      blinkOpen: 0.35, // buka
      // Saat scaleY mengecil, X akan melebar (squash) supaya jelas
      blinkSquashX: 0.35, // 0..1 (0 = tak melebar; 0.35 = melebar 35% saat Y=0)
      blinkAffectsPupil: true, // pupil ikut “hilang” saat iris 0

      // Jadwal kedip acak (biar bisa kedip sambil jalan/idle/turn)
      blinkMinInterval: 1.2,
      blinkMaxInterval: 3.0,
      blinkDoubleChance: 0.22, // peluang “double blink”
      blinkDoubleGap: 0.12, // jeda antar blink pada double

      // Opsional slow motion multiplier khusus blink
      blinkSpeedScale: 1.0, // 1.0 = normal, >1.0 = lebih cepat, <1.0 = lebih lambat
    };

    super(garchompNode, { ...defaultConfig, ...config });
    Object.assign(this, this.config);

    // Pos & rot awal
    this.currentPos = [...this.startPos];
    this.currentRotation = this.startRotation;

    // Cari & cache eye nodes
    this._findEyeNodes(garchompNode);
    this._cacheOriginalEyeTransforms(true); // sekali di awal

    // ====== BLINK OVERLAY RUNTIME ======
    this._blinkActive = false;
    this._blinkTime = 0;
    this._blinkQueue = 0; // untuk double blink (sisa blink yang harus dimainkan)
    this._blinkNextSchedule = this._nowPlusRandom();

    // State machine utama
    this.states = {
      [GarchompAnimState.WALK_FORWARD]: {
        onEnter: () => {
          const distToStart = Math.abs(this.currentPos[2] - this.startPos[2]);
          const distToEnd = Math.abs(this.currentPos[2] - this.endPos[2]);
          if (distToStart < distToEnd) {
            this._walkFrom = [...this.startPos];
            this._walkTo = [...this.endPos];
          } else {
            this._walkFrom = [...this.endPos];
            this._walkTo = [...this.startPos];
          }
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
          this.turnStartRot = this.currentRotation;
          this.targetRotation =
            Math.abs(this.currentRotation) < 0.5 ? Math.PI : 0;
        },
        onUpdate: (dt) => this.updateTurn(dt),
        duration: this.turnDuration,
      },
    };

    this.transitionTo(GarchompAnimState.WALK_FORWARD);
  }

  // ================== STATE MACHINE LOOP ==================
  updateStateMachine(dt) {
    const state = this.states[this.currentState];
    if (state?.onUpdate) state.onUpdate.call(this, dt);

    if (this.stateTime >= (state?.duration ?? Infinity)) {
      this.handleStateTransition();
    }

    // Animasi kontinu
    this.updateTailSway(this.totalTime);
    this.updateBodyMotion();

    // === BLINK OVERLAY (jalan kapan saja) ===
    this._updateBlinkOverlay(dt);
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
        this.transitionTo(GarchompAnimState.WALK_FORWARD);
        break;
    }
  }

  // ================== MAIN ANIMS ==================
  updateWalkForward(dt) {
    const t = this.stateTime / this.walkDuration;
    this.currentPos = this.lerpVec3(this._walkFrom, this._walkTo, t);
    this.updateWalkCycle(this.stateTime);
  }

  updateIdle(dt) {
    const t = Math.min(this.stateTime / 0.5, 1.0);
    const L = this.lerp(this.rig.leftHip?._currentAngle || 0, 0, t);
    const R = this.lerp(this.rig.rightHip?._currentAngle || 0, 0, t);
    this.setHipRotation(this.rig.leftHip, L);
    this.setHipRotation(this.rig.rightHip, R);
    if (this.rig.leftHip) this.rig.leftHip._currentAngle = L;
    if (this.rig.rightHip) this.rig.rightHip._currentAngle = R;
  }

  updateTurn(dt) {
    const t = this.stateTime / this.turnDuration;
    const eased = this.easeInOutCubic(t);
    this.currentRotation = this.lerp(
      this.turnStartRot,
      this.targetRotation,
      eased
    );
  }

  // ================== BLINK OVERLAY ==================
  _updateBlinkOverlay(dt) {
    // Jadwalkan mulai blink jika waktunya
    if (!this._blinkActive && this.totalTime >= this._blinkNextSchedule) {
      this._startBlink();
    }

    if (!this._blinkActive) return;

    const speed = Math.max(0.0001, this.blinkSpeedScale);
    this._blinkTime += dt / speed;

    const dClose = this.blinkClose;
    const dHold = this.blinkHold;
    const dOpen = this.blinkOpen;
    const total = dClose + dHold + dOpen;

    let scaleY = 1.0;

    if (this._blinkTime < dClose) {
      // CLOSE: 1 → 0 (ease-in)
      const k = this._blinkTime / dClose;
      scaleY = 1.0 - this.easeInCubic(k);
    } else if (this._blinkTime < dClose + dHold) {
      // HOLD
      scaleY = 0.0;
    } else if (this._blinkTime < total) {
      // OPEN: 0 → 1 (ease-out)
      const k = (this._blinkTime - dClose - dHold) / dOpen;
      scaleY = this.easeOutCubic(k);
    } else {
      // Selesai satu blink
      this._finishOneBlink();
      return;
    }

    // Squash X supaya proses kedip “jelas”
    const squashAmount = (1.0 - scaleY) * this.blinkSquashX; // 0..blinkSquashX
    const scaleX = 1.0 + squashAmount;
    const scaleZ = 1.0;

    this._applyEyeScaleXZ(scaleX, scaleY, scaleZ);

    if (this.blinkAffectsPupil) {
      // pupil mengikuti (bisa juga atur berbeda jika ingin)
      this._applyPupilScaleXZ(scaleX, scaleY, scaleZ);
    }
  }

  _startBlink() {
    if (!this.irisL && !this.irisR) {
      // Tidak ada node iris; jadwalkan ulang saja
      this._blinkNextSchedule = this._nowPlusRandom();
      return;
    }
    this._blinkActive = true;
    this._blinkTime = 0;

    // Double blink?
    this._blinkQueue = Math.random() < this.blinkDoubleChance ? 1 : 0;
  }

  _finishOneBlink() {
    // Kembalikan ke transform asli (clean)
    this._restoreEyeTransforms();

    if (this._blinkQueue > 0) {
      // Jadwalkan blink kedua dengan jeda kecil
      this._blinkQueue -= 1;
      this._blinkActive = false;
      this._blinkNextSchedule = this.totalTime + this.blinkDoubleGap;
    } else {
      // Selesai, jadwalkan blink berikutnya secara acak
      this._blinkActive = false;
      this._blinkNextSchedule = this._nowPlusRandom();
    }
  }

  _nowPlusRandom() {
    const a = this.blinkMinInterval;
    const b = this.blinkMaxInterval;
    const r = a + Math.random() * Math.max(0, b - a);
    return this.totalTime + r;
  }

  // ================== EYE NODES OPS ==================
  _applyEyeScaleXZ(sx, sy, sz) {
    if (this.irisL) this._scaleNodeFromOriginal(this.irisL, sx, sy, sz);
    if (this.irisR) this._scaleNodeFromOriginal(this.irisR, sx, sy, sz);
  }

  _applyPupilScaleXZ(sx, sy, sz) {
    if (this.pupilL) this._scaleNodeFromOriginal(this.pupilL, sx, sy, sz);
    if (this.pupilR) this._scaleNodeFromOriginal(this.pupilR, sx, sy, sz);
  }

  _scaleNodeFromOriginal(node, sx, sy, sz) {
    if (!node) return;
    if (!node._originalLT) node._originalLT = mat4.clone(node.localTransform);
    mat4.copy(node.localTransform, node._originalLT);
    mat4.scale(node.localTransform, node.localTransform, [sx, sy, sz]);
  }

  _cacheOriginalEyeTransforms(force = false) {
    [this.irisL, this.irisR, this.pupilL, this.pupilR].forEach((n) => {
      if (n && (force || !n._originalLT))
        n._originalLT = mat4.clone(n.localTransform);
    });
  }

  _restoreEyeTransforms() {
    [this.irisL, this.irisR, this.pupilL, this.pupilR].forEach((n) => {
      if (n?._originalLT) mat4.copy(n.localTransform, n._originalLT);
    });
  }

  _findEyeNodes(root) {
    // Prefer root.eyes bila ada
    if (root && root.eyes) {
      this.irisL = root.eyes.irisL;
      this.irisR = root.eyes.irisR;
      this.pupilL = root.eyes.pupilL;
      this.pupilR = root.eyes.pupilR;
      return;
    }
    // DFS
    const nodes = [];
    (function dfs(n) {
      if (!n) return;
      nodes.push(n);
      (n.children || []).forEach(dfs);
    })(root);
    const byName = (name) => nodes.find((n) => n.name === name);

    this.irisL = byName("EyeIrisLeft") || null;
    this.irisR = byName("EyeIrisRight") || null;
    this.pupilL = byName("EyePupilLeft") || null;
    this.pupilR = byName("EyePupilRight") || null;

    if (!this.irisL || !this.irisR) {
      const yellow = nodes.filter(
        (n) => n.materialColor === GarchompAnatomy.colors?.yellow
      );
      if (!this.irisL)
        this.irisL =
          yellow.find((n) => (n.localTransform?.[12] ?? 0) < 0) || null;
      if (!this.irisR)
        this.irisR =
          yellow.find((n) => (n.localTransform?.[12] ?? 0) > 0) || null;
    }
  }

  // ================== WALK / TAIL / BODY ==================
  updateWalkCycle(time) {
    const cycle = Math.sin(time * this.walkCycleFreq * Math.PI * 2);
    const L = cycle * this.hipSwingAngle;
    const R = -cycle * this.hipSwingAngle;
    this.setHipRotation(this.rig.leftHip, L);
    this.setHipRotation(this.rig.rightHip, R);
    if (this.rig.leftHip) this.rig.leftHip._currentAngle = L;
    if (this.rig.rightHip) this.rig.rightHip._currentAngle = R;
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

  updateTailSway(time) {
    const joints = this.rig.tailJoints || [];
    if (!joints.length) return;
    for (let i = 0; i < joints.length; i++) {
      const j = joints[i];
      const L = j?._segmentLength ?? 0.8;
      const idx = j?._segmentIndex ?? i;
      const phase = (i / joints.length) * Math.PI * 0.5;
      const t = i / joints.length;

      const swayY =
        Math.sin(time * this.tailSwayFreq * Math.PI * 2 + phase) *
        this.tailSwayAmount *
        (0.3 + 0.7 * t);
      const swayX =
        Math.sin(time * this.tailSwayFreq * Math.PI * 2 + phase + Math.PI / 2) *
        this.tailSwayAmount *
        0.2 *
        t;
      const twist =
        Math.sin(time * this.tailSwayFreq * Math.PI + phase) * 0.5 * t;

      mat4.identity(j.localTransform);
      if (idx > 0)
        mat4.translate(j.localTransform, j.localTransform, [0, 0, -L]);
      mat4.rotateY(j.localTransform, j.localTransform, swayY * 0.3);
      mat4.rotateX(j.localTransform, j.localTransform, swayX * 0.3);
      mat4.rotateZ(j.localTransform, j.localTransform, twist);
    }
  }

  updateBodyMotion() {
    const isWalking = this.currentState === GarchompAnimState.WALK_FORWARD;
    const isTurning = this.currentState === GarchompAnimState.TURN_AROUND;

    if (isWalking) {
      this.applyHeadBob();
      this.applyBodySway();
    } else {
      this.resetNeck();
      this.resetTorso();
    }

    if (isTurning) this.applyTorsoLean();
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
    const lean = Math.sin(t * Math.PI) * this.torsoLeanAmount;
    mat4.identity(this.rig.torso.localTransform);
    mat4.translate(
      this.rig.torso.localTransform,
      this.rig.torso.localTransform,
      [0, -3, 5]
    );
    mat4.rotateZ(
      this.rig.torso.localTransform,
      this.rig.torso.localTransform,
      lean
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

  // ================== EASING ==================
  easeInCubic(x) {
    return x * x * x;
  }
  easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }
  easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
}

// Export
if (typeof module !== "undefined" && module.exports)
  module.exports = GarchompAnimator;
window.GarchompAnimator = GarchompAnimator;

console.log("✅ GarchompAnimator (Overlay Blink, No Roar)");
console.log(
  "Blink: scaleY→0 + squashX (jelas), random timer, bisa saat jalan/idle/turn."
);
