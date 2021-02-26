export interface SpriteObject {
  onUpdate(delta: number): void;

  onResize(width: number, height: number): void;

  onCollision(object: SpriteObject): void;
}
