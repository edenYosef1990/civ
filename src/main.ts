import { Engine, Loader } from "excalibur";
import { Resources } from "./resources";
import { Player } from "./player";
import { Level } from "./level";
import { WorldMap } from "./world-map";
import { singletonContainer } from "./singleton-container";

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
    ]);
    await this.start(loader);
    const player = new Player();
    const world = new WorldMap(20, 15);
    singletonContainer.InitContainer(world);
    const level = new Level(world);
    level.add(world);
    this.add("level1", level);
    this.goToScene("level1");
  }

}

export const game = new Game();
game.initializeAsync();
