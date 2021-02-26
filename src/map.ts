import * as PIXI from 'pixi.js';

import { loadTilingSprite } from './helpers';
import { SpriteObject } from './interfaces/spriteObject';

export class Map implements SpriteObject {
  private app: PIXI.Application;
  private map: PIXI.TilingSprite;

  constructor(app) {
    this.app = app;
  }

  public async create(): Promise<void> {
    this.map = await loadTilingSprite(this.app, 'assets/sprites/map.jpg');
    this.map.x = 0;
    this.map.y = 0;
    this.map.width = this.app.screen.width;
    this.map.height = this.app.screen.height;

    this.app.stage.addChild(this.map);
  }

  public onResize(width: number, height: number): void {
    this.map.width = width;
  }

  public onUpdate = (delta: number): void => {
    this.map.tilePosition.x -= delta * 8;
  };

  public onCollision = (object: SpriteObject): void => {
    //
  };
}
