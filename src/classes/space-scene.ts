import * as THREE from 'three';

class SpaceScene extends THREE.Scene {

  constructor() {
    super()

    this.initLighting();
  }

  private initLighting() {
    const pointLight = new THREE.PointLight(0xffffff, 0.1);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    this.add(pointLight);
  }

  update(){
    
  }
}

export default SpaceScene;