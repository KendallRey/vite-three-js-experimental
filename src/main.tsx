import * as THREE from 'three';
import * as CANNON from 'cannon';

import SpaceScene from './classes/space-scene';
import './index.css';
import { BlendFunction, DepthEffect, DepthOfFieldEffect, EffectComposer, EffectPass, RenderPass, SelectiveBloomEffect, TextureEffect } from 'postprocessing';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('root') as HTMLCanvasElement,
  powerPreference: "high-performance",
	antialias: false,
	stencil: false,
	depth: false
})

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor(new THREE.Color('#21282a'), 1);

const mainCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);


const world = new CANNON.World();
world.gravity.set(0, -9.81, 0);

const scene = new SpaceScene(mainCamera, world, width, height);
scene.init();

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, mainCamera));



const effect = new SelectiveBloomEffect(scene, mainCamera, {
  blendFunction: BlendFunction.ADD,
  mipmapBlur: true,
  luminanceThreshold: 0,
  luminanceSmoothing: 0,
  intensity: 2,
  radius: 0.3,
});

const depthOfFieldEffect = new DepthOfFieldEffect( mainCamera, {
  focusDistance: 10,
  focalLength: 2,
  bokehScale: 0.2,
  height: 480
});

const cocTextureEffect = new TextureEffect({
  blendFunction: BlendFunction.SKIP,
  texture: depthOfFieldEffect.cocTexture
});

const depthEffect = new DepthEffect({
  blendFunction: BlendFunction.SKIP
});

const effectPass = new EffectPass(
  mainCamera,
  effect,
  depthOfFieldEffect,
  depthEffect,
  cocTextureEffect,
);

effect.inverted = true;

composer.addPass(effectPass);

function tick() {
  requestAnimationFrame(tick);

  scene.update();
  world.step(1 / 60);

  composer.render();
  renderer.render(scene, mainCamera);
}

tick();
