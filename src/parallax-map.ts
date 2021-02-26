import * as PIXI from 'pixi.js';

import { SpriteObject } from './interfaces/spriteObject';

interface ParallaxMapParams {
  renderer: PIXI.Renderer;
  assets: string[];
  rate?: number;
}

export class ParallaxMap extends PIXI.Container implements SpriteObject {
  private scrollingRate: number;

  constructor({ renderer, assets, rate = 1.28 }: ParallaxMapParams) {
    super();
    this.scrollingRate = rate;

    this.x = 0;
    this.y = 0;

    this.width = renderer.width;
    this.height = renderer.height;

    for (const asset of assets) {
      const texture = PIXI.Loader.shared.resources[asset].texture;
      const tilingSprite = new PIXI.TilingSprite(texture, texture.width, texture.height);
      this.addChild(tilingSprite);
    }
  }

  onUpdate(delta: number): void {
    this.children.map((child, index) => {
      if (child instanceof PIXI.TilingSprite) {
        child.tilePosition.x -= this.scrollingRate * (index + 1);
      }
    });
  }

  onResize(width: number, height: number): void {
    for (const child of this.children) {
      if (child instanceof PIXI.TilingSprite) {
        child.width = width;
        child.height = height;
      }
    }
  }
}
