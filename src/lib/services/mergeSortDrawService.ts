import {
	range 
} from '../utils';
import {
	DrawService 
} from './drawService';

export class MergeSortDrawService extends DrawService {

	getBarColor(generation: Generation, index: number, hideSelection: boolean, options: SceneState): string {
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index) && !hideSelection) {
			return options.colorTheme.accentSecondary;
		}
		if (generation.subListRange) {
			const [start, stop] = generation.subListRange;
			if (range(start, stop).includes(index)) {
				return options.colorTheme.accent;
			}
		}
		return options.colorTheme.primary;
	}
}