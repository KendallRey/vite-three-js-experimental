import * as THREE from 'three';
import * as CANNON from 'cannon';
import { ThreeVec3ToCannonVec3 } from '../helper/vector';

export default class Ground {
  private scene: THREE.Scene;
  private world: CANNON.World;

  constructor(scene: THREE.Scene, world: CANNON.World, width: number, height: number) {
    this.scene = scene;
    this.world = world;

    // Create the ground mesh
    const groundGeometry = new THREE.PlaneGeometry(width, height);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xd3436, side: THREE.DoubleSide });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -5;
    const newPosition = groundMesh.position.clone();
    this.scene.add(groundMesh);

    // Create the ground shape
    const groundShape = new CANNON.Plane();
    groundShape.worldNormal.set(-10, -10, -10); // Set the normal of the ground plane
    const rotationQuaternion = new CANNON.Quaternion()
    // rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 90);
    rotationQuaternion.vmult(groundShape.worldNormal, groundShape.worldNormal); // Rotate the normal vector

    // Adjust the size of the ground plane by scaling its bounding box
    const groundShapeHalfExtents = new CANNON.Vec3(width / 2, 1, height / 2); // Use half of the desired width and height
    groundShape.boundingSphereRadius = groundShapeHalfExtents.norm(); // Update bounding sphere radius

    // Create the ground body
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.position.copy(ThreeVec3ToCannonVec3(newPosition))
    this.world.addBody(groundBody);

    const geometry = new THREE.BoxGeometry(width, height, 10);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const _groundMesh = new THREE.Mesh(geometry, material);
    _groundMesh.rotateX(Math.PI * 0.5);
    _groundMesh.position.y = -10;
    scene.add(_groundMesh);
  }
}
