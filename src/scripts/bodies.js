import { Mesh, SphereGeometry, MeshToonMaterial, Vector3 } from "three";

class Body {
  //#region Public Fields
  mass;
  position;
  velocity;
  //#endregion

  //#region Public Methods
  constructor({mass, position, velocity}) {
    this.mass = mass ?? 1;
    this.position = position ?? new Vector3(0, 0, 0);
    this.velocity = velocity ?? new Vector3(0, 0, 0);
  }
  //#endregion
}

export class SphericalBody extends Body {
    //#region Public Fields
    mesh;
    radius;
    //#endregion
  
    //#region Public Methods
    constructor({radius, color}) {
      super(...arguments);
  
      this.radius = radius ?? 1;
      this.mesh = new Mesh(new SphereGeometry(radius, 8, 8), new MeshToonMaterial({ color }));
    }
  
    toPhysicsObject() {
      return {
        mass: this.mass,
        radius: this.radius,
        position: this.position.toArray(),
        velocity: this.velocity.toArray()
      };
    }
    //#endregion
}