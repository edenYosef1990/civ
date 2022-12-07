import { Effects, IEffects } from "./effects";
import { StateManagmentStore, ISelector } from "./state-managment";

export class StateAggragator<T extends object> {
  constructor(private store: StateManagmentStore<T>) {}

  private effectsAggragator: IEffects[] = [];

  addEffects(effects: IEffects) {
    this.effectsAggragator.push(effects);
  }

  execute(actionName: string, params: any): void {
    for (let effects of this.effectsAggragator) {
      let actions = effects.execute(actionName, params);
      for (let action of actions) {
        this.store.execute(action.actionName, action.params);
      }
    }
  }

  getSelector(selector: ISelector<T>): ISelector<T> {
    return this.store.getSelector(selector);
  }

  getCurrentState(): T {
    return this.store.getCurrentState();
  }
}
