import { BaseZombie } from './base-zombie';
import { ZombieType } from './zombie-enums';

export class ZabaZombie extends BaseZombie {
  public health = 50;

  constructor() {
    super({ type: ZombieType.Zaba });
  }

  public getDamage(): number {
    return super.isAlive() ? 3 : 0;
  }
}
