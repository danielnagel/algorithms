export class InsertionSort implements Script {
	// TODO: remove duplicate
	protected data: number[] = [];
	// TODO: remove duplicate
	protected generations: Generation[] = [];
	// TODO: remove duplicate
	protected currentSelectionIndizes: number[] = [];

	protected insertionIndex: number = 1;
	protected insertionValue: number = -1;

	constructor(data: number[]) {
		this.data = data;
	}

	// TODO: remove duplicate
	getData(): number[] {
		return this.data;
	}

	// TODO: remove duplicate
	getSelectionIndizes(): number[] {
		return this.currentSelectionIndizes;
	}

	// TODO: remove duplicate
	setSelectionIndizes(selection: number[]): void {
		this.currentSelectionIndizes = selection;
	}

	setInsertionIndex(insertionIndex: number): void {
		this.insertionIndex = insertionIndex;
	}

	setInsertionValue(insertionValue: number): void {
		this.insertionValue = insertionValue;
	}

	// TODO: remove duplicate
	getGenerations(): Generation[] {
		return this.generations;
	}

	// TODO: remove duplicate
	setGenerations(generations: Generation[]): void {
		this.generations = generations;
	}

	initScript(): Generation {
		if (this.data.length === 0)
			throw Error('There is no data available!');

		this.currentSelectionIndizes = [0, 1];
		this.insertionValue = this.data[this.insertionIndex];
		const firstGeneration: Generation = {
			data: [...this.data],
			selectionIndizes: [...this.currentSelectionIndizes] 
		};
		this.generations.push(firstGeneration);
		return firstGeneration;
	}

	// TODO: remove duplicate
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
		this.generations.push(newGeneration);
		return newGeneration;
	}



	sortAlgorithm() {
		if (this.currentSelectionIndizes.length !== 2)
			throw Error('There have to be exactly two selection indizes!');

		const [firstIndex, lastIndex] = this.currentSelectionIndizes;

		if (lastIndex > this.insertionIndex || firstIndex < 0)
			throw Error('Selection index exceeds data size!');

		const a = this.data[firstIndex];
		const b = this.data[lastIndex];

		if (a > b) {
			// data needs to be sorted
			this.data[firstIndex] = b;
			this.data[lastIndex] = a;
		} else if (firstIndex === 0) {
			// "inner" loop is at the beginning
			if (this.insertionIndex + 1 === this.data.length) {
				// data is sorted
				this.insertionIndex = 1;
				this.currentSelectionIndizes = [];
			} else {
				// update insertion index
				this.insertionIndex += 1;
				this.insertionValue = this.data[this.insertionIndex];
				this.currentSelectionIndizes = [this.insertionIndex - 1, this.insertionIndex];
			}
		} else if (firstIndex > 0) {
			// "inner" loop has data left
			if (this.data[firstIndex -1] > this.insertionValue) {
				// next pair of data has to be sorted
				this.currentSelectionIndizes = [firstIndex - 1, firstIndex];
			} else if (this.insertionIndex + 1 === this.data.length) {
				// data is sorted
				this.insertionIndex = 1;
				this.currentSelectionIndizes = [];
			} else {
				// no more data to sort in this iteration, update insertion index
				this.insertionIndex += 1;
				this.insertionValue = this.data[this.insertionIndex];
				this.currentSelectionIndizes = [this.insertionIndex - 1, this.insertionIndex];
			}
		}
	}

	// TODO: remove duplicate?
	isEqualGeneration(a: Generation, b: Generation) {
		if (a.data.length !== b.data.length) return false;
		if (a.selectionIndizes.length !== b.selectionIndizes.length) return false;
		for (let i = 0; i < a.selectionIndizes.length; i++) {
			if (a.selectionIndizes[i] !== b.selectionIndizes[i]) return false;
		}
		for (let i = 0; i < a.data.length; i++) {
			if (a.data[i] !== b.data[i]) return false;
		}
		return true;
	}

	prevGeneration(): Generation {
		if (this.data.length === 0) {
			throw Error('There is no data available!');
		}

		// no generations, reset script
		if (this.generations.length === 0) {
			return this.resetScript();
		}

		const currentGeneration = {
			data: [...this.data],
			selectionIndizes: [...this.currentSelectionIndizes] 
		};
		
		let lastGeneration = this.generations[this.generations.length - 1];
		this.generations.splice(this.generations.length -1, 1);

		if (this.isEqualGeneration(currentGeneration, lastGeneration)) {
			// remove one generation more, when current and last generation are the same
			lastGeneration = this.generations[this.generations.length - 1];
			this.generations.splice(this.generations.length -1, 1);
		}

		const [cfi, cli] = currentGeneration.selectionIndizes;
		const [lfi, lli] = lastGeneration.selectionIndizes;
		if (cfi === lfi && cli === lli) {
			// Same indizes, there was a switch
		} else if (cfi === 0 && cli === 1) {
			// current index is at the beginning, we need to update the already sorted index
			// there was a switch, because the indizes switched to the beginning
		}

		const {data, selectionIndizes} = lastGeneration;
		this.data = [...data];
		this.currentSelectionIndizes = [...selectionIndizes];
		return lastGeneration;
	}

	resetScript(data?: number[]): Generation {
		if (this.data.length === 0 && (!data || data.length === 0))
			throw Error('There is no data available!');

		this.insertionIndex = 1;
		this.insertionValue = -1;

		if (this.generations.length === 0) {
			this.currentSelectionIndizes = [];
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

	// TODO: remove duplicate
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