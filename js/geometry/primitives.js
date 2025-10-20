// File: js/geometry/primitives.js

const Primitives = {

  /**
   * Creates a tapered tube mesh along a given path.
   * @param {number[][]} path - An array of points defining the path.
   * @param {number} radius - The base radius of the tube.
   * @param {number} radialSegments - The number of segments around the tube's circumference.
   * @param {number[]} scaleFactors - An array of multipliers for the radius at each path point.
   * @returns {object} Geometry data (vertices, normals, indices).
   */
  createTubeFromPath: function(path, radius, radialSegments, scaleFactors) {
      const vertices = [];
      const normals = [];
      const indices = [];

      // Helper functions from gl-matrix, defined locally for robustness
      const vec3_subtract = (out, a, b) => { out[0] = a[0] - b[0]; out[1] = a[1] - b[1]; out[2] = a[2] - b[2]; return out; };
      const vec3_normalize = (out, a) => { let len = a[0]*a[0] + a[1]*a[1] + a[2]*a[2]; if (len > 0) { len = 1 / Math.sqrt(len); } out[0] = a[0] * len; out[1] = a[1] * len; out[2] = a[2] * len; return out; };
      const vec3_cross = (out, a, b) => { let ax=a[0],ay=a[1],az=a[2],bx=b[0],by=b[1],bz=b[2]; out[0]=ay*bz-az*by; out[1]=az*bx-ax*bz; out[2]=ax*by-ay*bx; return out; };

      for (let i = 0; i < path.length; i++) {
          const center = path[i];
          const scale = scaleFactors[i];
          
          let tangent = [0,0,1], normal = [0,1,0], binormal = [1,0,0];
          
          if (i < path.length - 1) {
              vec3_subtract(tangent, path[i+1], center);
          } else {
              vec3_subtract(tangent, center, path[i-1]);
          }
          vec3_normalize(tangent, tangent);
          
          vec3_cross(binormal, tangent, [0, 1, 0]);
          if(Math.hypot(...binormal) < 0.1) vec3_cross(binormal, tangent, [1, 0, 0]); // Avoid gimbal lock
          vec3_normalize(binormal, binormal);
          vec3_cross(normal, binormal, tangent);
          
          for (let j = 0; j <= radialSegments; j++) {
              const theta = (j / radialSegments) * 2 * Math.PI;
              const cosTheta = Math.cos(theta);
              const sinTheta = Math.sin(theta);

              const nx = cosTheta * normal[0] + sinTheta * binormal[0];
              const ny = cosTheta * normal[1] + sinTheta * binormal[1];
              const nz = cosTheta * normal[2] + sinTheta * binormal[2];
              
              vertices.push(center[0] + radius * scale * nx, center[1] + radius * scale * ny, center[2] + radius * scale * nz);
              normals.push(nx, ny, nz);
          }
      }

      for (let i = 0; i < path.length - 1; i++) {
          for (let j = 0; j < radialSegments; j++) {
              const a = i * (radialSegments + 1) + j;
              const b = a + 1;
              const c = (i + 1) * (radialSegments + 1) + j;
              const d = c + 1;
              indices.push(a, c, b, b, c, d);
          }
      }

      return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  },

  // ... (sisa fungsi primitif lainnya tetap ada di sini) ...
  createEllipsoid: function (radiusX = 1, radiusY = 1, radiusZ = 1, latitudeBands = 30, longitudeBands = 30) {
    const vertices = []; const normals = []; const indices = [];
    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      const theta = (latNumber * Math.PI) / latitudeBands; const sinTheta = Math.sin(theta); const cosTheta = Math.cos(theta);
      for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        const phi = (longNumber * 2 * Math.PI) / longitudeBands; const sinPhi = Math.sin(phi); const cosPhi = Math.cos(phi);
        const x = radiusX * cosPhi * sinTheta; const y = radiusY * cosTheta; const z = radiusZ * sinPhi * sinTheta;
        const normal = [x / (radiusX * radiusX), y / (radiusY * radiusY), z / (radiusZ * radiusZ)]; const len = Math.hypot(...normal);
        vertices.push(x, y, z); normals.push(normal[0] / len, normal[1] / len, normal[2] / len);
      }
    }
    for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
        const first = latNumber * (longitudeBands + 1) + longNumber; const second = first + longitudeBands + 1;
        indices.push(first, second, first + 1, second, second + 1, first + 1);
      }
    } return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  },
  createCone: function (radius = 1, height = 2, radialSegments = 32) {
    const vertices = []; const normals = []; const indices = []; const halfHeight = height/2;
    vertices.push(0,halfHeight,0); normals.push(0,1,0);
    for (let i = 0; i <= radialSegments; i++) {
        const theta = (i * 2 * Math.PI) / radialSegments; const x = radius * Math.cos(theta); const z = radius * Math.sin(theta);
        vertices.push(x, -halfHeight, z); const normal = [height * x, radius * radius, height * z]; const len = Math.hypot(...normal);
        normals.push(normal[0]/len, normal[1]/len, normal[2]/len);
    }
    for (let i = 1; i <= radialSegments; i++) { indices.push(0, i, i + 1); }
    const baseStartIndex = vertices.length / 3; vertices.push(0,-halfHeight,0); normals.push(0,-1,0);
    for (let i = 0; i <= radialSegments; i++) {
        const theta = (i * 2 * Math.PI) / radialSegments; vertices.push(radius * Math.cos(theta), -halfHeight, radius * Math.sin(theta)); normals.push(0,-1,0);
    }
    for (let i = 1; i <= radialSegments; i++) { indices.push(baseStartIndex, baseStartIndex + i + 1, baseStartIndex + i); }
    return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  },
  createCapsule: function (radius = 1, cylinderHeight = 2, segments = 32) {
      // Placeholder - returns a cylinder for now
      const { vertices, normals, indices } = this.createCylinder(radius, cylinderHeight, segments);
      return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  },
  createCylinder: function(radius = 1, height = 2, radialSegments = 32) {
      const vertices = [], normals = [], indices = []; const halfHeight = height / 2;
      for (let i = 0; i <= radialSegments; i++) {
          const theta = i * 2 * Math.PI / radialSegments; const x = radius * Math.cos(theta); const z = radius * Math.sin(theta);
          vertices.push(x, halfHeight, z, x, -halfHeight, z); normals.push(x / radius, 0, z / radius, x / radius, 0, z / radius);
      }
      for (let i = 0; i < radialSegments; i++) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; indices.push(a, b, c, b, d, c); }
      return { vertices: new Float32Array(vertices), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  },
   createTriangularPrism: function (baseWidth = 1, height = 1, depth = 1) {
    const w = baseWidth / 2, d = depth / 2; const vertices = [ -w, 0, d,  w, 0, d,  0, height, d, -w, 0,-d,  w, 0,-d,  0, height,-d, ];
    const indices = [ 0,1,2, 3,5,4, 0,3,4, 0,4,1, 0,2,5, 0,5,3, 1,4,5, 1,5,2 ];
    return { vertices: new Float32Array(vertices), normals: new Float32Array(new Array(vertices.length).fill(0)), indices: new Uint16Array(indices) };
  },
};

