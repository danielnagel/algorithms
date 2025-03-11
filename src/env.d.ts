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

    /**
     * Updates a Generation Array to a NewGeneration Array,
     * which contains animation states for the animation manager.
     * 
     * @param generations which should be get animation states.
     * @returns NewGeneration array with animation states.
     */
    addStateToGenerations(generations: Generation[]): NewGeneration[];
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
    /**
     * The current insertion sort selection,
     * from a shellsort sub list selection.
     */
    subListSelection?: number[];
    /**
     * The currently sorted smaller sub list.
     */
    subListRange?: number[];
    /**
     * The current merge result, during merging.
     */
    mergeResult?: number[];
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
    color: string;
};

type NewGeneration = {
    state: 'update-selection' | 'swap-selection' | 'search' | 'merge'
} & Generation;

type SceneState = {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    // sort algorithm data
    algorithmType: string,
    generations: NewGeneration[],
    index: number,
    isBackwards?: boolean,
    // animation speed options
    lastTimestamp: number,
    frameDelay: number,
    // swap animation options
    b1?: Bar,
    b2?: Bar,
    initialB1x?: number,
    initialB2x?: number,
    swapSpeed?: number,
    swapping: boolean;
    isStep: boolean,
    isRunning: boolean,
    colorTheme: ColorTheme
}
