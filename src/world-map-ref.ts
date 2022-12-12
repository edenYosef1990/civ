import * as ex from "excalibur";
import * as Actions from "./stateManagment/actions";
import { singletonContainer } from "./singleton-container";
import { GlobalState } from "./stateManagment/global-state";
import { StateAggragator } from "./stateManagment/state-aggragator";
import { WorldEntityBase } from "./types/world-entity-base";
import {Tile} from "./tile";


export class WorldMapRef extends ex.Actor {
  hoveredTile: { x: number; y: number } | null = null;
  mapTiles: Tile[][] = [];
  stateAggragator: StateAggragator<GlobalState> | null =
    null;
  readonly tileSize: number = 50;

  onInitialize() {
    this.stateAggragator = singletonContainer.container.globalStateStore;
    this.mapTiles = [];
    let idCounter = 0;
    for (let i = 0; i < this.rows; i++) {
      let tilesInRow: Tile[] = [];
      for (let j = 0; j < this.cols; j++) {
        let tile = new Tile(
          {
            name: `tile ${i},${j} `,
            pos: ex.vec(j * this.tileSize, i * this.tileSize),
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

  addWorldEntity(worldEntity: WorldEntityBase){
	  worldEntity.z = this.z + 1;
	  this.addChild(worldEntity);
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
