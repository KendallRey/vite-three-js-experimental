import * as CANNON from 'cannon-es';
import HoverShip from "./hover-ship";

class Mob extends HoverShip {
  
  private target?: CANNON.Body;

  updateMovement() {
    if(!this.mesh) return;

    if(!this.body) return;
    this.updateThrust();
    this.body.applyLocalForce(this.thrustForce, new CANNON.Vec3(0,0,0));
    // this.body.applyTorque(this.steeringForce);
  }

  setTarget(target: CANNON.Body) {
    this.target = target;
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