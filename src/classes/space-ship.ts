import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { Group, Object3DEventMap } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import DynamicObj from './dynamic-obj';
import { GetGroupDimensions, ThreeVec3ToCannonVec3 } from '../helper/vector';

const SPEED = 1;

class SpaceShip extends DynamicObj {

  private model?: Group<Object3DEventMap>
  private loader = new FBXLoader();
  private turrets: THREE.Object3D<THREE.Object3DEventMap>[] = [];
  private targetAltitude = 10;
  private hoverOffsetForce = 18;

  private ray = new CANNON.Ray();
  private downDir = new CANNON.Vec3(0, -1, 0);

  async init(scale: number, position: THREE.Vector3) {
    this.model = await this.loader.loadAsync('assets/test_ship.fbx')
    this.model.scale.set(scale, scale, scale)

    this.model.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.processGroup(mesh)
      }
    });

    const body = this.useBoxShape(this.model);
    const newVec3 = ThreeVec3ToCannonVec3(position);
    body.position.copy(newVec3);
    body.angularFactor = new CANNON.Vec3(0, 1, 0);
    body.angularDamping = 0.5;

    this.setObj(this.model, body);
  }

  private useBoxShape(mesh: THREE.Group<THREE.Object3DEventMap>) {
    const dimensions = GetGroupDimensions(mesh);

    const boxShape = new CANNON.Box(new CANNON.Vec3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2));
    
    const body = new CANNON.Body({ mass: 10, shape: boxShape });
    return body;
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

  private keyDown = new Set<string>();

  initController(){
    if(!this.model) return;
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    document.addEventListener('keyup', this.handleKeyup.bind(this));
  }

  private handleKeydown(ev: KeyboardEvent) {
    this.keyDown.add(ev.key.toLowerCase());
  }

  private handleKeyup(ev: KeyboardEvent) {
    this.keyDown.delete(ev.key.toLowerCase());
  }

  private directionVector = new THREE.Vector3();

  updateMovement() {
    if(!this.model) return;

    const force = new CANNON.Vec3(0, 0, 0);
    const point = new CANNON.Vec3(0, 0, 0);

    if(!this.body) return;
  
    if(this.keyDown.has('a') || this.keyDown.has('arrowleft'))
      this.body.applyTorque(new CANNON.Vec3(0, 20, 0));
    if(this.keyDown.has('d') || this.keyDown.has('arrowright'))
      this.body.applyTorque(new CANNON.Vec3(0, -20, 0));

    if(this.keyDown.has('w') || this.keyDown.has('arrowup')){
      force.z = 20;
    }
    else if (this.keyDown.has('s') || this.keyDown.has('arrowdown')) {
      force.z = -20;
    }

    const startPos = this.body.position;
    this.ray.from.copy(startPos);
    this.ray.to.copy(startPos.vadd(this.downDir.scale(this.targetAltitude)));

    const raycastResult = new CANNON.RaycastResult();
    this.world.rayTest(this.ray.from, this.ray.to, raycastResult);

    if(raycastResult.hasHit) {
      const { distance } = raycastResult;
      force.y = Math.abs(((distance - this.targetAltitude) * 1.2) * this.hoverOffsetForce);
    }

    this.body.applyLocalForce(force, this.body.position);

  }
  
}

export default SpaceShip;