import * as THREE from 'three';
import { GetChildMeshesIncludeName } from '../helper/mesh';

class Turret {

  public readonly gunMeshes: THREE.Object3D<THREE.Object3DEventMap>[] = [];
  public readonly mesh: THREE.Object3D<THREE.Object3DEventMap>;

  constructor(mesh: THREE.Object3D<THREE.Object3DEventMap>) {
    this.mesh = mesh;
    this.gunMeshes = GetChildMeshesIncludeName(mesh, 'gun');
  }

  updateTurret(target: THREE.Vector3) {
    const position = new THREE.Vector3();
    this.mesh.getWorldPosition(position);
    position.z = 0;
    position.x = 0;
    const newTargetPosition = target.clone().add(position);
    this.mesh.lookAt(newTargetPosition);
    this.gunMeshes.forEach((gunMesh) => gunMesh.lookAt(target));
  }
}

export default Turret