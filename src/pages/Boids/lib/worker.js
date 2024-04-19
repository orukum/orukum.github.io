import { expose } from 'comlink';

let visualRange = 200,
  visualRageSquared = visualRange * visualRange,
  protectedRange = 10,
  protectedRangeSquared = protectedRange * protectedRange,
  minSpeed = 2,
  maxSpeed = 4,
  avoidFactor = 0.05,
  matchingFactor = 0.05,
  centeringFactor = 0.00025,
  turningFactor = 0.1,
  maxX = 0,
  maxY = 0,
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
        closePosX = 0,
        closePosY = 0,
        visiblePosX = 0,
        visiblePosY = 0,
        visibleVelX = 0,
        visibleVelY = 0;

      for(let other of boids) {
        if (boid === other)
          continue;

        const diffX = boid.position.x - other.position.x,
          diffY = boid.position.y - other.position.y,
          distSquared = diffX * diffX + diffY * diffY;

        if (distSquared < protectedRangeSquared) {
          closePosX += boid.position.x - other.position.x;
          closePosY += boid.position.y - other.position.y;
        } else if (distSquared < visualRageSquared) {
          visiblePosX += other.position.x;
          visiblePosY += other.position.y;

          visibleVelX += other.velocity.x;
          visibleVelY += other.velocity.y;

          totalVisible += 1;
        }
      }

      if (totalVisible > 0) {
        visiblePosX = visiblePosX / totalVisible;
        visiblePosY = visiblePosY / totalVisible;
  
        visibleVelX = visibleVelX / totalVisible;
        visibleVelY = visibleVelY / totalVisible;
  
        boid.velocity.x += (visiblePosX - boid.position.x) * centeringFactor + (visibleVelX - boid.velocity.x) * matchingFactor;
        boid.velocity.y += (visiblePosY - boid.position.y) * centeringFactor + (visibleVelY - boid.velocity.y) * matchingFactor;
  
        boid.velocity.x += closePosX * avoidFactor;
        boid.velocity.y += closePosY * avoidFactor;
      }

      if (boid.position.x < 0)
        boid.velocity.x += turningFactor;
      else if (boid.position.x > maxX)
        boid.velocity.x -= turningFactor;

      if (boid.position.y < 0)
        boid.velocity.y += turningFactor;
      else if (boid.position.y > maxY)
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