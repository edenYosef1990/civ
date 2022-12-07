import * as Actions from "./actions";
import { EffectsDependencies } from "../singleton-container";
import { EffectHandler, onEffect } from "./effects";

export class GlobalStateEffects {
  static getEffects(): EffectHandler<EffectsDependencies>[] {
    let effects: EffectHandler<EffectsDependencies>[] = [
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
      ),
      onEffect(
        Actions.clickOnTile,
        (data: { x: number; col: number; row: number }, context) => {
          return [];
        }
      ),
    ];
    return effects;
  }
}
