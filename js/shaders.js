// ============================================================
// js/shaders.js - COMPLETE WITH EXPORTS
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
      // 1. Ambient
      float ambientStrength = 0.2;
      vec3 ambient = ambientStrength * vec3(1.0, 1.0, 1.0);

      // 2. Diffuse
      vec3 lightDir = normalize(u_lightDirection - v_fragPosition);
      vec3 normal = normalize(v_normal);
      float diff = max(dot(normal, lightDir), 0.0);
      vec3 diffuse = diff * vec3(1.0, 1.0, 1.0);

      // 3. Specular
      float specularStrength = 0.7;
      vec3 viewDir = normalize(u_viewPosition - v_fragPosition);
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      vec3 specular = specularStrength * spec * vec3(1.0, 1.0, 1.0);
      
      vec3 result = (ambient + diffuse + specular) * u_color.rgb;
      gl_FragColor = vec4(result, u_color.a);
    }
`;

// Export to window
window.vertexShaderSource = vertexShaderSource;
window.fragmentShaderSource = fragmentShaderSource;

console.log("✅ Shaders loaded");
