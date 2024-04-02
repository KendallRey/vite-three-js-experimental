import * as THREE from 'three';
import * as CANNON from 'cannon';

export const ThreeVec3ToCannonVec3 = (threeVec3: THREE.Vector3) => {
  const { x, y, z, } = threeVec3;
  return new CANNON.Vec3(x, y, z);
}

export const CannonVec3ToThreeVec3 = (cannonVec3: CANNON.Vec3) => {
  const { x, y, z, } = cannonVec3;
  return new THREE.Vector3(x, y, z);
}

export const GetGroupDimensions = (group: THREE.Group): THREE.Vector3 => {
  const boundingBox = new THREE.Box3();
  boundingBox.setFromObject(group);
  return boundingBox.getSize(new THREE.Vector3());
}