/**
 * CloudAnimator.js - Smooth Orbiting & Bobbing Animation for Clouds
 * Extends AnimationController for consistency with Pokemon animations
 * FIXED: Properly handles existing cloud nodes without mesh conflicts
 */

class CloudAnimator extends AnimationController {
  constructor(cloudNode, islandCenterWorld, config = {}) {
    super(cloudNode, config);

    // Island reference point (world coordinates)
    this.islandCenter = islandCenterWorld || [0, 0, 0];

    // Cloud-specific config dengan defaults
    const defaults = {
      // Orbit parameters
      orbitRadius: 40.0, // Distance from island center
      orbitSpeed: 0.08, // Radians per second (0.05-0.15 recommended)
      orbitAxis: [0, 1, 0.1], // Rotation axis (normalized internally)
      orbitPhase: 0, // Starting angle offset

      // Bobbing (vertical oscillation)
      bobbingAmplitude: 0.5, // Up-down distance
      bobbingFrequency: 0.6, // Cycles per second
      bobbingPhase: 0, // Starting phase offset

      // Self-rotation (cloud spins slowly on itself)
      selfRotationSpeed: 0.02, // Very slow rotation
      selfRotationAxis: [0, 1, 0], // Usually Y-axis

      // Height offset from island center
      heightOffset: 0, // Additional Y offset
    };

    // Merge config
    Object.assign(this, { ...defaults, ...config });

    // Normalize orbit axis
    this.orbitAxis = this.normalizeVec3(this.orbitAxis);
    this.selfRotationAxis = this.normalizeVec3(this.selfRotationAxis);

    // Runtime state
    this.currentOrbitAngle = this.orbitPhase;
    this.currentSelfRotation = 0;

    // IMPORTANT: Store INITIAL local transform to preserve scale
    this.initialTransform = mat4.clone(this.entity.localTransform);
    this.initialScale = this.extractScale(this.initialTransform);

    console.log(
      `☁️ CloudAnimator initialized for ${
        this.entity.name || "Cloud"
      } with scale [${this.initialScale.map((s) => s.toFixed(2)).join(", ")}]`
    );
  }

  /**
   * Main update loop
   */
  update(deltaTime) {
    this.totalTime += deltaTime;

    // 1. Update orbit angle
    this.currentOrbitAngle += this.orbitSpeed * deltaTime;

    // 2. Update self-rotation
    this.currentSelfRotation += this.selfRotationSpeed * deltaTime;

    // 3. Calculate bobbing offset
    const bobbingOffset =
      Math.sin(
        this.totalTime * this.bobbingFrequency * Math.PI * 2 + this.bobbingPhase
      ) * this.bobbingAmplitude;

    // 4. Calculate orbit position using arbitrary axis rotation
    const orbitPos = this.calculateOrbitPosition(
      this.currentOrbitAngle,
      this.orbitRadius,
      this.orbitAxis
    );

    // 5. Final world position = island center + orbit + height + bobbing
    const finalPos = [
      this.islandCenter[0] + orbitPos[0],
      this.islandCenter[1] + this.heightOffset + bobbingOffset,
      this.islandCenter[2] + orbitPos[2],
    ];

    // 6. Build transform matrix (CRITICAL: Preserve scale!)
    this.buildTransformMatrix(finalPos, this.currentSelfRotation);
  }

  /**
   * Calculate orbit position using arbitrary axis rotation (Rodrigues' rotation formula)
   * @param {number} angle - Current orbit angle (radians)
   * @param {number} radius - Orbit radius
   * @param {Array} axis - Normalized rotation axis [x, y, z]
   * @returns {Array} Position offset [x, y, z]
   */
  calculateOrbitPosition(angle, radius, axis) {
    // Start vector: point on XZ plane
    const startVec = [radius, 0, 0];

    // Rodrigues' rotation formula: v' = v*cos(θ) + (k×v)*sin(θ) + k*(k·v)*(1-cos(θ))
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const k = axis;
    const v = startVec;

    // k × v (cross product)
    const cross = [
      k[1] * v[2] - k[2] * v[1],
      k[2] * v[0] - k[0] * v[2],
      k[0] * v[1] - k[1] * v[0],
    ];

    // k · v (dot product)
    const dot = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];

    // Final rotation
    const rotated = [
      v[0] * cosA + cross[0] * sinA + k[0] * dot * (1 - cosA),
      v[1] * cosA + cross[1] * sinA + k[1] * dot * (1 - cosA),
      v[2] * cosA + cross[2] * sinA + k[2] * dot * (1 - cosA),
    ];

    return rotated;
  }

  /**
   * Build final transform matrix
   * CRITICAL FIX: Preserve initial scale from createCloud1/createCloud2
   */
  buildTransformMatrix(position, selfRotation) {
    // Start fresh
    mat4.identity(this.entity.localTransform);

    // 1. Translate to world position
    mat4.translate(
      this.entity.localTransform,
      this.entity.localTransform,
      position
    );

    // 2. Apply self-rotation (cloud spins slowly)
    if (Math.abs(selfRotation) > 0.001) {
      mat4.rotate(
        this.entity.localTransform,
        this.entity.localTransform,
        selfRotation,
        this.selfRotationAxis
      );
    }

    // 3. CRITICAL: Apply initial scale (from createCloud1/createCloud2)
    // This preserves the scale that was set in island.js
    mat4.scale(
      this.entity.localTransform,
      this.entity.localTransform,
      this.initialScale
    );
  }

  /**
   * Helper: Normalize vector
   */
  normalizeVec3(v) {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (len < 0.0001) return [0, 1, 0]; // Default to Y-axis
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  /**
   * Helper: Extract scale from matrix
   */
  extractScale(matrix) {
    const sx = Math.sqrt(
      matrix[0] * matrix[0] + matrix[1] * matrix[1] + matrix[2] * matrix[2]
    );
    const sy = Math.sqrt(
      matrix[4] * matrix[4] + matrix[5] * matrix[5] + matrix[6] * matrix[6]
    );
    const sz = Math.sqrt(
      matrix[8] * matrix[8] + matrix[9] * matrix[9] + matrix[10] * matrix[10]
    );
    return [sx, sy, sz];
  }

  /**
   * Override: CloudAnimator tidak pakai state machine
   */
  updateStateMachine(deltaTime) {
    // Not used - clouds use continuous animation
  }

  /**
   * Override: applyTransforms sudah handled di buildTransformMatrix
   */
  applyTransforms() {
    // Already handled in buildTransformMatrix
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = CloudAnimator;
}
window.CloudAnimator = CloudAnimator;

console.log(
  "✅ CloudAnimator loaded - Fixed transform handling with scale preservation"
);
