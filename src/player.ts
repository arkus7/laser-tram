import * as PIXI from 'pixi.js';
import { SpriteObject } from './interfaces/spriteObject';
import { Keyboard } from './keyboard';

export class Player extends PIXI.Sprite implements SpriteObject {
  private app: PIXI.Application;

  private vx: number;
  private vy: number;

  private static readonly SPEED = 5;
  private static readonly VERTICAL_TELEPORT = 70;
  private static readonly NUM_OF_TRACKS = 3;
  private static readonly START_TRACK_RELATIVE_POSITION_Y = 15;

  constructor(app) {
    super(PIXI.Loader.shared.resources['assets/sprites/tram.png'].texture);
    this.app = app;
  }

  public async create(): Promise<void> {
    this.x = 15;
    this.y = this.app.renderer.screen.height - this.height - Player.START_TRACK_RELATIVE_POSITION_Y;

    this.vx = 0;
    this.vy = 0;

    this.setKeyboardEvents();

    this.app.stage.addChild(this);
  }

  public getPosition(): { x: number; y: number } {
    return {
      x: this.x,
      y: this.y,
    };
  }

  private setKeyboardEvents(): void {
    const left = new Keyboard('ArrowLeft');
    const right = new Keyboard('ArrowRight');
    const up = new Keyboard('ArrowUp');
    const down = new Keyboard('ArrowDown');

    left.press = (): void => {
      this.vx = -Player.SPEED;
    };

    left.release = (): void => {
      if (!right.isDown) {
        this.vx = 0;
      }
    };

    right.press = (): void => {
      this.vx = Player.SPEED;
    };

    right.release = (): void => {
      if (!left.isDown) {
        this.vx = 0;
      }
    };

    up.press = (): void => {
      if (
        this.y - Player.VERTICAL_TELEPORT >=
        this.app.renderer.screen.height -
          this.height -
          Player.START_TRACK_RELATIVE_POSITION_Y -
          Player.VERTICAL_TELEPORT * (Player.NUM_OF_TRACKS - 1)
      ) {
        this.y -= Player.VERTICAL_TELEPORT;
      }
    };

    down.press = (): void => {
      if (
        this.y + Player.VERTICAL_TELEPORT <=
        this.app.renderer.screen.height - this.height - Player.START_TRACK_RELATIVE_POSITION_Y
      ) {
        this.y += Player.VERTICAL_TELEPORT;
      }
    };
  }

  public isCollisable(): boolean {
    return true;
  }

  public onUpdate = (delta: number): void => {
    this.x += this.vx;
    this.y += this.vy;
  };

  public onResize = (width: number, height: number): void => {
    // to be implemented
  };

  public onCollision = (object: SpriteObject): void => {
    console.log('test', 'tram collision! with', object);
  };
}
