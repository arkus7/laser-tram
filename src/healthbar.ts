import * as PIXI from 'pixi.js';
import { SpriteObject } from './interfaces/spriteObject';

export class HealthBar implements SpriteObject {
    private app: PIXI.Application;
    private healthBar: PIXI.Container & { outer?: PIXI.Graphics;  x?: number; y?: number, moving?: boolean };
    constructor(app) {
      this.app = app;
    }
  
    public async create(x: number, y: number, widthRed: number, widthBlack: number, moving: boolean): Promise<void> {
        this.healthBar = new PIXI.Container();
        this.healthBar.moving = moving;
        this.healthBar.x = x; 
        this.healthBar.y = y;
        this.healthBar.position.set(this.healthBar.x, this.healthBar.y);
        this.app.stage.addChild(this.healthBar);
        
        //Create the black background rectangle
        let innerBar = new PIXI.Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, widthBlack, 30);
        innerBar.endFill();
        this.healthBar.addChild(innerBar);
        
        //Create the front red rectangle
        let outerBar = new PIXI.Graphics();
        outerBar.beginFill(0xFF3300);
        outerBar.drawRect(0, 0, widthRed, 25);
        outerBar.endFill();
        this.healthBar.addChild(outerBar);
        
        this.healthBar.outer = outerBar;
        this.app.stage.addChild(this.healthBar);
    }
    
    public onUpdate = (delta: number): void => {
    
    };
  
    public onMove = (delta: number, newX: number, newY: number): void => {
        if (this.healthBar.moving) {
            this.healthBar.x = newX;
            this.healthBar.y = newY;
        }
    }
    public onChangeHP = (width: number): void => {
        this.healthBar.outer.width = width;
    };

    public onResize = (width: number, height: number): void => {
      this.healthBar.y = height -  this.healthBar.height - 15;
    };

    public onCollision = (object: SpriteObject): void => {
      //
    };
  }
  
