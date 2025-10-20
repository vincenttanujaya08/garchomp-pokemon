// ============================================================
// js/shaders.js - WARM GOLDEN LIGHTING SYSTEM
// ============================================================

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

const fragmentShaderSource = `
    precision mediump float;
    
    uniform vec4 u_color;
    uniform vec3 u_lightDirection;
    uniform vec3 u_viewPosition;

    varying highp vec3 v_normal;
    varying highp vec3 v_fragPosition;

    void main() {
      // 🌅 WARM GOLDEN LIGHTING
      
      // 1. Ambient - Warm golden glow
      float ambientStrength = 0.35; // Increased for brighter scene
      vec3 ambientColor = vec3(1.0, 0.95, 0.85); // Warm golden tone
      vec3 ambient = ambientStrength * ambientColor;

      // 2. Diffuse - Main light with golden tint
      vec3 lightDir = normalize(u_lightDirection - v_fragPosition);
      vec3 normal = normalize(v_normal);
      float diff = max(dot(normal, lightDir), 0.0);
      
      // Golden sunset light color
      vec3 lightColor = vec3(1.0, 0.92, 0.75); // Warm golden yellow
      vec3 diffuse = diff * lightColor * 1.2; // Boosted intensity

      // 3. Specular - Subtle golden highlights
      float specularStrength = 0.5; // Slightly reduced for softer look
      vec3 viewDir = normalize(u_viewPosition - v_fragPosition);
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 24.0); // Softer specular
      
      // Golden specular highlights
      vec3 specularColor = vec3(1.0, 0.95, 0.8);
      vec3 specular = specularStrength * spec * specularColor;
      
      // 4. Rim lighting for depth (optional enhancement)
      float rimStrength = 0.3;
      float rim = 1.0 - max(dot(viewDir, normal), 0.0);
      rim = pow(rim, 3.0);
      vec3 rimColor = vec3(1.0, 0.85, 0.6) * rimStrength * rim;
      
      // Combine all lighting
      vec3 result = (ambient + diffuse + specular + rimColor) * u_color.rgb;
      
      // Slight color grading for warmth
      result *= vec3(1.05, 1.0, 0.95); // Push towards warm tones
      
      gl_FragColor = vec4(result, u_color.a);
    }
`;

// Export to window
window.vertexShaderSource = vertexShaderSource;
window.fragmentShaderSource = fragmentShaderSource;

console.log("✅ Shaders loaded - Warm Golden Lighting");
