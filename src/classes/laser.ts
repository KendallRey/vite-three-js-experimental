import * as THREE from 'three';
import Effect from "./effects";

class Laser extends Effect {
  isAlive = true;
  private line?: THREE.Line;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, origin: THREE.Vector3, end: THREE.Vector3, life: number){
    super(life)
    this.scene = scene;
    this.init(origin, end);
  }

  init(origin: THREE.Vector3, end: THREE.Vector3){

    const line = new THREE.LineCurve3(origin, end);
    const geometry = new THREE.TubeGeometry(line, undefined, .05, 4);

    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, });

    this.line = new THREE.Line(geometry, material);

    this.scene.add(this.line);
  }

  updateEffect(){
    const doUpdate = this.update();
    if(!doUpdate) {
      this.scene.remove(this.line!);
      return;
    }
    const opacityStep = this.currentLife/ this.life;
    this.updateOpacity(opacityStep);
  }

  updateOpacity(opacity: number){
    if(this.line instanceof THREE.Line){
      if(!Array.isArray(this.line.material))
        this.line.material.opacity = opacity;
    }
  }
}

export default Laser;