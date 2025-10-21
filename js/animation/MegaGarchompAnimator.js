/**
 * Mega Garchomp Animator
 * Static pose - hanya set posisi di Island C
 */

class MegaGarchompAnimator extends AnimationController {
  constructor(megaGarchompNode, config = {}) {
    const defaultConfig = {
      startPos: [0, -2, -100], // Island C position
      startRotation: 0,
    };

    super(megaGarchompNode, { ...defaultConfig, ...config });

    this.currentPos = [...this.startPos];
    this.currentRotation = this.startRotation;
  }

  updateStateMachine(deltaTime) {
    // Static - tidak ada animasi
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = MegaGarchompAnimator;
}

window.MegaGarchompAnimator = MegaGarchompAnimator;
