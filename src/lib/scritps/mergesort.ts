import {
	GenerationSortScript 
} from './generationsortscript';

export class MergeSort extends GenerationSortScript {

	merge(l: number[], r: number[], rangeInData: number[]): number[] {
		const y: number[] = [];
		const nl = l.length;
		const nr = r.length;
		let il = 0;
		this.generations.push({
			data: [...this.data],
			selectionIndizes: [],
			subListRange: rangeInData,
			mergeResult: [...y]
		});
		for (let i = 0; i < nl+nr; i++) {
			if (il > nl) {
				y.push(r[i-il]);
				this.generations.push({
					data: [...this.data],
					selectionIndizes: [rangeInData[0] + nl + (i-il)],
					subListRange: rangeInData,
					mergeResult: [...y]
				});
				continue;
			}
			if (il <= i-nr) {
				y.push(l[il]);
				this.generations.push({
					data: [...this.data],
					selectionIndizes: [rangeInData[0] + il],
					subListRange: rangeInData,
					mergeResult: [...y]
				});
				il++;
				continue;
			}
			if (l[il] <= r[i-il]) {
				y.push(l[il]);
				this.generations.push({
					data: [...this.data],
					selectionIndizes: [rangeInData[0] + il],
					subListRange: rangeInData,
					mergeResult: [...y]
				});
				il++;
			} else {
				y.push(r[i-il]);
				this.generations.push({
					data: [...this.data],
					selectionIndizes: [rangeInData[0] + nl + (i-il)],
					subListRange: rangeInData,
					mergeResult: [...y]
				});
			}
		}
		this.generations.push({
			data: [...this.data],
			selectionIndizes: [],
			subListRange: rangeInData,
			mergeResult: [...y]
		});
		return y;
	}

	mergesort(data: number[], selectionRange: number[]): number[] {
		if (data.length <= 1) return data;
		let l = data.slice(0, Math.floor(data.length/2));
		let r = data.slice(Math.floor(data.length/2));
		this.generations.push({
			data: [...this.data],
			selectionIndizes: [],
			subListRange: selectionRange
		});
		const selectionRangeSplit = selectionRange[0] + Math.floor((selectionRange[1] - selectionRange[0])/2);
		l = this.mergesort(l, [selectionRange[0], selectionRangeSplit]);
		r = this.mergesort(r, [selectionRangeSplit, selectionRange[1]]);
		const mergeResult = this.merge(l, r, selectionRange);
		mergeResult.forEach((item, index) => {
			this.data[selectionRange[0] + index] = item;
		});
		this.generations.push({
			data: [...this.data],
			selectionIndizes: [],
			subListRange: selectionRange
		});
		return mergeResult;
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
		
		this.mergesort(this.data, [0, this.data.length]);

		this.generations.push({
			data: [...this.data],
			selectionIndizes: [] 
		});

		return this.generations;
	}

	addStateToGenerations(generations: Generation[]): AnimationGeneration<Generation>[] {
		const AnimationGenerations: AnimationGeneration<Generation>[] = [];
		generations.forEach((gen, index) => {
			if (index > 0 && generations[index].subListRange && generations[index].subListRange.length) {
				if (generations[index].selectionIndizes !== undefined && generations[index].mergeResult !== undefined) {
					AnimationGenerations.push({
						state: 'swap-selection',
						...gen
					});
				} else {
					AnimationGenerations.push({
						state: 'update-selection',
						...gen
					});
				}
			} else {
				AnimationGenerations.push({
					state: 'update-selection',
					...gen
				});
			}
		});
		return AnimationGenerations;
	}
}