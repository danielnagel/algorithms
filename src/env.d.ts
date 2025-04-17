// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Script<T> {
    /**
     * Runs sortAlgorithm(), until the data is sorted.
     * If the data is sorted will be indicated by an empty selectionIndizes array.
     * 
     * Returns all generations.
     */
    sortData(data?: number[]): T[];

    /**
     * Updates a Generation Array to a AnimationGeneration Array,
     * which contains animation states for the animation manager.
     * 
     * @param generations which should be get animation states.
     * @returns AnimationGeneration array with animation states.
     */
    addStateToGenerations(generations: T[]): AnimationGeneration[];
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

type TableGeneration = {
    initialTable: TableSelection;
    countTable: TableSelection;
    resultTable: ResultTableSelection;
};

type TableSelection = {
    selectionIndex: number;
    data: number[];
};

type ResultTableSelection = {
    selectionIndex: number;
    data: (number|undefined)[];
};

type AnimationGeneration<T extends Generation | TableGeneration> = {
    state: 'update-selection' | 'swap-selection'
} & T;

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
type NewBar = Bar & {y: number};

type SceneState<T> = {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    // sort algorithm data
    algorithmType: string,
    generations: AnimationGeneration<T>[],
    index: number,
    isBackwards?: boolean,
    // animation speed options
    lastTimestamp: number,
    frameDelay: number,
    // swap animation options
    b1?: Bar,
    b2?: Bar,
    fylingBars?: {from: newBar, to: newBar, initialFrom: newBar}[],
    initialB1x?: number,
    initialB2x?: number,
    swapSpeed?: number,
    swapping: boolean;
    isStep: boolean,
    isRunning: boolean,
    colorTheme: ColorTheme
}

/**
 * Eine CanvasTableCell kennt ihre Position (x, y)
 * und Dimensionen (w, h) im Canvas.
 * Außerdem kennt sie ihre Position in einer CanvasTable (r, c)
 * und enthält einen textuellen Inhalt (text).
 */
interface CanvasTableCell {
    r: number;
    c: number;
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
}

/**
 * Eine CanvasTable kennt ihre Zellen (CanvasTableCell)
 * und speichert die Anzahl der verfügbaren Reihen und Spalten.
 * Zusätzlich kennt sie ihre Position (x, y) sowie ihre Höhe und Breite.
 */
interface CanvasTable {
    cells: CanvasTableCell[];
    rows: number;
    columns: number;
    x: number;
    y: number;
    w: number;
    h: number;
}

interface CanvasTableHandler {
    /**
     * Aktueller Zustand der Tabelle im Objekt.
     */
    table: CanvasTable;

    /**
     * Erstellt den initialen Zustand der Tabelle
     * und überschreibt die table-Eigenschaft.
     *
     * @param rows - Anzahl der Reihen
     * @param columns - Anzahl der Spalten
     * @param x - X-Position der Tabelle
     * @param y - Y-Position der Tabelle
     * @returns Die erstellte CanvasTable
     */
    create(rows: number, columns: number, x: number, y: number): CanvasTable;

    /**
     * Zeichnet die Tabelle auf das Canvas.
     * Optional können die Indizes der Zellen angezeigt werden.
     *
     * @param showIndex - Wenn true, werden die Indizes der Zellen angezeigt.
     */
    draw(showIndex?: boolean): void;

    /**
     * Ruft die Informationen zu einer bestimmten Zelle aus der Tabelle ab.
     *
     * @param row - Die Zeilenposition der Zelle
     * @param column - Die Spaltenposition der Zelle
     * @returns Das entsprechende CanvasTableCell-Objekt oder null, falls keine Zelle gefunden wurde.
     */
    getCell(row: number, column: number): CanvasTableCell | null;

    /**
     * Schreibt einen Text in eine bestimmte Zelle der Tabelle.
     *
     * @param row - Die Zeilenposition der Zelle
     * @param column - Die Spaltenposition der Zelle
     * @param text - Der einzufügende Text
     */
    fillCell(row: number, column: number, text: string): void;
}
