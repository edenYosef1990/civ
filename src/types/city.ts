import {location} from "./location";
import {worldEntity} from "./world-entity";
import {worldTile} from "./world-tile";

export interface city extends worldEntity {
	centerLocation: location;
	tiles: worldTile[];
}
