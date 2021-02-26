import { ZombieState, ZombieType } from './zombie-enums';

export function assetsForZombie(type: ZombieType): string[] {
  const assets = zombieStates().map((state) => {
    return Array(spritesPerZombieState(state))
      .fill(null)
      .map((_, i) => {
        return `assets/sprites/zombie/${type}/${state}/${i + 1}.png`;
      });
  });

  return [].concat(...assets);
}

export function zombieStates(): ZombieState[] {
  return Object.values(ZombieState);
}
export function zombieTypes(): ZombieType[] {
  return Object.values(ZombieType);
}

export function spritesPerZombieState(state: ZombieState): number {
  switch (state) {
    case ZombieState.Attack:
      return 6;
    case ZombieState.Dead:
      return 8;
    case ZombieState.Hurt:
      return 5;
    case ZombieState.Run:
      return 10;
    case ZombieState.Walk:
      return 6;
  }
}
