// /**
//  * Mega Garchomp Walking + Attack + Roar Animation (Deterministic Flow)
//  * Extends AnimationController
//  */

// const MegaGarchompAnimState = {
//   PROWL_FORWARD: "PROWL_FORWARD",
//   IDLE_STANCE: "IDLE_STANCE",
//   ATTACK_SLASH: "ATTACK_SLASH",
//   ROAR: "ROAR",
//   TURN_AROUND: "TURN_AROUND",
//   PROWL_BACK: "PROWL_BACK",
// };

// class MegaGarchompAnimator extends AnimationController {
//   constructor(megaGarchompNode, config = {}) {
//     const defaultConfig = {
//       // Pos/rot global (dipakai kalau kamu pakai controller posisi)
//       startPos: [0, -1, 5],
//       endPos: [0, -1, -8],
//       startRotation: Math.PI,

//       // Durations
//       prowlDuration: 4.0,
//       idleDuration: 1.2, // idle sebentar untuk settle kaki
//       attackDuration: 2.0,
//       roarDuration: 3.0,
//       turnDuration: 1.2,

//       // Walk cycle
//       prowlCycleFreq: 1.2,
//       legSwingAngle: Math.PI / 8,

//       // Body
//       bodySwayAmount: 0.1,
//       headBobAmount: 0.08,
//       tailDragAmount: 0.05,

//       // Attack
//       armWindupAngle: Math.PI / 3,
//       armSlashSpeed: 8.0,

//       // Roar
//       roarLeanBack: Math.PI / 12,
//       roarHeadTilt: Math.PI / 8,
//       roarArmSpread: Math.PI / 4,
//       jawOpenAngle: Math.PI / 6,

//       // Deterministic combo
//       comboMax: 2,

//       // Foot settle
//       settleDuration: 0.35,
//     };

//     super(megaGarchompNode, { ...defaultConfig, ...config });
//     Object.assign(this, this.config);
//     this.rig = megaGarchompNode?.animationRig || this.rig;

//     // Simpan bind-pose sekali
//     this.captureBindPose();

//     // Runtime
//     this.currentPos = [...this.startPos];
//     this.currentRotation = this.startRotation;
//     this.targetRotation = this.startRotation;
//     this.comboCount = 0;

//     // Track sudut paha terakhir
//     this.lastLeftAngle = 0;
//     this.lastRightAngle = 0;

//     // ====== STATES ======
//     this.states = {
//       [MegaGarchompAnimState.PROWL_FORWARD]: {
//         onEnter: () => {
//           this.currentPos = [...this.startPos];
//           this.currentRotation = Math.PI;
//           this.targetRotation = Math.PI;
//           this.comboCount = 0;
//           this.lastLeftAngle = 0;
//           this.lastRightAngle = 0;
//         },
//         onUpdate: (dt) => this.updateProwlForward(dt),
//         duration: this.prowlDuration,
//       },

//       [MegaGarchompAnimState.IDLE_STANCE]: {
//         onEnter: () => {
//           // Mulai settle dari sudut terakhir ke 0 (bind)
//           this.idleSettleTime = 0;
//           this.idleStartLeft = this.lastLeftAngle || 0;
//           this.idleStartRight = this.lastRightAngle || 0;
//           this._snappedThisIdle = false; // supaya snap bind sekali saja
//           // Paksa shin/foot ke bind segera (mencegah miring saat transisi)
//           this.snapShinFootToBind();
//         },
//         onUpdate: (dt) => this.updateIdleStance(dt),
//         duration: this.idleDuration,
//       },

//       [MegaGarchompAnimState.ATTACK_SLASH]: {
//         onEnter: () => {
//           // Pastikan kaki rata sebelum attack
//           this.snapLegsToBind();
//           this.attackPhase = 0;
//           this.attackTime = 0;
//         },
//         onUpdate: (dt) => this.updateAttackSlash(dt),
//         duration: this.attackDuration,
//       },

