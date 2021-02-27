import { BaseZombie } from './base-zombie';
import { ZombieType } from './zombie-enums';

export class BrainiacZombie extends BaseZombie {
  public health = 50;
  public score = 25;

  constructor() {
    super({
      type: ZombieType.Brainiac,
      sounds: {
        spawn: 'assets/sounds/zombie_brainiac_spawn.mp3',
        death: 'assets/sounds/zombie_brainiac_dead.mp3',
      },
    });
  }

  public getDamage(): number {
    return super.isAlive() ? 5 : 0;
  }
}
