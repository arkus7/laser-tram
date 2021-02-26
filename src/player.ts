import * as PIXI from 'pixi.js';
import { loadSprite } from './helpers';
import { SpriteObject } from './interfaces/spriteObject';
import { Keyboard } from './keyboard';

export class Player implements SpriteObject {
  private app: PIXI.Application;
  private player: PIXI.Sprite & { vx?: number; vy?: number };

  private static readonly SPEED = 5;
  private static readonly VERTICAL_TELEPORT = 70;
  private static readonly NUM_OF_TRACKS = 3;
  private static readonly START_TRACK_RELATIVE_POSITION_Y = 15;

  constructor(app) {
    this.app = app;
  }

  public async create(): Promise<void> {
    this.player = await loadSprite(this.app, 'assets/sprites/tram.png');
    this.player.x = 15;
    this.player.y = this.app.renderer.screen.height - this.player.height - Player.START_TRACK_RELATIVE_POSITION_Y;

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

    left.press = (): void => {
      this.player.vx = -Player.SPEED;
    };

    left.release = (): void => {
      if (!right.isDown) {
        this.player.vx = 0;
      }
    };

    right.press = (): void => {
      this.player.vx = Player.SPEED;
    };

    right.release = (): void => {
      if (!left.isDown) {
        this.player.vx = 0;
      }
    };

    up.press = (): void => {
      if (
        this.player.y - Player.VERTICAL_TELEPORT >=
        this.app.renderer.screen.height -
          this.player.height -
          Player.START_TRACK_RELATIVE_POSITION_Y -
          Player.VERTICAL_TELEPORT * (Player.NUM_OF_TRACKS - 1)
      ) {
        this.player.y -= Player.VERTICAL_TELEPORT;
      }
    };

    down.press = (): void => {
      if (
        this.player.y + Player.VERTICAL_TELEPORT <=
        this.app.renderer.screen.height - this.player.height - Player.START_TRACK_RELATIVE_POSITION_Y
      ) {
        this.player.y += Player.VERTICAL_TELEPORT;
      }
    };
  }

  public onUpdate = (delta: number): void => {
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;
  };

  public onResize = (width: number, height: number): void => {
    // to be implemented
  };
}
