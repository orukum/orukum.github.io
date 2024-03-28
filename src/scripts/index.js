import 'styles/index.less';
import * as THREE from 'three';
import Canvas from "./canvas";
import { Engine, SphericalBody, Vector } from './physics';

function makeLight() {
  const color = 0x220088;
  const intensity = 4000;
  const light = new THREE.PointLight(color, intensity);
  light.position.set(0, 0, 0);

  return light;
}

const element = document.getElementById('canvas'),
  canvas = new Canvas(element),
  engine = new Engine();

for(let i = 0; i < 64; i++) {
  const d = Math.random() * 32 + 4,
    r = Math.random() * 2 * Math.PI,
    t = Math.random() * 2 * Math.PI,
    size = Math.random();

  const planet = new SphericalBody(size / 1000, size / 2);
  planet.position = new Vector(d * Math.sin(r) * Math.cos(t), d * Math.sin(r) * Math.sin(t), d * Math.cos(r));
  planet.velocity = planet.position.cross(new Vector(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)).unit().scale(Math.pow(1.064/d, 0.5));

  engine.add(planet);
  canvas.add(planet.mesh);
  canvas.add(planet.light);
}

const core = new SphericalBody(1, 2, 0x000000);
core.freeze = true;

engine.add(core);
canvas.add(core.mesh);

//canvas.add(makeLight());

engine.startSimulation(1000/30);
canvas.startAnimation(false);