import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { GetGroupDimensions } from '../helper/vector';

type MeshType = THREE.Object3D<THREE.Object3DEventMap>

abstract class DynamicObj {

  private isAlive = true;
  protected scene: THREE.Scene;
  protected world: CANNON.World;
  protected mesh?: MeshType;
  protected body?: CANNON.Body;

  constructor (scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
  }

  protected setObj( mesh: MeshType, body: CANNON.Body) {
    this.mesh = mesh;
    this.body = body;
    this.scene.add(this.mesh);
    this.world.addBody(this.body);
  }

  protected setMesh( mesh: MeshType ) {
    this.mesh = mesh;
    this.scene.add(this.mesh);
  }

  protected setBody( body: CANNON.Body ) {
    this.body = body;
    this.world.addBody(this.body);
  }

  update() {
    if(!this.body) return;
    if(!this.isAlive) return;
    this.mesh?.position.copy(this.body.position);
    this.mesh?.quaternion.copy(this.body.quaternion);
  }

  protected useBoxShape(mesh: MeshType, options?: CannonBodyOptions) {
    const dimensions = GetGroupDimensions(mesh);

    const boxShape = new CANNON.Box(new CANNON.Vec3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2));

    const body = new CANNON.Body({ mass: 1, shape: boxShape, ...options });
    return body;
  }

  protected setOptions(mesh: MeshType, options?: ThreeMeshOptions){
    if(options?.scale){
      mesh.scale.copy(options.scale)
    }
  }

  kill(){
    this.isAlive = false;
    if(this.body)
      this.world.removeBody(this.body);
    if(this.mesh)
      this.scene.remove(this.mesh);
  }
}

export default DynamicObj