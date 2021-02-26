import '../styles.scss';

import * as PIXI from 'pixi.js';
import { Player } from './player';
import { Map } from './map';
import { onClick} from './helpers';
import { SpriteObject } from './interfaces/spriteObject';
import { HealthBar } from './healthbar';
import { Projectile } from './projectile';

let objectList = new Array();
let bulletsList = new Array();
export class Application {
  private app: PIXI.Application;
  private width = window.innerWidth;
  private height = window.innerHeight;
  private player;
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
    window.addEventListener('mousedown', () => this.onClick());
    this.setup();
  
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
    await projectile.create(playerPos.x, playerPos.y, mouseposition.x, mouseposition.y, angle);
    bulletsList.push(projectile);
  };


  private async setup(): Promise<void> {
    const map = new Map(this.app);
    const player = new Player(this.app);
    const bar = new HealthBar(this.app);  //main bar for train hp

    await map.create();
    await player.create();
    this.player = player;
    await bar.create(90, 20, 100, 100, true);
  
    objectList = objectList;
    objectList.push(map);
    objectList.push(player);
    objectList.push(bar);
    this.app.ticker.add((delta) => this.gameLoop(delta));
    
  }

  private gameLoop = (delta: number): void => {
    this.play(delta);
  };

 
  private play = (delta: number): void => {
  objectList.forEach((object) => {
      object.onUpdate(delta);
    });

    bulletsList.forEach((object) => {
      object.onUpdate(delta);
    });
  };
 
}

const app = new Application();
