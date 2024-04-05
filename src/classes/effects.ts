import { IDestroyable } from "../interface/killable";

abstract class Effect implements IDestroyable {

  isAlive = true;
  currentLife = 0;
  life = 0;

  constructor(life: number){
    this.currentLife = life;
    this.life = life;
  }

  update(){
    if(!this.isAlive) return this.isAlive;
    this.currentLife -= 1;
    if(this.currentLife <= 0){
      this.isAlive = false;
    }
    return this.isAlive;
  }

  updateEffect() {}
}

export default Effect;