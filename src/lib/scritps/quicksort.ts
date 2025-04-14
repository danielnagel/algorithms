import {
	GenerationSortScript 
} from './generationsortscript';

export class QuickSort extends GenerationSortScript {

	partition(left: number, right: number): number {
		let i = left;
		let j = right - 1;
		const pivot = this.data[right];
		this.generations.push({
			data: [...this.data],
			selectionIndizes: [i, j],
			subListRange: [left, right]
		});
		while (i < j) {
			while (i < j && this.data[i] <= pivot) {
				i++;
				this.generations.push({
					data: [...this.data],
					selectionIndizes: [i, j],
					subListRange: [left, right]
				});
			}
			while (j > i && this.data[j] > pivot) {
				j--;
				this.generations.push({
					data: [...this.data],
					selectionIndizes: [i, j],
					subListRange: [left, right]
				});
			}
			if (this.data[i] > this.data[j]) {
				const tid = this.data[i];
				const tjd = this.data[j];
				this.data[i] = tjd;
				this.data[j] = tid;
				this.generations.push({
					data: [...this.data],
					selectionIndizes: [i, j],
					subListRange: [left, right]
				});
			}
		}
		if (this.data[i] > pivot) {
			const tid = this.data[i];
			const trd = this.data[right];
			this.data[i] = trd;
			this.data[right] = tid;
			this.generations.push({
				data: [...this.data],
				selectionIndizes: [i, j],
				subListRange: [left, right]
			});
		} else {
			i = right;
		}
		return i;
	}

	quicksort(left: number, right: number): void {
		if (left > right) return;
		const partitionIndex = this.partition(left, right);
		this.quicksort(left, partitionIndex-1);
		this.quicksort(partitionIndex + 1, right);
	}

	sortData(data?: number[]): Generation[] {
		if (this.data.length === 0 && (!data || data.length === 0))
			throw Error('There is no data available!');
		if (this.generations.length) this.generations = [];
		if (data) this.data = [...data];

		this.generations.push({
			data: [...this.data],
			selectionIndizes: [] 
		});
		
		this.quicksort(0, this.data.length-1);

		this.generations.push({
			data: [...this.data],
			selectionIndizes: [] 
		});

		return this.generations;
	}

}
