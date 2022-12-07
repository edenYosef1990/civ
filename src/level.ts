import layerNumber from "./config/window-config.json";
import { Engine, Scene, SceneActivationContext } from "excalibur";
import { WorldMapRef } from "./world-map-ref";
import { GameWindow } from "./windows/windows";
import { GlobalState, ControlState } from "./stateManagment/global-state";
import { Selector } from "./stateManagment/state-managment";
import { singletonContainer } from "./singleton-container";
import { BlockEventsLayer } from "./blockEventsLayer";
import { UnitOpsWindow } from "./windows/text-window";
import { WindowsCompoisitonUtils } from "./windows/windows-composition.utils";
import * as Actions from "./stateManagment/actions";

export class Level extends Scene {
  saveState() {}

  private gameWindow: GameWindow | null = null;
  private turnWindow: UnitOpsWindow | null = null;
  private unitOpsWindow: UnitOpsWindow | null = null;

  private blockEventsLayer: BlockEventsLayer | null = null;
  controlStateSelector: Selector<GlobalState, ControlState>;
  selectedTileXSelector: Selector<GlobalState, number | null>;
  selectedTileYSelector: Selector<GlobalState, number | null>;

  controlState: ControlState = "world";
  selectedTileX: number | null = null;
  selectedTileY: number | null = null;

  getSelector<T>(
    callback: (globalState: GlobalState) => T
  ): Selector<GlobalState, T> {
    const globalStateAggr = singletonContainer.container.globalStateStore;
    return globalStateAggr.getSelector(
      new Selector(callback)
    ) as Selector<GlobalState, T>;
  }

  constructor(private worldMap: WorldMapRef) {
    super();
    const globalStateAggr = singletonContainer.container;
    this.controlStateSelector = this.getSelector(
      (globalState) => globalState.controlState
    );
    this.selectedTileXSelector = this.getSelector(
      (globalState) => globalState.selectedTileX
    );
    this.selectedTileYSelector = this.getSelector(
      (globalState) => globalState.selectedTileY
    );
  }

  override onInitialize(_engine: Engine): void {
    this.turnWindow = new UnitOpsWindow(
      4, 100, 100, () => {},
      this.engine.drawWidth,
      this.engine.drawHeight,
      "Turn!"
    );
    this.unitOpsWindow = new UnitOpsWindow(
      4, 200, 200, () => {},
      this.engine.drawWidth,
      this.engine.drawHeight,
      "Unit ops"
    );

    this.add(this.turnWindow);
    WindowsCompoisitonUtils.setWindowToLeftOfRightWindow(
      this.unitOpsWindow,
      this.turnWindow,
      10
    );
    this.add(this.unitOpsWindow);

    const globalStateAggr = singletonContainer.container;
    globalStateAggr.globalStateStore.execute(Actions.initWorld, {});
    //this.blockEventsLayer = new BlockEventsLayer(2400, 1500, 4);
    //this.add(this.blockEventsLayer);
    //this.gameWindow = new GameWindow(100, 100, 6, 10, 10, () => {
    //  this.remove(this.blockEventsLayer!);
    // });
    //this.add(this.gameWindow);
    //_engine.input.pointers.primary.on("up", this.onMouseUp);
    //_engine.input.pointers.primary.on("move",this.onMouseMove);
  }

  override onPostUpdate(_engine: Engine, _delta: number): void {
    const newControlState = this.controlStateSelector.savedValue;
    if (newControlState !== null)
      this.controlState = newControlState.changedValue;
    const newSelectedTileX = this.selectedTileXSelector.savedValue;
    if (newSelectedTileX === null) this.selectedTileX = newSelectedTileX;
    const newSelectedTileY = this.selectedTileYSelector.savedValue;
    if (newSelectedTileY === null) this.selectedTileY = newSelectedTileY;

    if (newControlState !== null && newControlState.changedValue === "window") {
      this.gameWindow = new GameWindow(
        100, 50,
        layerNumber.LayerNumbers.window,
        newSelectedTileX!.changedValue!,
        newSelectedTileY!.changedValue!,
        () => {
          this.remove(this.blockEventsLayer!);
        }
      );
      this.add(this.gameWindow);
      this.blockEventsLayer = new BlockEventsLayer(
        this.engine.drawWidth,
        this.engine.drawHeight,
        layerNumber.LayerNumbers.windowBackgroundBlocker
      );
      this.add(this.blockEventsLayer);
    }
    if (
      newControlState !== null &&
      newControlState.changedValue === "world" &&
      this.gameWindow !== null
    ) {
      this.gameWindow.kill();
      this.remove(this.gameWindow);
    }
  }

  onMouseUp = (evt: any): void => {
    const pointerEvent: PointerEvent = evt as PointerEvent;
    if (this.controlState === "world") this.worldMap?.onMouseup(pointerEvent);
  };

  onMouseMove = (evt: any): void => {
    const pointerEvent: PointerEvent = evt as PointerEvent;
    if (this.controlState === "world") this.worldMap?.onMosemove(pointerEvent);
  };

  public onActivate(_context: SceneActivationContext<unknown>): void {}
  public onDeactivate(_context: SceneActivationContext<undefined>): void {
    this.saveState();
  }
}
