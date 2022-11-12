export type EventHandler<T extends object> = (
  actionName: string,
  params: any,
  currentState: T
) => T | null;

export function on<T extends object>(
  matchingActionName: string,
  eventHandler: (params: any, currentState: T) => T
): EventHandler<T> {
  return (actionName: string, params: any, currentState: T) => {
    if (actionName !== matchingActionName) return null;
    return eventHandler(params, currentState);
  };
}

export interface ISelector<T> {
  tryUpdate(currState: T, newState: T): void;
  setLoopIterationComplete(): void;
}

export class Selector<T, K> implements ISelector<T> {
  private _savedValue: { changedValue: K } | null = null;
  public get savedValue(): { changedValue: K } | null {
    if (this._savedValue == null || this.isLoopIterCompleted) return null;
    const savedValue = this.savedValue;
    this.isLoopIterCompleted = false;
    this._savedValue = null;
    return savedValue;
  }
  isLoopIterCompleted: boolean = false;
  constructor(private selectObserveredProperty: (state: T) => K) {}

  tryUpdate(currState: T, newState: T) {
    let currProperty = this.selectObserveredProperty(currState);
    let newProperty = this.selectObserveredProperty(newState);
    if (currProperty === newProperty) return;
    this._savedValue = { changedValue: newProperty };
  }

  setLoopIterationComplete() {
    this.isLoopIterCompleted = true;
  }
}



export interface IStateManagmentStore {
  execute(actionName: string, params: any): void;
}

export class StateManagmentStore<T extends object>
  implements IStateManagmentStore
{
  currentState: T;
  eventHandlers: EventHandler<T>[];
  selectors: ISelector<T>[];

  constructor(initState: T, ...eventHandlers: EventHandler<T>[]) {
    this.currentState = initState;
    this.eventHandlers = eventHandlers;
    this.selectors = [];
  }

  execute(actionName: string, params: any) {
    for (let eventHandler of this.eventHandlers) {
      let res = eventHandler(actionName, params, this.currentState);
      if (res === null) continue;
      else {
        const newState = res;
        for (let selector of this.selectors) {
          selector.tryUpdate(this.currentState, newState);
        }
        this.currentState = newState;
        return;
      }
    }
  }

  getSelector(selector: ISelector<T>) : ISelector<T>{
    this.selectors.push(selector);
    return selector
  }

  setLoopIterationComplete() {
    for (let selector of this.selectors) {
      selector.setLoopIterationComplete();
    }
  }
}
