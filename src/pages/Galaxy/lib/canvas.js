import { WebGLRenderer, PerspectiveCamera, Scene } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class Canvas {
  //#region Private Fields
  #animationFrameRequestId;
  //#endregion

  //#region Public Fields
  renderer;  // WebGLRenderer
  camera;    // PerspectiveCamera
  controls;  // OrbitControls
  scene;     // Scene
  //#endregion

  //#region Private Methods
  #animate() {
    this.#animationFrameRequestId = requestAnimationFrame(() => {
      this.#resize();
      this.#render();
      this.#animate();
    });
  }

  #render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  #resize() {
    const canvas = this.renderer.domElement,
      [currentWidth, currentHeight] = [canvas.width, canvas.height],
      [desiredWidth, desiredHeight] = [canvas.clientWidth, canvas.clientHeight];

    if (currentWidth != desiredWidth || currentHeight !== desiredHeight) {
      this.renderer.setSize(desiredWidth, desiredHeight, false);
      this.camera.aspect = desiredWidth / desiredHeight;
      this.camera.updateProjectionMatrix();
    }
  }
  //#endregion

  //#region Public Methods
  constructor(element = document.body) {
    // Renderer
    this.renderer = new WebGLRenderer({
      canvas: element
    });

    // Camera  
    this.camera = new PerspectiveCamera(75, 2, 0.1, 1000);
    this.camera.position.set(0, 0, 150);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Scene
    this.scene = new Scene();      
  }

  add(mesh) {
    this.scene.add(mesh);
  }

  startAnimation() {
    if (this.#animationFrameRequestId)  // We're already animating
      return;

    this.#animate();
  }

  stopAnimation() {
    if (!this.#animationFrameRequestId) // We're not yet animating
      return;
    
      this.#animationFrameRequestId = cancelAnimationFrame(this.#animationFrameRequestId);
  }
  //#endregion
}