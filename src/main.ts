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
  private scoreCountText: PIXI.Text;
  private gameOverCounter = 0;

  private playerPoints = 0;
  private playerDamage = 5;
  private weaponDamage = 5;
  private playerMaxHealth = 100;

  private healthUpgradeCost = 0;
  private ramDamageUpgradeCost = 0;
  private weaponUpgradeCost = 0;

  private playerPointsText: PIXI.Text;
  private currentHealthText: PIXI.Text;
  private upgradeRamDamageCostText: PIXI.Text;
  private upgradeWeaponDamageCostText: PIXI.Text;

  private appStage: (delta?: number) => void;

  private playScene: PIXI.Container;
  private upgradeScene: PIXI.Container;
  private gameOverScene: PIXI.Container;
  private mainMenuScene: PIXI.Container;

  private objectList: Array<SpriteObject & PIXI.Container> = new Array();

  private cheatKeysSequence: string[] = 'zelki'.split('');
  private keysSequence: string[] = [];

  private backgroundMusic: Sound;
  private menuSelectSound: Sound;

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
      .add('assets/fonts/zoombieland.ttf')
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
    if (!this.playScene.visible) {
      return;
    }
    const mouseposition = this.app.renderer.plugins.interaction.mouse.global;
    console.log(mouseposition.x);
    const projectile = new Projectile();
    let playerPos = this.player.getPosition();
    let dist_Y = mouseposition.y - playerPos.y;
    let dist_X = mouseposition.x - playerPos.x;
    let angle = Math.atan2(dist_Y, dist_X);
    projectile.create(playerPos.x + this.player.width - 50, playerPos.y, mouseposition.x, mouseposition.y, angle);
    projectile.setDamage(this.weaponDamage);
    this.playScene.addChild(projectile);
    this.objectList.push(projectile);
  }

  private async setup(): Promise<void> {
    this.playScene = new PIXI.Container();
    this.upgradeScene = new PIXI.Container();
    this.gameOverScene = new PIXI.Container();
    this.mainMenuScene = new PIXI.Container();

    this.app.stage.addChild(this.mainMenuScene);
    this.app.stage.addChild(this.playScene);
    this.app.stage.addChild(this.upgradeScene);
    this.app.stage.addChild(this.gameOverScene);

    this.backgroundMusic = new Sound('assets/sounds/muzyka-z-dooma-full.mp3', { loop: true });
    this.menuSelectSound = new Sound('assets/sounds/menu-select.mp3', { speed: 3, volume: 5 });

    this.setupPlayScene();
    this.setupUpgradeScene();
    this.setupGameOverScene();
    this.setupMainMenuScene();

    this.setupCheats();

    this.appStage = this.mainMenu;

    this.app.ticker.add((delta) => this.gameLoop(delta));
  }

  private setupMainMenuScene() {
    this.playScene.visible = false;
    const titleStyle = new PIXI.TextStyle({
      fontFamily: 'Futura',
      align: 'center',
      dropShadow: true,
      dropShadowBlur: 5,
      dropShadowColor: '#cccccc',
      fill: 'yellow',
      fontSize: 60,
      wordWrap: true,
      wordWrapWidth: 700,
    });
    const titleText = new PIXI.Text(`Jeżdżący tramwaj strzelający laserami do`, titleStyle);
    titleText.y = 200;
    titleText.x = APP_WIDTH / 2 - titleText.width / 2;

    const titleStrikethroughText = new PIXI.Text(`ludzi zarażonych covidem`, { ...titleStyle, wordWrap: false });
    titleStrikethroughText.y = titleText.y + titleText.height;
    titleStrikethroughText.x = (APP_WIDTH - titleStrikethroughText.width) / 2;

    this.mainMenuScene.addChild(titleText);
    this.mainMenuScene.addChild(titleStrikethroughText);

    const strikethrough = new PIXI.Graphics();
    strikethrough.beginFill(0xc80000);
    strikethrough.drawRect(
      titleStrikethroughText.x - 50,
      titleStrikethroughText.y + titleStrikethroughText.height / 2,
      titleStrikethroughText.width + 100,
      titleStrikethroughText.height / 10
    );
    strikethrough.endFill();

    this.mainMenuScene.addChild(strikethrough);

    const zombieText = new PIXI.Text(`ZOMBIE`, {
      ...titleStyle,
      fontSize: 120,
      fill: 'yellow',
      fontFamily: 'zoombieland demo',
    });
    zombieText.x = (APP_WIDTH - zombieText.width) / 2;
    zombieText.y = titleStrikethroughText.y + titleStrikethroughText.height + 10;

    this.mainMenuScene.addChild(zombieText);

    const startGameText = new PIXI.Text('Start Game', { ...titleStyle, fill: 'white' });
    startGameText.x = (APP_WIDTH - startGameText.width) / 2;
    startGameText.y = APP_HEIGHT - startGameText.height - 200;

    startGameText.interactive = true;
    startGameText.buttonMode = true;

    startGameText.on('pointertap', () => {
      this.menuSelectSound.get().play();
      this.switchToPlayScene();
    });

    this.mainMenuScene.addChild(startGameText);
  }

  private setupCheats() {
    window.addEventListener('keypress', (event) => {
      const index = this.keysSequence.length;
      if (event.key === this.cheatKeysSequence[index]) {
        this.keysSequence.push(event.key);
        if (this.keysSequence.join() === this.cheatKeysSequence.join()) {
          this.keysSequence.length = 0;
          this.player.addToScore(1000);
          this.scoreCountText.text = this.player.getTotalScore().toString();
        }
      } else {
        this.keysSequence.length = 0;
      }
    });
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

    const upgradeTramText = new PIXI.Text('Upgrade tram', { ...gameOverTextStyle, fontSize: 64 });
    upgradeTramText.x = APP_WIDTH / 2 - upgradeTramText.width / 2;
    upgradeTramText.y = APP_HEIGHT - upgradeTramText.height - 200;
    upgradeTramText.interactive = true;
    upgradeTramText.buttonMode = true;

    const restartGameText = new PIXI.Text('Restart Game', { ...gameOverTextStyle, fontSize: 64 });
    restartGameText.x = APP_WIDTH / 2 - restartGameText.width / 2;
    restartGameText.y = APP_HEIGHT - restartGameText.height - 100;
    restartGameText.interactive = true;
    restartGameText.buttonMode = true;

    restartGameText.on('pointertap', () => {
      this.menuSelectSound.get().play();
      this.switchToPlayScene();
    });

    upgradeTramText.on('pointertap', () => {
      this.menuSelectSound.get().play();
      this.swithToUpgradeScene();
    });

    const tram = new PIXI.Sprite(PIXI.Loader.shared.resources['assets/sprites/map/postapo4/train.png'].texture);
    tram.x = -150;

    this.gameOverScene.addChild(tram);
    this.gameOverScene.addChild(gameOverText);
    this.gameOverScene.addChild(upgradeTramText);
    this.gameOverScene.addChild(restartGameText);
  }

  private gameLoop = (delta: number): void => {
    this.appStage(delta);
  };

  private play = (delta: number): void => {
    Collisions.checkForCollisions(this.objectList);

    if (Math.ceil(Math.random() * 200) % 50 == 0) {
      let zombie: BaseZombie;

      if (Math.ceil(Math.random() * 3) % 3 == 0) {
        zombie = new NormalZombie();
      } else if (Math.ceil(Math.random() * 3) % 3 == 1) {
        zombie = new BrainiacZombie();
      } else {
        zombie = new ZabaZombie();
      }
      zombie.onDeadEvent = () => {
        this.player.addToScore(zombie.score);
        let text = this.player.getTotalScore();
        this.scoreCountText.text = text.toString();
      };
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

  private upgrade = (): void => {
    //
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

  private mainMenu = (): void => {
    //
  };

  private setupUpgradeScene(): void {
    this.upgradeScene.visible = false;

    const upgradeMenuTextStyle = new PIXI.TextStyle({
      fontFamily: 'Futura',
      fontSize: 48,
      fill: 'white',
    });

    this.playerPointsText = new PIXI.Text(`Player points: ${this.playerPoints.toString()}`, upgradeMenuTextStyle);
    this.playerPointsText.x = APP_WIDTH - this.playerPointsText.width - 100;
    this.playerPointsText.y = 100;

    const upgradeHealthText = new PIXI.Text('Upgrade health', upgradeMenuTextStyle);
    upgradeHealthText.x = 50;
    upgradeHealthText.y = 200;

    const upgradeHealthButton = new PIXI.Text('+', upgradeMenuTextStyle);
    upgradeHealthButton.x = APP_WIDTH - 100;
    upgradeHealthButton.y = 200;
    upgradeHealthButton.interactive = true;
    upgradeHealthButton.buttonMode = true;

    this.currentHealthText = new PIXI.Text(this.healthUpgradeCost.toString(), upgradeMenuTextStyle);
    this.currentHealthText.x = APP_WIDTH - upgradeHealthButton.width - 100 - 100;
    this.currentHealthText.y = 200;

    const upgradeRamDamageText = new PIXI.Text('Upgrade ram damage', upgradeMenuTextStyle);
    upgradeRamDamageText.x = 50;
    upgradeRamDamageText.y = 300;

    const upgradeRamDamageButton = new PIXI.Text('+', upgradeMenuTextStyle);
    upgradeRamDamageButton.x = APP_WIDTH - 100;
    upgradeRamDamageButton.y = 300;
    upgradeRamDamageButton.interactive = true;
    upgradeRamDamageButton.buttonMode = true;

    this.upgradeRamDamageCostText = new PIXI.Text(this.ramDamageUpgradeCost.toString(), upgradeMenuTextStyle);
    this.upgradeRamDamageCostText.x = APP_WIDTH - upgradeRamDamageButton.width - 100 - 100;
    this.upgradeRamDamageCostText.y = 300;

    const upgradeWeaponDamageText = new PIXI.Text('Upgrade weapon damage', upgradeMenuTextStyle);
    upgradeWeaponDamageText.x = 50;
    upgradeWeaponDamageText.y = 400;

    const upgradeWeaponDamageButton = new PIXI.Text('+', upgradeMenuTextStyle);
    upgradeWeaponDamageButton.x = APP_WIDTH - 100;
    upgradeWeaponDamageButton.y = 400;
    upgradeWeaponDamageButton.interactive = true;
    upgradeWeaponDamageButton.buttonMode = true;

    this.upgradeWeaponDamageCostText = new PIXI.Text(this.weaponUpgradeCost.toString(), upgradeMenuTextStyle);
    this.upgradeWeaponDamageCostText.x = APP_WIDTH - upgradeWeaponDamageButton.width - 100 - 100;
    this.upgradeWeaponDamageCostText.y = 400;

    const restartGameText = new PIXI.Text('Restart Game', { ...upgradeMenuTextStyle, fontSize: 120 });
    restartGameText.x = APP_WIDTH / 2 - restartGameText.width / 2;
    restartGameText.y = APP_HEIGHT - restartGameText.height - 100;
    restartGameText.interactive = true;
    restartGameText.buttonMode = true;

    const statsText = new PIXI.Text('Stats', { ...upgradeMenuTextStyle, fontSize: 60 });
    statsText.x = 50;
    statsText.y = 500;

    const currentHealthText = new PIXI.Text(`Health: ${this.playerMaxHealth}`, upgradeMenuTextStyle);
    currentHealthText.x = statsText.x;
    currentHealthText.y = statsText.y + 75;
    const currentRamDamageText = new PIXI.Text(`Ram damage: ${this.playerDamage}`, upgradeMenuTextStyle);
    currentRamDamageText.x = statsText.x;
    currentRamDamageText.y = currentHealthText.y + 50;
    const currentWeaponDamageText = new PIXI.Text(`Weapon damage: ${this.weaponDamage}`, upgradeMenuTextStyle);
    currentWeaponDamageText.x = statsText.x;
    currentWeaponDamageText.y = currentRamDamageText.y + 50;

    upgradeHealthButton.on('pointertap', () => {
      this.menuSelectSound.get().play();
      if (this.playerPoints >= this.healthUpgradeCost) {
        this.playerMaxHealth += 50;
        this.playerPoints -= this.healthUpgradeCost;
        this.healthUpgradeCost = this.playerMaxHealth * 5;
        this.currentHealthText.text = this.healthUpgradeCost.toString();
        this.playerPointsText.text = `Player points: ${this.playerPoints.toString()}`;
        currentHealthText.text = `Health: ${this.playerMaxHealth}`;
      }
    });

    upgradeRamDamageButton.on('pointertap', () => {
      this.menuSelectSound.get().play();
      if (this.playerPoints >= this.ramDamageUpgradeCost) {
        this.playerDamage += 10;
        this.playerPoints -= this.ramDamageUpgradeCost;
        this.ramDamageUpgradeCost = this.playerDamage * 5;
        this.upgradeRamDamageCostText.text = this.ramDamageUpgradeCost.toString();
        this.playerPointsText.text = `Player points: ${this.playerPoints.toString()}`;
        currentRamDamageText.text = `Ram damage: ${this.playerDamage}`;
      }
    });

    upgradeWeaponDamageButton.on('pointertap', () => {
      this.menuSelectSound.get().play();
      if (this.playerPoints >= this.weaponUpgradeCost) {
        this.weaponDamage += 5;
        this.playerPoints -= this.weaponUpgradeCost;
        this.weaponUpgradeCost = this.weaponDamage * 10;
        this.upgradeWeaponDamageCostText.text = this.weaponUpgradeCost.toString();
        this.playerPointsText.text = `Player points: ${this.playerPoints.toString()}`;
        currentWeaponDamageText.text = `Weapon damage: ${this.weaponDamage}`;
      }
    });

    restartGameText.on('pointertap', () => {
      this.menuSelectSound.get().play();
      this.switchToPlayScene();
    });

    this.upgradeScene.addChild(this.playerPointsText);
    this.upgradeScene.addChild(upgradeHealthText);
    this.upgradeScene.addChild(upgradeHealthButton);
    this.upgradeScene.addChild(this.currentHealthText);

    this.upgradeScene.addChild(upgradeRamDamageText);
    this.upgradeScene.addChild(upgradeRamDamageButton);
    this.upgradeScene.addChild(this.upgradeRamDamageCostText);

    this.upgradeScene.addChild(upgradeWeaponDamageText);
    this.upgradeScene.addChild(upgradeWeaponDamageButton);
    this.upgradeScene.addChild(this.upgradeWeaponDamageCostText);

    this.upgradeScene.addChild(statsText);
    this.upgradeScene.addChild(currentHealthText);
    this.upgradeScene.addChild(currentRamDamageText);
    this.upgradeScene.addChild(currentWeaponDamageText);

    this.upgradeScene.addChild(restartGameText);
  }

  private setupPlayScene(): void {
    const parallaxMap = new ParallaxMap({
      renderer: this.app.renderer,
      assets: postapo4MapSprites,
    });

    parallaxMap.children[0].filters = [new GodrayFilter()];

    this.playScene.addChild(parallaxMap);
    this.objectList.push(parallaxMap);

    this.player = new Player();
    this.player.setDamage(this.playerDamage);
    this.player.setMaxHealth(this.playerMaxHealth);
    this.player.addToScore(this.playerPoints);
    this.playScene.addChild(this.player);

    const scoreStyle = new PIXI.TextStyle({
      fontFamily: 'Futura',
      fontSize: 120,
      fill: 'white',
    });
    this.scoreCountText = new PIXI.Text(this.player.getTotalScore().toString(), scoreStyle);
    this.scoreCountText.x = 100;
    this.scoreCountText.y = 100;
    this.playScene.addChild(this.scoreCountText);

    this.player.onDeadEvent = () => {
      this.backgroundMusic.get().stop();
      new Sound('assets/sounds/game_over.mp3', { volume: 4 }).get().play();
      this.switchToGameOver();
    };

    this.player.create();
    this.objectList.push(this.player);
  }

  private switchToGameOver(): void {
    this.playScene.visible = false;
    this.upgradeScene.visible = false;
    this.gameOverScene.visible = true;
    this.appStage = this.gameOver;
  }

  private swithToUpgradeScene(): void {
    this.playScene.visible = false;
    this.upgradeScene.visible = true;
    this.gameOverScene.visible = false;

    this.playerPoints = this.player.getTotalScore();
    this.healthUpgradeCost = this.player.getMaxHealth() * 5;
    this.ramDamageUpgradeCost = this.player.getDamage() * 5;
    this.weaponUpgradeCost = this.weaponDamage * 10;

    this.playerPointsText.text = `Player points: ${this.playerPoints.toString()}`;
    this.currentHealthText.text = this.healthUpgradeCost.toString();
    this.upgradeRamDamageCostText.text = this.ramDamageUpgradeCost.toString();
    this.upgradeWeaponDamageCostText.text = this.weaponUpgradeCost.toString();

    this.appStage = this.upgrade;
  }

  private switchToPlayScene(): void {
    this.resetPlayScene();
    this.playScene.visible = true;
    this.upgradeScene.visible = false;
    this.gameOverScene.visible = false;
    this.mainMenuScene.visible = false;
    this.backgroundMusic.get().play();
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
