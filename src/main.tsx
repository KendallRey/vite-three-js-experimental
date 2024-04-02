import * as THREE from 'three';
import * as CANNON from 'cannon';
import SpaceScene from './classes/space-scene';
import './index.css';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('root') as HTMLCanvasElement
})

// renderer.setSize(width, height);

const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);

const physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -9.81, 0);

const scene = new SpaceScene();

function tick() {
  physicsWorld.step(1 / 60);
  renderer.render(scene, mainCamera);
  requestAnimationFrame(tick);
}

tick();
