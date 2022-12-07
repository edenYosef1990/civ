import * as ex from "excalibur";
import {
  spriteSheet,
  mapTypeToIndexes,
  TileType,
  TerrainSpriteSheet,
} from "./resources";

export class TileMarkings extends ex.Actor {
  readonly tileSize: number = 50;
  inRangeMark: ex.Sprite | null = null;

  constructor(
    args: ex.ActorArgs,
    public readonly row: number,
    public readonly col: number,
    public zindex: number
  ) {
    super(args);
  }

  override onInitialize() {
    let tileType: TileType = "cancelSquare";
    const indexes = mapTypeToIndexes(tileType);
    const sprite = spriteSheet.getSprite(indexes.col, indexes.row);
    if (sprite === null) return;
    this.inRangeMark = sprite;
    //this.graphics.add(sprite);
    sprite.destSize = { width: this.tileSize, height: this.tileSize };
  }

  markInRange() {
    if (this.inRangeMark === null)
      throw new Error("sprite for inRangeMarking Failed to upload!");
    this.graphics.add(this.inRangeMark);
  }

  unmarkInRange() {
    if (this.inRangeMark === null)
      throw new Error("sprite for inRangeMarking Failed to upload!");
    this.graphics.hide(this.inRangeMark);
  }
}
