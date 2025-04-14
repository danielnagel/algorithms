import {
	SortScript 
} from './sortscript';

export class GenerationSortScript extends SortScript<Generation> {

	sortData(data?: number[]): Generation[] {
		super.sortData(data);

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

	addStateToGenerations(generations: Generation[]): NewGeneration<Generation>[] {
		const newGenerations: NewGeneration<Generation>[] = [];
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