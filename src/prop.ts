import * as PIXI from 'pixi.js';

import { loadSprite } from './helpers';
import { SpriteObject } from './interfaces/spriteObject';

export class Prop implements SpriteObject {
  private app: PIXI.Application;
  private asset: string;
  private sprite: PIXI.Sprite;

  constructor(app: PIXI.Application, asset: string) {
    this.app = app;
    this.asset = asset;
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
