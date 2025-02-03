import {
	SortScript 
} from './sortscript';

export class QuickSort extends SortScript {
    
	sortData(data?: number[]): Generation[] {
		if (this.data.length === 0 && (!data || data.length === 0))
			throw Error('There is no data available!');
		if (this.generations.length) this.generations = [];
		if (data) this.data = [...data];

		this.generations.push({
			data: [...this.data],
			selectionIndizes: [] 
		});
		
		// TODO quicksort

		return this.generations;
	}

}
