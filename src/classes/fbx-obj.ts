import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import DynamicObj from "./dynamic-obj";
import { ThreeVec3ToCannonVec3 } from '../helper/vector';

class FBXObj extends DynamicObj {

  private loader = new FBXLoader();
  private url: string

  constructor (scene: THREE.Scene, world: CANNON.World, url: string) {
    super(scene, world);
    this.url = url;
  }

  async init(position: THREE.Vector3, options?: ThreeMeshOptions) {

    this.mesh = await this.loader.loadAsync(`${this.url}.fbx`);
    this.mesh.position.copy(position);
    this.applyMaterial(this.mesh as THREE.Group<THREE.Object3DEventMap>);
    this.setOptions(this.mesh, options);
    const body = this.useBoxShape(this.mesh);
    // const body = this.useConvexShape(mesh);
    const newVec3 = ThreeVec3ToCannonVec3(position);
    body.position.copy(newVec3);
    this.setObj(this.mesh, body);
  }

  private applyMaterial(mesh: THREE.Group<THREE.Object3DEventMap>) {
    mesh.children.forEach((child) => {
      if(child instanceof THREE.Mesh) {
        if (child.material) {
          // Apply the material to the mesh
          // Here you can modify the material properties if needed
          // For example: child.material.color.set(0xff0000);
          const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 10,
            opacity: 1,
            blending: THREE.AdditiveBlending,
            
          });
          child.material = material;
      } else {
          const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
          child.material = material;
      }
      }
    })
  }
}

export default FBXObj