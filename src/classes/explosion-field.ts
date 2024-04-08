import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import Effect from "./effects";
import { ThreeVec3ToCannonVec3 } from '../helper/vector';

class ExplosionField extends Effect {

  private position: CANNON.Vec3;
  private world: CANNON.World;
  private radius: number;
  private body?: CANNON.Body;

  constructor(world: CANNON.World, position: THREE.Vector3, radius: number, life: number) {
    super(life);
    this.world = world;
    this.radius = radius;
    this.position = ThreeVec3ToCannonVec3(position);
    this.init();
  }

  private init(){
    const shape = new CANNON.Sphere(this.radius);
    this.body = new CANNON.Body({ mass: 0, shape });
    this.body.position = this.position;
    this.world.addBody(this.body);
  }

  updateEffect() {
    const doUpdate = this.update();
    if(!doUpdate) {
      this.world.removeBody(this.body!);
      return;
    }
  }
}

export default ExplosionField