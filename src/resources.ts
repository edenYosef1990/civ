import { ImageSource } from "excalibur";
import sword from "./images/sword.png"; // for parcelv2 this is configured in the .parcelrc
import sheet from "./images/sheet.png";
import grass from "./images/RectangleGrass.png";
import * as ex from "excalibur";

let Resources = {
  Sword: new ImageSource(sword),
  grass: new ImageSource(grass),
  sheet: new ImageSource(sheet),
};

const spriteSheet = ex.SpriteSheet.fromImageSource({
  image: Resources.sheet,
  grid: {
    rows: 5,
    columns: 5,
    spriteHeight: 200,
    spriteWidth: 200,
  },
  spacing: {
    margin: {
      x: 0,
      y: 0,
    },
  },
});

export type TileType =
  | "grass"
  | "darkGrass"
  | "grey"
  | "darkGrey"
  | "sand"
  | "darkSand"
  | "selectSquare"
  | "cancelSquare";

export function mapTypeToIndexes(tileType: TileType): {
  row: number;
  col: number;
} {
  switch (tileType) {
    case "grass":
      return { row: 0, col: 0 };
    case "darkGrass":
      return { row: 0, col: 1 };
    case "grey":
      return { row: 0, col: 2 };
    case "darkGrey":
      return { row: 0, col: 3 };
    case "selectSquare":
      return { row: 0, col: 4 };
    case "sand":
      return { row: 1, col: 0 };
    case "darkSand":
      return { row: 1, col: 1 };
    case "cancelSquare":
      return { row: 1, col: 4 };
    default:
      return { row: 0, col: 4 };
  }
}

export { Resources, spriteSheet };