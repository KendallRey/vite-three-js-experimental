import * as THREE from 'three';
import * as CANNON from 'cannon';

abstract class DynamicObj {

  private scene: THREE.Scene;
  private world: CANNON.World;
  private mesh?: THREE.Object3D<THREE.Object3DEventMap>;
  private body?: CANNON.Body;

  constructor (scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
  }

  protected setObj( mesh: THREE.Object3D<THREE.Object3DEventMap>, body: CANNON.Body ) {
    this.mesh = mesh;
    this.body = body;
    this.scene.add(this.mesh);
    this.world.addBody(this.body);
  }

  protected setMesh( mesh: THREE.Object3D<THREE.Object3DEventMap> ) {
    this.mesh = mesh;
    this.scene.add(this.mesh);
  }

  protected setBody( body: CANNON.Body ) {
    this.body = body;
    this.world.addBody(this.body);
  }

  update() {
    if(!this.body) return;
    this.mesh?.position.copy(this.body.position);
    this.mesh?.quaternion.copy(this.body.quaternion);
  }

}

export default DynamicObj