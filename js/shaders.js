// ============================================================
// js/shaders.js - Ditambah Shader untuk Shadow Mapping
// ============================================================

// --- Shader Utama (Sudah dimodifikasi sebelumnya) ---
const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec3 a_normal;
    attribute vec2 a_texCoord;

    uniform mat4 u_projectionMatrix;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_normalMatrix;
    uniform mat4 u_lightViewMatrix;    // <-- BARU: View matrix dari cahaya
    uniform mat4 u_lightProjMatrix;    // <-- BARU: Projection matrix dari cahaya

    varying highp vec3 v_normal;
    varying highp vec3 v_fragPosition;
    varying highp vec2 v_texCoord;
    varying highp vec4 v_posFromLight; // <-- BARU: Posisi dari sudut pandang cahaya

    void main() {
      gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;

      v_fragPosition = (u_modelMatrix * a_position).xyz;
      v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
      v_texCoord = a_texCoord;

      // Hitung posisi dari sudut pandang cahaya untuk shadow map lookup
      v_posFromLight = u_lightProjMatrix * u_lightViewMatrix * u_modelMatrix * a_position;
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    uniform vec4 u_color;
    uniform vec3 u_lightDirection; // Mungkin bisa dihapus jika lightDir dihitung dari v_posFromLight
    uniform vec3 u_viewPosition;
    uniform sampler2D u_sampler;
    uniform bool u_useTexture;
    uniform sampler2D u_shadowMap;      // <-- BARU: Shadow map texture
    uniform float u_bias;             // <-- BARU: Shadow bias

    varying highp vec3 v_normal;
    varying highp vec3 v_fragPosition;
    varying highp vec2 v_texCoord;
    varying highp vec4 v_posFromLight; // <-- BARU: Posisi dari sudut pandang cahaya

    float unpackDepth(const in vec4 rgbaDepth) {
        const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
        return dot(rgbaDepth, bitShift); // Atau metode unpack lain jika depth shader beda
    }


    void main() {
      // --- Shadow Calculation ---
      vec3 shadowCoord = v_posFromLight.xyz / v_posFromLight.w; // Perspective divide
      shadowCoord = shadowCoord * 0.5 + 0.5; // Konversi ke [0, 1] range

      // Ambil kedalaman dari shadow map (mungkin perlu unpack jika shadow shader meng-encode depth)
      float depthFromLight = texture2D(u_shadowMap, shadowCoord.xy).r; // Ambil R channel
      // Jika shadow shader meng-encode depth ke RGBA:
      // float depthFromLight = unpackDepth(texture2D(u_shadowMap, shadowCoord.xy));


      float currentDepth = shadowCoord.z;

      float shadow = 1.0;
      // Periksa apakah di luar map atau lebih jauh dari depth di map (+ bias)
      if (shadowCoord.x < 0.0 || shadowCoord.x > 1.0 || shadowCoord.y < 0.0 || shadowCoord.y > 1.0 || currentDepth > depthFromLight + u_bias) {
          shadow = 0.3; // Dalam bayangan (0.3 = intensitas ambient, bukan hitam total)
      }

      // --- Lighting Calculations (Sama seperti sebelumnya, tapi dikalikan 'shadow') ---
      float ambientStrength = 0.30;
      vec3 ambientColor = vec3(1.0, 0.95, 0.85);
      vec3 ambient = ambientStrength * ambientColor;

      vec3 lightActualDir = normalize(u_lightDirection - v_fragPosition); // Arah cahaya sesungguhnya
      vec3 normal = normalize(v_normal);
      float diff = max(dot(normal, lightActualDir), 0.0);
      vec3 lightColor = vec3(1.0, 0.92, 0.75);
      vec3 diffuse = diff * lightColor * 1.4;

      float specularStrength = 0.2;
      vec3 viewDir = normalize(u_viewPosition - v_fragPosition);
      vec3 reflectDir = reflect(-lightActualDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 48.0);
      vec3 specularColor = vec3(1.0, 0.98, 0.88);
      vec3 specular = specularStrength * spec * specularColor;

      float rimStrength = 0.20;
      float rim = 1.0 - max(dot(viewDir, normal), 0.0);
      rim = pow(rim, 2.5);
      vec3 rimColor = vec3(1.0, 0.88, 0.70) * rimStrength * rim;

      // Gabungkan lighting, KALIKAN diffuse & specular dengan 'shadow'
      vec3 lighting = ambient + (diffuse + specular + rimColor) * shadow; // <-- DIKALIKAN SHADOW

      // --- Texture & Final Color (Sama seperti sebelumnya) ---
      vec4 texColor = texture2D(u_sampler, v_texCoord);
      vec4 baseColor = u_color;
      vec4 finalColor;
      if (u_useTexture) {
         finalColor = vec4(lighting * mix(baseColor.rgb, texColor.rgb, texColor.a), baseColor.a);
      } else {
         finalColor = vec4(lighting * baseColor.rgb, baseColor.a);
      }
      finalColor.rgb *= vec3(1.05, 1.01, 0.97);
      gl_FragColor = finalColor;
    }
`;

// --- BARU: Shader untuk Shadow Pass ---
const shadowVertexSource = `
    attribute vec4 a_position;

    uniform mat4 u_modelMatrix;
    uniform mat4 u_lightViewMatrix;
    uniform mat4 u_lightProjMatrix;

    void main() {
        gl_Position = u_lightProjMatrix * u_lightViewMatrix * u_modelMatrix * a_position;
    }
`;

const shadowFragmentSource = `
    precision mediump float;

    // Untuk menyimpan depth dalam format yang bisa dibaca texture2D (jika perlu encoding)
    // vec4 packDepth(float depth) {
    //     const vec4 bitShift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
    //     const vec4 bitMask = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
    //     vec4 res = fract(depth * bitShift);
    //     res -= res.xxyz * bitMask;
    //     return res;
    // }

    void main() {
        // Cukup tulis depth bawaan WebGL ke output
        // WebGL akan otomatis menyimpannya ke depth texture
         gl_FragColor = vec4(gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z, 1.0); // Simple depth

        // Jika perlu encoding manual (biasanya tidak perlu jika FBO depth texture didukung):
        // gl_FragColor = packDepth(gl_FragCoord.z);
    }
`;

// Export SEMUA shader
window.vertexShaderSource = vertexShaderSource;
window.fragmentShaderSource = fragmentShaderSource;
window.shadowVertexSource = shadowVertexSource;
window.shadowFragmentSource = shadowFragmentSource;

console.log("✅ Shaders loaded - Main (with shadow calc) + Shadow Depth");