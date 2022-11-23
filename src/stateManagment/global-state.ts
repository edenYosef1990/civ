import { Effects, onEffect } from "./effects";
import { StateAggragator } from "./state-aggragator";
import { StateManagmentStore, on } from "./state-managment";
import * as Actions from "./actions";
import { EffectsDependencies } from "../singleton-container";

export type ControlState = "world" | "window" ;

export type GlobalState = {
  controlState: ControlState;
  selectedTileX: number | null;
  selectedTileY: number | null;
};

export function createGlobalStateAggr<T>(
  effectsDependencies: EffectsDependencies
): StateAggragator<GlobalState, EffectsDependencies> {
  const worldStateReducer: StateManagmentStore<GlobalState> =
    new StateManagmentStore<GlobalState>({
      controlState: "world",
      selectedTileX: null,
      selectedTileY: null,
    },
  on(Actions.selectTileAction, (data: { x: number; y: number }, state) => ({
    ...state,
    controlState: "window",
    selectedTileX: data.x,
    selectedTileY: data.y,
  })));
  const effects: Effects<EffectsDependencies> = new Effects(
    worldStateReducer,
    effectsDependencies,
    onEffect(Actions.initWorld,(params,context) => {
	    context.worldService.initWorld();
	    return null;
    })
    //onEffect(
    //  Actions.selectTileAction,
    //  (params: { x: number; y: number }, context) => {
    //    return { actionName: Actions.selectTileAction, params: params };
    //  }
    //)
  );
  return new StateAggragator<GlobalState, EffectsDependencies>(
    worldStateReducer,
    effects
  );
}
