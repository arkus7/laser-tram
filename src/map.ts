import * as PIXI from 'pixi.js';

import { SpriteObject } from './interfaces/spriteObject';

export class Map extends PIXI.TilingSprite implements SpriteObject {
  private app: PIXI.Application;

  constructor(app) {
    super(PIXI.Loader.shared.resources['assets/sprites/map.jpg'].texture);
    this.app = app;
  }

  public async create(): Promise<void> {
    this.x = 0;
    this.y = 0;
    this.width = this.app.screen.width;
    this.height = this.app.screen.height;

    this.app.stage.addChild(this);
  }

  public isCollisable(): boolean {
    return false;
  }

  public onResize(width: number, height: number): void {
    this.width = width;
  }

  public onUpdate = (delta: number): void => {
    this.tilePosition.x -= delta * 8;
  };
}
