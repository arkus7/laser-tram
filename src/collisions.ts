import * as PIXI from 'pixi.js';

import { SpriteObject } from './interfaces/spriteObject';

interface Extra {
  centerX: number;
  centerY: number;
  halfWidth: number;
  halfHeight: number;
}
export class Collisions implements SpriteObject {
  private app: PIXI.Application;

  constructor(app) {
    this.app = app;
  }

  public checkForCollision(object1: PIXI.Sprite & Partial<Extra>, object2: PIXI.Sprite & Partial<Extra>) {
    let hit = false;

    let combinedHalfWidths;
    let combinedHalfHeights;
    let vx;
    let vy;

    object1.centerX = object1.x + object1.width / 2;
    object1.centerY = object1.y + object1.height / 2;
    object2.centerX = object2.x + object2.width / 2;
    object2.centerY = object2.y + object2.height / 2;

    object1.halfWidth = object1.width / 2;
    object1.halfHeight = object1.height / 2;
    object2.halfWidth = object2.width / 2;
    object2.halfHeight = object2.height / 2;

    vx = object1.centerX - object2.centerX;
    vy = object1.centerY - object2.centerY;

    combinedHalfWidths = object1.halfWidth + object2.halfWidth;
    combinedHalfHeights = object1.halfHeight + object2.halfHeight;

    if (Math.abs(vx) < combinedHalfWidths) {
      if (Math.abs(vy) < combinedHalfHeights) {
        hit = true;
      } else {
        hit = false;
      }
    } else {
      hit = false;
    }

    return hit;
  }

  public onUpdate = (delta: number): void => {
    //
  };

  public onResize = (width: number, height: number): void => {
    // to be implemented
  };

  public onCollision = (object: SpriteObject): void => {
    //
  };
}
