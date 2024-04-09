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

  getBody() { return this.body; }
  getMesh() { return this.mesh; }

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



  protected useConvexShape(mesh: THREE.Group<THREE.Object3DEventMap>, options?: CannonBodyOptions) {
    const boxShapes: CANNON.Box[] = [];
    mesh.children.forEach((child) => {
      if(child instanceof THREE.Mesh) { 
        const dimensions = GetGroupDimensions(mesh);
        const boxShape = new CANNON.Box(new CANNON.Vec3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2));
        boxShapes.push(boxShape);
      }
    })

    const boxBodies = boxShapes.map(shape => {
      return new CANNON.Body({
          mass: 0,
          shape: shape,
      });
    });
    const compoundBody = new CANNON.Body({ mass: 1, ...options });
    boxBodies.forEach(body => {
      compoundBody.addShape(body.shapes[0], body.position, body.quaternion);
    });
    return compoundBody
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