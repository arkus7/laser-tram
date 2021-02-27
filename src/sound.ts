import PIXISound from 'pixi-sound';

export class Sound {
  private sound: PIXISound.Sound;

  constructor(asset: string, options?: PIXISound.Options) {
    this.sound = PIXISound.Sound.from(asset);
    this.sound.speed = options?.speed;
  }

  public play() {
    this.sound.play();
  }
}
