import { BaseZombie } from './base-zombie';
import { ZombieType } from './zombie-enums';

export class BrainiacZombie extends BaseZombie {
  constructor() {
    super({ type: ZombieType.Brainiac });
  }
}
