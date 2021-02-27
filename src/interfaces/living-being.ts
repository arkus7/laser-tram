export interface LivingBeing {
  health: number;

  addOnDeadEvent(callback: Function): void;

  getCurrentHealth?(): number;

  setCurrentHealth?(health: number): void;

  getMaxHealth?(): number;

  setMaxHealth?(health: number): void;

  isAlive?(): boolean;
}
