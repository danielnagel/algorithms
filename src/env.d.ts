/// <reference types="astro/client" />

interface Script {
    /**
     * Executes the algorithm on the current data selection and returns the resulting next generation.
     */
	nextGeneration(): Generation;

    /**
     * Removes and returns the most recent entry in the generations list.
     * If there is no generation in the generations list available,
     * the current data with an empty selection index is returned.
     */
	prevGeneration(): Generation;

    /**
     * Resets the script to its initial state and returns the first generation, without a selection.
     * @param data (optional) a number array which can be used to override the initial data state.
     */
    resetScript(data?: number[]): Generation;

    /**
     * Executes the script, until the condition in isFinished is met.
     * Then the last generation is returned.
     */
    finishScript(): Generation;
}

/**
 * Represents one step in an algorithm.
 */
type Generation = {
    /**
     * The data state of this generation.
     */
	data: number[];

    /**
     * The selection indizes of this generation.
     */
	selectionIndizes: number[];
}