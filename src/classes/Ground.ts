import * as THREE from 'three';
import * as CANNON from 'cannon-es'

export default class Ground {
  private scene: THREE.Scene;
  private world: CANNON.World;
  private planeMesh: THREE.Mesh;
  private groundBody: CANNON.Body;

  constructor(scene: THREE.Scene, world: CANNON.World, width: number, height: number) {
    this.scene = scene;
    this.world = world;

    const groundShape = new CANNON.Plane();
    this.groundBody = new CANNON.Body({ mass: 0 });
    this.groundBody.addShape(groundShape);
    this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x636e72,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    this.planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    this.syncPlane();
  }

  private syncPlane()  {
    const { x, y, z } = this.groundBody.position;
    const quaternion = new THREE.Quaternion().copy(this.groundBody.quaternion);
    this.planeMesh.position.set(x, y, z);
    this.planeMesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    
    this.world.addBody(this.groundBody);
    this.scene.add(this.planeMesh);
  }
}
