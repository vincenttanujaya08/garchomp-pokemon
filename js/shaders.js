// ============================================================
// js/shaders.js - SOFTER LIGHTING (Less Specular)
// ============================================================

const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec3 a_normal;
    attribute vec2 a_texCoord;

    uniform mat4 u_projectionMatrix;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_normalMatrix;

    varying highp vec3 v_normal;
    varying highp vec3 v_fragPosition;
    varying highp vec2 v_texCoord;

    void main() {
      gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;

      v_fragPosition = (u_modelMatrix * a_position).xyz;
      v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
      v_texCoord = a_texCoord;
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    uniform vec4 u_color;
    uniform vec3 u_lightDirection;
    uniform vec3 u_viewPosition;
    uniform sampler2D u_sampler;
    uniform bool u_useTexture;

    varying highp vec3 v_normal;
    varying highp vec3 v_fragPosition;
    varying highp vec2 v_texCoord;

    void main() {
      // --- Lighting Calculations (Adjusted for Softer Look) ---

      // 1. Ambient - Slightly darker ambient for more contrast
      float ambientStrength = 0.25; // Slightly reduced
      vec3 ambientColor = vec3(1.0, 0.95, 0.85);
      vec3 ambient = ambientStrength * ambientColor;

      // 2. Diffuse - Reduced intensity
      vec3 lightDir = normalize(u_lightDirection - v_fragPosition);
      vec3 normal = normalize(v_normal);
      float diff = max(dot(normal, lightDir), 0.0);
      vec3 lightColor = vec3(1.0, 0.92, 0.75);
      vec3 diffuse = diff * lightColor * 1.2; // <--- REDUCED intensity from 1.6 to 1.2

      // 3. Specular - Significantly reduced strength and tighter highlight
      float specularStrength = 0.2; // <--- SIGNIFICANTLY REDUCED strength from 0.8
      vec3 viewDir = normalize(u_viewPosition - v_fragPosition);
      vec3 reflectDir = reflect(-lightDir, normal);
      // Increased exponent for tighter highlight
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 48.0); // <--- INCREASED exponent from 24.0
      vec3 specularColor = vec3(1.0, 0.98, 0.88);
      vec3 specular = specularStrength * spec * specularColor;

      // 4. Rim lighting - Keep as is or slightly reduce if needed
      float rimStrength = 0.20; // Slightly reduced
      float rim = 1.0 - max(dot(viewDir, normal), 0.0);
      rim = pow(rim, 2.5);
      vec3 rimColor = vec3(1.0, 0.88, 0.70) * rimStrength * rim;

      vec3 lighting = (ambient + diffuse + specular + rimColor);

      // --- Texture Sampling ---
      vec4 texColor = texture2D(u_sampler, v_texCoord);
      vec4 baseColor = u_color;

      // --- Combine Lighting & Color/Texture ---
      vec4 finalColor;
      if (u_useTexture) {
         finalColor = vec4(lighting * mix(baseColor.rgb, texColor.rgb, texColor.a), baseColor.a);
      } else {
         finalColor = vec4(lighting * baseColor.rgb, baseColor.a);
      }

       // Color grading (Keep warm tone)
      finalColor.rgb *= vec3(1.05, 1.01, 0.97); // Slightly adjusted grading

      gl_FragColor = finalColor;
    }
`;

// Export to window
window.vertexShaderSource = vertexShaderSource;
window.fragmentShaderSource = fragmentShaderSource;

console.log("✅ Shaders loaded - Softer Lighting (Less Specular)"); // Update log message