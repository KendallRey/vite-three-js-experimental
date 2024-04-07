import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import SpaceShip from './space-ship';
import DynamicObj from './dynamic-obj';
import Ground from './world-ground';
import FBXObj from './fbx-obj';
import OBJObj from './obj-obj';
import ParticleSystem from './particle-system';
import { IDestroyable } from '../interface/killable';
import Effect from './effects';
import Laser from './laser';
import { SetVectorRandom } from '../helper/vector';

class SpaceScene extends THREE.Scene {

  private readonly camera: THREE.PerspectiveCamera;
  private readonly cameraContainer = new THREE.Group();
  private readonly clock = new THREE.Clock();

  private star?: THREE.Texture;
  private particlesMesh?: THREE.Points;

  private screenSize = new THREE.Vector2();

  private mousePosition = new THREE.Vector2();
  private targetPosition = new THREE.Vector3();
  private raycaster = new THREE.Raycaster();
  private groundMesh?: THREE.Mesh;
  private world: CANNON.World;

  constructor(camera: THREE.PerspectiveCamera, world: CANNON.World, screenX: number, screenY: number) {
    super()
    this.world = world;
    this.camera = camera;
    this.camera.layers.enable(1);
    this.raycaster.layers.set(1);
    this.initScreenSize(screenX, screenY);
  }

  async init() {

    await this.loadTextures();
    this.initGround();
    // this.initBGStarts(10000);
    this.initLighting();
    this.test();
    this.initListeners();

    this.initCamera();
    this.initObjects();
  }

  private initScreenSize(x: number, y: number) {
    this.screenSize  = new THREE.Vector2(x, y);
  }

  private async loadTextures() {
    const textureLoader = new THREE.TextureLoader();
    this.star = await textureLoader.loadAsync('assets/star.png');
  }

  private initGround() {
    new Ground(this, this.world, 2000, 2000);
  }

