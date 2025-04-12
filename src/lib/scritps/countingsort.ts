import { SortScript } from "./sortscript";

export class CountingSort extends SortScript {

    // TODO: alle indizes und arrays müssen seperat in den generations gespeichert werden
    sortAlgorithm(): void {
        const max = Math.max(...this.data);
        const count = new Array(max + 1).fill(0);
        const output = new Array(this.data.length);

        for (let i = 0; i < this.data.length; i++) {
            count[this.data[i]]++;
        }

        for (let i = 1; i <= max; i++) {
            count[i] += count[i - 1];
        }

        for (let i = this.data.length - 1; i >= 0; i--) {
            output[count[this.data[i]] - 1] = this.data[i];
            count[this.data[i]]--;
        }

        this.data = output;
        this.currentSelectionIndizes = [];
        this.generations.push({
            data: [...this.data],
            selectionIndizes: [...this.currentSelectionIndizes],
        });
    }

}