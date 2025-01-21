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

			this.currentSelectionIndizes = this.currentSelectionIndizes.map(s => s + 1).filter(s => s < this.data.length);
			if (this.currentSelectionIndizes[0] > gap || this.currentSelectionIndizes.length === 1) {
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

	isEqualShellSortGeneration(a: ShellSortGeneration, b: ShellSortGeneration)  {
		// shellsort generation
		if (a.subListSelection !== undefined && b.subListSelection !== undefined) {
			const isSubListSelectionEqual = a.subListSelection[0] === b.subListSelection[0] && a.subListSelection[1] === b.subListSelection[1];
			if (!isSubListSelectionEqual || a.selectionIndizes.length !== b.selectionIndizes.length) return false;
			for (let i = 0; i < a.selectionIndizes.length; i++) {
				if (a.selectionIndizes[i] !== b.selectionIndizes[i]) return false;
			}
			return true;
		}
		// insertionsort generation
		if (a.subListSelection === undefined && b.subListSelection === undefined) {
			return a.selectionIndizes[0] === b.selectionIndizes[0] && a.selectionIndizes[1] === b.selectionIndizes[1];
		}
		return false;
	}

	addStateToGenerations(generations: ShellSortGeneration[]): NewGeneration[] {
		const newGenerations: NewGeneration[] = [];
		generations.forEach((gen, index) => {
			if (index > 0 && this.isEqualShellSortGeneration(generations[index - 1], gen)) {
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
