import * as THREE from 'three';
import BlasterScene from './classes/BlasterScene';
import * as CANNON from 'cannon';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('root') as HTMLCanvasElement
})

renderer.setSize(width, height);

const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);

// Initialize Cannon.js physics world
const physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -9.81, 0);

const scene = new BlasterScene(mainCamera, physicsWorld);
scene.init();

function tick() {
  scene.update();
  physicsWorld.step(1 / 60);
  renderer.render(scene, mainCamera);
  requestAnimationFrame(tick);
}

tick();
