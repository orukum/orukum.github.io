import * as THREE from 'three';
import { sum } from "lodash";

export class Vector extends Array {
  //#region Private Methods
  #map(rhs, fn) {
    const result = new Vector();
    for(let i = 0; i < this.length; i++)
      result[i] = fn(this[i], rhs[i]);
    return result;
  }
  //#endregion

  //#region Public Methods
  add(rhs) {
    return this.#map(rhs, (x, y) => x + y);
  }

  subtract(rhs) {
    return this.#map(rhs, (x, y) => x - y);
  }

  scale(scalar) {
    return this.#map([], x => x * scalar);
  }

  product(rhs) {
    return sum(this.#map(rhs, (x, y) => x * y));
  }

  magnitude() {
    return Math.pow(this.product(this), 0.5);
  }

  unit() {
    return this.scale(1 / this.magnitude());
  }

  cross(rhs) {
    return new Vector(this[1] * rhs[2] - this[2] * rhs[1], this[2] * rhs[0] - this[0] * rhs[2], this[0] * rhs[1] - this[1] * rhs[0]);
  }
  //#endregion
}

export class Body {
  //#region Public Fields
  mass;
  position = new Vector(0, 0, 0);
  velocity = new Vector(0, 0, 0);
  freeze = false;
  //#endregion

  //#region Public Methods
  constructor(mass = 1) {
    this.mass = mass;
  }

  simulate() {
    if (!this.freeze) {
      this.position = this.position.add(this.velocity);
    }
  }
  //#endregion
}

export class SphericalBody extends Body {
  //#region Private Fields
  #mesh;
  #light;
  #noClip = new Set();
  //#endregion

  //#region Public Fields
  radius;
  
  get mesh() {
    return this.#mesh;
  }

  get light() {
    return this.#light;
  }
  //#endregion

  //#region Public Methods
  constructor(mass = 1, radius = 1, color = 0xffffff) {
    super(mass);

    this.radius = radius;
    this.#mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), new THREE.MeshToonMaterial({ color }));
    this.#light = new THREE.PointLight(color, radius * 4);
  }

  collide(other) {
    const xDiff = this.position.subtract(other.position),
      vDiff = this.velocity.subtract(other.velocity),
      dist = xDiff.product(xDiff);

    return this.velocity.subtract(xDiff.scale((vDiff.product(xDiff) / dist) * (other.mass + other.mass) / (this.mass + other.mass)));
  }

  simulate() {
    super.simulate();
    this.#mesh.position.set(...this.position);
    this.#light.position.set(...this.position);
  }
  //#endregion
}

window.Vector = Vector;

export class Engine {
  //#region Private Fields
  #bodies = new Set();  // Physics Bodies

  #intervalId; // interval Id
  //#endregion

  //#region Private Methods
  #simulate(speed) {
    this.#intervalId = setInterval(() => {
      this.#gravity();
      this.#bodies.forEach(body => body.simulate());
    }, speed);
  }

  #gravity() {
    const visited = new Set(),
      remove = new Set();
    
    for(let body of this.#bodies) {
      visited.add(body);
      for(let other of this.#bodies) {
        if (visited.has(other)) // We've already calculated the effect of gravity between these bodies
          continue;

        const difference = body.position.subtract(other.position),
          distance = difference.magnitude(),
          scalar = body.mass * other.mass * Math.pow(distance, -3);

          [body.velocity, other.velocity] = [body.velocity.add(difference.scale(-scalar / body.mass)), other.velocity.add(difference.scale(scalar / other.mass))];

        if(distance <= body.radius + other.radius) {
          [body.velocity, other.velocity] = [body.collide(other), other.collide(body)];
        }
      }
    }
  }
  //#endregion

  //#region Public Methods
  add(body) {
    this.#bodies.add(body);
  }

  startSimulation(speed) {
    if (this.#intervalId)  // We're already simulating
      return;

    this.#simulate(speed);
  }

  stopSimulation() {
    if (!this.#intervalId)  // We're not simulating
      return;

    clearInterval(this.#intervalId);
    this.#intervalId = null;
  }
  //#endregion
}