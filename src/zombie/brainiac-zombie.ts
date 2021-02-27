import { BaseZombie } from './base-zombie';
import { ZombieType } from './zombie-enums';

export class BrainiacZombie extends BaseZombie {
  public health = 50;

  constructor() {
    super({ type: ZombieType.Brainiac });
  }

  public getDamage(): number {
    return super.isAlive() ? 5 : 0;
  }
}
