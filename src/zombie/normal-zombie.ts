import { BaseZombie } from './base-zombie';
import { ZombieType } from './zombie-enums';

export class NormalZombie extends BaseZombie {
  constructor() {
    super(ZombieType.Normal);
  }
}
