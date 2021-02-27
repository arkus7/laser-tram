import * as PIXI from 'pixi.js';
import { SpriteObject } from './interfaces/spriteObject';
import { Weapon } from './interfaces/weapon';
import { Keyboard } from './keyboard';
 

export class Projectile extends PIXI.Sprite implements SpriteObject, Weapon{
  private app: PIXI.Application;
  private xfinal: number;
  private yfinal: number;
  
  private static readonly BULLET_SPEED = 5;
  constructor(app) {
    super(PIXI.Loader.shared.resources['assets/sprites/Vicodo_phone.png'].texture);
    this.app = app;
  }
  isCollisable(): boolean {
    return true;
  }
  onCollision?(object: SpriteObject): void {

  }
  getDamage(): number {
    return 5;
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
    this.position.x += Math.cos(this.rotation)*Projectile.BULLET_SPEED;
    this.position.y += Math.sin(this.rotation)*Projectile.BULLET_SPEED;
  };

  public onResize = (width: number, height: number): void => {
    // to be implemented
  };
}
