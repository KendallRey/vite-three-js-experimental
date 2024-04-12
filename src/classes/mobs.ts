import * as CANNON from 'cannon-es';
import HoverShip from "./hover-ship";
import { IEnemy } from '../interface/enemy';

class Mob extends HoverShip implements IEnemy {
  
  health = 100;
  currentHealth = 100;
  private targetRb?: CANNON.Body;

  takeDamage(dmg: number): boolean {
    this.currentHealth -= dmg;
    return this.currentHealth <= 0;
  }

  updateMovement() {
    if(!this.body) return;
    this.updateThrust();
    if(this.targetRb)
      this.setSteer(this.targetRb, this.body);
    this.body.applyLocalForce(this.thrustForce, new CANNON.Vec3(0,0,0));
    this.body.applyTorque(this.steeringForce);
  }

  setTarget(targetRb: CANNON.Body) {
    this.targetRb = targetRb;
  }

  setSteer(target: CANNON.Body, body: CANNON.Body) {
    const direction = new CANNON.Vec3();
    target.position.vsub(body.position, direction);
    direction.y = 0;
    direction.normalize();

    const forward = new CANNON.Vec3(0,0,1);
    const targetQuaternion = new CANNON.Quaternion();
    targetQuaternion.setFromVectors(forward, direction);

    const interpolatedQuaternion = new CANNON.Quaternion().copy(body.quaternion).slerp(targetQuaternion, 1);

    body.quaternion.copy(interpolatedQuaternion);

  }
}

export default Mob;