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
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index) && generation.subListSelection && (generation.selectionIndizes[generation.subListSelection[0]] === index || generation.selectionIndizes[generation.subListSelection[1]] === index) && !hideSelection) {
			return options.colorTheme.accentSecondary;
		}
		if (generation.selectionIndizes && generation.selectionIndizes.includes(index)) {
			return options.colorTheme.accent;
		}
		return super.getBarColor(generation, index, hideSelection, options);
	}

	getBar(options: SceneState, index: number, backwardIndex: number) {
		const bar = super.getBar(options, index, backwardIndex);
		const subListSelection = options.generations[options.index].subListSelection;
		if (subListSelection && subListSelection[index]) {
			const {width} = this.getBarRect(options.canvas.width, 0, options.generations[options.index].data, 0);
			bar.x = options.generations[options.index].selectionIndizes[subListSelection[index]] * width;
			bar.value = options.generations[options.index].data[options.generations[options.index].selectionIndizes[options.isBackwards ? subListSelection[index] : subListSelection[backwardIndex]]];
		}
		return bar;
	}
}