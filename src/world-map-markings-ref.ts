import * as ex from "excalibur";
import { Engine } from "excalibur";
import { TileMarkings } from "./markings-tile";
import { singletonContainer } from "./singleton-container";
import { StateAggragator } from "./stateManagment/state-aggragator";
import { Selector } from "./stateManagment/state-managment";
import { WorldState } from "./stateManagment/world-state";

function getSelector<T>(
  callback: (globalState: WorldState) => T
): Selector<WorldState, T> {
  const globalStateAggr = singletonContainer.container.worldStateStore;
  return globalStateAggr.getSelector(new Selector(callback)) as Selector<
    WorldState,
    T
  >;
}
export class WorldMapMarkingsRef extends ex.Actor {
  mapTileMarkings: TileMarkings[][] = [];
  readonly tileSize: number = 50;
  stateAggragator: StateAggragator<WorldState> | null = null;

  movementRangeTilesSelector: Selector<
    WorldState,
    { col: number; row: number }[] | null
  >;

  moveRangeTilesSelected: { col: number; row: number }[] = [];

  constructor(
    private cols: number,
    private rows: number,
    private layerNumber: number
  ) {
    super({ pos: ex.vec(0, 0), width: 1000, height: 1000 });
    this.movementRangeTilesSelector = getSelector(
      (globalState) => globalState.movementRangeTiles
    );
  }

  override onInitialize() {
    for (let i = 0; i < this.rows; i++) {
      let tilesInRow: TileMarkings[] = [];
      for (let j = 0; j < this.cols; j++) {
        let tile = new TileMarkings(
          {
            name: `tile markings ${i},${j} `,
            pos: ex.vec(i * this.tileSize, j * this.tileSize),
            width: this.tileSize,
            height: this.tileSize,
          },
          i,
          j,
          this.layerNumber
        );
        this.addChild(tile);
        tilesInRow.push(tile);
      }
      this.mapTileMarkings.push(tilesInRow);
    }
  }

  override onPostUpdate(_engine: Engine, _delta: number) {
    const newMoveRangeTiles = this.movementRangeTilesSelector.savedValue;
    if (newMoveRangeTiles === null) return;

    this.unmarkInRange(this.moveRangeTilesSelected);
    this.moveRangeTilesSelected = [];
    if (newMoveRangeTiles.changedValue !== null) {
      this.markInRange(newMoveRangeTiles.changedValue);
      this.moveRangeTilesSelected = newMoveRangeTiles.changedValue;
    }
  }

  private markInRange(coords: { col: number; row: number }[]) {
    for (let coord of coords) {
      this.mapTileMarkings[coord.row][coord.col].markInRange();
    }
  }

  private unmarkInRange(coords: { col: number; row: number }[]) {
    for (let coord of coords) {
      this.mapTileMarkings[coord.row][coord.col].unmarkInRange();
    }
  }
}
