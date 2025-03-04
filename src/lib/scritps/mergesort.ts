import {
	SortScript 
} from './sortscript';

export class MergeSort extends SortScript {

	merge(l: number[], r: number[]): number[] {
		const y: number[] = []
		const nl = l.length;
		const nr = r.length;
		let il = 0;
		for(let i = 0; i < nl+nr; i++) {
			if(il > nl) {
				y.push(r[i-il])
				continue;
			}
			if(il <= i-nr) {
				y.push(l[il])
				il++;
				continue;
			}
			if(l[il] <= r[i-il]) {
				y.push(l[il]);
				il++;
			} else {
				y.push(r[i-il]);
			}
		}
		return y;
	}

    mergesort(data: number[]): number[] {
		if(data.length <= 1) return data;
		let l = data.slice(0, Math.floor(data.length/2))
		let r = data.slice(Math.floor(data.length/2))
		l = this.mergesort(l);
		r = this.mergesort(r);
        return this.merge(l, r);
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
		
		this.mergesort(this.data);
		

		this.generations.push({
			data: [...this.data],
			selectionIndizes: [] 
		});

		return this.generations;
    }
}