import * as ex from 'excalibur';
import {WorldEntityComponent} from '../components/world-entity.component';

export class WorldEntityBase extends ex.Actor {
	constructor(actorArgs: ex.ActorArgs) {
		super(actorArgs);
		this.addComponent(new WorldEntityComponent());
	}
}
