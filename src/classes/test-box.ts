import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { ThreeVec3ToCannonVec3 } from '../helper/vector';
import DynamicObj from './dynamic-obj';

class TestBox extends DynamicObj {

  constructor(scene: THREE.Scene, world: CANNON.World, position: THREE.Vector3, size: number) {
    super(scene, world)

    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2));
    const body = new CANNON.Body({ mass: 1, shape });
    const newVec3 = ThreeVec3ToCannonVec3(position);
    body.position.copy(newVec3);

    this.setObj(mesh, body);
  }

}

export default TestBox;