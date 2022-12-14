import { IStateManagmentStore } from "./state-managment";

export type EffectHandler<T> = (
  actionName: string,
  params: any,
  context: T
) => { actionName: string; params: any }[];

export function onEffect<T>(
  matchingActionName: string,
  eventHandler: (
    params: any,
    context: T
  ) => { actionName: string; params: any }[]
): EffectHandler<T> {
  return (actionName: string, params: any, context: T) => {
    if (actionName !== matchingActionName) return [];
    return eventHandler(params, context);
  };
}

export interface IEffects {
  execute(
    actionName: string,
    params: any
  ): { actionName: string; params: any }[];
}

export class Effects<T> implements IEffects {
  effectHandlers: EffectHandler<T>[];
  constructor(private context: T, ...effectHandlers: EffectHandler<T>[]) {
    this.effectHandlers = effectHandlers;
  }

  private getOutputPerAction(actionName: string, params: any) {
    let output: { actionName: string; params: any }[] = [];
    for (let effectHandler of this.effectHandlers) {
      let res = effectHandler(actionName, params, this.context);
      if (res === null) continue;
      else {
        output = [...output, ...res];
      }
    }
    return output;
  }

  execute(
    actionName: string,
    params: any
  ): { actionName: string; params: any }[] {
    let output: { actionName: string; params: any }[] = [
      { actionName: actionName, params: params },
    ];
    let currLayer: { actionName: string; params: any }[] = [
      { actionName: actionName, params: params },
    ];

    while (currLayer.length > 0) {
      let newOutput: { actionName: string; params: any }[] = [];
      for (let action of currLayer) {
        let outputPerAction = this.getOutputPerAction(
          action.actionName,
          action.params
        );
        newOutput = [...newOutput, ...outputPerAction];
      }
      currLayer = newOutput;
      output = [...output, ...currLayer];
    }

    return output;
  }
}
