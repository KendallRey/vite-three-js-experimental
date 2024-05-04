import {
  Scene as TScene,
  Vector3 as TVec3,
} from 'three';
import { 
  World as CWorld,
} from 'cannon-es';

type ISpawner = {
  scene: TScene;
  world: CWorld;
  objs: DynamicObj[];
  position?: Vector3;
}