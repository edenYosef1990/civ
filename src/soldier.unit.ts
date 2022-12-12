import { WorldEntityBase } from "./types/world-entity-base";
import { soldiersSpriteSheetBlue, soldiersSpriteSheetRed } from "./resources";
import { kingdomType } from "./types/kingdom-type";
import * as ex from "excalibur";

export class SoldierUnit extends WorldEntityBase {
  static readonly size = 50;
  constructor(
    public row: number,
    public col: number,
    soldierId: number,
    private kingdomType: kingdomType
  ) {
    super(
      {
        x: row * SoldierUnit.size,
        y: col * SoldierUnit.size,
        width: 50,
        height: 50,
      },
      soldierId
    );
  }

  override onInitialize() {
    let sprite: ex.Sprite | null = null;
    if (this.kingdomType === "me") {
      sprite = soldiersSpriteSheetBlue.getSprite(0, 0);
    } else {
      sprite = soldiersSpriteSheetRed.getSprite(0, 0);
    }
    if (sprite === null) throw new Error("failed to load sprite!");
    this.graphics.add(sprite);
  }
}
