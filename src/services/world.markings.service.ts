import { WorldMapMarkingsRef } from "../world-map-markings-ref";

export class WorldMarkingsService {
  constructor(private worldMapMarkingsRef: WorldMapMarkingsRef) {}

  markInRange(coords: {col: number, row: number}[]) {
    this.worldMapMarkingsRef.markInRange(coords);
  }

  unmarkInRange(coords: {col: number, row: number}[]) {
    this.worldMapMarkingsRef.unmarkInRange(coords);
  }
}
