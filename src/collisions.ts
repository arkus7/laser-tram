import * as PIXI from 'pixi.js';
import { SpriteObject } from './interfaces/spriteObject';

interface CollisionsExtraFields {
  centerX: number;
  centerY: number;
  halfWidth: number;
  halfHeight: number;
}
export class Collisions {
  public static checkForCollisions(objects: Array<PIXI.Container & SpriteObject>): void {
    const collisableObjects = objects.filter((object) => object.isCollisable());
    for (let i = 0; i < collisableObjects.length; i++) {
      for (let j = 0; j < collisableObjects.length; j++) {
        if (i === j) {
          continue;
        }

        if (Collisions.checkForCollision(collisableObjects[i], collisableObjects[j])) {
          collisableObjects[i]?.onCollision(collisableObjects[j]);
        }
      }
    }
  }

  public static checkForCollision(
    object1: PIXI.Container & Partial<CollisionsExtraFields>,
    object2: PIXI.Container & Partial<CollisionsExtraFields>
  ): boolean {
    let hit: boolean = false;

    let combinedHalfWidths: number;
    let combinedHalfHeights: number;
    let vx: number;
    let vy: number;

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
}
