import { expose } from 'comlink';
import { Vector3 } from 'three';

function applyGravity(a, b, pDiff, pDist) {
  const scalar = Math.pow(pDist, -3);

  a.velocity.add(pDiff.clone().multiplyScalar(b.mass * -scalar));
  b.velocity.add(pDiff.clone().multiplyScalar(a.mass * scalar));
  
  a.position.add(a.velocity);
  b.position.add(b.velocity);
}

function applyCollision(a, b, pDiff, pDist) {
  const space = (a.radius + b.radius - pDist) / pDist / 2;

  a.position.add(pDiff.clone().multiplyScalar(space));
  b.position.add(pDiff.clone().multiplyScalar(-space));

  const vDiff = a.velocity.clone().sub(b.velocity),
    scalar = vDiff.clone().dot(pDiff) / (pDist * pDist),
    inverseMass = 0.90 / (a.mass + b.mass);

  a.velocity.sub(pDiff.clone().multiplyScalar(scalar * (b.mass + b.mass) * inverseMass));
  b.velocity.add(pDiff.clone().multiplyScalar(scalar * (a.mass + a.mass) * inverseMass));
}

function applyPhysics(bodies) {
  for(let i = 0; i < bodies.length; i++) {
    for(let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i],
        b = bodies[j],
        pDiff = a.position.clone().sub(b.position),
        pDist = pDiff.length();

      if (pDist > 1000)
        continue;

      if (pDist > a.radius + b.radius)
        applyGravity(a, b, pDiff, pDist);
      else
        applyCollision(a, b, pDiff, pDist);
    }
  }

  return bodies.map(({position}) => {
    return {
      position: position.toArray()
    };
  });
}

const bodies = [];
expose({
  add: function({radius, mass, position, velocity}) {
    bodies.push({
      radius,
      mass,
      position: new Vector3(...position),
      velocity: new Vector3(...velocity)
    });
  },
  simulate: function() {
    return applyPhysics(bodies);
  }
});