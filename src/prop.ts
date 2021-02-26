import * as PIXI from 'pixi.js';

import { SpriteObject } from './interfaces/spriteObject';

export class Prop extends PIXI.Sprite implements SpriteObject {
  private app: PIXI.Application;
  private collisable: boolean;

  constructor(app: PIXI.Application, asset: string, collisable = true) {
    super(PIXI.Loader.shared.resources[asset].texture);
    this.app = app;
    this.collisable = collisable;
  }

  public async create(x: number, y: number): Promise<void> {
    this.x = x;
    this.y = y;

    this.app.stage.addChild(this);
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