//       [MegaGarchompAnimState.ROAR]: {
//         onEnter: () => {
//           // Kaki tetap di bind saat roar
//           this.snapLegsToBind();
//         },
//         onUpdate: (dt) => this.updateRoar(dt),
//         duration: this.roarDuration,
//       },

//       [MegaGarchompAnimState.TURN_AROUND]: {
//         onEnter: () => {
//           // Putar balik smooth; kaki tetap bind
//           this.snapLegsToBind();
//           this.turnStartRot = this.currentRotation;
//           this.targetRotation =
//             Math.abs(this.currentRotation - Math.PI) < 0.1 ? 0 : Math.PI;
//         },
//         onUpdate: (dt) => this.updateTurn(dt),
//         duration: this.turnDuration,
//       },

//       [MegaGarchompAnimState.PROWL_BACK]: {
//         onEnter: () => {
//           this.currentPos = [...this.endPos];
//           this.currentRotation = 0;
//           this.targetRotation = 0;
//           this.comboCount = 0;
//           this.lastLeftAngle = 0;
//           this.lastRightAngle = 0;
//         },
//         onUpdate: (dt) => this.updateProwlBack(dt),
//         duration: this.prowlDuration,
//       },
//     };

//     // Mulai dari jalan maju
//     this.transitionTo(MegaGarchompAnimState.PROWL_FORWARD);
//   }

//   // ====== BIND POSE ======
//   captureBindPose() {
//     this.bind = this.bind || {};
//     const keys = [
//       "leftThigh",
//       "rightThigh",
//       "leftShin",
//       "rightShin",
//       "leftFoot",
//       "rightFoot",
//       "torso",
//       "neck",
//       "jaw",
//     ];
//     for (const k of keys) {
//       const n = this.rig?.[k];
//       if (n && !this.bind[k]) this.bind[k] = mat4.clone(n.localTransform);
//     }

//     // Simpan upper arm kiri original buat slash
//     if (this.rig?.leftArm?.children?.[0]) {
//       const upperArm = this.rig.leftArm.children[0];
//       if (!upperArm._originalTransform) {
//         upperArm._originalTransform = mat4.clone(upperArm.localTransform);
//       }
//     }
//   }

//   // Snap helper
//   snapLegsToBind() {
//     if (this.rig.leftThigh && this.bind.leftThigh)
//       mat4.copy(this.rig.leftThigh.localTransform, this.bind.leftThigh);
//     if (this.rig.rightThigh && this.bind.rightThigh)
//       mat4.copy(this.rig.rightThigh.localTransform, this.bind.rightThigh);
//     this.snapShinFootToBind();
//     this.lastLeftAngle = 0;
//     this.lastRightAngle = 0;
//   }
//   snapShinFootToBind() {
//     if (this.rig.leftShin && this.bind.leftShin)
//       mat4.copy(this.rig.leftShin.localTransform, this.bind.leftShin);
//     if (this.rig.rightShin && this.bind.rightShin)
//       mat4.copy(this.rig.rightShin.localTransform, this.bind.rightShin);
//     if (this.rig.leftFoot && this.bind.leftFoot)
//       mat4.copy(this.rig.leftFoot.localTransform, this.bind.leftFoot);
//     if (this.rig.rightFoot && this.bind.rightFoot)
//       mat4.copy(this.rig.rightFoot.localTransform, this.bind.rightFoot);
//   }

//   // ====== STATE MACHINE TICK ======
//   updateStateMachine(deltaTime) {
//     const state = this.states[this.currentState];
//     if (!state) return;

//     if (state.onUpdate) state.onUpdate.call(this, deltaTime);
//     if (this.stateTime >= state.duration) this.handleStateTransition();

//     // Body effects
//     this.updateBodySway();
//     this.updateTailDrag();
//   }

//   handleStateTransition() {
//     switch (this.currentState) {
//       case MegaGarchompAnimState.PROWL_FORWARD:
//         // Selesai jalan → settle dulu supaya kaki rata
//         this.transitionTo(MegaGarchompAnimState.IDLE_STANCE);
//         break;

