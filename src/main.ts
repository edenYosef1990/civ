import { Engine, Loader } from "excalibur";
import { Resources } from "./resources";
import { Player } from "./player";
import {Level} from "./level";
import {GameWindow} from "./windows";

class Game extends Engine {
  constructor() {
    super({ width: 800, height: 600 });
  }
  initialize() {
    const loader = new Loader([
      Resources.sheet,
      Resources.Sword,
      Resources.grass,
    ]);
    this.start(loader).then(() => {
      const player = new Player();
      const level = new Level();
      this.add('level1', level);
      this.goToScene("level1");
    });
  }
}

export const game = new Game();
game.initialize();
