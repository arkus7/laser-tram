import * as PIXI from 'pixi.js';
import { SpriteObject } from './interfaces/spriteObject';
import { Weapon } from './interfaces/weapon';
import { BaseZombie } from './zombie/base-zombie';


export class Projectile extends PIXI.Sprite implements SpriteObject, Weapon{
  private app: PIXI.Application;
  private xfinal: number;
  private yfinal: number;
  
  private static readonly BULLET_SPEED = 14;
  constructor(app) {
    super(PIXI.Loader.shared.resources['assets/sprites/Vicodo_phone.png'].texture);
    this.app = app;
  }
  isCollisable(): boolean {
    return true;
  }
  onCollision?(object: SpriteObject): void {
    if (object instanceof BaseZombie) {
      this.alpha = 0;
    }
  }

  getDamage(): number {
    if (this.alpha === 0) {
      return 0;
    }
    else {
      return 5;
    }
  }

  public async create(x: number, y: number, xfinal?: number, yfinal?: number, rotation?: number): Promise<void> {
    this.x = x;
    this.y = y;
    this.xfinal = xfinal;
    this.yfinal = yfinal;
    this.rotation = rotation;
    this.app.stage.addChild(this);
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
  }
  
  public onUpdate = (delta: number): void => {
    if (this._destroyed) {
      return;
    }
    this.position.x += Math.cos(this.rotation)*Projectile.BULLET_SPEED;
    this.position.y += Math.sin(this.rotation)*Projectile.BULLET_SPEED;

  };

  public onResize = (width: number, height: number): void => {
    // to be implemented
  };
}
