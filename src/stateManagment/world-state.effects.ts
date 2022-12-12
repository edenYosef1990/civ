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
	    console.log("move unit");
            return [
              createActionToDispatch(Actions.moveUnit, { row: data.row, col: data.col, }), ];
          } else if (unitInTile === null) {
		  console.log("click on nothing!");
            return [ createActionToDispatch(Actions.selectUnit, { unitId: null }), ];
          } else if (unitInTile.unitId !== currState.selectedUnit) {
	    console.log("select unit");
            return [ createActionToDispatch(Actions.selectUnit, { unitId: unitInTile.unitId, }), ];
          }
	  console.log("nothing");
          return [];
        }
      ),

      onEffect(Actions.moveUnit, (data: { col: number , row: number}, context) => {
        let currState = context.store.getCurrentState();
	if(currState.selectedUnit === null) return [];
        context.worldService.moveUnitToTile(currState.selectedUnit,data.row, data.col);

        return [ createActionToDispatch(Actions.selectMoveRange, { moveRange: null}),
	 createActionToDispatch(Actions.selectUnit, { unitId: null }) ];
      }),

      onEffect(Actions.selectUnit, (data: { unitId: number | null }, context) => {
        if(data.unitId === null) {
		return [ createActionToDispatch(Actions.selectMoveRange, { moveRange: null}),
		];
	}
        let unit = context.worldService.getUnitById(data.unitId);
        const moveRange = context.worldService.GetUnitMoveRange(unit);
        return [ createActionToDispatch(Actions.selectMoveRange, { moveRange: moveRange })];
      })

      ,
    ];
    return effects;
  }
}
