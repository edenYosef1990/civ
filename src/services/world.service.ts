import {
  EffectsDependencies,
  singletonContainer,
} from "../singleton-container";
import * as Actions from "../stateManagment/actions";
import { SoldierUnit } from "../soldier.unit";
import { GlobalState } from "../stateManagment/global-state";
import { StateAggragator } from "../stateManagment/state-aggragator";
import { WorldEntityBase } from "../types/world-entity-base";
import { WorldMapRef } from "../world-map-ref";
import { uniqIdCounterService } from "./uniqIdCounter.service";
import { GameState } from "../types/game-state";

type unitType = "soldier" | "traveler";
type usageType = "city" | "none";

export class Unit {
  constructor(
    public readonly unitId: number,
    public readonly unitType: unitType,
    public belongToTile: TileInWorld,
    private worldEntityRef: WorldEntityBase
  ) {}

  async moveTo(x: number, y: number) {
    await this.worldEntityRef.moveTo(x, y);
  }

  getPosition(): { col: number; row: number } {
    return { col: this.belongToTile.col, row: this.belongToTile.row };
  }
}

export class TileInWorld {
  usageType: usageType = "none";
  units: Unit[] = [];
  constructor(public readonly col: number, public readonly row: number) {}

  setBelongTo(usageType: usageType) {
    this.usageType = usageType;
  }

  addUnit(unit: Unit) {
    this.units.push(unit);
  }
  removeUnit(unitId: number) {
    const idx = this.units.findIndex((item) => item.unitId === unitId);
    this.units = this.units.slice(idx, 1);
  }
}

export class WorldService {
  tiles: TileInWorld[][]; // first dimension - width , second dimension - height
  units: Unit[] = [];
  worldEntitiesIdCounter: uniqIdCounterService = new uniqIdCounterService();

  constructor(
    width: number,
    height: number,
    private worldEntityRef: WorldMapRef,
    private stateManagmentStore: StateAggragator<GlobalState>
  ) {
    this.tiles = [];
    for (let i = 0; i < width; i++) {
      let tileRow: TileInWorld[] = [];
      for (let j = 0; j < height; j++) {
        let tile = new TileInWorld(i, j);
        tileRow.push(tile);
      }
      this.tiles.push(tileRow);
    }
  }

  getTile(row: number, col: number): TileInWorld {
    return this.tiles[col][row];
  }

  getUnitById(unitId: number): Unit {
    const idx = this.units.findIndex((item) => item.unitId === unitId);
    return this.units[idx];
  }

  addUnit(row: number, col: number) {
    const unitId = this.worldEntitiesIdCounter.getCounter();
    let addedUnit = new SoldierUnit(10, 10, unitId);
    let tile = this.getTile(row, col);
    let unit = new Unit(unitId, "soldier", tile, addedUnit);
    tile.addUnit(unit);

    this.units.push(unit);
    this.worldEntityRef.addWorldEntity(addedUnit);
  }

  async moveUnitToTile(unitId: number, row: number, col: number) {
    let startMovmentState: GameState = "moving";
    let endMovmentState: GameState = "readyForMove";
    this.stateManagmentStore.execute(Actions.setGameState, {
      state: startMovmentState,
    });
    let unit = this.getUnitById(unitId);
    let originalTile = unit.belongToTile;
    let destTile = this.getTile(row, col);

    await unit.moveTo(col * 50, row * 50);
    unit.belongToTile = destTile;

    originalTile.removeUnit(unit.unitId);
    destTile.addUnit(unit);

    this.stateManagmentStore.execute(Actions.setGameState, {
      state: endMovmentState,
    });
  }

  GetUnitInTile(row: number, col: number): Unit | null {
    let tile = this.getTile(row, col);
    return tile.units.length > 0 ? tile.units[0] : null;
  }

  GetUnitMoveRange(unit: Unit): { col: number; row: number }[] {
    let range: { col: number; row: number }[] = [];
    let location = unit.getPosition();
    range.push({ col: location.col + 1, row: location.row });
    range.push({ col: location.col, row: location.row + 1 });
    range.push({ col: location.col - 1, row: location.row });
    range.push({ col: location.col, row: location.row - 1 });
    return range;
  }

  initWorld() {
    this.addUnit(10, 10);
    //this.moveUnitToTile(0, 4, 4);
  }
}
