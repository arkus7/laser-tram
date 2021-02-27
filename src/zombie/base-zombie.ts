import { AdjustmentFilter } from 'pixi-filters';
import * as PIXI from 'pixi.js';

import { HealthBar } from '../health-bar';
import { SpriteObject } from '../interfaces/spriteObject';
import { Weapon } from '../interfaces/weapon';
import { isDestroyed } from '../main';
import { Player } from '../player';
import { Sound } from '../sounds/sound';
import { assetsForZombie, spritesPerZombieState } from './utils';
import { ZombieState, ZombieType } from './zombie-enums';
import { Projectile } from '../projectile';

export type ZombieConstructorParams = {
  type: ZombieType;
  initialState?: ZombieState;
  autoUpdate?: boolean;
  sounds?: {
    spawn: string;
    death: string;
  };
};

export abstract class BaseZombie extends PIXI.AnimatedSprite implements SpriteObject, Weapon {
  public speed: number;
  public health: number;
  public score: number;
  protected spawnSound: Sound;
  protected deathSound: Sound;

  public onDeadEvent: Function;

  private healthBar: HealthBar;

  private type: ZombieType;
  private state: ZombieState;
  private needsAnimationUpdate: boolean = false;

  static texturesForType(type: ZombieType, state: ZombieState): PIXI.Texture[] {
    const assets = assetsForZombie(type).filter((x) => x.includes(state));
    return assets.map((assetPath) => PIXI.Loader.shared.resources[assetPath].texture);
  }

  constructor({
    type,
    initialState = ZombieState.Attack,
    autoUpdate = true,
    sounds = { spawn: 'assets/sounds/zombie_normal_spawn.mp3', death: 'assets/sounds/zombie_normal_dead.mp3' },
  }: ZombieConstructorParams) {
    super(BaseZombie.texturesForType(type, initialState), autoUpdate);

    this.type = type;
    this.state = initialState;

    this.spawnSound = new Sound(sounds.spawn);
    this.deathSound = new Sound(sounds.death);

    this.animationSpeed = 0.2;
    this.play();

    this.x = 1200;
    this.y = 900;

    this.scale.set(-0.25, 0.25);
    this.anchor.x = 1;

    this.speed = 1;

    this.filters = [new AdjustmentFilter({ red: 1.3, green: 1.3, saturation: 0.5 })];

    this.addHealthBar(new HealthBar(this.width * -1, -20, 100, 100));

    this.spawnSound.get().play();
  }

  public isAlive(): boolean {
    return this.health > 0;
  }

  public addHealthBar(bar: HealthBar): void {
    this.healthBar = bar;
    this.addChild(this.healthBar);
  }

  public getDamage(): number {
    return this.isAlive() ? 1 : 0;
  }

  public addOnDeadEvent(callback: Function): void {
    this.onDeadEvent = callback;
  }

  public setState(state: ZombieState): void {
    if (this.state === state) {
      return;
    }
    this.state = state;
    this.needsAnimationUpdate = true;
  }

  onUpdate(delta: number): void {
    if (isDestroyed(this)) {
      return;
    }
    this.x -= this.speed * delta;

    if (this.needsAnimationUpdate) {
      this.changeAnimationTo(this.state);
      this.play();
      this.needsAnimationUpdate = false;
    }

    if (!this.isAlive()) {
      this.setState(ZombieState.Dead);
    }

    if (this.state === ZombieState.Dead) {
      if (this.currentFrame === spritesPerZombieState(ZombieState.Dead) - 1) {
        this.stop();
      } else {
        this.y += 1;
      }

      if (!this.playing) {
        this.fadeOut();
      }

      if (this.alpha < 0 && !isDestroyed(this)) {
        this.destroy({ children: true });
      }
    }
  }

  private changeAnimationTo(state: ZombieState): void {
    this.textures = BaseZombie.texturesForType(this.type, state);
  }

  private fadeOut(): void {
    this.alpha -= 0.05;
  }

  isCollisable(): boolean {
    return true;
  }

  onResize(width: number, height: number): void {
    throw new Error('Method not implemented.');
  }

  onCollision(object: SpriteObject): void {
    if (object instanceof Player  || object instanceof Projectile) {
      if(object.getDamage() != 0){
      this.health -= object.getDamage();
      this.healthBar?.onChangeHP(this.health);
      }
      if (!this.isAlive()) {
        if (this.deathSound.get().isPlaying === false) {
          this.deathSound.get().play();

          if (this.onDeadEvent) {
            this.onDeadEvent();
          }
        }
      }
    }
  }
}
