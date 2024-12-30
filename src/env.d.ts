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

    getGenerations(): Generation[]
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
 * Represents one step in a bubble sort algorithm.
 */
type BubbleSortGeneration = Generation & {
    /**
     * Indicates, at which index the biggest number already has bubbled to.
     */
    alreadySortedIndex: number;

    /**
     * Indicates, wheter the data was sorted in the current iteration.
     * When false and the algorithm reached the end of the data, the data is sorted.
     */
    switched: boolean;
}

/**
 * Represents one step in an insertion sort algorithm.
 */
type InsertionSortGeneration = Generation & {
    /**
     * Position of the current iteration of the insertion sort algorithm.
     */
    insertionIndex: number;

    /**
     * Value which should be inserted at the correct position.
     */
    insertionValue: number;
}

/**
 * Represents one step in an selection sort algorithm.
 */
type SelectionSortGeneration = Generation & {
    /**
     * Position of the current iteration of the selection sort algorithm.
     */
    insertionIndex: number;

    /**
     * Position of the currently known smallest value in the array.
     */
    minIndex: number;

    /**
     * Needed to visualize the switch, creates two extra steps.
     */
    switchAnimationStep: number;
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

type Bar = {
    x: number;
    value: number;
};

type NewGeneration = {
    state: string;
} & Generation;

type AnimationLoopState = {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    // sort algorithm data
    generations: NewGeneration[],
    index: number,
    // animation speed options
    animationFrameTimestamp: number,
    lastTimestamp: number,
    frameDelay: number,
    // swap animation options
    b1?: Bar,
    b2?: Bar,
    initialB1x?: number,
    intialB2x?: number,
    swapSpeed?: number,
    swapping: boolean
}
