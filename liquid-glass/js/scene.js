import { initShaderProgram } from "./utils.js";

export function initScene(gl, texture) {
  const vsSource = `
    attribute vec4 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    void main(void) {
      gl_Position = aPosition;
      vTexCoord = aTexCoord;
    }
  `;

  const fsSource = `
    precision mediump float;
    varying vec2 vTexCoord;
    uniform sampler2D uSampler;
    void main(void) {
      gl_FragColor = texture2D(uSampler, vTexCoord);
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      position: gl.getAttribLocation(shaderProgram, "aPosition"),
      texCoord: gl.getAttribLocation(shaderProgram, "aTexCoord"),
    },
    uniformLocations: {
      sampler: gl.getUniformLocation(shaderProgram, "uSampler"),
    },
  };

  const buffer = initBuffers(gl);

  function draw() {
    gl.useProgram(programInfo.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.vertexAttribPointer(programInfo.attribLocations.position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.position);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.texCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.texCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.texCoord);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations.sampler, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  return { draw };
}

function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
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
