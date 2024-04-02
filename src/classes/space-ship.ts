import * as THREE from 'three';
import { Group, Object3DEventMap } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

class SpaceShip {

  private model?: Group<Object3DEventMap>
  private loader = new FBXLoader();
  private turrets: THREE.Object3D<THREE.Object3DEventMap>[] = [];

  async init(scale: number) {
    this.model = await this.loader.loadAsync('assets/test_ship.fbx')
    this.model.scale.set(scale, scale, scale)
    this.model.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.processGroup(mesh)
      }
    });
  }

  processGroup(obj: THREE.Object3D<THREE.Object3DEventMap>) {
    if(obj.name.includes('turret')){
      this.turrets.push(obj);
    }
  }

  get() {
    return this.model;
  }

  updateTurrets(target: THREE.Vector3) {
    this.turrets.forEach((turret) => turret.lookAt(target));
  }
}

export default SpaceShip;