import { wrap } from 'comlink';

export default class Physics {
    //#region Private Fields
    #worker;  // Web worker responsible for physics calculations
    #link;  // Comlinked web worker
    #listeners; // The functions invoked when a simulation frame has completed

    #animationFrameRequestId; 
    //#endregion
  
    //#region Private Methods
    #simulate() {
      this.#animationFrameRequestId = requestAnimationFrame(async () => {
        this.#sendEvent(await this.#link.simulate());
        this.#simulate();
      });
    }

    #sendEvent(bodies) {
      for(let listener of this.#listeners)
        listener(bodies);
    }
    //#endregion
  
    //#region Public Methods
    constructor() {
      this.#worker = new Worker(new URL('./worker.js', import.meta.url));
      this.#link = wrap(this.#worker);
      this.#listeners = new Set();
    }

    on(fn) {
      this.#listeners.add(fn);
    }

    off(fn) {
      this.#listeners.delete(fn);
    }
  
    add(body) {
      this.#link.add(body);
    }
  
    startSimulation(msDelay) {
      if (this.#animationFrameRequestId)  // We're already simulating
        return;

      this.#simulate(msDelay);
    }
  
    stopSimulation() {
      if (!this.#animationFrameRequestId)  // We're not simulating
        return;
      
      cancelAnimationFrame(this.#animationFrameRequestId);
      this.#animationFrameRequestId = null;
    }

    destroy() {
      this.#worker.terminate();
    }
    //#endregion
}