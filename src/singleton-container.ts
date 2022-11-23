import { WindowsService } from "./services/windows.service";
import { WorldService } from "./services/world.service";
import {
  createGlobalStateAggr,
  GlobalState,
} from "./stateManagment/global-state";
import { StateAggragator } from "./stateManagment/state-aggragator";
import { windowType } from "./types/window-type";
import { WorldMap } from "./world-map";

export interface gameState {
  selectedTile: number | null;
  windowType: windowType;
}

export type EffectsDependencies = {
  worldService: WorldService;
};

export type GlobalContainer = {
  stateManagmentStore: StateAggragator<GlobalState, EffectsDependencies>;
};

export function createSingletonContainer(
  worldService: WorldMap
): GlobalContainer {
  let effectsDependencies: EffectsDependencies = {
    worldService: new WorldService(20, 15, worldService),
  };
  return {
    stateManagmentStore: createGlobalStateAggr(effectsDependencies),
  };
}

export class Container {
  private _container: GlobalContainer | null = null;
  public get container(): GlobalContainer {
    if (this._container === null) throw new Error("container not initalized!");
    return this._container;
  }

  InitContainer(worldMap: WorldMap) {
    this._container = createSingletonContainer(worldMap);
  }
}

export const singletonContainer: Container = new Container();
