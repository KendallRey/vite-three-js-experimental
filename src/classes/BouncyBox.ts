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

    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    this.scene.add(this.mesh);

    const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
    this.body = new CANNON.Body({ mass: 1, shape });
    const newVec3 = ThreeVec3ToCannonVec3(position);
    this.body.position.copy(newVec3);
    this.world.addBody(this.body);
  }

  update() {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
}
