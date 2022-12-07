import { Effects, onEffect } from "./effects";
import { StateAggragator } from "./state-aggragator";
import { StateManagmentStore, on } from "./state-managment";
import * as Actions from "./actions";
import { EffectsDependencies } from "../singleton-container";

export type ControlState = "world" | "window";

export type GlobalState = {
  controlState: ControlState;
  selectedTileX: number | null;
  selectedTileY: number | null;
};

export function createGlobalEffects(
  effectsDependencies: EffectsDependencies
): Effects<EffectsDependencies> {
  return new Effects(
    effectsDependencies,
    onEffect(Actions.initWorld, (_, context) => {
      context.worldService.initWorld();
      return [];
    }),
    onEffect(
      Actions.commandSoldierMove,
      (data: { unitId: number; col: number; row: number }, context) => {
        context.worldService.moveUnitToTile(data.unitId, data.row, data.col);
        return [];
      }
    ),
    onEffect(
      Actions.clickOnTile,
      (data: { unitId: number; col: number; row: number }, context) => {
        context.worldService.moveUnitToTile(data.unitId, data.row, data.col);
        return [];
      }
    )
  );
}

export function createGlobalStateAggr<T>(): StateAggragator< GlobalState > {
  const worldStateReducer: StateManagmentStore<GlobalState> =
    new StateManagmentStore<GlobalState>(
      {
        controlState: "world",
        selectedTileX: null,
        selectedTileY: null,
      },
      on(Actions.selectTileAction, (data: { x: number; y: number }, state) => ({
        ...state,
        controlState: "window",
        selectedTileX: data.x,
        selectedTileY: data.y,
      }))
    );
  return new StateAggragator<GlobalState>(
    worldStateReducer
  );
}
