/// <reference types="astro/client" />

interface Script {
	// initialize(data: number[]): void;
	nextGeneration(): Generation;
	prevGeneration(): Generation;
    isFinished(): boolean;
    getData(): number[];
    setData(data: number[]): void;
    getSelectionIndizes(): number[];
    setSelectionIndizes(selection: number[]): void;
    getGenerations(): Generation[];
    setGenerations(generations: Generation[]): void;
    /**
     * Resets the script to its initial state and returns the first generation.
     */
    resetScript(): Generation;

    /**
     * Executes the script, until the condition in isFinished is met.
     * Then the last generation is returned.
     */
    finishScript(): Generation;
}

type Generation = {
	data: number[];
	selectionIndizes: number[];
}