import {
	SortScript 
} from './sortscript';

export class MergeSort extends SortScript {

	merge(l: number[], r: number[]): number[] {
		const y: number[] = [];
		const nl = l.length;
		const nr = r.length;
		let il = 0;
		// TODO: index von l und r in this.data
		for (let i = 0; i < nl+nr; i++) {
			if (il > nl) {
				y.push(r[i-il]);
				console.log('MERGE:        this.data', this.data.join(), 'left merge selection', l.join(), 'right merge selection', r.join(), 'selection in data', [], 'selection in right list', r[i-il], i-il, 'selection index in this.data ?', 'merge result', y.join());
				continue;
			}
			if (il <= i-nr) {
				y.push(l[il]);
				console.log('MERGE:        this.data', this.data.join(), 'left merge selection', l.join(), 'right merge selection', r.join(), 'selection in data', [], 'selection in left list', l[il], il, 'selection index in this.data ?', 'merge result', y.join());
				il++;
				continue;
			}
			if (l[il] <= r[i-il]) {
				y.push(l[il]);
				console.log('MERGE:        this.data', this.data.join(), 'left merge selection', l.join(), 'right merge selection', r.join(), 'selection in data', [], 'selection in left list', l[il], il, 'selection index in this.data ?', 'merge result', y.join());
				il++;
			} else {
				y.push(r[i-il]);
				console.log('MERGE:        this.data', this.data.join(), 'left merge selection', l.join(), 'right merge selection', r.join(), 'selection in data', [], 'selection in right list', r[i-il], i-il, 'selection index in this.data ?', 'merge result', y.join());
			}
		}
		return y;
	}

	mergesort(data: number[], selectionRange: number[]): number[] {
		if (data.length <= 1) return data;
		let l = data.slice(0, Math.floor(data.length/2));
		let r = data.slice(Math.floor(data.length/2));
		console.log('SEARCH:       this.data', this.data.join(), '(kann raus: merge selection/sublistrange', this.data.slice(selectionRange[0], selectionRange[1]).join() + ')', 'selectionRange', selectionRange.join());
		const selectionRangeSplit = selectionRange[0] + Math.floor((selectionRange[1] - selectionRange[0])/2);
		l = this.mergesort(l, [selectionRange[0], selectionRangeSplit]);
		r = this.mergesort(r, [selectionRangeSplit, selectionRange[1]]);
		const mergeResult = this.merge(l, r);
		console.log('MERGE-RESULT: this.data', this.data.join(), '(kann raus: merge selection/sublistrange', this.data.slice(selectionRange[0], selectionRange[1]).join() + ')', 'merge result', mergeResult.join(), 'selectionRange', selectionRange.join());
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
}