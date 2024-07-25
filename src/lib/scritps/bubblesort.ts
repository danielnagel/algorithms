export class BubbleSort implements Script {
	protected data: number[] = [];
	protected generations: Generation[] = [];
	protected currentSelectionIndizes: number[] = [];

	constructor(data: number[]) {
		this.data = data;
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

		if (this.isFinished() && this.currentSelectionIndizes.length === 0)
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
			if (lastIndex + 1 >= this.data.length) {
				// TODO: do this check at every index.
				if (this.isFinished()) {
					// is the selection at the end of data and is the data sorted?
					// then remove selection
					this.currentSelectionIndizes = [];
				} else {
					// reset selection to the begining
					this.currentSelectionIndizes = [0, 1];
				}
			} else {
				this.currentSelectionIndizes = [lastIndex, lastIndex + 1];
			}
			return;
		}

		// sort data, but keep current selection indizes
		this.data[firstIndex] = b;
		this.data[lastIndex] = a;
	}

	prevGeneration(): Generation {
		// there is no more previous generation, reset script
		if (this.generations.length === 0) {
			return this.resetScript();
		}

		const lastGeneration = this.generations.pop();
		// There should never be no last generation
		if (!lastGeneration) {
			throw Error('There should still be generations, but this one was undefined!');
		}
		const {data: lastData, selectionIndizes: lastSelectionIndizes} = lastGeneration;
		// TODO: skip an entire generation, if its the one that is currently displayed
		// if(lastSelectionIndizes.length  === this.currentSelectionIndizes.length && lastSelectionIndizes[0] === this.currentSelectionIndizes[0]) {
		//     lastGeneration = this.generations.pop();
		//     // There should never be no last generation
		//     if (!lastGeneration) {
		//         throw Error("There should still be generations, but this one was undefined!")
		//     }
		// }
		this.data = [...lastData];
		this.currentSelectionIndizes = [...lastSelectionIndizes];
		return lastGeneration;
	}

	isFinished(): boolean {
		for (let i = 0; i < this.data.length - 1; i++) {
			const a = this.data[i];
			const b = this.data[i + 1];
			if (a > b) return false;
		}
		return true;
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

	finishScript(): Generation {
		if (this.data.length === 0)
			throw Error('There is no data available!');

		let lastGeneration = this.initScript();
		while (this.currentSelectionIndizes.length) {
			lastGeneration = this.nextGeneration();
		}
		return lastGeneration;
	}

}