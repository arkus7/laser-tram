import * as PIXI from 'pixi.js';

import { loadSprite } from './helpers';
import { SpriteObject } from './interfaces/spriteObject';

export class Prop implements SpriteObject {
  private app: PIXI.Application;
  private asset: string;
  private sprite: PIXI.Sprite;
  private collisable: boolean;

  constructor(app: PIXI.Application, asset: string, collisable = false) {
    this.app = app;
    this.asset = asset;
    this.collisable = collisable;
  }

  public async create(x: number, y: number): Promise<void> {
    this.sprite = await loadSprite(this.app, this.asset);
    this.sprite.x = x;
    this.sprite.y = y;

    this.app.stage.addChild(this.sprite);
  }

  public getSprite(): PIXI.Sprite {
    return this.sprite;
  }

  public isCollisable(): boolean {
    return this.collisable;
  }

  public onResize(width: number, height: number): void {
    //
  }

  public onUpdate = (delta: number): void => {
    //
  };

  public onCollision = (object: SpriteObject): void => {
    //
  };
}
