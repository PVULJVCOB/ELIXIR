import { initShaderProgram } from "./utils.js";
import vsSource from "../shaders/vertex.glsl";
import fsSource from "../shaders/fragment.glsl";

export function initGlass(gl, normalTexture) {
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      position: gl.getAttribLocation(shaderProgram, "aPosition"),
      texCoord: gl.getAttribLocation(shaderProgram, "aTexCoord"),
    },
    uniformLocations: {
      background: gl.getUniformLocation(shaderProgram, "uBackground"),
      normalMap: gl.getUniformLocation(shaderProgram, "uNormalMap"),
      refractionIndex: gl.getUniformLocation(shaderProgram, "uRefractionIndex"),
      fresnelPower: gl.getUniformLocation(shaderProgram, "uFresnelPower"),
    },
  };

  const buffer = initBuffers(gl);

  function draw(backgroundTex) {
    gl.useProgram(programInfo.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.vertexAttribPointer(programInfo.attribLocations.position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.position);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.texCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.texCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.texCoord);

    // Hintergrund-Textur
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, backgroundTex);
    gl.uniform1i(programInfo.uniformLocations.background, 0);

    // Normal Map
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, normalTexture);
    gl.uniform1i(programInfo.uniformLocations.normalMap, 1);

    gl.uniform1f(programInfo.uniformLocations.refractionIndex, 1.1);
    gl.uniform1f(programInfo.uniformLocations.fresnelPower, 3.0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  return { draw };
}

function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    -0.5, -0.5,
     0.5, -0.5,
    -0.5,  0.5,
     0.5,  0.5,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  const texCoords = [
    0, 0,
    1, 0,
    0, 1,
    1, 1,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    texCoord: texCoordBuffer,
  };
}
