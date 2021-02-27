import { BaseZombie } from './base-zombie';
import { ZombieType } from './zombie-enums';

export class NormalZombie extends BaseZombie {
  public health = 25;

  constructor() {
    super({ type: ZombieType.Normal });
  }

  public getDamage(): number {
    return super.isAlive() ? 2 : 0;
  }
}
