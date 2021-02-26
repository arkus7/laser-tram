import '../styles.scss';

import * as PIXI from 'pixi.js';

import { HealthBar } from './healthbar';
import { SpriteObject } from './interfaces/spriteObject';
import { Map } from './map';
import { Player } from './player';
import { BrainiacZombie } from './zombie/brainiac-zombie';
import { NormalZombie } from './zombie/normal-zombie';
import { assetsForZombie } from './zombie/utils';
import { ZombieType } from './zombie/zombie-enums';
import { Prop } from './prop';
import { Collisions } from './collisions';

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

    PIXI.Loader.shared
      .add([...assetsForZombie(ZombieType.Normal), ...assetsForZombie(ZombieType.Brainiac)])
      .load(() => this.setup());
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
    const bar = new HealthBar(this.app); //main bar for train hp
    const testObject1 = new Prop(this.app, '/assets/sprites/cat.png');
    const collisions = new Collisions(this.app);

    await map.create();
    await player.create();
    await bar.create(90, 20, 100, 100, false);
    await testObject1.create(400, this.app.renderer.screen.height - 85);

    const normalZombie = new NormalZombie();
    this.app.stage.addChild(normalZombie);

    const brainiacZombie = new BrainiacZombie();
    brainiacZombie.x = 550;
    brainiacZombie.y = 850;

    this.app.stage.addChild(brainiacZombie);

    this.objectList = new Array();
    this.objectList.push(map);
    this.objectList.push(player);
    this.objectList.push(normalZombie, brainiacZombie);

    this.objectList.push(bar);

    this.app.ticker.add((delta) => this.gameLoop(delta));
    this.app.ticker.add((delta) => {
      const result = collisions.checkForCollision(player.getSprite(), testObject1.getSprite());
      console.log('test', 'result', result);
    });
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
