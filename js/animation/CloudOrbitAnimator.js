class CloudOrbitAnimator {
  constructor(cloudNode, config = {}) {
    this.cloudNode = cloudNode;
    this.config = {
      orbitRadius: 40,
      orbitHeight: 15,
      orbitSpeed: 0.3,
      orbitTilt: 0,
      startAngle: Math.random() * Math.PI * 2,
      islandCenter: [0, 0, 0],
      heightVariation: 2,
      heightVariationSpeed: 0.5,
      radiusVariation: 3,
      radiusVariationSpeed: 0.7,
      selfRotationSpeed: 0.1,
      scalePulse: 0.05,
      scalePulseSpeed: 0.8,
      ...config,
    };

    this.currentAngle = this.config.startAngle;
    this.time = 0;

    this._originalLocalTransform = mat4.clone(this.cloudNode.localTransform);
    const m = this._originalLocalTransform;
    this._originalScale = [
      Math.hypot(m[0], m[1], m[2]),
      Math.hypot(m[4], m[5], m[6]),
      Math.hypot(m[8], m[9], m[10]),
    ];
  }

  update(deltaTime) {
    this.time += deltaTime;
    this.currentAngle += this.config.orbitSpeed * deltaTime;

    const radius =
      this.config.orbitRadius +
      Math.sin(this.time * this.config.radiusVariationSpeed) *
        this.config.radiusVariation;

    const x = Math.cos(this.currentAngle) * radius;
    const z = Math.sin(this.currentAngle) * radius;

    const y =
      this.config.orbitHeight +
      Math.sin(this.time * this.config.heightVariationSpeed) *
        this.config.heightVariation;

    let finalX = x,
      finalY = y,
      finalZ = z;

    if (Math.abs(this.config.orbitTilt) > 0.001) {
      const t = this.config.orbitTilt;
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);
      finalY = y * cosT - z * sinT;
      finalZ = y * sinT + z * cosT;
    }

    const worldX = this.config.islandCenter[0] + finalX;
    const worldY = this.config.islandCenter[1] + finalY;
    const worldZ = this.config.islandCenter[2] + finalZ;

    const transform = mat4.create();
    mat4.translate(transform, transform, [worldX, worldY, worldZ]);

    const selfRotation = this.time * this.config.selfRotationSpeed;
    mat4.rotateY(transform, transform, selfRotation);

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

    mat4.copy(this.cloudNode.localTransform, transform);
  }

  setIslandCenter(center) {
    this.config.islandCenter = center;
  }

  reset() {
    this.currentAngle = this.config.startAngle;
    this.time = 0;
  }
}

window.CloudOrbitAnimator = CloudOrbitAnimator;
console.log("CloudOrbitAnimator loaded");
