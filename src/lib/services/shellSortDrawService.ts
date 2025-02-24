import {
	DrawService 
} from './drawService';

export class ShellSortDrawService extends DrawService {

	shouldBarBeDrawn(generation: Generation, index: number, hideSelection: boolean): boolean {
		if (!super.shouldBarBeDrawn(generation, index, hideSelection)) {
			if (generation.subListSelection && !(generation.selectionIndizes[generation.subListSelection[0]] === index || generation.selectionIndizes[generation.subListSelection[1]] === index)) {
				return true;
			}
			return false;
		}
		return true;
	}

	getBarColor(generation: Generation, index: number, hideSelection: boolean, options: SceneState) {
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index)&& generation.subListSelection && (generation.selectionIndizes[generation.subListSelection[0]] === index || generation.selectionIndizes[generation.subListSelection[1]] === index) && !hideSelection) {
			return options.colorTheme.accentSecondary;
		}
		return super.getBarColor(generation, index, hideSelection, options);
	}
}