//       case MegaGarchompAnimState.IDLE_STANCE:
//         // Setelah rata → Attack
//         this.transitionTo(MegaGarchompAnimState.ATTACK_SLASH);
//         break;

//       case MegaGarchompAnimState.ATTACK_SLASH:
//         this.transitionTo(MegaGarchompAnimState.ROAR);
//         break;

//       case MegaGarchompAnimState.ROAR:
//         this.comboCount += 1;
//         if (this.comboCount < this.comboMax) {
//           this.transitionTo(MegaGarchompAnimState.ATTACK_SLASH);
//         } else {
//           this.transitionTo(MegaGarchompAnimState.TURN_AROUND);
//         }
//         break;

//       case MegaGarchompAnimState.TURN_AROUND:
//         // Setelah putar balik, pilih arah jalan baru
//         if (Math.abs(this.currentRotation - Math.PI) < 0.1) {
//           this.transitionTo(MegaGarchompAnimState.PROWL_FORWARD);
//         } else {
//           this.transitionTo(MegaGarchompAnimState.PROWL_BACK);
//         }
//         break;

//       case MegaGarchompAnimState.PROWL_BACK:
//         // Selesai jalan balik → settle dulu juga
//         this.transitionTo(MegaGarchompAnimState.IDLE_STANCE);
//         break;
//     }
//   }

//   // ====== PROWL ======
//   updateProwlForward(dt) {
//     const t = this.stateTime / this.prowlDuration;
//     this.currentPos = this.lerpVec3(this.startPos, this.endPos, t);
//     this.updateLegCycle(this.stateTime);
//   }
//   updateProwlBack(dt) {
//     const t = this.stateTime / this.prowlDuration;
//     this.currentPos = this.lerpVec3(this.endPos, this.startPos, t);
//     this.updateLegCycle(this.stateTime);
//   }

//   updateLegCycle(time) {
//     const cycle = Math.sin(time * this.prowlCycleFreq * Math.PI * 2);
//     const leftAngle = cycle * this.legSwingAngle;
//     const rightAngle = -cycle * this.legSwingAngle;

//     this.setThighFromBind(this.rig.leftThigh, this.bind.leftThigh, leftAngle);
//     this.setThighFromBind(
//       this.rig.rightThigh,
//       this.bind.rightThigh,
//       rightAngle
//     );

//     this.lastLeftAngle = leftAngle;
//     this.lastRightAngle = rightAngle;
//   }

//   setThighFromBind(thighNode, bindMat, angle) {
//     if (!thighNode || !bindMat) return;
//     mat4.copy(thighNode.localTransform, bindMat);
//     if (Math.abs(angle) > 1e-4) {
//       mat4.rotate(
//         thighNode.localTransform,
//         thighNode.localTransform,
//         angle,
//         [1, 0, 0]
//       );
//     }

//     // Reset anak-anaknya ke bind supaya posisi kaki “menapak” stabil
//     const shin = thighNode.children?.find((c) => c.name?.includes("Shin"));
//     const foot = shin?.children?.find((c) => c.name?.includes("Foot"));
//     if (shin) {
//       const key = thighNode.name?.includes("Left") ? "leftShin" : "rightShin";
//       if (this.bind[key]) mat4.copy(shin.localTransform, this.bind[key]);
//     }
//     if (foot) {
//       const key = thighNode.name?.includes("Left") ? "leftFoot" : "rightFoot";
//       if (this.bind[key]) mat4.copy(foot.localTransform, this.bind[key]);
//     }
//   }

//   // ====== IDLE + FOOT SETTLE ======
//   updateIdleStance(dt) {
//     // Interpolasi paha kembali ke sudut 0 (bind)
//     this.idleSettleTime = Math.min(
//       this.idleSettleTime + dt,
//       this.settleDuration
//     );
//     const t = this.easeInOutCubic(this.idleSettleTime / this.settleDuration);

//     const lAngle = this.lerp(this.idleStartLeft, 0, t);
//     const rAngle = this.lerp(this.idleStartRight, 0, t);

