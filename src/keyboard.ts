export class Keyboard {
  public value: string;
  public isDown: boolean = false;
  public isUp: boolean = true;
  public press: Function;
  public release: Function;

  constructor(value: string) {
    this.init(value);
  }

  private init(value: string): void {
    this.value = value;

    window.addEventListener('keydown', this.downHandler);
    window.addEventListener('keyup', this.upHandler);
  }

  private downHandler = (event: KeyboardEvent) => {
    if (event.key === this.value) {
      if (this.isUp && this.press) {
        this.press();
      }

      this.isDown = true;
      this.isUp = false;
      event.preventDefault();
    }
  };

  private upHandler = (event: KeyboardEvent): void => {
    if (event.key === this.value) {
      if (this.isDown && this.release) {
        this.release();
      }

      this.isDown = false;
      this.isUp = true;
      event.preventDefault();
    }
  };

  public unsubscribe = (): void => {
    window.removeEventListener('keydown', this.downHandler);
    window.removeEventListener('keyup', this.upHandler);
  };
}
