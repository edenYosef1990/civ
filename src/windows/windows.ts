import * as ex from "excalibur";
import { worldTileType } from "../types/world-tile-type";
import { BaseAlign } from "excalibur";
import { CancelButton } from "../cancel-button";

type tileStates = {
  mineralsLeft: number;
  typeOfLand: worldTileType;
};

export class GameWindow extends ex.ScreenElement {
  constructor(
    private xOffset: number,
    private yOffset: number,
    private zLayer: number,
    posXdesc: number,
    posYdesc: number,
    private onKillCallback: () => void
  ) {
    super({
      x: xOffset,
      y: yOffset,
      color: ex.Color.Gray,
      width: 500,
      height: 500,
      z: zLayer,
    });
  }

  onInitialize() {
    this.addChild(
      new CancelButton(() => {
        let callback = this.onKillCallback;
        this.kill();
        callback();
      }, this.zLayer + 1)
    );
    this.addChild(this.generateTitle());
    this.addChild(this.statsToLabel(this.typeStats, 150, 100));
  }

  typeStats: tileStates = {
    mineralsLeft: 0,
    typeOfLand: "land",
  };

  generateTitle(): ex.Label {
    return new ex.Label({
      text: `Tile`,
      pos: ex.vec(150, 0),
      z: this.zLayer + 1,
      font: new ex.Font({
        size: 100,
        color: ex.Color.White,
        baseAlign: BaseAlign.Top,
        shadow: { blur: 20, offset: ex.vec(10, 10), color: ex.Color.Black },
      }),
    });
  }

  statsToLabel(stats: tileStates, x: number, y: number): ex.Label {
   var textToDisplay =
      "minerals left: " +
      `${stats.mineralsLeft}\n` +
      "TypeOfLand: " +
      `${stats.typeOfLand}\n`;
    var label = new ex.Label({
      text: textToDisplay,
      pos: ex.vec(x, y),
      z: this.zLayer,
      font: new ex.Font({
        size: 30,
        color: ex.Color.Red,
        baseAlign: BaseAlign.Top,
        shadow: { blur: 5, offset: ex.vec(5, 5), color: ex.Color.Black },
      }),
    });
    return label;
  }
}