//     this.setThighFromBind(this.rig.leftThigh, this.bind.leftThigh, lAngle);
//     this.setThighFromBind(this.rig.rightThigh, this.bind.rightThigh, rAngle);

//     this.lastLeftAngle = lAngle;
//     this.lastRightAngle = rAngle;

//     // Setelah benar-benar 0°, “snap” sekali untuk menghilangkan sisa akumulasi
//     if (
//       !this._snappedThisIdle &&
//       this.idleSettleTime >= this.settleDuration - 1e-4
//     ) {
//       this.snapLegsToBind();
//       this._snappedThisIdle = true;
//     }

//     // Napas ringan di torso (relatif bind, bukan akumulatif)
//     if (this.rig.torso && this.bind?.torso) {
//       const breathe = Math.sin(this.stateTime * 2) * 0.02;
//       const m = mat4.clone(this.bind.torso);
//       const s = mat4.create();
//       mat4.scale(s, s, [1, 1 + breathe, 1]);
//       mat4.multiply(m, m, s);
//       mat4.copy(this.rig.torso.localTransform, m);
//     }
//   }

//   // ====== ATTACK SLASH ======
//   updateAttackSlash(deltaTime) {
//     const t = this.stateTime / this.attackDuration;

//     let armAngle = 0;
//     if (t < 0.3) {
//       const windupT = t / 0.3;
//       armAngle = this.easeInOutCubic(windupT) * this.armWindupAngle;
//     } else if (t < 0.5) {
//       armAngle = this.armWindupAngle;
//     } else {
//       const recoveryT = (t - 0.5) / 0.5;
//       armAngle = this.lerp(
//         this.armWindupAngle,
//         0,
//         this.easeInOutCubic(recoveryT)
//       );
//     }

//     if (this.rig.leftArm) {
//       const upperArm = this.rig.leftArm.children?.[0];
//       if (upperArm) {
//         if (!upperArm._originalTransform) {
//           upperArm._originalTransform = mat4.clone(upperArm.localTransform);
//         }
//         mat4.copy(upperArm.localTransform, upperArm._originalTransform);
//         mat4.rotate(
//           upperArm.localTransform,
//           upperArm.localTransform,
//           -armAngle,
//           [0, 0, 1]
//         );
//       }
//     }
//   }

//   // ====== ROAR ======
//   updateRoar(deltaTime) {
//     const t = this.stateTime / this.roarDuration;
//     let intensity = 0;
//     if (t < 0.2) intensity = this.easeInOutCubic(t / 0.2);
//     else if (t < 0.7) intensity = 1.0;
//     else intensity = this.easeInOutCubic(1 - (t - 0.7) / 0.3);

//     if (this.rig.torso && this.bind?.torso) {
//       const leanAngle = -this.roarLeanBack * intensity;
//       mat4.copy(this.rig.torso.localTransform, this.bind.torso);
//       mat4.rotate(
//         this.rig.torso.localTransform,
//         this.rig.torso.localTransform,
//         leanAngle,
//         [1, 0, 0]
//       );
//     }

//     if (this.rig.neck && this.bind?.neck) {
//       const tiltAngle = -this.roarHeadTilt * intensity;
//       mat4.copy(this.rig.neck.localTransform, this.bind.neck);
//       mat4.rotate(
//         this.rig.neck.localTransform,
//         this.rig.neck.localTransform,
//         tiltAngle,
//         [1, 0, 0]
//       );
//     }

//     if (this.rig.jaw && this.bind?.jaw) {
//       mat4.copy(this.rig.jaw.localTransform, this.bind.jaw);
//       mat4.rotate(
//         this.rig.jaw.localTransform,
//         this.rig.jaw.localTransform,
//         this.jawOpenAngle * intensity,
//         [1, 0, 0]
//       );
//     }
//   }

//   // ====== TURN ======
//   updateTurn(deltaTime) {
//     const t = this.stateTime / this.turnDuration;
//     const eased = this.easeInOutCubic(t);
//     this.currentRotation = this.lerp(
//       this.turnStartRot,
//       this.targetRotation,
//       eased
//     );

