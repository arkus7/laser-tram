import * as PIXI from 'pixi.js';

import { HealthBar } from './health-bar';
import { LivingBeing } from './interfaces/living-being';
import { SpriteObject } from './interfaces/spriteObject';
import { Weapon } from './interfaces/weapon';
import { Keyboard } from './keyboard';
import { APP_HEIGHT } from './main';
import { BaseZombie } from './zombie/base-zombie';

export class Player extends PIXI.Sprite implements SpriteObject, LivingBeing, Weapon {
  private healthBar: HealthBar;

  private vx: number;
  private vy: number;

  public health = 100;

  private static readonly SPEED = 5;
  private static readonly VERTICAL_TELEPORT = 70;
  private static readonly NUM_OF_TRACKS = 2;
  private static readonly START_TRACK_RELATIVE_POSITION_Y = 15;

  public onDeadEvent: Function;

  constructor() {
    super(PIXI.Loader.shared.resources['assets/sprites/tram.png'].texture);
  }

  public create(): void {
    this.scale.set(2, 2);

    this.x = 15;
    this.y = APP_HEIGHT - this.height - Player.START_TRACK_RELATIVE_POSITION_Y;

    this.vx = 0;
    this.vy = 0;

    this.setKeyboardEvents();
    this.addHealthBar(new HealthBar(this.width / 8, -20, 100, 100));
  }

  public addHealthBar(bar: HealthBar): void {
    this.healthBar = bar;
    this.addChild(this.healthBar);
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
        APP_HEIGHT -
          this.height -
          Player.START_TRACK_RELATIVE_POSITION_Y -
          Player.VERTICAL_TELEPORT * (Player.NUM_OF_TRACKS - 1)
      ) {
        this.y -= Player.VERTICAL_TELEPORT;
      }
    };

    down.press = (): void => {
      if (this.y + Player.VERTICAL_TELEPORT <= APP_HEIGHT - this.height - Player.START_TRACK_RELATIVE_POSITION_Y) {
        this.y += Player.VERTICAL_TELEPORT;
      }
    };
  }

  public isCollisable(): boolean {
    return true;
  }

  public isAlive(): boolean {
    return this.health > 0;
  }

  public getDamage(): number {
    return 5;
  }

  public addOnDeadEvent(callback: Function): void {
    this.onDeadEvent = callback;
  }

  public onUpdate = (delta: number): void => {
    this.x += this.vx;
    this.y += this.vy;
  };

  public onResize = (width: number, height: number): void => {
    // to be implemented
  };

  public onCollision = (object: SpriteObject): void => {
    if (object instanceof BaseZombie) {
      this.health -= object.getDamage();
      this.healthBar?.onChangeHP(this.health);

      if (!this.isAlive() && this.onDeadEvent) {
        this.onDeadEvent();
      }
    }
  };
}
