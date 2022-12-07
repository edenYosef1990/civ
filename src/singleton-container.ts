import { WindowsService } from "./services/windows.service";
import { WorldMarkingsService} from "./services/world.markings.service";
import { WorldService } from "./services/world.service";
import {
  createGlobalEffects,
  createGlobalStateAggr,
  GlobalState,
} from "./stateManagment/global-state";
import { StateAggragator } from "./stateManagment/state-aggragator";
import {
  createWorldEffects,
  createWorldStateAggr,
  WorldEffectsDependencies,
  WorldState,
} from "./stateManagment/world-state";
import { windowType } from "./types/window-type";
import {WorldMapMarkingsRef} from "./world-map-markings-ref";
import { WorldMapRef } from "./world-map-ref";

export interface gameState {
  selectedTile: number | null;
  windowType: windowType;
}

export type EffectsDependencies = {
  worldService: WorldService;
};

export type GlobalContainer = {
  globalStateStore: StateAggragator<GlobalState>;
  worldStateStore: StateAggragator<WorldState>;
};

export function createSingletonContainer(
  worldMapRef: WorldMapRef
): GlobalContainer {
  let stateManagmentStore = createGlobalStateAggr();
  let worldService = new WorldService(20, 15, worldMapRef, stateManagmentStore);
  let effectsDependencies: EffectsDependencies = {
    worldService: worldService,
  };
  stateManagmentStore.addEffects(createGlobalEffects(effectsDependencies));

  let worldStateStore = createWorldStateAggr();
  let WorldEffectsDependencies: WorldEffectsDependencies = {
    store: worldStateStore,
    worldService: worldService};
  worldStateStore.addEffects(createWorldEffects(WorldEffectsDependencies));

  return {
    globalStateStore: stateManagmentStore,
    worldStateStore: worldStateStore,
  };
}

export class Container {
  private _container: GlobalContainer | null = null;
  public get container(): GlobalContainer {
    if (this._container === null) throw new Error("container not initalized!");
    return this._container;
  }

  InitContainer(worldMap: WorldMapRef) {
    this._container = createSingletonContainer(worldMap);
  }
}

export const singletonContainer: Container = new Container();
