import * as ex from "excalibur";
import { WorldEntityComponent } from "../components/world-entity.component";
import { singletonContainer } from "../singleton-container";
import { GlobalState, ControlState } from "../stateManagment/global-state";
import { stateAggragator } from "../stateManagment/state-aggragator";
import { Selector } from "../stateManagment/state-managment";

export class WorldEntitiesSystem extends ex.System<WorldEntityComponent> {
  public readonly types = ["worldEntity"] as const;
  public systemType: ex.SystemType = ex.SystemType.Update;
  private globalStateAggr: stateAggragator<GlobalState, object>;
  private selector: Selector<GlobalState, ControlState>;

  constructor() {
    super();
    this.globalStateAggr = singletonContainer.stateManagmentStore;
    let controlStateSelector = this.globalStateAggr.getSelector(
      new Selector<GlobalState, ControlState>(
        (globalState) => globalState.controlState
      )
    );
    this.selector = controlStateSelector as Selector<GlobalState, ControlState>;
  }
  public update(entities: ex.Entity[], delta: number) {
    let newControlValue = this.selector.savedValue;
    if (newControlValue !== null) {
      if (newControlValue.changedValue === "world") {
        entities.forEach((entity) =>
          (entity as ex.Actor).eventDispatcher.clear()
        );
      } else if (newControlValue.changedValue === "window") {
      }
    }
  }
}
