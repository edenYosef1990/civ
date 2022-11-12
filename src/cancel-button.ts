import * as ex from "excalibur";
import { mapTypeToIndexes, spriteSheet } from "./resources";

export class CancelButton extends ex.ScreenElement {
  constructor(private callback : () => void, zlayer: number) {
    super({
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      z: zlayer
    });
  }

  onInitialize() {
    const indexes = mapTypeToIndexes("cancelSquare");
    let sprite = spriteSheet.getSprite(indexes.col, indexes.row);
    if (sprite === null) return;

    sprite.destSize = { width: 50, height: 50 };
    if (!sprite) throw new Error("no sprite found!");
    this.graphics.add(sprite);

    this.on('pointerup',() => this.callback());
  }
}
