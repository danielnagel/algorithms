export class BubbleSort implements Script {
    protected data: number[] = [];
    protected generations: Generation[] = [];
    protected currentSelectionIndizes: number[] = [];

    constructor(data: number[]) {
        this.data = data;
    }

    initScript(): Generation {
        if (this.data.length === 0)
            throw Error('There is no data available!');

        this.currentSelectionIndizes = [0, 1];
        const firstGeneration: Generation = { data: [...this.data], selectionIndizes: [...this.currentSelectionIndizes] };
        this.generations.push(firstGeneration);
        return firstGeneration;
    }

    nextGeneration(): Generation {
        if (this.isFinished() && this.currentSelectionIndizes.length === 0)
            return this.generations[this.generations.length - 1];

        if (this.data.length === 0)
            throw Error('There is no data available!');

        if (this.currentSelectionIndizes.length === 0)
            throw Error('There is no selection indizes set!');

        this.sortAlgorithm();

        const newGeneration: Generation = { data: [...this.data], selectionIndizes: [...this.currentSelectionIndizes] };
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
                if (this.isFinished()) {
                    // is the selection at the end of data and is the data sorted?
                    // then remove selection
                    // TODO: is this necessary? maybe when finished, the animation calls the clean up tasks
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
        // the "first" generation is completly empty
        if (this.generations.length === 0) return {data: [], selectionIndizes: []};

        let lastGeneration = this.generations.pop();
        // There should never be no last generation
        if (!lastGeneration) {
            throw Error("There should still be generations, but this one was undefined!")
        }
        const {data: lastData, selectionIndizes: lastSelectionIndizes} = lastGeneration;
        // skip an entire generation, if its the one that is currently displayed
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
        return this.currentSelectionIndizes
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

    resetScript(): Generation {
        if (this.generations.length === 0) {
            // no generations, return current state
            return { data: this.data, selectionIndizes: [] };
        }
        const firstGeneration = this.generations[0];
        firstGeneration.selectionIndizes = [];
        this.generations = [];
        this.data = [...firstGeneration.data];
        this.currentSelectionIndizes = [...firstGeneration.selectionIndizes];
        return firstGeneration;
    }

    finishScript(): Generation {
        if (this.data.length === 0)
            throw Error('There is no data available!');

        let lastGeneration = this.initScript();
        while (this.currentSelectionIndizes.length) {
            lastGeneration = this.nextGeneration()
        }
        return lastGeneration;
    }

}