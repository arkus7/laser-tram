import '../styles.scss';

import * as PIXI from 'pixi.js';
import { Player } from './player';
import { Map } from './map';
import { SpriteObject } from './interfaces/spriteObject';
import { HealthBar } from './healthbar';

export class Application {
  private app: PIXI.Application;
  private width = window.innerWidth;
  private height = window.innerHeight;

  private objectList: Array<SpriteObject>;

  constructor() {
    const mainElement = document.getElementById('app') as HTMLElement;

    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      resizeTo: mainElement,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    window.addEventListener('resize', this.resize);
    mainElement.appendChild(this.app.view);

    this.setup();
  }

  private resize = (): void => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.app.renderer.resize(this.width, this.height);

    this.objectList.forEach((object) => {
      object.onResize(this.width, this.height);
    });
  };

  private async setup(): Promise<void> {
    const map = new Map(this.app);
    const player = new Player(this.app);
    const bar = new HealthBar(this.app);

    await map.create();
    await player.create();
    await bar.create();
    //bar.onChangeHP(100); how to change hp - may be positive or negative
    this.objectList = new Array();

    this.objectList.push(map);
    this.objectList.push(player);
    this.objectList.push(bar);
    
    this.app.ticker.add((delta) => this.gameLoop(delta));
  }

  private gameLoop = (delta: number): void => {
    this.play(delta);
  };

  private play = (delta: number): void => {
    this.objectList.forEach((object) => {
      object.onUpdate(delta);
    });
  };
}

const app = new Application();
