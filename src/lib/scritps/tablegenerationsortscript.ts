import {
	SortScript 
} from './sortscript';

export class TableGenerationSortScript extends SortScript<TableGeneration> {

	sortData(data?: number[]): TableGeneration[] {
		super.sortData(data);

		// always sort data
		if (this.generations.length) this.generations = [];
		if (data) this.data = [...data];

		this.sortAlgorithm();

		return this.generations;
	}
}