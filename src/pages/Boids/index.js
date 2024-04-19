import './index.less';
import { onMount, onCleanup } from 'solid-js';
import Engine from './lib/engine';

export default function ()  {
  let canvas,
    engine;

  onMount(() => {
    engine = new Engine(canvas);

    for(let i = 0; i < 1024; i++)
      engine.add({});

    engine.start();
  });

  onCleanup(() => {
    engine.destroy();
  });

  return <canvas class="boids" ref={canvas}></canvas>;
};