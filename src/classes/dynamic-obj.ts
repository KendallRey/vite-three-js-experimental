import {
  Object3D as TObject3D,
  Object3DEventMap as TObject3DEventMap,
  Scene as TScene,
  Group as TGroup,
  Mesh as TMesh,
  BufferGeometry as TBufferGeometry,
} from 'three';
import { 
  World as CWorld,
  Body as CBody,
  Box as CBox,
  Vec3 as CVec3,
  Trimesh as CTrimesh,
  ConvexPolyhedron as CConvexPolyhedron,
} from 'cannon-es';
import { GetGroupDimensions } from '../helper/vector';


type MeshType = TObject3D<TObject3DEventMap>

abstract class DynamicObj {

  private isAlive = true;
  protected scene: TScene;
  protected world: CWorld;
  protected mesh?: MeshType;
  protected body?: CBody;

  getBody() { return this.body; }
  getMesh() { return this.mesh; }

  constructor (scene: TScene, world: CWorld) {
    this.scene = scene;
    this.world = world;
  }

  protected setObj( mesh: MeshType, body: CBody) {
    this.mesh = mesh;
    this.body = body;
    this.scene.add(this.mesh);
    this.world.addBody(this.body);
  }

  protected setMesh( mesh: MeshType ) {
    this.mesh = mesh;
    this.scene.add(this.mesh);
  }

  protected setBody( body: CBody ) {
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

    const boxShape = new CBox(new CVec3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2));

    const body = new CBody({ mass: 1, shape: boxShape, ...options });
    return body;
  }



  protected useCompoundShape(mesh: TGroup<TObject3DEventMap>, options?: CannonBodyOptions) {
    const boxShapes: CBox[] = [];
    console.log("test", mesh)
    mesh.children.forEach((child) => {
      if(child instanceof TMesh) { 
        const dimensions = GetGroupDimensions(child);
        const boxShape = new CBox(new CVec3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2));
        boxShapes.push(boxShape);
      }
    })

    const boxBodies = boxShapes.map(shape => {
      return new CBody({
          mass: 0,
          shape: shape,
      });
    });
    const compoundBody = new CBody({ mass: 1, ...options });
    boxBodies.forEach(body => {
      compoundBody.addShape(body.shapes[0], body.position, body.quaternion);
    });
    return compoundBody
  }

  protected useTrimeshShape(mesh: TGroup<TObject3DEventMap>, options?: CannonBodyOptions){
    const mainMesh = mesh.children[0];
    if(mainMesh instanceof TMesh) {
      const positions = mainMesh.geometry.attributes.position.array as number[];
    
     const indices: number[] = [];
      for (let i = 0; i < positions.length / 3; i += 3) {
        indices.push(i, i + 1, i + 2);
      }

      const shape = new CTrimesh(positions, indices);
      const body = new CBody({ mass: 100, shape: shape, ...options });

      return body;
    }
  }

  protected useConvexShape(mesh: TGroup<TObject3DEventMap>, options?: CannonBodyOptions){
    const mainMesh = mesh.children[0];
    console.log("test", mainMesh)
    if(mainMesh instanceof TMesh) {

      const positionsArr = mainMesh.geometry.attributes.position.array as number[];
      const normalsArr = mainMesh.geometry.attributes.normal.array as number[];

      const normals: CVec3[] = [];
      for (let i = 0; i < normalsArr.length; i += 3) {
        normals.push(new CVec3(normalsArr[i], normalsArr[i + 1], normalsArr[i + 2]));
      }

      const points: CVec3[] = [];
      for (let i = 0; i < positionsArr.length; i += 3) {
        points.push(new CVec3(positionsArr[i], positionsArr[i + 1], positionsArr[i + 2]));
      }

      const faces: number[][] = [];
      for (let i = 0; i < positionsArr.length / 9; i += 3) {
          faces.push([i, i + 1, i + 2]);
      }

      const shape = new CConvexPolyhedron({ vertices: points, faces, normals, });
      const body = new CBody({ mass: 100, shape: shape, ...options });

      return body;
    }
    return this.useBoxShape(mesh, options);
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