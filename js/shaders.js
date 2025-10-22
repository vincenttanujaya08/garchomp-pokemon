// ============================================================
// js/shaders.js - HOT DAYLIGHT LIGHTING (Warm & Sunny)
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
      // ☀️🔥 HOT DAYLIGHT - Warm, Sunny, Intense Heat
      
      // 1. Ambient - Warm hazy atmosphere
      float ambientStrength = 0.30; // Medium-bright for hot day
      vec3 ambientColor = vec3(1.0, 0.95, 0.85); // Warm yellowish haze
      vec3 ambient = ambientStrength * ambientColor;

      // 2. Diffuse - Intense hot sunlight
      vec3 lightDir = normalize(u_lightDirection - v_fragPosition);
      vec3 normal = normalize(v_normal);
      float diff = max(dot(normal, lightDir), 0.0);
      
      // Strong yellow-orange hot sun
      vec3 lightColor = vec3(1.0, 0.92, 0.75); // Warm golden yellow
      vec3 diffuse = diff * lightColor * 1.6; // Very strong intensity

      // 3. Specular - Hot bright highlights
      float specularStrength = 0.8; // Strong for intense sun glare
      vec3 viewDir = normalize(u_viewPosition - v_fragPosition);
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 24.0); // Softer but bright
      
      // Warm white-yellow specular (sun glare)
      vec3 specularColor = vec3(1.0, 0.98, 0.88);
      vec3 specular = specularStrength * spec * specularColor;
      
      // 4. Rim lighting - Warm atmospheric glow
      float rimStrength = 0.25;
      float rim = 1.0 - max(dot(viewDir, normal), 0.0);
      rim = pow(rim, 2.5);
      vec3 rimColor = vec3(1.0, 0.88, 0.70) * rimStrength * rim; // Warm orange glow
      
      // Combine all lighting components
      vec3 result = (ambient + diffuse + specular + rimColor) * u_color.rgb;
      
      // Hot day color grading - push towards warm/saturated
      result *= vec3(1.08, 1.02, 0.95); // Boost warm, reduce cool
      
      gl_FragColor = vec4(result, u_color.a);
    }
`;

// Export to window
window.vertexShaderSource = vertexShaderSource;
window.fragmentShaderSource = fragmentShaderSource;

console.log("✅ Shaders loaded - Hot Daylight Lighting");
