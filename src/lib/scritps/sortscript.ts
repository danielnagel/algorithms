export class SortScript<T extends Generation | TableGeneration>{

	protected data: number[] = [];
	protected generations: T[] = [];
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

	getGenerations(): T[] {
		return this.generations;
	}

	sortAlgorithm() {
		// add custom logic
	}
    
	sortData(data?: number[]): T[] {
		if (this.data.length === 0 && (!data || data.length === 0))
			throw Error('There is no data available!');
		return this.generations;
	}

	addStateToGenerations(generations: T[]): AnimationGeneration<T>[] {
		const AnimationGenerations: AnimationGeneration<T>[] = [];
		generations.forEach((gen) => {
			AnimationGenerations.push({
				state: 'update-selection',
				...gen
			});
		});
		return AnimationGenerations;
	}
}