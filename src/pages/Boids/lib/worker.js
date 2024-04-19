import { expose } from 'comlink';

let visualRageSquared = 10000,
  visualRange = 100,
  protectedRangeSquared = 400,
  minSpeed = 2,
  maxSpeed = 4,
  avoidFactor = 0.05,
  matchingFactor = 0.05,
  centeringFactor = 0.0005,
  turningFactor = 0.1,
  maxX = 100,
  maxY = 100,
  boids = [];

expose({
  add: function({position, velocity}) {
    boids.push({
      position: position ?? {x: Math.random() * maxX, y: Math.random() * maxY},
      velocity: velocity ?? {x: (Math.random() - 0.5) * minSpeed, y: (Math.random() - 0.5) * minSpeed}
    });
  },
  resize: function (width, height) {
    maxX = width;
    maxY = height;
  },
  next: function() {
    for(let boid of boids) {
      let totalVisible = 0,
        closePos = [0, 0],
        visiblePos = [0, 0],
        visibleVel = [0, 0];

      for(let other of boids) {
        if (boid === other)
          continue;

        let diffX = Math.abs(boid.position.x - other.position.x),
          diffY = Math.abs(boid.position.y - other.position.y)

        if (diffX > visualRange || diffY > visualRange)
          continue;

        let distSquared = diffX * diffX + diffY * diffY;
        if (distSquared < protectedRangeSquared) {
          closePos[0] += boid.position.x - other.position.x;
          closePos[1] += boid.position.y - other.position.y;
        } else if (distSquared < visualRageSquared) {
          visiblePos[0] += other.position.x;
          visiblePos[1] += other.position.y;

          visibleVel[0] += other.velocity.x;
          visibleVel[1] += other.velocity.y;

          totalVisible += 1;
        }
      }

      if (totalVisible > 0) {
        visiblePos[0] = visiblePos[0] / totalVisible;
        visiblePos[1] = visiblePos[1] / totalVisible;
  
        visibleVel[0] = visibleVel[0] / totalVisible;
        visibleVel[1] = visibleVel[1] / totalVisible;
  
        boid.velocity.x += (visiblePos[0] - boid.position.x) * centeringFactor + (visibleVel[0] - boid.velocity.x) * matchingFactor;
        boid.velocity.y += (visiblePos[1] - boid.position.y) * centeringFactor + (visibleVel[1] - boid.velocity.y) * matchingFactor;
  
        boid.velocity.x += closePos[0] * avoidFactor;
        boid.velocity.y += closePos[1] * avoidFactor;
      }

      if (boid.position.x < 20)
        boid.velocity.x += turningFactor;
      else if (boid.position.x > maxX - 20)
        boid.velocity.x -= turningFactor;

      if (boid.position.y < 20)
        boid.velocity.y += turningFactor;
      else if (boid.position.y > maxY - 20)
        boid.velocity.y -= turningFactor;

      let speed = Math.sqrt(boid.velocity.x * boid.velocity.x + boid.velocity.y * boid.velocity.y);
      if (speed > maxSpeed) {
        boid.velocity.x = (boid.velocity.x / speed) * maxSpeed;
        boid.velocity.y = (boid.velocity.y / speed) * maxSpeed;
      } else if (speed < minSpeed) {
        boid.velocity.x = (boid.velocity.x / speed) * minSpeed;
        boid.velocity.y = (boid.velocity.y / speed) * minSpeed;
      }

      boid.position.x += boid.velocity.x;
      boid.position.y += boid.velocity.y;
    }
    return boids;
  }
});