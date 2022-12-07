import { Effects, onEffect } from "./effects";
import { StateAggragator } from "./state-aggragator";
import { StateManagmentStore, on } from "./state-managment";
import { WorldService } from "../services/world.service";
import * as Actions from "./world-state.actions";
import { WorldStateEffects } from "./world-state.effects";

export type WorldEffectsDependencies = {
  store: StateAggragator<WorldState>;
  worldService: WorldService;
};

export type WorldStateEnum = "" | "window";

export type WorldState = {
  movementRangeTiles: { col: number; row: number }[] | null;
  selectedUnit: number | null;
  selectedTileX: number | null;
  selectedTileY: number | null;
};

function tileInRangeTiles(
  col: number,
  row: number,
  tileInRangeTiles: { col: number; row: number }[] | null
): boolean {
  if (tileInRangeTiles === null) return false;
  return tileInRangeTiles.some((tile) => tile.row === row && tile.col === col);
}

function createActionToDispatch(
  actionName: string,
  params: any
): { actionName: string; params: any } {
  return { actionName: actionName, params: params };
}

export function createWorldEffects(
  effectsDependencies: WorldEffectsDependencies
): Effects<WorldEffectsDependencies> {
  return new Effects(effectsDependencies, ...WorldStateEffects.getEffects());
}

export function createWorldStateAggr<T>(): StateAggragator<WorldState> {
  const worldStateReducer: StateManagmentStore<WorldState> =
    new StateManagmentStore<WorldState>(
      {
        movementRangeTiles: null,
        selectedUnit: null,
        selectedTileX: null,
        selectedTileY: null,
      },
      on(
        Actions.selectMoveRange,
        (data: { moveRange: { col: number; row: number }[] }, state) => ({
          ...state,
          movementRangeTiles: data.moveRange,
        })
      ),
      on(Actions.selectUnit, (data: { unitId: number }, state) => ({
        ...state,
        selectedUnit: data.unitId,
      }))
    );
  return new StateAggragator<WorldState>(worldStateReducer);
}
