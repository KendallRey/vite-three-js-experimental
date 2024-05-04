import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import DynamicObj from "./dynamic-obj"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { ThreeVec3ToCannonVec3 } from '../helper/vector';

class OBJObj extends DynamicObj {

  private readonly mtlLoader = new MTLLoader();
  private readonly objLoader = new OBJLoader();

  private url: string

  constructor(scene: THREE.Scene, world: CANNON.World, url: string){
    super(scene, world);
    this.url = url;
  }


  async init(position: THREE.Vector3, options?: ThreeMeshOptions){
    const objMtl = await this.mtlLoader.loadAsync(`${this.url}.mtl`);
    objMtl.preload();

    this.objLoader.setMaterials(objMtl);

    this.mesh = await this.objLoader.loadAsync(`${this.url}.obj`);
    this.setOptions(this.mesh, options);
    // const body = this.useBoxShape(this.mesh);
    // const body = this.useConvexShape(this.mesh);
    // const body = this.useCompoundShape(this.mesh);
    // const body = this.useTrimeshShape(this.mesh);
    const body = this.useTTCConvexShape(this.mesh);
    const newVec3 = ThreeVec3ToCannonVec3(position);
    body.position.copy(newVec3);

    this.setObj(this.mesh, body);
  }
}

export default OBJObj