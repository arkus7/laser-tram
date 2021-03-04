import * as PIXI from 'pixi.js';

import { SpriteObject } from './interfaces/spriteObject';
import { Weapon } from './interfaces/weapon';
import { Sound } from './sounds/sound';
import { BaseZombie } from './zombie/base-zombie';

export class Projectile extends PIXI.Sprite implements SpriteObject, Weapon {
  private static readonly BULLET_SPEED = 14;

  private fireSound: Sound;
  private damage: number;

  constructor() {
    super(PIXI.Loader.shared.resources['assets/sprites/Vicodo_phone.png'].texture);
    this.initSounds();
  }

  private initSounds() {
    this.fireSound = new Sound('assets/sounds/laser_fire.mp3');
    this.fireSound.get().play();
  }

  isCollisable(): boolean {
    return true;
  }

  onCollision?(object: SpriteObject): void {
    if (object instanceof BaseZombie) {
      this.alpha = 0;
      this.destroy();
    }
  }

  getDamage(): number {
    if (this.alpha === 0) {
      return 0;
    } else {
      return this.damage;
    }
  }

  setDamage(damage: number): void {
    this.damage = damage;
  }

  public create(x: number, y: number, xfinal?: number, yfinal?: number, rotation?: number): void {
    this.x = x;
    this.y = y;

    this.rotation = rotation;
  }

  public getPosition(): { x: number; y: number } {
    return {
      x: this.x,
      y: this.y,
    };
  }

  public shoot = (): void => {
    this.x += 1;
    this.y += 1;
  };

  public onUpdate = (delta: number): void => {
    if (this._destroyed) {
      return;
    }
    this.position.x += Math.cos(this.rotation) * Projectile.BULLET_SPEED;
    this.position.y += Math.sin(this.rotation) * Projectile.BULLET_SPEED;
  };

  public onResize = (width: number, height: number): void => {
    // to be implemented
  };
}
