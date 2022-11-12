import * as ex from 'excalibur';


export class WorldEntityComponent extends ex.Component<'worldEntity'> {
	public readonly type = 'worldEntity';
	constructor(){
		super();
	}
}
