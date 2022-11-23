import { Effects } from "./effects";
import { StateManagmentStore, ISelector } from "./state-managment";

export class StateAggragator<T extends object, K> {
  constructor(
    private store: StateManagmentStore<T>,
    private effects: Effects<K>
  ) {}

  execute(actionName: string, params: any): void {
    let actions = this.effects.execute(actionName, params);
    for (let action of actions) {
      this.store.execute(action.actionName, action.params);
    }
  }

  getSelector(selector: ISelector<T>): ISelector<T> {
    return this.store.getSelector(selector);
  }
}
