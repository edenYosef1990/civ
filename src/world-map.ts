import * as ex from "excalibur";
import { WorldEntityComponent } from "./components/world-entity.component";
import {
  Resources,
  spriteSheet,
  mapTypeToIndexes,
  TileType,
} from "./resources";
import { singletonContainer } from "./singleton-container";
import { GlobalState } from "./stateManagment/global-state";
import { StateAggragator } from "./stateManagment/state-aggragator";
import { StateManagmentStore } from "./stateManagment/state-managment";
import { WorldEntityBase } from "./types/world-entity-base";
export class Tile extends WorldEntityBase {
  constructor(
    args: ex.ActorArgs,
    private tileType: TileType,
    private row: number,
    private col: number,
    public id: number
  ) {
    super(args);
  }

  onInitialize() {
    const indexes = mapTypeToIndexes(this.tileType);
    const selectedIndexes = mapTypeToIndexes("selectSquare");
    const sprite = spriteSheet.getSprite(indexes.col, indexes.row);
    this.selectedMark = spriteSheet.getSprite(
      selectedIndexes.col,
      selectedIndexes.row
    );
    if (sprite === null || this.selectedMark === null) return;
    this.graphics.add(sprite);
    this.selectedMark.destSize = { width: 50, height: 50 };
    sprite.destSize = { width: 50, height: 50 };
    this.on("pointerenter", () => this.graphics.add(this.selectedMark!));
    this.on("pointerleave", () => this.graphics.hide(this.selectedMark!));
  }

  selectedMark: ex.Sprite | null = null;
}

export class WorldMap extends ex.Actor {
  mapTiles: Tile[][] = [];
  stateAggragator: StateAggragator<GlobalState, object> | null = null;

  onInitialize() {
    this.stateAggragator = singletonContainer.stateManagmentStore;
    this.mapTiles = [];
    let idCounter = 0;
    for (let i = 0; i < this.rows; i++) {
      let tilesInRow: Tile[] = [];
      for (let j = 0; j < this.cols; j++) {
        let tile = new Tile(
          {
            name: `tile ${i},${j} `,
            pos: ex.vec(i * 50, j * 50),
            width: 50,
            height: 50,
          },
          "grass",
          i,
          j,
          idCounter++
        );
        this.addChild(tile);
        tilesInRow.push(tile);
      }
      this.mapTiles.push(tilesInRow);
    }
  }

  constructor(private cols: number, private rows: number) {
    super({ pos: ex.vec(0, 0), width: 1000, height: 1000 });
  }

  onMouseup(event: PointerEvent) {
    const x = event.x;
    const y = event.y;
    let tile = this.mapTiles[x / 50][y / 50];
    this.stateAggragator?.execute("selectTile", { selectedTile: tile.id });
  }
}
