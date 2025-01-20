import {
	InsertionSort 
} from './insertionsort';
import {
	SortScript 
} from './sortscript';

export class ShellSort extends SortScript {

	protected generations: ShellSortGeneration[] = [];
    
	// TODO: refactor
	sortData(data?: number[]): ShellSortGeneration[] {
		if (this.data.length === 0 && (!data || data.length === 0))
			throw Error('There is no data available!');

		// always sort data
		if (this.generations.length) this.generations = [];
		if (data) this.data = [...data];

		// initialize first generations
		let minGapSequence = this.data.length;
		const gapSequences: number[] = [];
		while (minGapSequence > 1) {
			minGapSequence = Math.round(minGapSequence / 2);
			gapSequences.push(minGapSequence);
		}
		this.generations.push({
			data: [...this.data],
			selectionIndizes: [] 
		});


		gapSequences.slice(0,gapSequences.length - 1).forEach(gs => {
			let selectionIndex = 0;
			this.currentSelectionIndizes = [];
			while (selectionIndex < this.data.length) {
				this.currentSelectionIndizes.push(selectionIndex);
				selectionIndex += gs;
			}

			while (this.currentSelectionIndizes.length > 0) {
				// 1. neue Daten aaus den Indizes von currentSelectionIndizes zusammen bauen
				const newDataList = this.currentSelectionIndizes.map(i => this.data[i]);
				const insertionSort = new InsertionSort(newDataList);
				insertionSort.sortData();

				// TODO: 2. transform insertion sort generations from current selection to shell sort generations
				insertionSort.getGenerations().forEach(g => {
					if (!g.selectionIndizes.length) return;
					const newData = [...this.data];
					g.data.forEach((d, index) => {
						newData[this.currentSelectionIndizes[index]] = d;
					});
					this.generations.push({
						selectionIndizes: this.currentSelectionIndizes,
						data: newData,
						subListSelection: g.selectionIndizes
					});
				});


				// 3. currentSelectionIndizes aktualisieren
				this.currentSelectionIndizes = this.currentSelectionIndizes.map(s => s + 1);
				if (this.currentSelectionIndizes[0] === gs) {
					this.currentSelectionIndizes = [];
				}

				// 4. data aktualisieren
				this.data = [...this.generations[this.generations.length - 1].data];
			}
		});
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
