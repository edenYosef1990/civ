export class uniqIdCounterService {
	private currCounter: number = 0;

	getCounter(): number{
		return this.currCounter++;
	}
}
