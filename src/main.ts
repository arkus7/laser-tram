import '../styles.scss';

import * as PIXI from 'pixi.js';

import { Collisions } from './collisions';
import { SpriteObject } from './interfaces/spriteObject';
import { ParallaxMap } from './parallax-map';
import { Player } from './player';
import { Projectile } from './projectile';
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

export const APP_HEIGHT = 1080;
export const APP_WIDTH = 1920;

export class Application {
  private app: PIXI.Application;
  private width = APP_WIDTH;
  private height = APP_HEIGHT;
  private player: Player;

  private appStage: (delta?: number) => void;

  private gameScene: PIXI.Container;
  private gameOverScene: PIXI.Container;

  private objectList: Array<SpriteObject & PIXI.Container> = new Array();

  constructor() {
    const mainElement = document.getElementById('app') as HTMLElement;

    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    // window.addEventListener('resize', () => this.resize());
    mainElement.appendChild(this.app.view);
    window.addEventListener('mousedown', () => this.onClick());

    PIXI.Loader.shared
      .add(assetsForZombie(ZombieType.Normal))
      .add(assetsForZombie(ZombieType.Brainiac))
      .add(postapo4MapSprites)
      .add('assets/sprites/tram.png')
      .add('assets/sprites/map.jpg')
      .add('assets/sprites/Vicodo_phone.png')
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

  private async onClick(): Promise<void> {
    const mouseposition = this.app.renderer.plugins.interaction.mouse.global;
    console.log(mouseposition.x);
    const projectile = new Projectile(this.app);
    let playerPos = this.player.getPosition();
    let dist_Y = mouseposition.y - playerPos.y;
    let dist_X = mouseposition.x - playerPos.x;
    let angle = Math.atan2(dist_Y, dist_X);
    projectile.create(playerPos.x + this.player.width - 50, playerPos.y, mouseposition.x, mouseposition.y, angle);
    this.gameScene.addChild(projectile);
    this.objectList.push(projectile);
  }

  private async setup(): Promise<void> {
    this.gameScene = new PIXI.Container();
    this.gameOverScene = new PIXI.Container();

    this.app.stage.addChild(this.gameScene);
    this.app.stage.addChild(this.gameOverScene);

    const parallaxMap = new ParallaxMap({
      renderer: this.app.renderer,
      assets: postapo4MapSprites,
    });

    this.gameScene.addChild(parallaxMap);
    this.objectList.push(parallaxMap);

    this.player = new Player();
    this.gameScene.addChild(this.player);

    this.player.onDeadEvent = () => {
      console.log('test', 'Player is dead');
      // this.swithToGameOver();
    };

    this.player.create();

    const normalZombie = new NormalZombie();
    this.gameScene.addChild(normalZombie);

    const brainiacZombie = new BrainiacZombie();
    brainiacZombie.x = 1550;
    brainiacZombie.y = 850;

    this.gameScene.addChild(brainiacZombie);

    this.objectList.push(this.player);
    this.objectList.push(normalZombie, brainiacZombie);

    this.appStage = this.play;

    this.app.ticker.add((delta) => this.gameLoop(delta));
  }

  private gameLoop = (delta: number): void => {
    // console.log(this.gameScene.getBounds(true));
    this.appStage(delta);
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
      const randomY = Math.random() * 200 + this.app.screen.height - 3 * zombie.height;
      zombie.y = Math.min(randomY, this.gameScene.height - zombie.height);
      this.objectList.push(zombie);
      this.gameScene.addChild(zombie);
    }

    this.objectList.forEach((object) => {
      if (isDestroyed(object)) {
        return;
      }
      object.onUpdate(delta);
      if (
        !isDestroyed(object) &&
        (object.x > this.gameScene.width + 3 * object.width || object.y > this.gameScene.height + 3 * object.height)
      ) {
        object.destroy({ children: true });
      }
    });
  };

  private gameOver = (): void => {};

  private swithToGameOver(): void {
    this.gameScene.visible = false;
    this.appStage = this.gameOver;
  }
}

const app = new Application();
function isDestroyed(object: SpriteObject & PIXI.Container) {
  return (object as any)._destroyed;
}
