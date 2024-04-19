import { wrap } from 'comlink';

export default class Engine {
    //#region Private Fields
    #animationFrameRequestId;
    #canvas;
    #context;
    #link;
    #worker;
    //#endregion
  
    //#region Private Methods
    #clear() {
      this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    #draw(boid) {
      this.#context.beginPath();
      this.#context.arc(boid.position.x, boid.position.y, 8, 0, 2 * Math.PI, false);
      this.#context.fillStyle = 'white';
      this.#context.fill();
    }

    #tick() {
      this.#animationFrameRequestId = requestAnimationFrame(async () => {       
        await this.#render();
        this.#tick();
      });
    }

    async #render() {
      const boids = await this.#link.next();

      this.#resize();
      this.#clear();

      for (let boid of boids) {
        this.#draw(boid);
      }
    }

    #resize() {
      const canvas = this.#canvas,
        [currentWidth, currentHeight] = [canvas.width, canvas.height],
        [desiredWidth, desiredHeight] = [canvas.clientWidth, canvas.clientHeight];

      if (currentWidth != desiredWidth || currentHeight !== desiredHeight) {
        this.#canvas.width = desiredWidth;
        this.#canvas.height = desiredHeight;
        this.#link.resize(desiredWidth, desiredHeight);
      }
    }
    //#endregion
  
    //#region Public Methods
    constructor(canvas) {
      this.#canvas = canvas;
      this.#context = canvas.getContext('2d');

      this.#worker = new Worker(new URL('./worker.js', import.meta.url));
      this.#link = wrap(this.#worker);

      this.#resize();
    }
  
    destroy() {
      this.#worker.terminate();
      this.stop();
    }

    add(boid) {
      this.#link.add(boid);
    }

    start() {
      if (this.#animationFrameRequestId)  // We're already running
        return;
  
      this.#tick();
    }
  
    stop() {
      if (!this.#animationFrameRequestId) // We're not yet running
        return;
      
      this.#animationFrameRequestId = cancelAnimationFrame(this.#animationFrameRequestId);
    }
    //#endregion
}