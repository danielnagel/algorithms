import 'iconify-icon';
import AlgorithmCanvasEngine from './lib/engine';

/**
 * The color theme for this application
 */
export type ColorTheme = {
    primary: string;
    primaryLight: string;
    primaryLighter: string;
    secondary: string;
    accent: string;
    accentSecondary: string;
}

/**
 * Configuration options for the AlgorithmCanvas component.
 * These options control the behavior and appearance of the component.
 */
export interface AlgorithmCanvasOptions {
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
   * Defines which control buttons are visible on the canvas.
   * Can be an empty array to hide all buttons.
   * @default ['menu-button']
   */
  visibleButtons?: string[];

  /**
   * Defines which menu buttons are visible.
   * Can be an empty array to hide all menu buttons.
   * @default ['play-button', 'randomize-button', 'skip-back-button', 'skip-forward-button', 'step-back-button', 'step-forward-button']
   */
  menuButtons?: string[];

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

  /**
   * The delay in milliseconds between animation frames.
   * This controls the speed of the animation.
   * A lower value results in a faster animation.
   * @default 1400
   */
  animationFrameDelay?: number;
}

export const run = (options: AlgorithmCanvasOptions) => {
	const engine = new AlgorithmCanvasEngine(options);
	engine.start();
};
