import * as THREE from 'three';
import * as CANNON from 'cannon';
import SpaceScene from './classes/space-scene';
import './index.css';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('root') as HTMLCanvasElement
})

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#21282a'), 1);

const mainCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);

const world = new CANNON.World();
world.gravity.set(0, -9.81, 0);

const scene = new SpaceScene(mainCamera, world, width, height);
scene.init();

function tick() {
  scene.update();
  world.step(1 / 60);
  renderer.render(scene, mainCamera);
  requestAnimationFrame(tick);
}

tick();
