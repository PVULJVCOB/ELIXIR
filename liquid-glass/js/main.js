import { loadTexture, initShaderProgram } from "./utils.js";
import { initScene } from "./scene.js";
import { initGlass } from "./glass.js";

async function main() {
  const canvas = document.getElementById("webgl");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    alert("WebGL wird nicht unterstützt");
    return;
  }

  // Texturen laden
  const backgroundTex = await loadTexture(gl, "../assets/background.jpg");
  const normalTex = await loadTexture(gl, "../assets/normalmap.png");

  // Szene und Glas initialisieren
  const scene = initScene(gl, backgroundTex);
  const glass = initGlass(gl, normalTex);

  function render() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    scene.draw();
    glass.draw(backgroundTex);

    requestAnimationFrame(render);
  }

  render();
}

main();
