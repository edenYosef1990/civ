import {city} from "./city";
import {worldEntity} from "./world-entity";

export interface kingdom extends worldEntity {
	cities: city[];
}
