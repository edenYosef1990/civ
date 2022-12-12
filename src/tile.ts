import * as ex from "excalibur";
import * as Actions from "./stateManagment/actions";
import { spriteSheet, mapTypeToIndexes, TileType, TerrainSpriteSheet} from "./resources";
import { singletonContainer } from "./singleton-container";
import {GlobalState} from "./stateManagment/global-state";
import {StateAggragator} from "./stateManagment/state-aggragator";
import {WorldEntityBase} from "./types/world-entity-base";
import {WorldState} from "./stateManagment/world-state";

export class Tile extends WorldEntityBase{
  stateAggragator: StateAggragator<GlobalState> | null =
    null;
  worldStateAggragator: StateAggragator<WorldState> | null =
    null;
  readonly tileSize: number = 50;

  constructor(
    args: ex.ActorArgs,
    private tileType: TileType,
    public readonly row: number,
    public readonly col: number,
    public worldId: number
  ) {
    super(args,worldId);
  }

  onInitialize() {
    const indexes = mapTypeToIndexes(this.tileType);
    const selectedIndexes = mapTypeToIndexes("selectSquare");
    //const sprite = spriteSheet.getSprite(indexes.col, indexes.row);
    const sprite = TerrainSpriteSheet.getSprite(0,0);
    this.selectedMark = spriteSheet.getSprite(
      selectedIndexes.col,
      selectedIndexes.row
    );
    if (sprite === null || this.selectedMark === null) return;
    this.graphics.add(sprite);
    this.selectedMark.destSize = {
      width: this.tileSize,
      height: this.tileSize,
    };
    sprite.destSize = { width: this.tileSize, height: this.tileSize };
    this.stateAggragator = singletonContainer.container.globalStateStore;
    this.worldStateAggragator = singletonContainer.container.worldStateStore;

    this.on("pointerup", () => {
      //this.stateAggragator?.execute(Actions.selectTileAction, {
      //  x: this.col, y: this.row,
      //});
      this.worldStateAggragator?.execute(Actions.clickOnTile, {
        col: this.col, row: this.row,
      });
    });
    this.on("pointerenter", () => this.graphics.add(this.selectedMark!));
    this.on("pointerleave", () => this.graphics.hide(this.selectedMark!));
  }

  onEnter() {
    this.graphics.add(this.selectedMark!);
  }

  onLeave() {
    this.graphics.hide(this.selectedMark!);
  }

  selectedMark: ex.Sprite | null = null;
}
