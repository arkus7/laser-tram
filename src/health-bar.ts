import * as PIXI from 'pixi.js';
import { SpriteObject } from './interfaces/spriteObject';

export class HealthBar extends PIXI.Container implements SpriteObject {
  private outer: PIXI.Graphics;
  private moving: boolean;

  constructor(x: number, y: number, widthRed: number, widthBlack: number) {
    super();
    this.create(x, y, widthRed, widthBlack, false);
  }

  public async create(x: number, y: number, widthRed: number, widthBlack: number, moving: boolean): Promise<HealthBar> {
    this.moving = moving;
    this.position.set(x, y);

    //Create the black background rectangle
    const innerBar = new PIXI.Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, widthBlack, 10);
    innerBar.endFill();
    this.addChild(innerBar);

    //Create the front red rectangle
    const outerBar = new PIXI.Graphics();
    outerBar.beginFill(0xff3300);
    outerBar.drawRect(0, 0, widthRed, 10);
    outerBar.endFill();
    this.addChild(outerBar);

    this.outer = outerBar;

    return this;
  }

  public onUpdate = (delta: number): void => {};

  public onMove = (delta: number, newX: number, newY: number): void => {
    if (this.moving) {
      this.x = newX;
      this.y = newY;
    }
  };

  public onChangeHP = (health: number): void => {
    if (health < 0) {
      this.outer.width = 0;
    } else {
      this.outer.width = health;
    }
  };

  public isCollisable(): boolean {
    return false;
  }

  public onResize = (width: number, height: number): void => {
    this.y = height - this.height - 15;
  };
}
