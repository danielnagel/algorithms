// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
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
     * Empties the generations array.
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

/**
 * The color theme for this application
 */
type ColorTheme = {
    primary: string;
    primaryLight: string;
    primaryLighter: string;
    secondary: string;
    accent: string;
    accentSecondary: string;
}

type CustomColorTheme = {
    primary?: string;
    primaryLight?: string;
    primaryLighter?: string;
    secondary?: string;
    accent?: string;
    accentSecondary?: string;
}