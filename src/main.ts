import { Engine, Loader } from "excalibur";
import { Resources } from "./resources";
import { Player } from "./player";
import { Level } from "./level";
import { WorldMapRef } from "./world-map-ref";
import { singletonContainer } from "./singleton-container";
import {WorldMapMarkingsRef} from "./world-map-markings-ref";
import {LayerNumbers} from "./config/window-config.json"

class Game extends Engine {
  constructor() {
    super({ width: 1200, height: 750 });
  }

  async initializeAsync() {
    const loader = new Loader([
      Resources.sheet,
      Resources.Sword,
      Resources.grass,
      Resources.soldiersSheet,
      Resources.terrain
    ]);
    await this.start(loader);
    const player = new Player();
    const worldMarkings = new WorldMapMarkingsRef(20,15,LayerNumbers.worldMarkings);
    const world = new WorldMapRef(20, 15);
    singletonContainer.InitContainer(world);
    const level = new Level(world);
    level.add(world);
    level.add(worldMarkings);
    this.add("level1", level);
    this.goToScene("level1");
  }

}

export const game = new Game();
game.initializeAsync();
