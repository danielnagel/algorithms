declare module '*.css?inline' {
  const content: string;
  export default content;
}

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
    state: string
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
 * Repräsentiert eine Zelle in einer canvas-basierten Tabelle.
 *
 * @property r - Der Zeilenindex der Zelle.
 * @property c - Der Spaltenindex der Zelle.
 * @property x - Die x-Koordinate der Position der Zelle.
 * @property y - Die y-Koordinate der Position der Zelle.
 * @property w - Die Breite der Zelle.
 * @property h - Die Höhe der Zelle.
 * @property text - Der Textinhalt der Zelle.
 * @property isIndex - Ein Flag, das anzeigt, ob es sich bei dieser Zelle um eine spezielle Zelle handelt,
 *                     die den Spaltenindex anzeigt. Diese Zellen werden optisch hervorgehoben.
 */
interface CanvasTableCell {
    r: number;
    c: number;
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
    isIndex?: boolean;
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

/**
 * Schnittstelle, die einen Handler zur Verwaltung und Darstellung einer Tabelle auf einem Canvas repräsentiert.
 */
interface CanvasTableHandler {
    /**
     * Der aktuelle Zustand der Tabelle als Objekt.
     */
    table: CanvasTable;

    /**
     * Erstellt den initialen Zustand der Tabelle und überschreibt die `table`-Eigenschaft.
     *
     * @param rows - Die Anzahl der Reihen in der Tabelle.
     * @param columns - Die Anzahl der Spalten in der Tabelle.
     * @param x - Die X-Position der Tabelle.
     * @param y - Die Y-Position der Tabelle.
     * @param showIndex - Gibt an, ob die Indizes der Zellen angezeigt werden sollen.
     * @returns Die erstellte `CanvasTable`-Instanz.
     */
    create(rows: number, columns: number, x: number, y: number, showIndex?: boolean): CanvasTable;

    /**
     * Zeichnet die Tabelle auf das Canvas.
     * Optional können die Indizes der Zellen angezeigt werden.
     *
     * @param showIndex - Wenn `true`, werden die Indizes der Zellen angezeigt.
     */
    draw(showIndex?: boolean): void;

    /**
     * Ruft die Informationen einer bestimmten Zelle aus der Tabelle ab.
     *
     * @param row - Die Zeilenposition der Zelle.
     * @param column - Die Spaltenposition der Zelle.
     * @returns Das entsprechende `CanvasTableCell`-Objekt oder `null`, wenn keine Zelle gefunden wurde.
     */
    getCell(row: number, column: number): CanvasTableCell | null;

    /**
     * Schreibt Text in eine bestimmte Zelle der Tabelle.
     *
     * @param row - Die Zeilenposition der Zelle.
     * @param column - Die Spaltenposition der Zelle.
     * @param text - Der Text, der in die Zelle eingefügt werden soll.
     */
    fillCell(row: number, column: number, text: string): void;
}

type CirclePosition = {x: number, y: number, size: number};

/**
 * Configuration options for the AlgorithmCanvas component.
 * These options control the behavior and appearance of the component.
 */
interface AlgorithmCanvasOptions {
/**
 * The ID of the HTML element where the algorithm canvas will be rendered.
 * Must be set; otherwise, an error will be thrown.
 */
  containerId: string;

  /**
   * The identifier of the algorithm that should be displayed.
   * Must be set; otherwise, an error will be thrown.
   */
  selectedAlgorithm: string;

  /**
   * Optional list of selectable algorithms.
   * A dropdown will be shown if more than one entry is provided.
   * If undefined, empty, or only one entry is present,
   * no dropdown will be shown.
   * @default undefined
   */
  selectableAlgorithms?: string[];

  /**
   * The dataset on which the algorithm should operate.
   * If undefined, a dataset will be randomly generated.
   */
  dataSet?: number[];

  /**
   * Specifies the size of the dataset when it is generated randomly.
   * Ignored if `dataSet` is provided.
   * @default 35
   */
  dataSetSize?: number;

  /**
   * Width of the canvas in pixels.
   * @default 1200
   */
  canvasWidth?: number;

  /**
   * Height of the canvas in pixels.
   * @default 720
   */
  canvasHeight?: number;

  /**
   * Defines which control buttons are visible on the canvas.
   * Can be an empty array to hide all buttons.
   * @default ['menu']
   */
  visibleButtons?: string[];

  /**
   * Customizes the color theme of the application.
   * See the {@link ColorTheme} type for available options.
   */
  colorTheme?: ColorTheme;

  /**
   * Determines whether the algorithm animation should start automatically
   * when the component is loaded and the data is initialized.
   * @default false
   */
  autoStartOnLoad?: boolean;

  /**
   * Specifies whether the animation should pause
   * when the application is not visible in the viewport.
   * @default true
   */
  stopAnimationWhenCanvasNotVisible?: boolean;
}