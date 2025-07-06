import 'iconify-icon';
import AlgorithmCanvasEngine from './lib/engine';

export const run = (options: AlgorithmCanvasOptions) => {
	const engine = new AlgorithmCanvasEngine(options);
	engine.start();
};
