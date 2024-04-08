import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import DynamicObj from "./dynamic-obj";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { ThreeVec3ToCannonVec3 } from '../helper/vector';
import Turret from './turret';
import Effect from './effects';

class HoverShip extends DynamicObj {

  protected model?: THREE.Group<THREE.Object3DEventMap>;
  protected loader = new FBXLoader();
  turrets: Turret[] = [];

  protected ray = new CANNON.Ray();
  protected downDir = new CANNON.Vec3(0, -1, 0);

  protected targetAltitude = 20;
  protected thrustForceMultiplier = 1.1;
  protected hoverOffsetForce = 200;
  protected steeringForce = new CANNON.Vec3(0, 300, 0);
  protected thrustForce = new CANNON.Vec3(0, 0, 0);
  protected targetDispersion = new THREE.Vector3(0.8, 0, 0.8);

  public async init(scale: number, position: THREE.Vector3, url: string, bodyProps?: CannonBodyOptions) {
    this.model = await this.loader.loadAsync(`${url}.fbx`);
    this.model.scale.set(scale, scale, scale)

    this.model.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.processGroup(mesh)
      }
    });

    const body = this.useBoxShape(this.model, { mass: 100, linearDamping: 0.2, angularDamping: 0.6, ...bodyProps })

    const newVec3 = ThreeVec3ToCannonVec3(position);
    body.position.copy(newVec3);

    body.angularFactor = new CANNON.Vec3(0, 1, 0);

    this.setObj(this.model, body);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fireTurret(_target: THREE.Vector3, _effects: Effect[]) {}

  processGroup(obj: THREE.Object3D<THREE.Object3DEventMap>) {
    if(obj.name.includes('turret')){
      const turret = new Turret(obj);
      this.turrets.push(turret);
    }
  }

  updateTurrets(target: THREE.Vector3) {
    this.turrets.forEach((turret) => turret.updateTurret(target));
  }

  updateMovement() {
    this.updateThrust();

    this.body?.applyLocalForce(this.thrustForce, new CANNON.Vec3(0,0,0));
  }

  protected updateThrust() {
    if(!this.body) return;
    const startPos = this.body.position;
    this.ray.from.copy(startPos);
    this.ray.to.copy(startPos.vadd(this.downDir.scale(this.targetAltitude)));

    const raycastResult = new CANNON.RaycastResult();
    this.world.rayTest(this.ray.from, this.ray.to, raycastResult);

    if(raycastResult.hasHit) {
      const { distance } = raycastResult;
      this.thrustForce.y = Math.abs(((distance - this.targetAltitude) * this.thrustForceMultiplier) * this.hoverOffsetForce);
    }
  }
}

export default HoverShip;