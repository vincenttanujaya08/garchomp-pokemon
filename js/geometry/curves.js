// File: js/geometry/curves.js

const Curves = {
  /**
   * Calculates a point on a cubic Bézier curve.
   * @param {number} t - The parameter, from 0 to 1.
   * @param {number[]} p0 - The start point.
   * @param {number[]} p1 - The first control point.
   * @param {number[]} p2 - The second control point.
   * @param {number[]} p3 - The end point.
   * @returns {number[]} The calculated point on the curve.
   */
  getBezierPoint: function(t, p0, p1, p2, p3) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    let p = [0, 0, 0];
    // Blending functions for each coordinate
    p[0] = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
    p[1] = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];
    p[2] = uuu * p0[2] + 3 * uu * t * p1[2] + 3 * u * tt * p2[2] + ttt * p3[2];

    return p;
  },

  createSharkFin: function (baseWidth, height, depth) {
    const halfWidth = baseWidth / 2;
    const vertices = [
      -halfWidth, 0, 0,  // 0: base left
       halfWidth, 0, 0,  // 1: base right
      -halfWidth * 0.7, height * 0.4, depth * 0.5, // 2: curve left
       0, height * 0.8, depth * 1.2, // 3: curve mid
       halfWidth * 0.7, height * 0.4, depth * 0.5, // 4: curve right
       0, height, depth * 1.5 // 5: tip
    ];
    const indices = [
      0, 2, 1, 2, 3, 1, 1, 3, 4, 1, 4, 5, 0, 3, 5, 0, 2, 5, 3, 4, 5, 2, 3, 5
    ];
    const normals = new Array(vertices.length).fill(0); // Placeholder
    return {
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      indices: new Uint16Array(indices),
    };
  },
};

