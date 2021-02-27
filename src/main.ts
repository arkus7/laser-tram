import '../styles.scss';

import { GodrayFilter, RGBSplitFilter } from 'pixi-filters';
import * as PIXI from 'pixi.js';

import { Collisions } from './collisions';
import { SpriteObject } from './interfaces/spriteObject';
import { ParallaxMap } from './parallax-map';
import { Player } from './player';
import { Projectile } from './projectile';
import { Sound } from './sounds/sound';
import { soundAssets } from './sounds/utils';
import { BaseZombie } from './zombie/base-zombie';
import { BrainiacZombie } from './zombie/brainiac-zombie';
import { NormalZombie } from './zombie/normal-zombie';
import { assetsForZombie } from './zombie/utils';
import { ZabaZombie } from './zombie/zaba-zombie';
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

  private gameOverCounter = 0;

  private appStage: (delta?: number) => void;

  private playScene: PIXI.Container;
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
      .add(assetsForZombie(ZombieType.Zaba))
      .add(postapo4MapSprites)
      .add('assets/sprites/tram.png')
      .add('assets/sprites/map.jpg')
      .add('assets/sprites/Vicodo_phone.png')
      .add(soundAssets())
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
    const projectile = new Projectile();
    let playerPos = this.player.getPosition();
    let dist_Y = mouseposition.y - playerPos.y;
    let dist_X = mouseposition.x - playerPos.x;
    let angle = Math.atan2(dist_Y, dist_X);
    projectile.create(playerPos.x + this.player.width - 50, playerPos.y, mouseposition.x, mouseposition.y, angle);
    this.playScene.addChild(projectile);
    this.objectList.push(projectile);
  }

  private async setup(): Promise<void> {
    this.playScene = new PIXI.Container();
    this.gameOverScene = new PIXI.Container();

    this.app.stage.addChild(this.playScene);
    this.app.stage.addChild(this.gameOverScene);

    this.setupPlayScene();
    this.setupGameOverScene();

    this.appStage = this.play;

    this.app.ticker.add((delta) => this.gameLoop(delta));
  }

  private setupGameOverScene(): void {
    this.gameOverScene.visible = false;
    const gameOverTextStyle = new PIXI.TextStyle({
      fontFamily: 'Futura',
      fontSize: 120,
      fill: 'white',
    });

    const gameOverText = new PIXI.Text('Game Over', gameOverTextStyle);
    gameOverText.x = APP_WIDTH / 2 - gameOverText.width / 2;
    gameOverText.y = 100;

    const restartGameText = new PIXI.Text('Restart Game', { ...gameOverTextStyle, fontSize: 64 });
    restartGameText.x = APP_WIDTH / 2 - restartGameText.width / 2;
    restartGameText.y = APP_HEIGHT - restartGameText.height - 100;
    restartGameText.interactive = true;
    restartGameText.buttonMode = true;

    restartGameText.on('pointertap', () => {
      this.swithToPlayScene();
    });

    const tram = new PIXI.Sprite(PIXI.Loader.shared.resources['assets/sprites/map/postapo4/train.png'].texture);
    tram.x = -150;

    this.gameOverScene.addChild(tram);
    this.gameOverScene.addChild(gameOverText);
    this.gameOverScene.addChild(restartGameText);
  }

  private gameLoop = (delta: number): void => {
    this.appStage(delta);
  };

  private play = (delta: number): void => {
    Collisions.checkForCollisions(this.objectList);

    if (Math.ceil(Math.random() * 200) % 100 == 0) {
      let zombie: BaseZombie;
      if (Math.ceil(Math.random() * 3) % 3 == 0) {
        zombie = new NormalZombie();
      } else if (Math.ceil(Math.random() * 3) % 3 == 1) {
        zombie = new BrainiacZombie();
      } else {
        zombie = new ZabaZombie();
      }

      zombie.x = Math.random() * 600 + this.app.screen.width;
      const randomY = Math.random() * 200 + this.app.screen.height - 3 * zombie.height;
      zombie.y = Math.min(randomY, this.playScene.height - zombie.height);
      this.objectList.push(zombie);
      this.playScene.addChild(zombie);
    }

    this.objectList.forEach((object) => {
      if (isDestroyed(object)) {
        return;
      }
      object.onUpdate(delta);
      this.destroyObjectWhenOutOfBounds(object);
    });
  };

  private gameOver = (): void => {
    if (this.gameOverCounter % 10 == 0) {
      const maxOffset = 30;
      this.gameOverScene.filters = [
        new RGBSplitFilter(
          new PIXI.Point(Math.random() * maxOffset, Math.random()),
          new PIXI.Point(Math.random() * maxOffset, Math.random()),
          new PIXI.Point(Math.random() * maxOffset, Math.random())
        ),
      ];
    }
    this.gameOverCounter += 1;
  };

  private setupPlayScene() {
    const backgroundMusic = new Sound('assets/sounds/muzyka-z-dooma-full.mp3', { loop: true });
    const parallaxMap = new ParallaxMap({
      renderer: this.app.renderer,
      assets: postapo4MapSprites,
    });

    parallaxMap.children[0].filters = [new GodrayFilter()];

    this.playScene.addChild(parallaxMap);
    this.objectList.push(parallaxMap);

    this.player = new Player();
    this.playScene.addChild(this.player);

    this.player.onDeadEvent = () => {
      backgroundMusic.get().stop();
      new Sound('assets/sounds/game_over.mp3', { volume: 4 }).get().play();
      this.swithToGameOver();
    };

    this.player.create();

    const normalZombie = new NormalZombie();
    this.playScene.addChild(normalZombie);

    const brainiacZombie = new BrainiacZombie();
    brainiacZombie.x = 1550;
    brainiacZombie.y = 850;

    this.playScene.addChild(brainiacZombie);

    this.objectList.push(this.player);
    this.objectList.push(normalZombie, brainiacZombie);

    backgroundMusic.get().play();
  }

  private swithToGameOver(): void {
    this.playScene.visible = false;
    this.gameOverScene.visible = true;
    this.appStage = this.gameOver;
  }

  private swithToPlayScene(): void {
    this.resetPlayScene();
    this.playScene.visible = true;
    this.gameOverScene.visible = false;
    this.appStage = this.play;
  }

  private resetPlayScene(): void {
    this.playScene.removeChild(...this.playScene.children);
    this.objectList.length = 0;
    this.setupPlayScene();
  }

  private destroyObjectWhenOutOfBounds(object: PIXI.Container) {
    if (!isDestroyed(object)) {
      const { x, y, width, height } = object;
      const widthOffset = 3 * width;
      const hightOffset = 3 * height;

      if (
        x > this.playScene.width + widthOffset ||
        x < 0 - widthOffset ||
        y > this.playScene.height + hightOffset ||
        y < 0 - hightOffset
      )
        object.destroy({ children: true });
    }
  }
}

export function isDestroyed(object: PIXI.DisplayObject) {
  return (object as any)._destroyed;
}

const app = new Application();