  private initLighting() {
    const pointLight = new THREE.PointLight(0xffffff, 0.1);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    this.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, .5);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    this.add(directionalLight);
  }

  private currentCameraPosition = new THREE.Vector3();
  private currentCameraRotation = new THREE.Quaternion();

  private initCamera() {
    this.camera.position.x = 2;
    this.camera.position.y = 4;
    this.camera.position.z = -2;
    this.camera.rotateX(Math.PI * -.7);
    this.camera.rotateY(Math.PI * .15);
    this.camera.rotateZ(Math.PI * .85);

    this.camera.getWorldPosition(this.currentCameraPosition);
    this.camera.getWorldQuaternion(this.currentCameraRotation);

    this.add(this.cameraContainer);
  }

  private initBGStarts(count: number) {
    const totalCount = count * 3;
    const particlesGeometry = new THREE.BufferGeometry();
    const positionArr = new Float32Array(totalCount);

    for(let i = 0; i < totalCount; i++){
      positionArr[i] = (Math.random() - 0.5) * (Math.random() * 100);
    }

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      map: this.star,
      color: 'white',
      transparent: true,
    });

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArr, 3));

    this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);

    this.add(this.particlesMesh);
  }

  private testMesh?: THREE.Mesh;
  private objs: DynamicObj[] = [];
  private effects: Effect[] = [];

  private test() {

    const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0,0.5,0), 20, 0xff0000);
    const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0,0.5,0), 20, 0x00ff00);
    const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0,0.5,0), 20, 0x0000ff);

    this.add(xAxis);
    this.add(yAxis);
    this.add(zAxis);

    const geometry = new THREE.BoxGeometry( .1, .1, 1);
    const material = new THREE.MeshBasicMaterial();

    this.testMesh = new THREE.Mesh(geometry, material);

    // this.add(this.testMesh);
  }


  private initListeners() {
    document.addEventListener('mousemove', (ev) => {

      this.mousePosition.x = (ev.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(ev.clientY / window.innerHeight) * 2 + 1;
      
    })

    document.addEventListener('mouseup', () => {
      this.fireTurrets();
    })
  }

  private spawnParticle(origin: THREE.Vector3, target: THREE.Vector3) {
    const newParticleSystem = new ParticleSystem(this, this.world, 50, target, 100);
    this.effects.push(newParticleSystem);

    const laser = new Laser(this, origin, target, 20);
    this.effects.push(laser);
  }

  private laserDispersion = new THREE.Vector3(0.8, 0, 0.8);

  private fireTurrets() {
    if(!this.spaceShip) return;
    this.spaceShip.turrets.forEach((turret) => {
      const pos = new THREE.Vector3();
      turret.getWorldPosition(pos)
      const offset = SetVectorRandom(this.laserDispersion);
      this.spawnParticle(pos, this.targetPosition.clone().add(offset));
    })
  }

  private spawnTest2() {
    const offset = new THREE.Vector3(0, 2, 0);
    const newObj = new FBXObj(this, this.world, 'assets/test_box');
    newObj.init(this.targetPosition.add(offset), { scale: new THREE.Vector3(0.05, 0.05, 0.05)})
    this.objs.push(newObj);
  }

  // #region Player

  private spaceShip?: SpaceShip;
  private spaceShipMesh?: THREE.Object3D<THREE.Object3DEventMap>;
  // #endregion

  private async initObjects() {
    this.spaceShip = new SpaceShip(this, this.world);
    await this.spaceShip.init(0.2, new THREE.Vector3(0, 5, 0));
    this.spaceShipMesh = this.spaceShip.getMesh();

    if(this.spaceShipMesh?.position)
      this.cameraContainer.position.copy(this.spaceShipMesh.position);

    this.spaceShip.initController();
    const obj = this.spaceShip.get();
    if(!obj) return;
    this.add(obj);

    this.objs.push(this.spaceShip);

    this.cameraContainer.add(this.camera);

    const { x: xPos, y: yPos , z: zPos } = this.currentCameraPosition;
    const { x: xRot, y: yRot , z: zRot, w } = this.currentCameraRotation;

    this.camera.position.set(xPos * 15, yPos * 15, zPos * 15);
    this.camera.quaternion.set(xRot, yRot, zRot, w);

    this.camera.position.sub(obj.position);
    this.camera.position.applyQuaternion(obj.quaternion.invert());
    this.camera.quaternion.premultiply(obj.quaternion.invert());

    const test = new OBJObj(this, this.world, 'assets/KR_Circle');
    await test.init(new THREE.Vector3(-20, 7, 0), { scale: new THREE.Vector3(10, 10, 10)})

    this.objs.push(test);

    const test2 = new OBJObj(this, this.world, 'assets/test_cube');
    await test2.init(new THREE.Vector3(-20, 2, 0), { scale: new THREE.Vector3(1, 1, 1)})

    this.objs.push(test2);
  }
  update(){
    const elapsedTime = this.clock.getElapsedTime();

    this.updateBGStars(elapsedTime);
    this.updateRaycast();

    this.spaceShip?.updateTurrets(this.targetPosition);
    this.spaceShip?.updateMovement();

    this.updateCamera();

    this.objs.forEach((obj) => obj.update())
    this.effects.forEach((obj) => obj.updateEffect())
    this.effects = this.garbageCollection(this.effects);
  }

  private lerpFactor = 0.1;

  private updateCamera() {
    if(!this.spaceShipMesh) return;
    this.cameraContainer.position.lerp(this.spaceShipMesh.position, this.lerpFactor);
  }

  private updateBGStars(time: number) {
    if(!this.particlesMesh) return;
    this.particlesMesh.rotation.y = (time * 0.008);
    this.particlesMesh.rotation.x = (time * 0.008);
  }

  private updateRaycast() {
    this.raycaster.setFromCamera(this.mousePosition, this.camera);
    const intersects = this.raycaster.intersectObjects(this.children);
    if(intersects.length > 0){
      const obj = intersects[0];
      this.targetPosition.copy(obj.point);
    }
  }

  private garbageCollection<T>(destroyables: IDestroyable[]) {
    return destroyables.filter((destroyable) => destroyable.isAlive) as T;
  }
}

export default SpaceScene;