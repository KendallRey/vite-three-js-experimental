import * as THREE from 'three';
import { MTLLoader, OBJLoader } from 'three/examples/jsm/Addons.js';

export default class BlasterScene extends THREE.Scene {

  private readonly mtlLoader = new MTLLoader();
  private readonly objLoader = new OBJLoader();

  private readonly camera: THREE.PerspectiveCamera;

  private blaster?: THREE.Group;

  private keyDown = new Set<string>();
  private directionVector = new THREE.Vector3();

  constructor (camera: THREE.PerspectiveCamera) {
    super()
    this.camera = camera;

  }

  async init(){
    
    const targetMtl = await this.mtlLoader.loadAsync('assets/targetA.mtl');
    targetMtl.preload();

    const t1 = await this.createTarget(targetMtl);
    t1.position.x = -1;
    t1.position.z = -3;
    const t2 = await this.createTarget(targetMtl);
    t2.position.x = 0;
    t2.position.z = -3;
    const t3 = await this.createTarget(targetMtl);
    t3.position.x = 1;
    t3.position.z = -3;
    const t4 = await this.createTarget(targetMtl);
    t4.position.x = 2;
    t4.position.z = -3;

    this.add(t1, t2, t3, t4);

    this.blaster = await this.createBlaster();
    this.add(this.blaster);

    this.blaster.position.z = 3;
    this.blaster.add(this.camera);

    this.camera.position.z = 1;
    this.camera.position.y = 0.5;

    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(0, 4, 2);

    this.add(light);

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.keyDown.add(event.key.toLowerCase());
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.keyDown.delete(event.key.toLowerCase());
  }

  private updateInput(){
    if(!this.blaster) return;

    const shiftKey = this.keyDown.has('shift');
    if(!shiftKey) {
      if(this.keyDown.has('a') || this.keyDown.has('arrowleft'))
        this.blaster.rotateY(0.02);
      if(this.keyDown.has('d') || this.keyDown.has('arrowright'))
        this.blaster.rotateY(-0.02);
    }

    const dir = this.directionVector;

    this.camera.getWorldDirection(dir);

    const speed = 0.01;

    if(this.keyDown.has('w') || this.keyDown.has('arrowup')){
      this.blaster.position.add(dir.clone().multiplyScalar(speed));
    }
    else if (this.keyDown.has('s') || this.keyDown.has('arrowdown')) {
      this.blaster.position.add(dir.clone().multiplyScalar(-speed));
    }

    if(shiftKey){
      const strafeDir = dir.clone();
      const upVector = new THREE.Vector3(0, 1, 0);
      
      if(this.keyDown.has('a') || this.keyDown.has('arrowleft'))
        this.blaster.position.add(
          strafeDir.applyAxisAngle(upVector, Math.PI * 0.5).multiplyScalar(speed)
        )
      else if(this.keyDown.has('d') || this.keyDown.has('arrowright'))
        this.blaster.position.add(
          strafeDir.applyAxisAngle(upVector, Math.PI * -0.5).multiplyScalar(speed)
        )
      }
  }

  private async createTarget (mtl: MTLLoader.MaterialCreator) {
    this.objLoader.setMaterials(mtl);
    const modelRoot = await this.objLoader.loadAsync('assets/targetA.obj');
    modelRoot.rotateY(Math.PI * 0.5);

    return modelRoot;
  }

  private async createBlaster(){
    const mtl = await this.mtlLoader.loadAsync('assets/blasterG.mtl');
    mtl.preload();

    this.objLoader.setMaterials(mtl);
    const modelRoot = await this.objLoader.loadAsync('assets/blasterG.obj');

    return modelRoot;
  }

  update(){
    this.updateInput();
  }
}