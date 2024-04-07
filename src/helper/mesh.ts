import * as THREE from 'three';

export const GetChildMeshesIncludeName = (mesh: THREE.Object3D<THREE.Object3DEventMap>, nameInclude: string) => {
  const meshes: THREE.Object3D<THREE.Object3DEventMap>[] = [];
  mesh.traverse(child => {
    if ((child as THREE.Mesh).isMesh && child.name.includes(nameInclude)) {
      meshes.push(child);
    }
  });
  return meshes;
}