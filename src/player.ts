import * as PIXI from 'pixi.js';
import { loadSprite } from './helpers';
import { SpriteObject } from './interfaces/spriteObject';
import { Keyboard } from './keyboard';

export class Player implements SpriteObject {
  private app: PIXI.Application;
  private player: PIXI.Sprite & { vx?: number; vy?: number };

  constructor(app) {
    this.app = app;
  }

  public async create(): Promise<void> {
    this.player = await loadSprite(this.app, 'assets/sprites/tram.png');
    this.player.x = 15;
    this.player.y = this.app.renderer.screen.height - this.player.height - 15;

    this.player.vx = 0;
    this.player.vy = 0;

    this.setKeyboardEvents();

    this.app.stage.addChild(this.player);
  }

  public getPosition(): { x: number; y: number } {
    return {
      x: this.player.x,
      y: this.player.y,
    };
  }

  private setKeyboardEvents(): void {
    const left = new Keyboard('ArrowLeft');
    const right = new Keyboard('ArrowRight');
    const up = new Keyboard('ArrowUp');
    const down = new Keyboard('ArrowDown');

    left.press = () => {
      this.player.vx = -5;
    };

    left.release = () => {
      if (!right.isDown) {
        this.player.vx = 0;
      }
    };

    right.press = () => {
      this.player.vx = 5;
    };

    right.release = () => {
      if (!left.isDown) {
        this.player.vx = 0;
      }
    };

    up.press = () => {
      this.player.vy = -5;
    };

    up.release = () => {
      if (!down.isDown) {
        this.player.vy = 0;
      }
    };

    down.press = () => {
      this.player.vy = 5;
    };

    down.release = () => {
      if (!up.isDown) {
        this.player.vy = 0;
      }
    };
  }

  public onUpdate = (delta: number): void => {
    // this.player.x = this.app.renderer.screen.width / 2;
    // this.player.y = this.app.renderer.screen.height / 2;

    // this.player.rotation += 0.01;

    this.player.x += this.player.vx;
    this.player.y += this.player.vy;
  };

  public onResize = (width: number, height: number): void => {
    this.player.y = height - this.player.height - 15;
  };
}
