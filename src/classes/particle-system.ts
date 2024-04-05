import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import Particle from './particle';
import { SetVectorRandomC } from '../helper/vector';

class ParticleSystem {

  private readonly life: number;
  private currentLife = 1;
  public isAlive = true;
  
  private groundMaterial = new CANNON.Material('ground');
  private material = new CANNON.Material()

  protected readonly scene: THREE.Scene;
  protected readonly world: CANNON.World;
  private readonly count: number;
  private particles: Particle[]

  constructor(scene: THREE.Scene, world: CANNON.World, count: number, position: THREE.Vector3, life: number){
    this.scene = scene;
    this.world = world;
    this.initContactMaterial();
    this.count = count;
    this.life = life;
    this.currentLife = life;
    this.particles = this.initParticles(position);
  }

  private initContactMaterial(){
    const contactMat = new CANNON.ContactMaterial(this.groundMaterial, this.material, {
      friction: 0.9,
      restitution: 0.9
    })
    this.world.addContactMaterial(contactMat)
  }

  private initParticles(position: THREE.Vector3) {
    const particles: Particle[] = [];
    for(let i = 0; i <= this.count; i ++){
      const particle = new Particle(this.scene, this.world);
      const randomVelocity = SetVectorRandomC({ x: 20, y: 20, z: 20});
      particle.init(position, {
        materialProps: {
          color: 0xf9b64e,
          transparent: true,
        },
        bodyProps: {
          mass: 0.1,
          velocity: randomVelocity,
          material: this.material,
          type: CANNON.SHAPE_TYPES.SPHERE
        },
        scale: {
          x: 0.15,
          y: 0.15,
          z: 0.15
        }
      })
      particles.push(particle);
    }
    return particles;
  }

  updateParticles() {
    if(!this.isAlive) return;
    this.currentLife -= 1;
    const opacityStep = this.currentLife/ this.life;
    if(this.currentLife <= 0){
      this.particles.forEach((particle) => particle.kill());
      this.isAlive = false;
      return;
    }
    this.particles.forEach((particle) => {
      particle.update()
      particle.updateOpacity(opacityStep);
    });
  }
}

export default ParticleSystem