//     // Opsional: sedikit lean saat putar (tidak memiringkan pinggul)
//     if (this.rig.torso && this.bind?.torso) {
//       const lean = Math.sin(eased * Math.PI) * 0.06;
//       const m = mat4.clone(this.bind.torso);
//       mat4.rotateZ(m, m, lean);
//       mat4.copy(this.rig.torso.localTransform, m);
//     }
//   }

//   // ====== BODY EFFECTS ======
//   updateBodySway() {
//     const walking =
//       this.currentState === MegaGarchompAnimState.PROWL_FORWARD ||
//       this.currentState === MegaGarchompAnimState.PROWL_BACK;
//     if (!walking) return;
//     if (!this.rig.torso || !this.bind?.torso) return;

//     const sway =
//       Math.sin(this.totalTime * this.prowlCycleFreq * Math.PI) *
//       this.bodySwayAmount;

//     // Yaw saja (hindari roll yang bikin pinggul beda tinggi)
//     const m = mat4.clone(this.bind.torso);
//     mat4.rotateY(m, m, sway);
//     mat4.copy(this.rig.torso.localTransform, m);
//   }

//   updateTailDrag() {
//     if (!this.rig.tail) return;
//     const drag = Math.sin(this.totalTime * 0.8) * this.tailDragAmount;
//     mat4.identity(this.rig.tail.localTransform);
//     mat4.translate(this.rig.tail.localTransform, this.rig.tail.localTransform, [
//       0,
//       drag,
//       0,
//     ]);
//   }
// }

// // Export
// if (typeof module !== "undefined" && module.exports) {
//   module.exports = MegaGarchompAnimator;
// }
// window.MegaGarchompAnimator = MegaGarchompAnimator;

/**
 * Mega Garchomp — Idle → Attack → Roar → Turn (no walking)
 * - Tidak ada gerak maju/mundur.
 * - Putar balik 180° secara halus di setiap siklus.
 * - Kaki selalu diratakan (snap) ke bind di setiap state.
 * - Tidak ada scale di head/neck/jaw (aman dari “membesar”).
 */

const MegaGarchompAnimState = {
  IDLE_STANCE: "IDLE_STANCE",
  ATTACK_SLASH: "ATTACK_SLASH",
  ROAR: "ROAR",
  TURN_AROUND: "TURN_AROUND",
};

class MegaGarchompAnimator extends AnimationController {
  constructor(megaGarchompNode, config = {}) {
    const defaultConfig = {
      // Tetap di tempat
      startPos: [0, -1, 0],
      startRotation: Math.PI, // menghadap “depan” versi kamu

      // Durasi per state
      idleDuration: 2.0,
      attackDuration: 3.0, // ≈3 detik sesuai permintaan
      roarDuration: 3.0,
      turnDuration: 1.2, // putar balik halus

      // Efek tubuh ringan
      tailDragAmount: 0.04,

      // Attack
      armWindupAngle: Math.PI / 3,

      // Roar
      roarLeanBack: Math.PI / 12,
      roarHeadTilt: Math.PI / 8,
      jawOpenAngle: Math.PI / 6,
    };

    super(megaGarchompNode, { ...defaultConfig, ...config });
    Object.assign(this, this.config);

    // Ambil rig dari model
    this.rig = megaGarchompNode?.animationRig || this.rig;

    // Simpan bind-pose untuk semua joint yang kita pegang
    this.captureBindPose();

    // World pose (tetap)
    this.currentPos = [...this.startPos];
    this.currentRotation = this.startRotation;
    this.targetRotation = this.startRotation;

    // State machine
    this.states = {
      [MegaGarchompAnimState.IDLE_STANCE]: {
        onEnter: () => {
          this.snapLegsToBind(); // kaki rata
          this.resetTorsoFromBind(); // torso ke bind
          this.resetNeckFromBind(); // leher ke bind
        },
        onUpdate: (dt) => this.updateIdle(dt),
        duration: this.idleDuration,
      },

      [MegaGarchompAnimState.ATTACK_SLASH]: {
        onEnter: () => {
          this.snapLegsToBind(); // kunci kaki tetap rata
          this.attackTime = 0;
        },
        onUpdate: (dt) => this.updateAttackSlash(dt),
        duration: this.attackDuration,
      },

      [MegaGarchompAnimState.ROAR]: {
        onEnter: () => {
          this.snapLegsToBind(); // tetap rata
        },
        onUpdate: (dt) => this.updateRoar(dt),
        duration: this.roarDuration,
      },

      [MegaGarchompAnimState.TURN_AROUND]: {
        onEnter: () => {
          // Target = rotasi 180° dari rotasi sekarang (dibungkus 0..2π)
          this.turnStartRot = this.currentRotation;
          this.targetRotation = this.normalizeAngle(
            this.turnStartRot + Math.PI
          );
          // Selama turn, kaki & lengan tidak diayun
          this.snapLegsToBind();
          this.resetLeftUpperArm(); // biar tangan netral saat berputar
        },
        onUpdate: (dt) => this.updateTurn(dt),
        duration: this.turnDuration,
      },
    };

    // Mulai dari IDLE
    this.transitionTo(MegaGarchompAnimState.IDLE_STANCE);
  }

