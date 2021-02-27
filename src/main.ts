import '../styles.scss';

import * as PIXI from 'pixi.js';
import { Map } from './map';
import { Projectile } from './projectile';

let objectList = new Array();
let bulletsList = new Array();

import { Collisions } from './collisions';
import { HealthBar } from './health-bar';
import { SpriteObject } from './interfaces/spriteObject';
import { ParallaxMap } from './parallax-map';
import { Player } from './player';
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
  private player: Player;

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
      objectList.forEach((object) => {
      object.onResize(this.width, this.height);
    });
  };

  private async onClick(): Promise<void> {
    const mouseposition = this.app.renderer.plugins.interaction.mouse.global;
    console.log( mouseposition.x)
    this.app.loader.reset();
    const projectile = new Projectile(this.app);
    let playerPos = this.player.getPosition();
    let dist_Y = mouseposition.y - playerPos.y;
    let dist_X = mouseposition.x - playerPos.x;
    let angle = Math.atan2(dist_Y,dist_X);
    await projectile.create(playerPos.x + this.player.width - 50, playerPos.y, mouseposition.x, mouseposition.y, angle);
    this.objectList.push(projectile);
  };


  private async setup(): Promise<void> {
    this.player = new Player(this.app);

    this.player.onDeadEvent = () => {
      console.log('test', 'Player is dead');
    };

    const parallaxMap = new ParallaxMap({
      renderer: this.app.renderer,
      assets: postapo4MapSprites,
    });

    this.app.stage.addChild(parallaxMap);
    this.objectList.push(parallaxMap);

    await this.player.create();
    this.player.addHealthBar(new HealthBar(this.player.width / 8, -20, 100, 100));

    const normalZombie = new NormalZombie();
    normalZombie.addHealthBar(new HealthBar(normalZombie.width * -1, -20, 100, 100));
    this.app.stage.addChild(normalZombie);

    const brainiacZombie = new BrainiacZombie();
    brainiacZombie.addHealthBar(new HealthBar(brainiacZombie.width * -1, -20, 100, 100));
    brainiacZombie.x = 1550;
    brainiacZombie.y = 850;

    this.app.stage.addChild(brainiacZombie);

    this.objectList.push(this.player);
    this.objectList.push(normalZombie, brainiacZombie);

    this.app.ticker.add((delta) => this.gameLoop(delta));
    
  }

  private gameLoop = (delta: number): void => {
    this.play(delta);
  };

 
  private play = (delta: number): void => {
    Collisions.checkForCollisions(this.objectList);

    this.objectList.forEach((object) => {
      object.onUpdate(delta);
    });
  };
 
}

const app = new Application();
