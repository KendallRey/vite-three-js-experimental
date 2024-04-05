import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import DynamicObj from "./dynamic-obj";
import { ThreeVec3ToCannonVec3 } from '../helper/vector';

class Particle extends DynamicObj {

  async init(position: THREE.Vector3, options: ThreeMeshOptions) {

    let x = 0.5, y = 0.5, z = 0.5;
    if(options.scale) {
      x = options.scale.x;
      y = options.scale.y;
      z = options.scale.z;
    }

    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshPhongMaterial(options.materialProps);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    const shape = new CANNON.Particle();
    const body = new CANNON.Body({ ...options.bodyProps, shape });
    const newVec3 = ThreeVec3ToCannonVec3(position);
    body.position.copy(newVec3);

    this.setObj(mesh, body);

  }
}

export default Particle