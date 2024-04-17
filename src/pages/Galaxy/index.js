import './index.less';
import { PointLight, Vector3 } from 'three';
import { onMount, onCleanup } from 'solid-js';
import Canvas from './lib/canvas';
import Physics from './lib/physics';
import Engine from './lib/engine';
import { SphericalBody } from './lib/bodies';
import { useParams } from '@solidjs/router';

export default function ()  {
  const { num } = useParams();

  let element,
    engine;

  onMount(() => {
    const canvas = new Canvas(element),
      physics = new Physics();
    
    engine = new Engine(canvas, physics);

    const light = new PointLight(0xff44aa, 500, 5000);
      light.position.set(0, 0, 0);  

    canvas.add(light);

    for(let i = 0; i < Math.min(num ?? 512, 1024); i++) {
      const d = Math.random() * 48 + 4,
        r = Math.random() * 2 * Math.PI,
        t = Math.random() * 2 * Math.PI,
        size = Math.random() + 0.25;

      const sphere = new SphericalBody({
        mass: size / 50,
        radius: size,
        position: new Vector3(d * Math.sin(r) * Math.cos(t), d * Math.sin(r) * Math.sin(t), d * Math.cos(r)),
        color: 0xffffff      
      });
      
      engine.addSphere(sphere);
    }

    engine.start();
  });

  onCleanup(() => {
    engine.destroy();
  });

  return <canvas ref={element}></canvas>;
};