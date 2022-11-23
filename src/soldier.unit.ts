import { WorldEntityBase } from "./types/world-entity-base";
import { soldiersSpriteSheet } from "./resources";

export class SoldierUnit extends WorldEntityBase {
  static readonly size = 50;
  constructor(public row: number, public col: number) {
    super({
      x: row * SoldierUnit.size,
      y: col * SoldierUnit.size,
      width: 50,
      height: 50,
      z: 8
    });
    console.log("soldier created");
  }

  override onInitialize(){
    const sprite = soldiersSpriteSheet.getSprite(0,0);
    if(sprite === null) throw new Error("failed to load sprite!");
    this.graphics.add(sprite);
  }
}
