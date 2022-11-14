import { Effects } from "./effects";
import { StateManagmentStore, ISelector } from "./state-managment";

export class StateAggragator<T extends object, K> {
  constructor(
    private store: StateManagmentStore<T>,
    private effects: Effects<K>
  ) {}

  execute(actionName: string, params: any): void {
    this.store.execute(actionName, params);
    this.effects.execute(actionName, params);
  }

  getSelector(selector: ISelector<T>): ISelector<T> {
    return this.store.getSelector(selector);
  }
}
