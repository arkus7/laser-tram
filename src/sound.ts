import * as PIXI from 'pixi.js';
import PIXISound from 'pixi-sound';

export class Sound {
  private sound: PIXISound.Sound;

  constructor(asset: string) {
    this.sound = PIXISound.Sound.from(asset);

    // this.sound = PIXI.Loader.shared.resources[asset].sound;
  }

  public play() {
    this.sound.play();
    this.sound.speed = 3;
    this.sound.loop = true;
  }
}
