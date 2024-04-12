import * as CANNON from 'cannon-es';

export interface IEnemy {
  health: number;
  currentHealth: number;
  setTarget(targetRb: CANNON.Body): void;
  takeDamage(dmg: number): boolean;
}