  /* =================== UTIL BIND & SNAP =================== */

  captureBindPose() {
    this.bind = this.bind || {};
    const keys = [
      "torso",
      "neck",
      "jaw",
      "leftThigh",
      "rightThigh",
      "leftShin",
      "rightShin",
      "leftFoot",
      "rightFoot",
      "leftArm",
      "rightArm",
    ];
    for (const k of keys) {
      const n = this.rig?.[k];
      if (n && !this.bind[k]) this.bind[k] = mat4.clone(n.localTransform);
    }
    // khusus upperArm kiri untuk slash (anak pertama dari leftArm)
    if (this.rig?.leftArm?.children?.[0]) {
      const upperArm = this.rig.leftArm.children[0];
      if (!upperArm._originalTransform) {
        upperArm._originalTransform = mat4.clone(upperArm.localTransform);
      }
    }
  }

  snapLegsToBind() {
    // paha
    if (this.rig.leftThigh && this.bind.leftThigh)
      mat4.copy(this.rig.leftThigh.localTransform, this.bind.leftThigh);
    if (this.rig.rightThigh && this.bind.rightThigh)
      mat4.copy(this.rig.rightThigh.localTransform, this.bind.rightThigh);
    // betis
    if (this.rig.leftShin && this.bind.leftShin)
      mat4.copy(this.rig.leftShin.localTransform, this.bind.leftShin);
    if (this.rig.rightShin && this.bind.rightShin)
      mat4.copy(this.rig.rightShin.localTransform, this.bind.rightShin);
    // telapak
    if (this.rig.leftFoot && this.bind.leftFoot)
      mat4.copy(this.rig.leftFoot.localTransform, this.bind.leftFoot);
    if (this.rig.rightFoot && this.bind.rightFoot)
      mat4.copy(this.rig.rightFoot.localTransform, this.bind.rightFoot);
  }

  resetTorsoFromBind() {
    if (this.rig.torso && this.bind.torso)
      mat4.copy(this.rig.torso.localTransform, this.bind.torso);
  }

  resetNeckFromBind() {
    if (this.rig.neck && this.bind.neck)
      mat4.copy(this.rig.neck.localTransform, this.bind.neck);
    if (this.rig.jaw && this.bind.jaw)
      mat4.copy(this.rig.jaw.localTransform, this.bind.jaw);
  }

  resetLeftUpperArm() {
    const upperArm = this.rig?.leftArm?.children?.[0];
    if (upperArm && upperArm._originalTransform) {
      mat4.copy(upperArm.localTransform, upperArm._originalTransform);
    }
  }

  normalizeAngle(a) {
    const TWO_PI = Math.PI * 2;
    a = a % TWO_PI;
    return a < 0 ? a + TWO_PI : a;
  }

  /* =================== UPDATE LOOP =================== */

