export class SortScript implements Script {

	protected data: number[] = [];
	protected generations: Generation[] = [];
	protected currentSelectionIndizes: number[] = [];

	constructor(data: number[]) {
		this.data = data;
	}

	getData(): number[] {
		return this.data;
	}

	getSelectionIndizes(): number[] {
		return this.currentSelectionIndizes;
	}

	setSelectionIndizes(selection: number[]): void {
		this.currentSelectionIndizes = selection;
	}

	getGenerations(): Generation[] {
		return this.generations;
	}

	sortAlgorithm() {
		// add custom logic
	}
    
	sortData(data?: number[]): Generation[] {
		if (this.data.length === 0 && (!data || data.length === 0))
			throw Error('There is no data available!');

		// always sort data
		if (this.generations.length) this.generations = [];
		if (data) this.data = [...data];

		// initialize first generations
		this.generations.push({
			data: [...this.data],
			selectionIndizes: [] 
		});
		this.currentSelectionIndizes = [0, 1];
		this.generations.push({
			data: [...this.data],
			selectionIndizes: [...this.currentSelectionIndizes] 
		});

		while (this.currentSelectionIndizes.length) {	
			this.sortAlgorithm();
			this.generations.push({
				data: [...this.data],
				selectionIndizes: [...this.currentSelectionIndizes] 
			});
		}
		return this.generations;
	}

	addStateToGenerations(generations: Generation[]): NewGeneration[] {
		const newGenerations: NewGeneration[] = [];
		generations.forEach((gen, index) => {
			if (
				index > 0 &&
				generations[index - 1].selectionIndizes[0] === gen.selectionIndizes[0] &&
				generations[index - 1].selectionIndizes[1] === gen.selectionIndizes[1]
			) {
				newGenerations.push({
					state: 'swap-selection',
					...gen
				});
			}
			newGenerations.push({
				state: 'update-selection',
				...gen
			});
		});
		return newGenerations;
	}
}