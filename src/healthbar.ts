import * as PIXI from 'pixi.js';
import { SpriteObject } from './interfaces/spriteObject';

export class HealthBar extends PIXI.Container implements SpriteObject {
  private app: PIXI.Application;
  private outer: PIXI.Graphics;
  private moving: boolean;

  constructor(app) {
    super();
    this.app = app;
  }

  public async create(x: number, y: number, widthRed: number, widthBlack: number, moving: boolean): Promise<void> {
    this.moving = moving;
    this.position.set(x, y);
    this.app.stage.addChild(this);

    //Create the black background rectangle
    const innerBar = new PIXI.Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, widthBlack, 30);
    innerBar.endFill();
    this.addChild(innerBar);

    //Create the front red rectangle
    const outerBar = new PIXI.Graphics();
    outerBar.beginFill(0xff3300);
    outerBar.drawRect(0, 0, widthRed, 25);
    outerBar.endFill();
    this.addChild(outerBar);

    this.outer = outerBar;
    this.app.stage.addChild(this);
  }

  public onUpdate = (delta: number): void => {};

  public onMove = (delta: number, newX: number, newY: number): void => {
    if (this.moving) {
      this.x = newX;
      this.y = newY;
    }
  };
  public onChangeHP = (width: number): void => {
    this.outer.width = width;
  };

  public isCollisable(): boolean {
    return false;
  }

  public onResize = (width: number, height: number): void => {
    this.y = height - this.height - 15;
  };

  public onCollision = (object: SpriteObject): void => {
    //
  };
}
