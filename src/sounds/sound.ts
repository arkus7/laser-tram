import * as PIXI from 'pixi.js';
import * as pixiSound from 'pixi-sound';

export class Sound {
  private sound: PIXI.sound.Sound;

  public static init() {
    pixiSound.default.init();
  }

  constructor(asset: string, options?: PIXI.sound.Options) {
    this.sound = PIXI.Loader.shared.resources[asset].sound;

    this.sound.speed = options?.speed || 1;
    this.sound.loop = options?.loop || false;
    this.sound.volume = options?.volume || 1;
  }

  public get() {
    return this.sound;
  }
}
