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
     * Initializes the script.
     * Sets the selection indizes to 0,1.
     * Creates and returns the first generation.
     */
    initScript(): Generation;

    /**
     * Resets the script to its initial state and returns the first generation, without a selection.
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