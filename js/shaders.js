// ============================================================
// js/shaders.js - SUNSET LIGHTING (Purple Sky + Golden Sun)
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
      // 🌅 SUNSET LIGHTING - Purple Sky + Golden Sun
      
      // 1. Ambient - Purple-tinted for sky harmony
      float ambientStrength = 0.20; // Brighter ambient for sunset atmosphere
      vec3 ambientColor = vec3(0.85, 0.80, 0.95); // Subtle purple tint from sky
      vec3 ambient = ambientStrength * ambientColor;

      // 2. Diffuse - Warm sunset light from the sun
      vec3 lightDir = normalize(u_lightDirection - v_fragPosition);
      vec3 normal = normalize(v_normal);
      float diff = max(dot(normal, lightDir), 0.0);
      
      // Intense orange-golden sunset light
      vec3 lightColor = vec3(1.0, 0.85, 0.60); // Deep orange for sunset sun
      vec3 diffuse = diff * lightColor * 1.3; // Strong intensity

      // 3. Specular - Warm sunset highlights
      float specularStrength = 0.6; // Stronger for sunset gleam
      vec3 viewDir = normalize(u_viewPosition - v_fragPosition);
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 28.0); // Softer falloff
      
      // Warm orange specular highlights
      vec3 specularColor = vec3(1.0, 0.90, 0.70);
      vec3 specular = specularStrength * spec * specularColor;
      
      // 4. Rim lighting - Purple-tinted from sky reflection
      float rimStrength = 0.25;
      float rim = 1.0 - max(dot(viewDir, normal), 0.0);
      rim = pow(rim, 3.0);
      vec3 rimColor = vec3(0.70, 0.65, 0.85) * rimStrength * rim; // Purple rim from sky
      
      // Combine all lighting components
      vec3 result = (ambient + diffuse + specular + rimColor) * u_color.rgb;
      
      // Slight color grading for sunset warmth
      result *= vec3(1.05, 1.0, 0.98); // Push towards warm but keep purple balance
      
      gl_FragColor = vec4(result, u_color.a);
    }
`;

// Export to window
window.vertexShaderSource = vertexShaderSource;
window.fragmentShaderSource = fragmentShaderSource;

console.log("✅ Shaders loaded - Sunset Purple Sky Lighting");
