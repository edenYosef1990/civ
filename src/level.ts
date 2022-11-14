import { Actor, Engine, Scene, SceneActivationContext } from "excalibur";
import { WorldMap } from "./world-map";
import { GameWindow } from "./windows";
import { GlobalState, ControlState } from "./stateManagment/global-state";
import { Selector } from "./stateManagment/state-managment";
import { singletonContainer } from "./singleton-container";
export class Level extends Scene {
  saveState() {}

  private worldMap: WorldMap | null = null;
  private gameWindow: GameWindow | null = null;
  selector: Selector<GlobalState, ControlState>;
  controlState: ControlState = "world";

  constructor() {
    super();
    const globalStateAggr = singletonContainer.stateManagmentStore;
    let controlStateSelector = globalStateAggr.getSelector(
      new Selector<GlobalState, ControlState>(
        (globalState) => globalState.controlState
      )
    );
    this.selector = controlStateSelector as Selector<GlobalState, ControlState>;
  }

  onInitialize(_engine: Engine): void {
    this.worldMap = new WorldMap(10, 10);
    this.add(this.worldMap);
    this.gameWindow = new GameWindow(100, 50, 4);
    this.add(this.gameWindow);
    _engine.input.pointers.primary.on("up", this.onMouseUp);
  }

  onPostpdate(_engine: Engine, _delta: number): void {
    const res = this.selector.savedValue;
    if (res === null) return;
    this.controlState = res.changedValue;

    if (res.changedValue === "window") {
      this.gameWindow = new GameWindow(100, 50, 4);
      this.add(this.gameWindow);
    }
  }

  onMouseUp = (evt: any): void => {
    const pointerEvent: PointerEvent = evt as PointerEvent;
    if (this.controlState === "world") this.worldMap?.onMouseup(pointerEvent);
  };

  public onActivate(_context: SceneActivationContext<unknown>): void {}
  public onDeactivate(_context: SceneActivationContext<undefined>): void {
    this.saveState();
  }
}