  updateStateMachine(deltaTime) {
    const state = this.states[this.currentState];
    if (!state) return;

    // Jalankan update state
    if (state.onUpdate) state.onUpdate.call(this, deltaTime);

    // Waktu habis? transisi
    if (this.stateTime >= state.duration) {
      this.handleTransition();
    }

    // Efek ekor kecil (aman tidak mengubah pose kaki)
    this.updateTailDrag();
  }

  handleTransition() {
    switch (this.currentState) {
      case MegaGarchompAnimState.IDLE_STANCE:
        this.transitionTo(MegaGarchompAnimState.ATTACK_SLASH);
        break;
      case MegaGarchompAnimState.ATTACK_SLASH:
        this.transitionTo(MegaGarchompAnimState.ROAR);
        break;
      case MegaGarchompAnimState.ROAR:
        this.transitionTo(MegaGarchompAnimState.TURN_AROUND);
        break;
      case MegaGarchompAnimState.TURN_AROUND:
        this.transitionTo(MegaGarchompAnimState.IDLE_STANCE);
        break;
    }
  }

  /* =================== STATE UPDATES =================== */

  updateIdle(dt) {
    // Idle ringan: leher/torso balik ke bind (sudah di onEnter),
    // tidak ada sway yang bikin pinggul miring.
    this.snapLegsToBind(); // jaga-jaga
  }

  updateAttackSlash(dt) {
    const t = this.stateTime / this.attackDuration;

    // 30% windup, 20% hold/slash, 50% recovery
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

    // Rotasi upperArm kiri (anak pertama dari leftArm)
    const upperArm = this.rig?.leftArm?.children?.[0];
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

    // Pastikan kaki tetap rata
    this.snapLegsToBind();
  }

  updateRoar(dt) {
    const t = this.stateTime / this.roarDuration;
    let intensity = 0;
    if (t < 0.2) intensity = this.easeInOutCubic(t / 0.2);
    else if (t < 0.7) intensity = 1.0;
    else intensity = this.easeInOutCubic(1 - (t - 0.7) / 0.3);

    // Torso lean back (rotate X)
    if (this.rig.torso && this.bind.torso) {
      mat4.copy(this.rig.torso.localTransform, this.bind.torso);
      mat4.rotate(
        this.rig.torso.localTransform,
        this.rig.torso.localTransform,
        -this.roarLeanBack * intensity,
        [1, 0, 0]
      );
    }

    // Head tilt via neck
    if (this.rig.neck && this.bind.neck) {
      mat4.copy(this.rig.neck.localTransform, this.bind.neck);
      mat4.rotate(
        this.rig.neck.localTransform,
        this.rig.neck.localTransform,
        -this.roarHeadTilt * intensity,
        [1, 0, 0]
      );
    }

    // Jaw open
    if (this.rig.jaw && this.bind.jaw) {
      mat4.copy(this.rig.jaw.localTransform, this.bind.jaw);
      mat4.rotate(
        this.rig.jaw.localTransform,
        this.rig.jaw.localTransform,
        this.jawOpenAngle * intensity,
        [1, 0, 0]
      );
    }

    // Kaki tetap rata
    this.snapLegsToBind();
  }

  updateTurn(dt) {
    const t = Math.min(this.stateTime / this.turnDuration, 1.0);
    const eased = this.easeInOutCubic(t);

    // Interpolasi rotasi halus (shortest arc)
    const start = this.normalizeAngle(this.turnStartRot);
    const end = this.normalizeAngle(this.targetRotation);

    // pilih arah rotasi terpendek
    let delta = end - start;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    this.currentRotation = this.normalizeAngle(start + delta * eased);

    // Selama turn: kaki & lengan netral
    this.snapLegsToBind();
    this.resetLeftUpperArm();
    this.resetNeckFromBind();
    this.resetTorsoFromBind();
  }

  /* =================== SMALL FX =================== */

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

/* ===== Exports ===== */
if (typeof module !== "undefined" && module.exports) {
  module.exports = MegaGarchompAnimator;
}
window.MegaGarchompAnimator = MegaGarchompAnimator;
