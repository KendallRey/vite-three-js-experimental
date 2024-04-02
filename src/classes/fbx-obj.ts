import * as THREE from 'three';
import * as CANNON from 'cannon';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import DynamicObj from "./dynamic-obj";
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js';
import { GetGroupDimensions, ThreeVec3ToCannonVec3 } from '../helper/vector';

class FBXObj extends DynamicObj {

  private loader = new FBXLoader();
  private url: string

  constructor (scene: THREE.Scene, world: CANNON.World, position: THREE.Vector3, url: string) {
    super(scene, world);
    this.url = url;
    this.init(position);
  }

  private async init(position: THREE.Vector3) {

    const mesh = await this.loader.loadAsync(this.url);
    mesh.position.copy(position);
    this.applyMaterial(mesh);
    mesh.scale.set(0.01, 0.01, 0.01)
    const body = this.useBoxShape(mesh);
    // const body = this.useConvexShape(mesh);
    const newVec3 = ThreeVec3ToCannonVec3(position);
    body.position.copy(newVec3);
    this.setObj(mesh, body);
  }

  private useConvexShape(mesh: THREE.Group<THREE.Object3DEventMap>) {
    
    const geometries: THREE.BufferGeometry[] = [];
    mesh.children.forEach((child) => {
      if(child instanceof THREE.Mesh) {
        const meshGeometry = child.geometry.clone(); 
        meshGeometry.applyMatrix4(child.matrixWorld);
        geometries.push(meshGeometry);
      }
    })

    if (geometries.length <= 0) return;

    const mergedGeometries = BufferGeometryUtils.mergeGeometries(geometries);

    const verticesArr = mergedGeometries.attributes.position.array;

    const faces = [];
    for (let i = 0; i < verticesArr.length / 9; i++) {
        faces.push([verticesArr[i * 9], verticesArr[i * 9 + 1], verticesArr[i * 9 + 2]]);
    }

    const facesArray = faces.map(face => [face[0], face[1], face[2]]);
    const vertices: CANNON.Vec3[] = facesArray.map(face => new CANNON.Vec3(face[0], face[1], face[2]));

    const convexShape = new CANNON.ConvexPolyhedron(vertices, facesArray);
    const body = new CANNON.Body({ mass: 1, shape: convexShape });

    return body;
  }

  private useBoxShape(mesh: THREE.Group<THREE.Object3DEventMap>) {
    const dimensions = GetGroupDimensions(mesh);

    const boxShape = new CANNON.Box(new CANNON.Vec3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2));
    
    const body = new CANNON.Body({ mass: 1, shape: boxShape });
    return body;
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
            emissiveIntensity: 1,
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