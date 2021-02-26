import { SpriteObject } from './interfaces/spriteObject';

export class Zombie extends PIXI.AnimatedSprite implements SpriteObject {
  constructor(textures: PIXI.Texture[], autoUpdate: boolean = true) {
    super(textures, autoUpdate);
  }

  onUpdate(delta: number): void {
    throw new Error("Method not implemented.");
  }
  onResize(width: number, height: number): void {
    throw new Error("Method not implemented.");
  }
}
