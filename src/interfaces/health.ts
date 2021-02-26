export interface LivingBeing {
  health: number;

  getCurrentHealth?(): number;

  setCurrentHealth?(health: number): void;

  getMaxHealth?(): number;

  setMaxHealth?(health: number): void;

  isAlive?(): boolean;
}
