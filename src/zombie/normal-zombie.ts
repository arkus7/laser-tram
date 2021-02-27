import { BaseZombie } from './base-zombie';
import { ZombieType } from './zombie-enums';

export class NormalZombie extends BaseZombie {
  public health = 25;

  constructor() {
    super({
      type: ZombieType.Normal,
      sounds: {
        spawn: 'assets/sounds/zombie_normal_spawn.mp3',
        death: 'assets/sounds/zombie_normal_dead.mp3',
      },
    });
  }

  public getDamage(): number {
    return super.isAlive() ? 2 : 0;
  }
}
