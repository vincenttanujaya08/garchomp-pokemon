// // ============================================================
// // js/shaders.js - SOFTER LIGHTING (Less Specular)
// // ============================================================

// const vertexShaderSource = `
//     attribute vec4 a_position;
//     attribute vec3 a_normal;
//     attribute vec2 a_texCoord;

//     uniform mat4 u_projectionMatrix;
//     uniform mat4 u_viewMatrix;
//     uniform mat4 u_modelMatrix;
//     uniform mat4 u_normalMatrix;

//     varying highp vec3 v_normal;
//     varying highp vec3 v_fragPosition;
//     varying highp vec2 v_texCoord;

//     void main() {
//       gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;

//       v_fragPosition = (u_modelMatrix * a_position).xyz;
//       v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
//       v_texCoord = a_texCoord;
//     }
// `;

// const fragmentShaderSource = `
//     precision mediump float;

//     uniform vec4 u_color;
//     uniform vec3 u_lightDirection;
//     uniform vec3 u_viewPosition;
//     uniform sampler2D u_sampler;
//     uniform bool u_useTexture;

//     varying highp vec3 v_normal;
//     varying highp vec3 v_fragPosition;
//     varying highp vec2 v_texCoord;

//     void main() {
//       // --- Lighting Calculations (Adjusted for Softer Look) ---

//       // 1. Ambient - Slightly darker ambient for more contrast
//       float ambientStrength = 0.25; // Slightly reduced
//       vec3 ambientColor = vec3(1.0, 0.95, 0.85);
//       vec3 ambient = ambientStrength * ambientColor;

//       // 2. Diffuse - Reduced intensity
//       vec3 lightDir = normalize(u_lightDirection - v_fragPosition);
//       vec3 normal = normalize(v_normal);
//       float diff = max(dot(normal, lightDir), 0.0);
//       vec3 lightColor = vec3(1.0, 0.92, 0.75);
//       vec3 diffuse = diff * lightColor * 1.2; // <--- REDUCED intensity from 1.6 to 1.2

//       // 3. Specular - Significantly reduced strength and tighter highlight
//       float specularStrength = 0.2; // <--- SIGNIFICANTLY REDUCED strength from 0.8
//       vec3 viewDir = normalize(u_viewPosition - v_fragPosition);
//       vec3 reflectDir = reflect(-lightDir, normal);
//       // Increased exponent for tighter highlight
//       float spec = pow(max(dot(viewDir, reflectDir), 0.0), 48.0); // <--- INCREASED exponent from 24.0
//       vec3 specularColor = vec3(1.0, 0.98, 0.88);
//       vec3 specular = specularStrength * spec * specularColor;

//       // 4. Rim lighting - Keep as is or slightly reduce if needed
//       float rimStrength = 0.20; // Slightly reduced
//       float rim = 1.0 - max(dot(viewDir, normal), 0.0);
//       rim = pow(rim, 2.5);
//       vec3 rimColor = vec3(1.0, 0.88, 0.70) * rimStrength * rim;

//       vec3 lighting = (ambient + diffuse + specular + rimColor);

//       // --- Texture Sampling ---
//       vec4 texColor = texture2D(u_sampler, v_texCoord);
//       vec4 baseColor = u_color;

//       // --- Combine Lighting & Color/Texture ---
//       vec4 finalColor;
//       if (u_useTexture) {
//          finalColor = vec4(lighting * mix(baseColor.rgb, texColor.rgb, texColor.a), baseColor.a);
//       } else {
//          finalColor = vec4(lighting * baseColor.rgb, baseColor.a);
//       }

//        // Color grading (Keep warm tone)
//       finalColor.rgb *= vec3(1.05, 1.01, 0.97); // Slightly adjusted grading

//       gl_FragColor = finalColor;
//     }
// `;



// // Export to window
// window.vertexShaderSource = vertexShaderSource;
// window.fragmentShaderSource = fragmentShaderSource;

// console.log("✅ Shaders loaded - Softer Lighting (Less Specular)"); // Update log message

// ============================================================
// js/shaders.js - DUAL SHADER SYSTEM
// General shader: Dynamic hot daylight (Pokemon/Island)
// Cave shader: Static rocky lighting (brightness konsisten)
// ============================================================

// ===== GENERAL VERTEX SHADER =====
const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec3 a_normal;

    uniform mat4 u_projectionMatrix;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_normalMatrix;

    varying highp vec3 v_normal;
    varying highp vec3 v_fragPosition;

    void main() {
      gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
      v_fragPosition = (u_modelMatrix * a_position).xyz;
      v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
    }
