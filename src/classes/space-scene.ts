import * as THREE from 'three';

class SpaceScene extends THREE.Scene {

  private readonly camera: THREE.PerspectiveCamera
  private readonly clock = new THREE.Clock();

  private sphere?: THREE.Points;
  private star?: THREE.Texture;
  private particlesMesh?: THREE.Points;

  private screenSize = new THREE.Vector2();

  constructor(camera: THREE.PerspectiveCamera, screenX: number, screenY: number) {
    super()
    this.camera = camera;

    this.initScreenSize(screenX, screenY);
  }

  async init() {

    await this.loadTextures();
    this.initBGStarts(5000);
    this.initLighting();
    this.test();
    this.initListeners();

    this.initCamera();
  }

  private initScreenSize(x: number, y: number) {
    this.screenSize  = new THREE.Vector2(x, y);
  }

  private async loadTextures() {
    const textureLoader = new THREE.TextureLoader();
    this.star = await textureLoader.loadAsync('assets/star.png');
  }

  private initLighting() {
    const pointLight = new THREE.PointLight(0xffffff, 0.1);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    this.add(pointLight);
  }

  private initCamera() {
  
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 2;
    this.add(this.camera);
  }

  private initBGStarts(count: number) {
    const totalCount = count * 3;
    const particlesGeometry = new THREE.BufferGeometry();
    const positionArr = new Float32Array(totalCount);

    for(let i = 0; i < totalCount; i++){
      positionArr[i] = (Math.random() - 0.5) * (Math.random() * 7);
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

  private test() {

    const geometry = new THREE.TorusGeometry( 0.7, 0.2, 16, 100);
    const material = new THREE.PointsMaterial({
      size: 0.005
    });

    this.sphere = new THREE.Points(geometry, material);

    this.add(this.sphere);

  }

  private mouseVector2 = new THREE.Vector2();

  private initListeners() {
    document.addEventListener('mousemove', (ev) => {
      this.mouseVector2.x = ev.clientX;
      this.mouseVector2.y = ev.clientY;
    })
  }



  update(){
    const elapsedTime = this.clock.getElapsedTime();

    this.updateSphere(elapsedTime);
    this.updateBGStars(elapsedTime);
  }

  private updateSphere(time: number) {
    if(!this.sphere) return;
    this.sphere.rotation.x = .8 * time;
    this.sphere.rotation.y = .5 * time;
    this.sphere.rotation.z = .2 * time;
  }

  private updateBGStars(time: number) {
    if(!this.particlesMesh) return;
    const mouseXOffset = this.screenSize.x / 2;
    const mouseYOffset = this.screenSize.y / 2;
    this.particlesMesh.rotation.y = (this.mouseVector2.x - mouseXOffset) * (time * 0.00005);
    this.particlesMesh.rotation.x = (this.mouseVector2.y - mouseYOffset) * (time * 0.00005);
  }
}

export default SpaceScene;