import { Unit, WorldService } from "../services/world.service";

export class SightTile {
  enemyUnit: Unit | null;

  constructor(public readonly col: number, public readonly row: number) {
    this.enemyUnit = null;
  }
}

export class AISightService {
  sightMap: SightTile[][];

  constructor(private worldService: WorldService) {
    let sightTiles: SightTile[][] = [];
    for (let i = 0; i < worldService.width; i++) {
      let tilesInRow: SightTile[] = [];
      for (let j = 0; j < worldService.height; j++) {
        tilesInRow.push(new SightTile(i, j));
      }
      sightTiles.push(tilesInRow);
    }
    this.sightMap = sightTiles;
  }

  getEnemysInSight(): Unit[] {
    let unitsDiscoverd = [];
    for (let row of this.sightMap) {
      for (let tile of row) {
        if (tile.enemyUnit === null) continue;
        unitsDiscoverd.push(tile.enemyUnit);
      }
    }
    return unitsDiscoverd;
  }
}

export class AIService {
  sight: AISightService;

  constructor(worldService: WorldService) {
    this.sight = new AISightService(worldService);
  }

  doTurn() {
    let unitsDiscoverd = this.sight.getEnemysInSight();
  }
}
