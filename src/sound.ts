import PIXISound from 'pixi-sound';

export class Sound {
  private sound: PIXISound.Sound;

  constructor(asset: string, options?: PIXISound.Options) {
    this.sound = PIXISound.Sound.from(asset);

    this.sound.speed = options?.speed || 1;
    this.sound.loop = options?.loop || false;
    this.sound.volume = options?.volume || 1;
  }

  public get() {
    return this.sound;
  }
}
