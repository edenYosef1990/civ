import { ImageSource } from "excalibur";
import sword from "./images/sword.png"; // for parcelv2 this is configured in the .parcelrc
import sheet from "./images/sheet.png";
import terrain from "./images/terrain_5.png";
import grass from "./images/RectangleGrass.png";
import units_blue from "./images/units_blue.png";
import * as ex from "excalibur";

let Resources = {
  Sword: new ImageSource(sword),
  grass: new ImageSource(grass),
  sheet: new ImageSource(sheet),
  terrain: new ImageSource(terrain),
  soldiersSheet: new ImageSource(units_blue),
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

const soldiersSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Resources.soldiersSheet,
  grid: {
    rows: 6,
    columns: 6,
    spriteHeight: 32,
    spriteWidth: 32,
  },
  spacing: {
    margin: {
      x: 0,
      y: 0,
    },
  },
});

const TerrainSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Resources.terrain,
  grid: {
    rows: 10,
    columns: 10,
    spriteHeight: 32,
    spriteWidth: 32,
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

export { Resources, spriteSheet , soldiersSpriteSheet , TerrainSpriteSheet};
