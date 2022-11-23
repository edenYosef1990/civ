import { SoldierUnit } from "../soldier.unit";
import { WorldMap } from "../world-map";

type unitType = "soldier" | "traveler";
type usageType = "city" | "none";

export class Unit {
  constructor(
    public readonly unitId: number,
    public readonly unitType: unitType,
    public belongToTile: TileInWorld
  ) {}
}

export class TileInWorld {
  usageType: usageType = "none";
  units: Unit[] = [];
  constructor(private col: number, private row: number) {}

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
  tiles: TileInWorld[][];
  units: Unit[] = [];

  constructor(width: number, height: number, private worldEntityRef: WorldMap) {
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

  getTile(x: number, y: number): TileInWorld {
    return this.tiles[x][y];
  }

  getUnitById(unitId: number) {
    const idx = this.units.findIndex((item) => item.unitId === unitId);
    return this.units[idx];
  }

  moveUnitToTile(unitId: number, row: number, col: number) {
    let unit = this.getUnitById(unitId);
    let originalTile = unit.belongToTile;
    let destTile = this.getTile(row, col);
    unit.belongToTile = destTile;

    originalTile.removeUnit(unit.unitId);
  }

  initWorld() {
    this.worldEntityRef.addChild(new SoldierUnit(10, 10));
  }
}
