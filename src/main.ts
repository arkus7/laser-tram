import '../styles.scss';

import * as PIXI from 'pixi.js';

import { Collisions } from './collisions';
import { HealthBar } from './health-bar';
import { SpriteObject } from './interfaces/spriteObject';
import { ParallaxMap } from './parallax-map';
import { Player } from './player';
import { BaseZombie } from './zombie/base-zombie';
import { BrainiacZombie } from './zombie/brainiac-zombie';
import { NormalZombie } from './zombie/normal-zombie';
import { assetsForZombie } from './zombie/utils';
import { ZombieType } from './zombie/zombie-enums';

const postapo4MapSprites = [
  'assets/sprites/map/postapo4/bg.png',
  'assets/sprites/map/postapo4/rail&wall.png',
  'assets/sprites/map/postapo4/train.png',
  'assets/sprites/map/postapo4/columns&floor.png',
  'assets/sprites/map/postapo4/infopost&wires.png',
  'assets/sprites/map/postapo4/floor&underfloor.png',
  'assets/sprites/map/postapo4/wires.png',
];
export class Application {
  private app: PIXI.Application;
  private width = window.innerWidth;
  private height = window.innerHeight;

  private objectList: Array<SpriteObject & PIXI.Container> = new Array();

  constructor() {
    const mainElement = document.getElementById('app') as HTMLElement;

    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      resizeTo: mainElement,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    window.addEventListener('resize', () => this.resize());
    mainElement.appendChild(this.app.view);

    PIXI.Loader.shared
      .add(assetsForZombie(ZombieType.Normal))
      .add(assetsForZombie(ZombieType.Brainiac))
      .add(postapo4MapSprites)
      .add('assets/sprites/tram.png')
      .add('assets/sprites/map.jpg')
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
    const player = new Player(this.app);

    player.onDeadEvent = () => {
      console.log('test', 'Player is dead');
    };

    const parallaxMap = new ParallaxMap({
      renderer: this.app.renderer,
      assets: postapo4MapSprites,
    });

    this.app.stage.addChild(parallaxMap);
    this.objectList.push(parallaxMap);

    await player.create();
    player.addHealthBar(new HealthBar(player.width / 8, -20, 100, 100));

    const normalZombie = new NormalZombie();
    this.app.stage.addChild(normalZombie);

    const brainiacZombie = new BrainiacZombie();
    brainiacZombie.x = 1550;
    brainiacZombie.y = 850;

    this.app.stage.addChild(brainiacZombie);

    this.objectList.push(player);
    this.objectList.push(normalZombie, brainiacZombie);

    this.app.ticker.add((delta) => this.gameLoop(delta));
  }

  private gameLoop = (delta: number): void => {
    this.play(delta);
  };

  private play = (delta: number): void => {
    Collisions.checkForCollisions(this.objectList.filter((obj) => !(obj as any)._destroyed));

    if (Math.ceil(Math.random() * 200) % 100 == 0) {
      let zombie: BaseZombie;
      if (Math.ceil(Math.random() * 3) % 2 == 0) {
        zombie = new NormalZombie();
      } else {
        zombie = new BrainiacZombie();
      }
      zombie.x = Math.random() * 600 + this.app.screen.width;
      zombie.y = Math.random() * 200 + this.app.screen.height - 3 * zombie.height;
      this.objectList.push(zombie);
      this.app.stage.addChild(zombie);
    }

    this.objectList.forEach((object) => {
      object.onUpdate(delta);
    });
  };
}

const app = new Application();
