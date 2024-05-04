import {
  Vector3 as TVec3,
} from 'three';

import OBJObj from '../classes/obj-obj';
import { ISpawner } from '../../types/spawner';

export const spawnLogo = async (props: ISpawner) => {
  const {scene,  world, objs, position } = props;

  const k1 = new OBJObj(scene, world, 'assets/logo/k1');
  await k1.init(new TVec3(0.5, 2, 0), { scale: new TVec3(1,1,1), bodyProps: { mass: 100}})
  objs.push(k1);

  const k2 = new OBJObj(scene, world, 'assets/logo/k2');
  await k2.init(new TVec3(15, 2, -1), { scale: new TVec3(1,1,1), bodyProps: { mass: 100}})
  objs.push(k2);

  const r1 = new OBJObj(scene, world, 'assets/logo/r1');
  await r1.init(new TVec3(2, 2, -9), { scale: new TVec3(1,1,1), bodyProps: { mass: 100}})
  objs.push(r1);

  // const r2 = new OBJObj(scene, world, 'assets/logo/r2');
  // await r2.init(new TVec3(8, 2, -5.9), { scale: new TVec3(1,1,1), bodyProps: { mass: 100}})
  // objs.push(r2);
}