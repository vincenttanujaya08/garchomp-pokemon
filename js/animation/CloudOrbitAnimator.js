/**
 * CloudOrbitAnimator.js
 * Animates clouds in orbital paths around island centers
 * Similar to a solar system - each cloud orbits at different radius and speed
 */

class CloudOrbitAnimator {
  /**
   * @param {SceneNode} cloudNode - The cloud node to animate
   * @param {Object} config - Animation configuration
   */
  constructor(cloudNode, config = {}) {
    this.cloudNode = cloudNode;
    this.config = {
      // Orbit parameters
      orbitRadius: 40, // Distance from island center (XZ plane)
      orbitHeight: 15, // Y offset from island
      orbitSpeed: 0.3, // Radians per second
      orbitTilt: 0, // Tilt angle of orbit plane (radians)

      // Starting position
      startAngle: Math.random() * Math.PI * 2, // Random start position

      // Island center (will be set from outside)
      islandCenter: [0, 0, 0],

      // Variation parameters (to make it more natural)
      heightVariation: 2, // ± Y wobble amplitude
      heightVariationSpeed: 0.5, // Speed of Y wobble

      radiusVariation: 3, // ± radius wobble amplitude
      radiusVariationSpeed: 0.7, // Speed of radius wobble

      // Cloud self-rotation
      selfRotationSpeed: 0.1, // Radians per second around Y axis

      // Scale pulsing (breathing effect)
      scalePulse: 0.05, // ± scale variation (0.05 = ±5%)
      scalePulseSpeed: 0.8, // Speed of scale pulsing

      ...config,
    };

    // Runtime state
    this.currentAngle = this.config.startAngle;
    this.time = 0;

    // Store original transform to preserve cloud's local properties
    this._originalLocalTransform = mat4.clone(this.cloudNode.localTransform);

    // Get original scale from the cloud node
    const m = this._originalLocalTransform;
    this._originalScale = [
      Math.hypot(m[0], m[1], m[2]),
      Math.hypot(m[4], m[5], m[6]),
      Math.hypot(m[8], m[9], m[10]),
    ];
  }

  /**
   * Update animation
   * @param {number} deltaTime - Time since last frame (seconds)
   */
  update(deltaTime) {
    this.time += deltaTime;

    // Update orbit angle
    this.currentAngle += this.config.orbitSpeed * deltaTime;

    // Calculate base orbital position (XZ circle)
    const baseRadius = this.config.orbitRadius;
    const radiusWobble =
      Math.sin(this.time * this.config.radiusVariationSpeed) *
      this.config.radiusVariation;
    const radius = baseRadius + radiusWobble;

    // Position in XZ plane relative to island
    const x = Math.cos(this.currentAngle) * radius;
    const z = Math.sin(this.currentAngle) * radius;

    // Height with wobble (Y axis)
    const baseHeight = this.config.orbitHeight;
    const heightWobble =
      Math.sin(this.time * this.config.heightVariationSpeed) *
      this.config.heightVariation;
    const y = baseHeight + heightWobble;

    // Apply orbit tilt (optional, untuk orbit yang miring)
    let finalX = x;
    let finalY = y;
    let finalZ = z;

    if (Math.abs(this.config.orbitTilt) > 0.001) {
      const tilt = this.config.orbitTilt;
      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);

      // Rotate around X axis to tilt the orbit
      finalY = y * cosTilt - z * sinTilt;
      finalZ = y * sinTilt + z * cosTilt;
    }

    // World position = island center + orbital offset
    const worldX = this.config.islandCenter[0] + finalX;
    const worldY = this.config.islandCenter[1] + finalY;
    const worldZ = this.config.islandCenter[2] + finalZ;

    // Build transform matrix
    const transform = mat4.create();

    // 1. Position
    mat4.translate(transform, transform, [worldX, worldY, worldZ]);

    // 2. Self-rotation around Y axis
    const selfRotation = this.time * this.config.selfRotationSpeed;
    mat4.rotateY(transform, transform, selfRotation);

    // 3. Scale with pulsing (breathing effect)
    const scaleFactor =
      1.0 +
      Math.sin(this.time * this.config.scalePulseSpeed) *
        this.config.scalePulse;
    const finalScale = [
      this._originalScale[0] * scaleFactor,
      this._originalScale[1] * scaleFactor,
      this._originalScale[2] * scaleFactor,
    ];
    mat4.scale(transform, transform, finalScale);

    // Apply to cloud node
    mat4.copy(this.cloudNode.localTransform, transform);
  }

  /**
   * Set island center position (called from main.js)
   */
  setIslandCenter(center) {
    this.config.islandCenter = center;
  }

  /**
   * Reset animation to initial state
   */
  reset() {
    this.currentAngle = this.config.startAngle;
    this.time = 0;
  }
}

// Export
window.CloudOrbitAnimator = CloudOrbitAnimator;
console.log("✅ CloudOrbitAnimator loaded - Solar system style cloud orbits!");
