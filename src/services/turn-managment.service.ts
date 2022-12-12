import {WorldService} from "./world.service";

export class TurnManagmentService{

	currPointLeft: number;

	constructor(){
		this.currPointLeft = 5;
	}

	technologyResearchToBeExecuted: string | null = null;



	advanceInTechnologyTree(attrName: string){this.technologyResearchToBeExecuted = attrName}


	endTurn(){}

}
