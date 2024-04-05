import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import Particle from './particle';

class ParticleSystem {

  private readonly lifeMs: number;

  protected readonly scene: THREE.Scene;
  protected readonly world: CANNON.World;
  private readonly count: number;
  private particles: Particle[]

  constructor(scene: THREE.Scene, world: CANNON.World, count: number, position: THREE.Vector3, lifeMs: number){
    this.scene = scene;
    this.world = world;
    this.count = count;
    this.lifeMs = lifeMs;
    this.particles = this.initParticles(position);
  }

  private initParticles(position: THREE.Vector3) {
    const particles: Particle[] = [];
    for(let i = 0; i <= this.count; i ++){
      const particle = new Particle(this.scene, this.world);
      particle.init(position, {})
      particles.push(particle);
    }
    return particles;
  }

  setDead() {
  
  }

  setDisabled() {
    
  }

  reset() {

  }

  updateParticles() {
    this.particles.forEach((particle) => particle.update());
  }
}

export default ParticleSystem