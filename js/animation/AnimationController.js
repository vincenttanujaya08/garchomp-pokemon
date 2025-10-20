/**
 * Base Animation Controller
 * Template untuk semua Pokemon animations
 * Teman bisa extend class ini untuk Pokemon mereka
 */

class AnimationController {
  constructor(entityNode, config = {}) {
    this.entity = entityNode;
    this.rig = entityNode.animationRig || {};

    // Timing
    this.totalTime = 0;
    this.stateTime = 0;

    // State machine
    this.currentState = null;
    this.states = {}; // Override di subclass

    // Transform
    this.currentPos = config.startPos ? [...config.startPos] : [0, 0, 0];
    this.currentRotation = config.startRotation || 0;

    // Config (bisa di-override)
    this.config = {
      startPos: [0, 0, 0],
      endPos: [0, 0, -10],
      ...config,
    };
  }

  /**
   * Main update loop - dipanggil tiap frame
   * @param {number} deltaTime - Time since last frame (seconds)
   */
  update(deltaTime) {
    this.totalTime += deltaTime;
    this.stateTime += deltaTime;

    // Override di subclass untuk implement state machine
    this.updateStateMachine(deltaTime);

    // Apply final transforms
    this.applyTransforms();
  }

  /**
   * State machine logic - OVERRIDE di subclass
   */
  updateStateMachine(deltaTime) {
    console.warn("AnimationController.updateStateMachine() not implemented");
  }

  /**
   * Transition ke state baru
   */
  transitionTo(newState) {
    if (this.currentState) {
      console.log(`${this.entity.name}: ${this.currentState} -> ${newState}`);
    }
    this.currentState = newState;
    this.stateTime = 0;

    // Call state enter callback jika ada
    const stateHandler = this.states[newState];
    if (stateHandler && stateHandler.onEnter) {
      stateHandler.onEnter.call(this);
    }
  }

  /**
   * Apply transform ke entity root node
   */
  applyTransforms() {
    mat4.identity(this.entity.localTransform);

    // Position
    mat4.translate(
      this.entity.localTransform,
      this.entity.localTransform,
      this.currentPos
    );

    // Rotation (Y-axis)
    mat4.rotateY(
      this.entity.localTransform,
      this.entity.localTransform,
      this.currentRotation
    );

    // Scale (dari config)
    const cfg = window.entityConfig?.[this.entity.name];
    if (cfg && cfg.scale) {
      mat4.scale(
        this.entity.localTransform,
        this.entity.localTransform,
        cfg.scale
      );
    }
  }

  /**
   * Helper: Linear interpolation
   */
  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * Helper: Cubic ease in-out
   */
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Helper: Vector3 lerp
   */
  lerpVec3(a, b, t) {
    return [
      this.lerp(a[0], b[0], t),
      this.lerp(a[1], b[1], t),
      this.lerp(a[2], b[2], t),
    ];
  }
}

// Export untuk module system (jika pakai)
if (typeof module !== "undefined" && module.exports) {
  module.exports = AnimationController;
}

// Global untuk browser
window.AnimationController = AnimationController;
