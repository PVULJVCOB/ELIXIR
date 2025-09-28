precision highp float;
varying vec2 vTexCoord;

uniform sampler2D uBackground;
uniform sampler2D uNormalMap;
uniform float uRefractionIndex;
uniform float uFresnelPower;

void main(void) {
  // Normal aus Map
  vec3 normal = texture2D(uNormalMap, vTexCoord).rgb * 2.0 - 1.0;

  // Brechung für RGB (Chromatische Aberration)
  vec2 offsetR = normal.xy * (0.02 / uRefractionIndex);
  vec2 offsetG = normal.xy * (0.018 / uRefractionIndex);
  vec2 offsetB = normal.xy * (0.016 / uRefractionIndex);

  float fresnel = pow(1.0 - dot(normalize(normal), vec3(0.0, 0.0, 1.0)), uFresnelPower);

  vec3 color;
  color.r = texture2D(uBackground, vTexCoord + offsetR).r;
  color.g = texture2D(uBackground, vTexCoord + offsetG).g;
  color.b = texture2D(uBackground, vTexCoord + offsetB).b;

  // Glas-Mix mit Fresnel
  gl_FragColor = vec4(mix(color, vec3(1.0), fresnel * 0.2), 0.9);
}
