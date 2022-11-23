
export class TurnManagmentService{

	unitMoveToBeExecuted: {unitId: number, dest :{x: number,y: number}} | null = null;
	technologyResearchToBeExecuted: string | null = null;


	moveUnit(unitId: number, dest :{x: number,y: number}){
		this.unitMoveToBeExecuted = {unitId: unitId, dest: dest};
	}

	cancelCurrMoveUnit(){this.unitMoveToBeExecuted = null;}
	advanceInTechnologyTree(attrName: string){this.technologyResearchToBeExecuted = attrName}
	endTurn(){}

}
