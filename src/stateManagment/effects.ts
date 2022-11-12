import {IStateManagmentStore} from './state-managment';

export type EffectHandler<T> = (
  actionName: string,
  params: any,
  context: T
) => { actionName: string; params: any };

export class Effects<T> {
  effectHandlers: EffectHandler<T>[];
  constructor(
    private store: IStateManagmentStore,
    private context: T,
    ...effectHandlers: EffectHandler<T>[]
  ) {
    this.effectHandlers = effectHandlers;
  }

  execute(actionName: string, params: any) {
    for (let effectHandler of this.effectHandlers) {
      let res = effectHandler(actionName, params, this.context);
      if (res === null) continue;
      else {
        const newState = res;
        this.store.execute(res.actionName, res.params);
      }
    }
  }
}
