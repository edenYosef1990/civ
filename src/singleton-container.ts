import {createGlobalStateAggr} from "./stateManagment/global-state";
import { windowType } from "./types/window-type";

export interface gameState {
  selectedTile: number | null;
  windowType: windowType;
}

export const singletonContainer = {
  stateManagmentStore: createGlobalStateAggr(),
};
