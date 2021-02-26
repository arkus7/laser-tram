import * as PIXI from 'pixi.js';

import { SpriteObject } from '../interfaces/spriteObject';
import { assetsForZombie } from './utils';
import { ZombieState, ZombieType } from './zombie-enums';

export type ZombieConstructorParams = {
  type: ZombieType;
  initialState?: ZombieState;
  autoUpdate?: boolean;
};

export abstract class BaseZombie extends PIXI.AnimatedSprite implements SpriteObject {
  public speed: number;
  private type: ZombieType;
  private state: ZombieState;
  private needsStateUpdate: boolean = false;

  static texturesForType(type: ZombieType, state: ZombieState): PIXI.Texture[] {
    const assets = assetsForZombie(type).filter((x) => x.includes(state));
    return assets.map((assetPath) => PIXI.Loader.shared.resources[assetPath].texture);
  }

  constructor({ type, initialState = ZombieState.Attack, autoUpdate = true }: ZombieConstructorParams) {
    super(BaseZombie.texturesForType(type, initialState), autoUpdate);

    this.type = type;
    this.state = initialState;

    this.animationSpeed = 0.2;
    this.play();

    this.x = 500;
    this.y = 900;
    this.scale.set(-0.15, 0.15);

    this.speed = 1;
  }

  public setState(state: ZombieState): void {
    this.state = state;
    this.needsStateUpdate = true;
  }

  onUpdate(delta: number): void {
    if (this.needsStateUpdate) {
      this.textures = BaseZombie.texturesForType(this.type, this.state);
      this.needsStateUpdate = false;
    }

    this.x -= this.speed * delta;
  }

  onResize(width: number, height: number): void {
    throw new Error('Method not implemented.');
  }
}
