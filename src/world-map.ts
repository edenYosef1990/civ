import * as ex from "excalibur";
import * as Actions from "./stateManagment/actions";
import { spriteSheet, mapTypeToIndexes, TileType } from "./resources";
import { EffectsDependencies, singletonContainer } from "./singleton-container";
import { GlobalState } from "./stateManagment/global-state";
import { StateAggragator } from "./stateManagment/state-aggragator";
import { WorldEntityBase } from "./types/world-entity-base";

export class Tile extends WorldEntityBase {
  stateAggragator: StateAggragator<GlobalState, EffectsDependencies> | null =
    null;
  readonly tileSize: number = 50;

  constructor(
    args: ex.ActorArgs,
    private tileType: TileType,
    public readonly row: number,
    public readonly col: number,
    public worldId: number
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
    this.selectedMark.destSize = {
      width: this.tileSize,
      height: this.tileSize,
    };
    sprite.destSize = { width: this.tileSize, height: this.tileSize };
    this.stateAggragator = singletonContainer.container.stateManagmentStore;

    this.on("pointerup", () => {
      this.stateAggragator?.execute(Actions.selectTileAction, {
        x: this.col, y: this.row,
      });
    });
    this.on("pointerenter", () => this.graphics.add(this.selectedMark!));
    this.on("pointerleave", () => this.graphics.hide(this.selectedMark!));
  }

  onEnter() {
    this.graphics.add(this.selectedMark!);
  }

  onLeave() {
    this.graphics.hide(this.selectedMark!);
  }

  selectedMark: ex.Sprite | null = null;
}

export class WorldMap extends ex.Actor {
  hoveredTile: { x: number; y: number } | null = null;
  mapTiles: Tile[][] = [];
  stateAggragator: StateAggragator<GlobalState, EffectsDependencies> | null =
    null;
  readonly tileSize: number = 50;

  onInitialize() {
    this.stateAggragator = singletonContainer.container.stateManagmentStore;
    this.mapTiles = [];
    let idCounter = 0;
    for (let i = 0; i < this.rows; i++) {
      let tilesInRow: Tile[] = [];
      for (let j = 0; j < this.cols; j++) {
        let tile = new Tile(
          {
            name: `tile ${i},${j} `,
            pos: ex.vec(i * this.tileSize, j * this.tileSize),
            width: this.tileSize,
            height: this.tileSize,
          },
          "grass",
          i, j, idCounter++
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
    this.stateAggragator?.execute(Actions.selectTileAction, {
      x: tile.col,
      y: tile.col,
    });
  }

  onMosemove(event: PointerEvent) {
    const x = event.x;
    const y = event.y;
    if (
      this.hoveredTile != null &&
      (this.hoveredTile.x != x / 50 || this.hoveredTile.y != x / 50)
    ) {
      let newTile = this.mapTiles[x / 50][y / 50];
      let oldTile =
        this.mapTiles[this.hoveredTile.x / 50][this.hoveredTile.y / 50];
      oldTile.onLeave();
      newTile.onEnter();
    }
  }
}
