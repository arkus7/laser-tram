import { BaseZombie } from './base-zombie';
import { ZombieType } from './zombie-enums';

export class ZabaZombie extends BaseZombie {
  public health = 50;
  public score = 35;

  constructor() {
    super({
      type: ZombieType.Zaba,
      sounds: {
        spawn: 'assets/sounds/zombie_zaba_spawn.mp3',
        death: 'assets/sounds/zombie_zaba_dead.mp3',
      },
    });
  }

  public getDamage(): number {
    return super.isAlive() ? 3 : 0;
  }
}
