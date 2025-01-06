export class SortScript implements Script {

	protected data: number[] = [];
	protected generations: Generation[] = [];
	protected currentSelectionIndizes: number[] = [];

	constructor(data: number[]) {
		this.data = data;
	}
	sortData(): Generation[] {
		throw new Error('Method not implemented.');
	}

	getData(): number[] {
		return this.data;
	}

	getSelectionIndizes(): number[] {
		return this.currentSelectionIndizes;
	}

	setSelectionIndizes(selection: number[]): void {
		this.currentSelectionIndizes = selection;
	}

	getGenerations(): Generation[] {
		return this.generations;
	}

	setGenerations(generations: Generation[]): void {
		this.generations = generations;
	}

	/**
     * Initializes the script.
     * Sets the selection indizes to 0,1.
     * Creates and returns the first generation.
     */
	initScript(): Generation {
		if (this.data.length === 0)
			throw Error('There is no data available!');

		this.currentSelectionIndizes = [0, 1];
		const firstGeneration: Generation = {
			data: [...this.data],
			selectionIndizes: [...this.currentSelectionIndizes] 
		};
		return firstGeneration;
	}

	nextGeneration(): Generation {
		if (this.data.length === 0)
			throw Error('There is no data available!');

		if (this.currentSelectionIndizes.length === 0)
			return this.initScript();

		this.sortAlgorithm();

		const newGeneration: Generation = {
			data: [...this.data],
			selectionIndizes: [...this.currentSelectionIndizes] 
		};
		return newGeneration;
	}



	sortAlgorithm() {
		// add custom logic
	}

	prevGeneration(): Generation {
		if (this.data.length === 0) {
			throw Error('There is no data available!');
		}

		// no generations, reset script
		if (this.generations.length === 0 || this.generations.length === 1) {
			return this.resetScript();
		}

		const lastGeneration = this.generations[this.generations.length - 2];
		this.generations.splice(this.generations.length -1, 1);

		const {data, selectionIndizes} = lastGeneration;
		this.data = [...data];
		this.currentSelectionIndizes = [...selectionIndizes];
		return lastGeneration;
	}

	resetScript(data?: number[]): Generation {
		if (this.data.length === 0 && (!data || data.length === 0))
			throw Error('There is no data available!');

		if (this.generations.length === 0) {
			this.currentSelectionIndizes = [];
			if (data) {
				this.data = [...data];
			}
			// no generations, return current state
			return {
				data: data ? data : this.data,
				selectionIndizes: [] 
			};
		}
		const firstGeneration = this.generations[0];
		if (data) {
			firstGeneration.data = [...data];
		}
		firstGeneration.selectionIndizes = [];
		this.data = [...firstGeneration.data];
		this.generations = [];
		this.currentSelectionIndizes = [];
		return firstGeneration;
	}

	finishScript(): Generation {
		if (this.data.length === 0)
			throw Error('There is no data available!');

		let lastGeneration =this.generations.length === 0
			? this.initScript()
			: this.generations[this.generations.length -1];
		
		while (this.currentSelectionIndizes.length) {
			lastGeneration = this.nextGeneration();
		}
		return lastGeneration;
	}
    
}