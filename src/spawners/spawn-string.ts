import {
  Vector3 as TVec3,
} from 'three';
import { ISpawner } from "../../types/spawner";
import FBXObj from "../classes/fbx-obj";
import { isLowerCase } from "../helper/string";

type ISpawnerString = {
  value: string;
} & ISpawner;

const ASSETS_LETTERS_UPPER = 'assets/letters/upper/'
const ASSETS_LETTERS_LOWER = 'assets/letters/lower/'

export const spawnString = async (props: ISpawnerString) => {
  const {scene,  world, objs, value, position } = props;

  for(let i=0; i < value.length; i++){
    const char = value[i];
    let path = ASSETS_LETTERS_UPPER
    if(isLowerCase(char))
      path = ASSETS_LETTERS_LOWER
    
    const letterObj =  new FBXObj(scene, world, `${path}${char}`);
    await letterObj.init(new TVec3(-9 * i, 1 + (i+2), 0) , { bodyProps: { mass: 200 }});
    objs.push(letterObj)
  }

}