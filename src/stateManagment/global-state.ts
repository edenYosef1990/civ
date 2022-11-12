import { Effects } from "./effects";
import { stateAggragator } from "./state-aggragator";
import { StateManagmentStore, on } from "./state-managment";

export type ControlState = "world" | "window";

export type GlobalState = {
  controlState: ControlState;
  selectedTile: number | null;
};

export function createGlobalStateAggr(): stateAggragator<GlobalState, object> {
  const worldStateReducer: StateManagmentStore<GlobalState> =
    new StateManagmentStore<GlobalState>({
      controlState: "world",
      selectedTile: null,
    });
  on("changeToTileWindow", (data: { selectedTile: number }, state) => ({
    ...state,
    selectedTile: data.selectedTile,
  }));
  const effects: Effects<object> = new Effects(worldStateReducer, {});
  return new stateAggragator<GlobalState, object>(worldStateReducer, effects);
}
