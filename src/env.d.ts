// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Script {
    /**
     * Runs sortAlgorithm(), until the data is sorted.
     * If the data is sorted will be indicated by an empty selectionIndizes array.
     * 
     * Returns all generations.
     */
    sortData(data?: number[]): Generation[];
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

type StaticGeneration = {
    state: 'update-selection';
} & Generation;

type DynamicGeneration = {
    state: 'swap-selection';
    pastData: number[];
} & Generation;

type NewGeneration = StaticGeneration | DynamicGeneration

type AnimationLoopState = {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    // sort algorithm data
    generations: NewGeneration[],
    index: number,
    isBackwards?: boolean,
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
