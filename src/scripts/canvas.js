import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

export default class Canvas {
  //#region Private Fields
  #renderer;  // WebGLRenderer
  #camera;    // PerspectiveCamera
  #controls;  // OrbitControls
  #scene;     // Scene

  #animationFrameRequestId; // requestAnimationFrame Id
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
    this.#controls.update();
    this.#renderer.render(this.#scene, this.#camera);
  }

  #resize() {
    const canvas = this.#renderer.domElement,
      currentWidth = canvas.width,
      currentHeight = canvas.height,
      expectedWidth = canvas.clientWidth,
      expectedHeight = canvas.clientHeight;

    if (currentWidth != expectedWidth || currentHeight !== expectedHeight) {
      this.#renderer.setSize(expectedWidth, expectedHeight, false);
      this.#camera.aspect = expectedWidth / expectedHeight;
      this.#camera.updateProjectionMatrix();
    }
  }
  //#endregion

  //#region Public Methods
  constructor(element = document.body) {
    const width = element.clientWidth,
      height = element.clientHeight;

    // Renderer
    this.#renderer = new THREE.WebGLRenderer({
      canvas: element
    });

    // Camera  
    this.#camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.#camera.position.set(0, 0, 50);

    // Controls
    this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement);

    // Scene
    this.#scene = new THREE.Scene();      
  }

  add(mesh) {
    this.#scene.add(mesh);
  }

  startAnimation(autoRotate) {
    if (this.#animationFrameRequestId)  // We are already animating
      return;

    this.#controls.autoRotate = autoRotate;

    this.#animate();
  }

  stopAnimation() {
    if (!this.#animationFrameRequestId) // We are not animating
      return;

    cancelAnimationFrame(this.#animationFrameRequestId);
    this.#animationFrameRequestId = null;
  }
  //#endregion
}