import * as THREE from 'three';
import SpaceShip from './space-ship';

class SpaceScene extends THREE.Scene {

  private readonly camera: THREE.PerspectiveCamera
  private readonly clock = new THREE.Clock();

  private star?: THREE.Texture;
  private particlesMesh?: THREE.Points;

  private screenSize = new THREE.Vector2();

  private mousePosition = new THREE.Vector2();
  private targetPosition = new THREE.Vector3();
  private raycaster = new THREE.Raycaster();
  private groundMesh?: THREE.Mesh;

  constructor(camera: THREE.PerspectiveCamera, screenX: number, screenY: number) {
    super()
    this.camera = camera;
    this.camera.layers.enable(1);
    this.raycaster.layers.set(1);
    this.initScreenSize(screenX, screenY);
  }

  async init() {

    await this.loadTextures();
    this.initGround();
    this.initBGStarts(10000);
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
    const geometry = new THREE.PlaneGeometry(40, 40);
    const material = new THREE.MeshBasicMaterial({
      color: 'black',
      opacity: 0,
      transparent: true,
      blending: THREE.NormalBlending,
    });

    this.groundMesh = new THREE.Mesh(geometry, material);
    this.groundMesh.layers.set(1);
    this.groundMesh.rotateX(Math.PI * .5);
    this.groundMesh.rotateY(Math.PI);
    this.groundMesh.rotateZ(Math.PI);
    this.add(this.groundMesh);
  }

  private initLighting() {
    const pointLight = new THREE.PointLight(0xffffff, 0.1);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    this.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    this.add(directionalLight);
  }

  private initCamera() {
  
    this.camera.position.x = 2;
    this.camera.position.y = 4;
    this.camera.position.z = -2;
    this.camera.rotateX(Math.PI * -.7);
    this.camera.rotateY(Math.PI * .1);
    this.camera.rotateZ(Math.PI * .85);
    this.add(this.camera);
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
  private test() {

    const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 2, 0xff0000);
    const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 2, 0x00ff00);
    const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 2, 0x0000ff);

    this.add(xAxis);
    this.add(yAxis);
    this.add(zAxis);

    const geometry = new THREE.BoxGeometry( .1, .1, 1);
    const material = new THREE.MeshBasicMaterial();

    this.testMesh = new THREE.Mesh(geometry, material);

    // this.add(this.testMesh);
  }

  private mouseVector2 = new THREE.Vector2();

  private initListeners() {
    document.addEventListener('mousemove', (ev) => {
      this.mouseVector2.x = ev.clientX;
      this.mouseVector2.y = ev.clientY;

      this.mousePosition.x = (ev.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    })
  }

  private spaceShip?: SpaceShip;
  private async initObjects() {
    this.spaceShip = new SpaceShip();
    await this.spaceShip.init(0.005);
    const obj = this.spaceShip.get();
    if(!obj) return;
    this.add(obj);
  }

  update(){
    const elapsedTime = this.clock.getElapsedTime();

    this.updateBGStars(elapsedTime);
    this.updateRaycast();
    
    this.spaceShip?.updateTurrets(this.targetPosition);
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

}

export default SpaceScene;