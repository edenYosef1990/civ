import { EffectHandler, onEffect } from "./effects";
import { WorldEffectsDependencies } from "./world-state";
import * as Actions from "./world-state.actions";

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

export class WorldStateEffects {
  static getEffects(): EffectHandler<WorldEffectsDependencies>[] {
    let effects: EffectHandler<WorldEffectsDependencies>[] = [

      onEffect(
        Actions.clickOnTile,
        (data: { col: number; row: number }, context) => {
          let currState = context.store.getCurrentState();
          const unitInTile = context.worldService.GetUnitInTile( data.row, data.col);

          if ( unitInTile === null && tileInRangeTiles(data.col, data.row, currState.movementRangeTiles)) {
            return [
              createActionToDispatch(Actions.moveUnit, { row: data.row, col: data.col, }), ];
          } else if (unitInTile === null) {
            return [ createActionToDispatch(Actions.selectUnit, { unitId: null }), ];
          } else if (unitInTile.unitId !== currState.selectedUnit) {
            return [ createActionToDispatch(Actions.selectUnit, { unitId: unitInTile.unitId, }), ];
          }
          return [];
        }
      ),

      onEffect(Actions.selectUnit, (data: { unitId: number }, context) => {
        let unit = context.worldService.getUnitById(data.unitId);
        const moveRange = context.worldService.GetUnitMoveRange(unit);
        return [ createActionToDispatch(Actions.selectMoveRange, { moveRange: moveRange })];
      })

      ,
    ];
    return effects;
  }
}
