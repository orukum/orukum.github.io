export default class Engine {
  //#region Private Fields
  #canvas;
  #physics;

  #objects;
  //#endregion

  //#region Private Methods
  #tick(bodies) {
    for(let i = 0; i < bodies.length; i++) {
      this.#objects[i].position.set(...bodies[i].position);
    }
  }
  //#endregion

  //#region Public Methods
  constructor(canvas, physics) {
    this.#canvas = canvas;
    this.#physics = physics;
    this.#physics.on(this.#tick.bind(this));

    this.#objects = [];
  }

  addSphere(sphere) {
    this.#objects.push(sphere.mesh);
    this.#canvas.add(sphere.mesh);
    this.#physics.add(sphere.toPhysicsObject());
  }

  start() {
    this.#canvas.startAnimation();
    this.#physics.startSimulation();
  }

  stop() {
    this.#canvas.stopAnimation();
    this.#physics.stopSimulation();
  }

  destroy() {
    this.#physics.destroy();
  }
  //#endregion
}