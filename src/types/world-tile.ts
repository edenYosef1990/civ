import {location} from "./location";
import {worldTileType} from "./world-tile-type";

export interface worldTile {
	location: location,
	tile: worldTileType 
}