`;

// ===== GENERAL FRAGMENT SHADER =====
const fragmentShaderSource = `
    precision mediump float;
    
    uniform vec4 u_color;
    uniform vec3 u_lightDirection;
    uniform vec3 u_viewPosition;

    varying highp vec3 v_normal;
    varying highp vec3 v_fragPosition;

    void main() {
      vec3 normal = normalize(v_normal);
      vec3 viewDir = normalize(u_viewPosition - v_fragPosition);
      vec3 lightDir = normalize(u_lightDirection - v_fragPosition);
      
      float ambientStrength = 0.35;
      vec3 ambientColor = vec3(1.0, 0.95, 0.85);
      vec3 ambient = ambientStrength * ambientColor;

      float diff = max(dot(normal, lightDir), 0.0);
      vec3 lightColor = vec3(1.0, 0.92, 0.75);
      vec3 diffuse = diff * lightColor * 1.5;

      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 24.0);
      vec3 specular = 0.7 * spec * vec3(1.0, 0.98, 0.88);
      
      float rim = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);
      vec3 rimColor = vec3(1.0, 0.88, 0.70) * 0.25 * rim;
      
      vec3 result = (ambient + diffuse + specular + rimColor) * u_color.rgb;
      result *= vec3(1.08, 1.02, 0.95);
      
      gl_FragColor = vec4(result, u_color.a);
    }
`;

// ===== CAVE VERTEX SHADER =====
const caveVertexShaderSource = `
    attribute vec4 a_position;
    attribute vec3 a_normal;

    uniform mat4 u_projectionMatrix;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_normalMatrix;

    varying highp vec3 v_normal;
    varying highp vec3 v_fragPosition;
    varying highp vec3 v_worldPosition;

    void main() {
      gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
      v_fragPosition = (u_modelMatrix * a_position).xyz;
      v_worldPosition = (u_modelMatrix * a_position).xyz;
      v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
    }
`;

// ===== CAVE FRAGMENT SHADER =====
const caveFragmentShaderSource = `
    precision highp float;
    
    uniform vec4 u_color;
    uniform vec3 u_lightDirection;
    uniform vec3 u_viewPosition;

    varying highp vec3 v_normal;
    varying highp vec3 v_fragPosition;
    varying highp vec3 v_worldPosition;

    float hash(vec2 p) {
      float h = dot(p, vec2(127.1, 311.7));
      return fract(sin(h) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 4; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec3 normal = normalize(v_normal);
      vec3 viewDir = normalize(u_viewPosition - v_fragPosition);
      
      vec3 staticSunDir = normalize(vec3(0.3, 0.8, 0.5));
      vec3 staticSkyDir = normalize(vec3(0.0, 1.0, 0.0));
      vec3 staticFillDir = normalize(vec3(-0.7, 0.2, 0.3));
      
      vec2 texCoord = v_worldPosition.xz * 0.15 + v_worldPosition.yz * 0.1;
      float rockNoise = fbm(texCoord * 2.0);
      float detailNoise = fbm(texCoord * 8.0) * 0.3;
      
      vec3 baseColor = u_color.rgb;
      float colorVariation = rockNoise * 0.2 + detailNoise * 0.1;
      baseColor *= (0.88 + colorVariation);
      
      float ambientStrength = 0.32;
      vec3 ambientColor = vec3(0.68, 0.70, 0.74);
      
      float ao = 1.0 - (1.0 - abs(normal.y)) * 0.3;
      ao *= 0.75 + 0.25 * rockNoise;
      
      vec3 ambient = ambientStrength * ambientColor * ao;
      
      float diff1 = max(dot(normal, staticSunDir), 0.0);
      float diff2 = max(dot(normal, staticSkyDir), 0.0) * 0.3;
      float diff3 = max(dot(normal, staticFillDir), 0.0) * 0.25;
      
      vec3 lightColor = vec3(1.0, 0.96, 0.88);
      vec3 diffuse = (diff1 * 1.1 + diff2 + diff3) * lightColor;
      
      vec3 reflectDir = reflect(-staticSunDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 28.0);
      
      float wetness = smoothstep(0.45, 0.55, rockNoise) * 0.2;
      vec3 specular = spec * wetness * vec3(0.5, 0.52, 0.54);
      
      float edgeFactor = abs(dot(viewDir, normal));
      float edgeDarken = mix(0.5, 1.0, pow(edgeFactor, 0.5));
      
      vec3 lighting = ambient + diffuse + specular;
      vec3 result = baseColor * lighting * edgeDarken;
      
      result = pow(result, vec3(1.03));
      
      gl_FragColor = vec4(result, u_color.a);
    }
`;

window.vertexShaderSource = vertexShaderSource;
window.fragmentShaderSource = fragmentShaderSource;
window.caveVertexShaderSource = caveVertexShaderSource;
window.caveFragmentShaderSource = caveFragmentShaderSource;

console.log("✅ Dual Shader System loaded");
console.log("   General: Dynamic daylight");
console.log("   Cave: Static rocky lighting");
