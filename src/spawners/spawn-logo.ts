import {
  Vector3 as TVec3,
} from 'three';

import OBJObj from '../classes/obj-obj';
import { ISpawner } from '../../types/spawner';
import { ThreeVec3Add } from '../helper/vector';

export const spawnLogo = async (props: ISpawner) => {
  const {scene,  world, objs, position } = props;

  const pos1 = ThreeVec3Add(new TVec3(0.5, 2, 0), position)
  const pos2 = ThreeVec3Add(new TVec3(11, 2, -1), position)
  const pos3 = ThreeVec3Add(new TVec3(2.6, 2, -8), position)
  const pos4 = ThreeVec3Add(new TVec3(12, 2, -8.5), position)
  
  const k1 = new OBJObj(scene, world, 'assets/logo/k1');
  await k1.init(pos1, { scale: new TVec3(1,1,1), bodyProps: { mass: 100}})
  objs.push(k1);

  const k2 = new OBJObj(scene, world, 'assets/logo/k2');
  await k2.init(pos2, { scale: new TVec3(1,1,1), bodyProps: { mass: 100}})
  objs.push(k2);

  const r1 = new OBJObj(scene, world, 'assets/logo/r1');
  await r1.init(pos3, { scale: new TVec3(1,1,1), bodyProps: { mass: 100}})
  objs.push(r1);

  const r2 = new OBJObj(scene, world, 'assets/logo/r2');
  await r2.init(pos4, { scale: new TVec3(1,1,1), bodyProps: { mass: 100}})
  objs.push(r2);
}