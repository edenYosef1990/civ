import { Actor, Engine, Scene, SceneActivationContext } from "excalibur";
import { WorldMap } from "./world-map";
import { GameWindow } from "./windows";

export class Level extends Scene {
  saveState() {}

  onInitialize(_engine: Engine): void {
    const worldMap = new WorldMap(10, 10);
    this.add(worldMap);
    const gameWindow = new GameWindow(100, 50,4);
    this.add(gameWindow);
  }

  onPreUpdate(_engine: Engine, _delta: number): void {}

  public onActivate(_context: SceneActivationContext<unknown>): void {}
  public onDeactivate(_context: SceneActivationContext<undefined>): void {
    this.saveState();
  }
}
