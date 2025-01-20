import {
	InsertionSort 
} from './insertionsort';
import {
	SortScript 
} from './sortscript';

export class ShellSort extends SortScript {

	protected generations: ShellSortGeneration[] = [];

	sortGapSequence(gap: number): void {
		// selection list on main data
		let selectionIndex = 0;
		this.currentSelectionIndizes = [];
		while (selectionIndex < this.data.length) {
			this.currentSelectionIndizes.push(selectionIndex);
			selectionIndex += gap;
		}

		while (this.currentSelectionIndizes.length > 0) {
			// create sub list from selection list and main data
			const subList = this.currentSelectionIndizes.map(i => this.data[i]);
			const insertionSort = new InsertionSort(subList);
			insertionSort.sortData();

			// add subListSelection property to every insertion sort generation
			// this way, its possible to see which entries in the sublist where selected
			// and at which position the sublist was.
			insertionSort.getGenerations().forEach(g => {
				// ignore first and last generation
				if (!g.selectionIndizes.length) return;

				// update main data
				const newData = [...this.data];
				g.data.forEach((d, index) => newData[this.currentSelectionIndizes[index]] = d);

				// create shell sort generation object, containing sub list selection property
				this.generations.push({
					selectionIndizes: this.currentSelectionIndizes,
					data: newData,
					subListSelection: g.selectionIndizes
				});
			});

			this.currentSelectionIndizes = this.currentSelectionIndizes.map(s => s + 1);
			if (this.currentSelectionIndizes[0] === gap) {
				this.currentSelectionIndizes = [];
			}
			this.data = [...this.generations[this.generations.length - 1].data];
		}
	}
    
	sortData(data?: number[]): ShellSortGeneration[] {
		if (this.data.length === 0 && (!data || data.length === 0))
			throw Error('There is no data available!');
		if (this.generations.length) this.generations = [];
		if (data) this.data = [...data];

		this.generations.push({
			data: [...this.data],
			selectionIndizes: [] 
		});

		// Shellsort
		const gapSequences: number[] = [];
		let minGapSequence = this.data.length;
		while (minGapSequence > 1) {
			minGapSequence = Math.round(minGapSequence / 2);
			gapSequences.push(minGapSequence);
		}
		gapSequences.slice(0,gapSequences.length - 1).forEach(gs => this.sortGapSequence(gs));
		const insertionSort = new InsertionSort(this.data);
		this.generations.push(...insertionSort.sortData().slice(1));

		return this.generations;
	}

	// TODO: fix
	addStateToGenerations(generations: Generation[]): NewGeneration[] {
		console.log('before');
		console.table(generations);
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
		console.log('after');
		console.table(newGenerations);
		return newGenerations;
	}

}
