export class BubbleSort implements Script {
	protected data: number[] = [];
	protected generations: Generation[] = [];
	protected currentSelectionIndizes: number[] = [];
	protected alreadySortedIndex: number = 0;

	constructor(data: number[]) {
		this.data = data;
		this.alreadySortedIndex = this.data.length - 1;
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
		this.generations.push(firstGeneration);
		return firstGeneration;
	}

	nextGeneration(): Generation {
		if (this.data.length === 0)
			throw Error('There is no data available!');

		if (this.alreadySortedIndex <= 1 && this.currentSelectionIndizes.length === 0)
			return {
				data: this.data,
				selectionIndizes: []
			};


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

		if (lastIndex >= this.data.length)
			throw Error('Selection index exceeds data size!');

		// bubblesort at current selection
		const a = this.data[firstIndex];
		const b = this.data[lastIndex];

		// already correct, update selection indizes
		if (a <= b) {
			if (this.alreadySortedIndex <= 1) {
				// is the data sorted? then remove selection
				this.currentSelectionIndizes = [];
			} else if (lastIndex === this.alreadySortedIndex) {
				// reset selection to the begining, when its at the end
				this.alreadySortedIndex = this.alreadySortedIndex - 1;
				this.currentSelectionIndizes = [0, 1];
			} else {
				// last index is data.length when script is initialized
				this.currentSelectionIndizes = [lastIndex, lastIndex + 1];
			}
			return;
		}

		// sort data, but keep current selection indizes
		this.data[firstIndex] = b;
		this.data[lastIndex] = a;
	}

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
		if (!this.data) {
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

		const {data, selectionIndizes} = lastGeneration;
		this.data = [...data];
		this.currentSelectionIndizes = [...selectionIndizes];
		return lastGeneration;
	}

	getData(): number[] {
		return this.data;
	}

	setData(data: number[]): void {
		this.data = data;
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

	resetScript(data?: number[]): Generation {
		if (this.data.length === 0 && (!data || data.length === 0))
			throw Error('There is no data available!');

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
		this.alreadySortedIndex = this.data.length - 1;
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