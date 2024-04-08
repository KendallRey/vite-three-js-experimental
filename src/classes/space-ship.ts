import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import {  SetVectorRandom } from '../helper/vector';
import Turret from './turret';
import Effect from './effects';
import ParticleSystem from './particle-system';
import Laser from './laser';
import ExplosionField from './explosion-field';
import HoverShip from './hover-ship';

class SpaceShip extends HoverShip {

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
  
        const newParticleSystem = new ParticleSystem(this.scene, this.world, 30, newTarget, 100);
        effects.push(newParticleSystem);
    
        const laser = new Laser(this.scene, pos, newTarget, 20);
        effects.push(laser);

        const explosion = new ExplosionField(this.world, newTarget, 3, 2);
        effects.push(explosion);

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


  private updateInput() {
    if(!this.body) return;

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
  
    this.updateThrust();
    this.updateInput();

    this.body.applyLocalForce(this.thrustForce, new CANNON.Vec3(0,0,0));

  }

}

export default SpaceShip;