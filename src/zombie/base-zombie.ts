import * as PIXI from 'pixi.js';

import { SpriteObject } from '../interfaces/spriteObject';
import { assetsForZombie, spritesPerZombieState } from './utils';
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
  private needsAnimationUpdate: boolean = false;

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
    this.anchor.x = 1;
    this.scale.set(-0.15, 0.15);

    this.speed = 1;
  }

  public setState(state: ZombieState): void {
    if (this.state === state) {
      return;
    }
    this.state = state;
    this.needsAnimationUpdate = true;
  }

  onUpdate(delta: number): void {
    if (this.needsAnimationUpdate) {
      this.changeAnimationTo(this.state);
      this.play();
      this.needsAnimationUpdate = false;
    }

    if (this.x < 200) {
      this.setState(ZombieState.Dead);
    }

    if (this.state === ZombieState.Dead) {
      if (this.currentFrame === spritesPerZombieState(ZombieState.Dead) - 1) {
        this.stop();
      } else {
        this.y += 1;
      }
    }

    this.x -= this.speed * delta;
  }

  private changeAnimationTo(state: ZombieState): void {
    this.textures = BaseZombie.texturesForType(this.type, state);
  }

  isCollisable(): boolean {
    return true;
  }

  onResize(width: number, height: number): void {
    throw new Error('Method not implemented.');
  }

  onCollision(object: SpriteObject): void {
    //
  }
}
