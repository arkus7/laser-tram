import * as PIXI from 'pixi.js';
import { loadSprite } from './helpers';
import { SpriteObject } from './interfaces/spriteObject';
import { Keyboard } from './keyboard';
 

export class Projectile implements SpriteObject {
  private app: PIXI.Application;
  private projectile: PIXI.Sprite  & { x?: number; y?: number, xfinal?: number, yfinal?: number, rotation?: number };
  private static readonly BULLET_SPEED = 5;
  constructor(app) {
    this.app = app;
  }

  public async create(x: number, y: number, xfinal?: number, yfinal?: number, rotation?: number): Promise<void> {
    this.projectile = await loadSprite(this.app, 'assets/sprites/Vicodo_phone.png');
    this.projectile.x = x;
    this.projectile.y = y;
    this.projectile.xfinal = xfinal;
    this.projectile.yfinal = yfinal;
    this.projectile.rotation = rotation;
    this.app.stage.addChild(this.projectile);
  }

  public getPosition(): { x: number; y: number } {
    return {
      x: this.projectile.x,
      y: this.projectile.y,
    };
  }

  public shoot = (): void => {  
        this.projectile.x += 1;
        this.projectile.y += 1;
  }
  
  public onUpdate = (delta: number): void => {
    this.projectile.position.x += Math.cos(this.projectile.rotation)*Projectile.BULLET_SPEED;
    this.projectile.position.y += Math.sin(this.projectile.rotation)*Projectile.BULLET_SPEED;
  };

  public onResize = (width: number, height: number): void => {
    // to be implemented
  };
}
