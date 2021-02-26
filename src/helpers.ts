import * as PIXI from 'pixi.js';

export const loadSprite = (
  app: PIXI.Application,
  path: string
): Promise<PIXI.Sprite> => {
  return new Promise((resolve) => {
    app.loader.add(path).load(() => {
      resolve(new PIXI.Sprite(app.loader.resources[path].texture));
    });
  });
};

export const loadTilingSprite = (
  app: PIXI.Application,
  path: string
): Promise<PIXI.TilingSprite> => {
  return new Promise((resolve) => {
    app.loader.add(path).load(() => {
      resolve(
        new PIXI.TilingSprite(
          app.loader.resources[path].texture,
          1,
          app.loader.resources[path].texture.height
        )
      );
    });
  });
};
