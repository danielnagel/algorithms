import {
	TableGenerationSortScript 
} from './tablegenerationsortscript';

export class CountingSort extends TableGenerationSortScript {

	sortAlgorithm(): void {
		const max = Math.max(...this.data);
		const count = new Array(max + 1).fill(0);
		const output = new Array(this.data.length).fill(undefined);

		this.generations.push({
			initialTable: {
				data: [...this.data],
				selectionIndex: -1
			},
			countTable: {
				data: [...count],
				selectionIndex: -1
			},
			resultTable: {
				data: [...output],
				selectionIndex: -1
			},
		});

		for (let i = 0; i < this.data.length; i++) {
			count[this.data[i]]++;

			this.generations.push({
				initialTable: {
					data: [...this.data],
					selectionIndex: i
				},
				countTable: {
					data: [...count],
					selectionIndex: this.data[i]
				},
				resultTable: {
					data: [...output],
					selectionIndex: -1
				},
			});
		}

		for (let i = 1; i <= max; i++) {
			count[i] += count[i - 1];

			this.generations.push({
				initialTable: {
					data: [...this.data],
					selectionIndex: -1
				},
				countTable: {
					data: [...count],
					selectionIndex: i
				},
				resultTable: {
					data: [...output],
					selectionIndex: -1
				},
			});
		}

		for (let i = this.data.length - 1; i >= 0; i--) {
			output[count[this.data[i]] - 1] = this.data[i];
			count[this.data[i]]--;

			this.generations.push({
				initialTable: {
					data: [...this.data],
					selectionIndex: i
				},
				countTable: {
					data: [...count],
					selectionIndex: this.data[i]
				},
				resultTable: {
					data: [...output],
					selectionIndex: count[this.data[i]] - 1
				},
			});
		}

		this.generations.push({
			initialTable: {
				data: [...this.data],
				selectionIndex: -1
			},
			countTable: {
				data: [...count],
				selectionIndex: -1
			},
			resultTable: {
				data: [...output],
				selectionIndex: -1
			},
		});
		this.data = output;
		this.currentSelectionIndizes = [];
	}

}