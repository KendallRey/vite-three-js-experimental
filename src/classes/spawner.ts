import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import DynamicObj from './dynamic-obj';
import TestBox from './test-box';

class Spawner {

  protected scene: THREE.Scene;
  protected world: CANNON.World;

  private grid: Vector2;

  objs: DynamicObj[] = []

  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    grid: Vector2
    ){
    this.scene = scene;
    this.world = world;
    this.grid = grid;
  }

  init() {
    const position = new THREE.Vector3(0, 0, 0);
    const { x, y } = this.grid;
    for(let i = 0; i <= x - 1; i++){
      for(let i2 = 0; i2 <= y - 1; i2++){
        position.x = i
        position.z = i2
        const box = new TestBox(this.scene, this.world, position, .6);
        this.objs.push(box);
      }
    }
  }
}

export default Spawner;