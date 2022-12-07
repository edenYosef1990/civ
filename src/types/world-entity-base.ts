import * as ex from "excalibur";
import { WorldEntityComponent } from "../components/world-entity.component";

export class WorldEntityBase extends ex.Actor {
  constructor(actorArgs: ex.ActorArgs, worldId: number) {
    super(actorArgs);
    this.addComponent(new WorldEntityComponent());
  }

  async moveTo(x: number, y: number) {
    return this.actions.moveTo(new ex.Vector(x, y), 30).toPromise();
  }
}
