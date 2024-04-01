import * as THREE from 'three';
import * as CANNON from 'cannon';
import { ThreeVec3ToCannonVec3 } from '../helper/vector';

export default class BouncyBox {
  private scene: THREE.Scene;
  private world: CANNON.World;
  private mesh: THREE.Mesh;
  private body: CANNON.Body;

  constructor(scene: THREE.Scene, world: CANNON.World, size: THREE.Vector3, position: THREE.Vector3) {
    this.scene = scene;
    this.world = world;

    // Create Three.js mesh
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    this.scene.add(this.mesh);

    // Create Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
    this.body = new CANNON.Body({ mass: 1, shape });
    this.body.position.copy(ThreeVec3ToCannonVec3(position));
    this.world.addBody(this.body);
  }

  applyRandomImpulse() {
    const impulse = new CANNON.Vec3(
      Math.random() * 10 - 5, // Random x component
      Math.random() * 10 - 5, // Random y component
      Math.random() * 10 - 5  // Random z component
    );
    this.body.applyImpulse(impulse, new CANNON.Vec3());
  }
}
