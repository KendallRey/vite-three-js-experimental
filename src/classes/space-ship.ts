import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { Group, Object3DEventMap } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import DynamicObj from './dynamic-obj';
import {  SetVectorRandom, ThreeVec3ToCannonVec3 } from '../helper/vector';
import Turret from './turret';
import Effect from './effects';
import ParticleSystem from './particle-system';
import Laser from './laser';

class SpaceShip extends DynamicObj {

  private model?: Group<Object3DEventMap>
  private loader = new FBXLoader();
  turrets: Turret[] = [];
  private targetAltitude = 10;
  private hoverOffsetForce = 200;

  private ray = new CANNON.Ray();
  private downDir = new CANNON.Vec3(0, -1, 0);

  async init(scale: number, position: THREE.Vector3) {
    this.model = await this.loader.loadAsync('assets/three-js.fbx')
    this.model.scale.set(scale, scale, scale)

    this.model.traverse(child => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.processGroup(mesh)
      }
    });

    const body = this.useBoxShape(this.model, { mass: 100, linearDamping: 0.2, angularDamping: 0.6 })

    const newVec3 = ThreeVec3ToCannonVec3(position);
    body.position.copy(newVec3);

    body.angularFactor = new CANNON.Vec3(0, 1, 0);

    this.setObj(this.model, body);
  }


  processGroup(obj: THREE.Object3D<THREE.Object3DEventMap>) {
    if(obj.name.includes('turret')){
      const turret = new Turret(obj);
      this.turrets.push(turret);
    }
  }

  get() {
    return this.mesh;
  }

  updateTurrets(target: THREE.Vector3) {
    this.turrets.forEach((turret) => turret.updateTurret(target));
  }

  private laserDispersion = new THREE.Vector3(0.8, 0, 0.8);

  fireTurret(target: THREE.Vector3, effects: Effect[]) {
    this.turrets.forEach((turret) => {
  
      turret.gunMeshes.forEach((gun) => {

        const pos = new THREE.Vector3();
        gun.getWorldPosition(pos);
        const offset = SetVectorRandom(this.laserDispersion);
  
        const newTarget = target.clone().add(offset);
  
        const newParticleSystem = new ParticleSystem(this.scene, this.world, 50, newTarget, 100);
        effects.push(newParticleSystem);
    
        const laser = new Laser(this.scene, pos, newTarget, 20);
        effects.push(laser);

      })

    })
  }

  private keyDown = new Set<string>();

  initController(){
    if(!this.mesh) return;
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    document.addEventListener('keyup', this.handleKeyup.bind(this));
  }

  private handleKeydown(ev: KeyboardEvent) {
    this.keyDown.add(ev.key.toLowerCase());
  }

  private handleKeyup(ev: KeyboardEvent) {
    this.keyDown.delete(ev.key.toLowerCase());
  }

  private steeringForce = new CANNON.Vec3(0, 300, 0);
  private thrustForce = new CANNON.Vec3(0, 0, 0);

  private updateInput() {
    if(!this.body) return;

    const startPos = this.body.position;
    this.ray.from.copy(startPos);
    this.ray.to.copy(startPos.vadd(this.downDir.scale(this.targetAltitude)));

    const raycastResult = new CANNON.RaycastResult();
    this.world.rayTest(this.ray.from, this.ray.to, raycastResult);

    if(raycastResult.hasHit) {
      const { distance } = raycastResult;
      this.thrustForce.y = Math.abs(((distance - this.targetAltitude) * 1.1) * this.hoverOffsetForce);
    }

    const left = this.keyDown.has('a') || this.keyDown.has('arrowleft');
    const right = this.keyDown.has('d') || this.keyDown.has('arrowright');
    const forward = this.keyDown.has('w') || this.keyDown.has('arrowup');
    const backward = this.keyDown.has('s') || this.keyDown.has('arrowdown');

    if(forward){
      this.thrustForce.z = 220
    }
    else if (backward) {
      this.thrustForce.z = -220
    }
    else {
      this.thrustForce.z = 0
    }

    if(left)
      this.body.applyTorque(this.steeringForce)
    if(right)
      this.body.applyTorque(this.steeringForce.clone().scale(-1))

  }

  

  updateMovement() {
    if(!this.mesh) return;

    if(!this.body) return;
  
    this.updateInput();

    this.body.applyLocalForce(this.thrustForce, new CANNON.Vec3(0,0,0));

  }

}

export default SpaceShip;