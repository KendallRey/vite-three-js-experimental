import * as THREE from 'three';
import * as CANNON from 'cannon';
import { ThreeVec3ToCannonVec3 } from '../helper/vector';

export default class Ground {
  private scene: THREE.Scene;
  private world: CANNON.World;

  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;

    // Create the ground mesh
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xd3436, side: THREE.DoubleSide });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
    groundMesh.position.y = -1;
    this.scene.add(groundMesh);

    // Create the ground shape
    const groundShape = new CANNON.Plane();
    
    // Create the ground body
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.position.copy(ThreeVec3ToCannonVec3(groundMesh.position))
    this.world.addBody(groundBody);
  }
}
