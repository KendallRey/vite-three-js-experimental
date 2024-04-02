import * as THREE from 'three';

class SpaceScene extends THREE.Scene {

  private readonly camera: THREE.PerspectiveCamera
  private readonly clock = new THREE.Clock();

  private sphere: THREE.Points | undefined;

  constructor(camera: THREE.PerspectiveCamera) {
    super()
    this.camera = camera;
    

  }

  async init() {

    await this.loadTextures();
    this.initBGStarts(5000);
    this.initLighting();
    this.test();

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 2;
    this.add(this.camera);
  }

  private star: THREE.Texture | undefined;

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

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);

    this.add(particlesMesh);
  }

  private test() {

    const geometry = new THREE.TorusGeometry( 0.7, 0.2, 16, 100);
    const material = new THREE.PointsMaterial({
      size: 0.005
    });

    this.sphere = new THREE.Points(geometry, material);

    this.add(this.sphere);

  }

  update(){

    const elapsedTime = this.clock.getElapsedTime();

    if(!this.sphere) return;
    this.sphere.rotation.x = .8 * elapsedTime;
    this.sphere.rotation.y = .5 * elapsedTime;
    this.sphere.rotation.z = .2 * elapsedTime;
  }
}

export default SpaceScene;