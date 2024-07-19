export class AnimationManger {
    #animationIntervalTimeout: number = 50;
    #animationIntervalId: ReturnType<typeof setInterval> | undefined = undefined;
    readonly #maxDataCount: number = 100;
    readonly #canvasHeightRatio: number = 0.6;
    canvasElement?: HTMLCanvasElement;
    script?: Script;

    constructor() {
        this.initElements();
        this.initScript();
    }

    initElements() {
        // TODO: create elements from script?
        const canvasElement = document.getElementById('algorithm-canvas');
        if (!(canvasElement instanceof HTMLCanvasElement)) throw Error('There is no canvas in the DOM!');
        this.canvasElement = canvasElement;
        this.canvasElement.height = this.canvasElement.width * this.#canvasHeightRatio;

        // animation control-panel
        const randomizeButton = document.getElementById('randomize-button') as HTMLButtonElement;
        if (!randomizeButton) throw Error('Damn no randomize button!');
        const playButton = document.getElementById('play-button') as HTMLButtonElement;
        if (!playButton) throw Error('Damn no play button!');
        const skipBackButton = document.getElementById('skip-back-button') as HTMLButtonElement;
        if (!skipBackButton) throw Error('Damn no skip back button!');
        const stepBackButton = document.getElementById('step-back-button') as HTMLButtonElement;
        if (!stepBackButton) throw Error('Damn no step back button!');
        const stepForwardButton = document.getElementById('step-forward-button') as HTMLButtonElement;
        if (!stepForwardButton) throw Error('Damn no step forward button!');
        const skipForwardButton = document.getElementById('skip-forward-button') as HTMLButtonElement;
        if (!skipForwardButton) throw Error('Damn no skip forward button!');
        const intervalTimeoutInput = document.getElementById('interval-timeout-input') as HTMLInputElement;
        if (!intervalTimeoutInput) throw Error('Damn no interval timeout input!');

        // add event handler
        randomizeButton.onclick = this.restartScript;
        playButton.onclick = this.animation;
        skipBackButton.onclick = this.skipBack;
        stepBackButton.onclick = this.stepBackward;
        stepForwardButton.onclick = this.stepForward;
        skipForwardButton.onclick = this.skipForward;
        intervalTimeoutInput.oninput = (event) => this.animationIntervalTimeoutInputHandler(event as InputEvent);
        intervalTimeoutInput.value = this.#animationIntervalTimeout.toString();
    }

    // animation control panel
    setControlsDisabledState = (state: boolean) => {
        playButton.title = state ? 'pause' : 'play';
        const disableableElements = [randomizeButton, skipBackButton, stepBackButton, stepForwardButton, skipForwardButton, intervalTimeoutInput];
        disableableElements.forEach(el => {
            el.disabled = state;
            if (state) el.classList.add('disabled');
            else el.classList.remove('disabled');
        });
    };

    async initScript() {
        const { BubbleSort } = await import("../components/script");
        this.script = new BubbleSort(this.generateRandomNumberArray(this.#maxDataCount));
        this.drawBarChart(this.script.getData());
    }

    restartScript() {
        // TODO: could use this.skipBack, when drawinBarChart is removed
        this.clearAnimationInterval();

        if (!this.script) {
            throw Error(`No script initialized!`);
        }

        this.script.resetScript();
        // TODO: should all of this before this.drawBarChart be part of a method in this.script?
        this.script.setSelectionIndizes([]);
        this.script.setData(this.generateRandomNumberArray(this.#maxDataCount));
        const data = this.script.getData();
        const selectionIndizes = this.script.getSelectionIndizes();

        this.drawBarChart(data, selectionIndizes);
    }

    // may be a part of a utility script?
    generateRandomNumberArray(count: number): number[] {
        const randomNumbers: number[] = [];
        for (let i = 0; i < count; i++) {
            const randomNumber = Math.floor(Math.random() * state.maxNumberSize);
            randomNumbers.push(randomNumber);
        }
        return randomNumbers;
    };


    // animation
    drawBarChart(data: number[], selection?: number[]) {
        const canvas = this.canvasElement;
        if (!canvas) {
            console.error('no canvas');
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('no context');
            return;
        }
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const drawAreaWidth = canvasWidth - 5;
        const barWidth = drawAreaWidth / data.length;
        const maxBarHeight = Math.max(...data);
        const barSpaceFromTop = 5;
        const barSpaceFromBottom = 5;
        const fontXPositionCorrection = 10;
        const fontXPositionCorrectionSingleDigit = 20;
        const barGap = 2;

        // TODO: get color from css properties, doesn't seem to work in astro, like it does in a plain html/css combination 
        const primaryColor = "#101010";
        const primaryLightColor = "#202020";
        const primaryLighterColor = "#303030";
        const secondaryColor = "#dadada";
        const accentColor = "#2755ee";
        const accentsecondaryColor = "#000000";

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        data.forEach((value, index) => {
            const barHeight = (value / maxBarHeight) * (canvasHeight - barSpaceFromBottom - barSpaceFromTop); // Leave space for value text
            const x = index * barWidth;
            const y = canvasHeight - barHeight - barSpaceFromBottom; // start from the top, begin to draw where the bar ends, leave space for the text

            // Draw the bar
            const barColor = selection?.includes(index) ? accentColor : primaryColor
            ctx.fillStyle = barColor;
            ctx.fillRect(x + barGap, y, barWidth - barGap, barHeight); // Leave some space between bars
            console.log(barWidth)

            // Draw the value below the bar
            ctx.fillStyle = secondaryColor;
            ctx.font = '35px system-ui, arial';
            ctx.textRendering = 'optimizeSpeed';
            const xPosition = value < 10
                ? x + fontXPositionCorrectionSingleDigit
                : x + fontXPositionCorrection;
            ctx.fillText(`${value}`, xPosition, canvasHeight - barSpaceFromBottom - barSpaceFromTop);
        });
    };

    // TODO: set button onclick
    // TODO: how to make testable? maybe so #stepForwardClickHandler = () => { const {data, selectionIndizes} = this.stepForward(); this.drawBarChart(data, selectionIndizes); }
    stepForward() {
        if (!this.script) {
            throw Error(`No script initialized!`);
        }
        // TODO:  && state.selection.length === 0 neccessary?, removed in the next line.
        if (this.script.isFinished()) return;

        if (this.script.getData().length === 0) {
            throw Error(`Script has no data!`);
        }

        if (this.script.getSelectionIndizes().length === 0) {
            throw Error(`Script has no initial selection!`);
        }

        // TODO: probably skips first generation
        const { data, selectionIndizes } = this.script.nextGeneration();
        this.drawBarChart(data, selectionIndizes);
    };

    // TODO: set button onclick
    // TODO: how to make testable? maybe so #stepBackwardClickHandler = () => { const {data, selectionIndizes} = this.stepBackward(); this.drawBarChart(data, selectionIndizes); }
    stepBackward() {
        if (!this.script) {
            throw Error(`No script initialized!`);
        }
        const { data, selectionIndizes } = this.script.prevGeneration();
        
        // there is no more previous generation, nothing to do
        if (data.length === 0 && selectionIndizes.length === 0) return;

        this.drawBarChart(data, selectionIndizes);
    };

    clearAnimationInterval() {
        clearInterval(this.#animationIntervalId);
        this.#animationIntervalId = undefined;
    };

    startSelectionAnimation() {
        this.#animationIntervalId = setInterval(async () => {
            // TODO: remove this check, when stepForward is refactored, rather let stepForward do the checks
            if (!this.script) {
                throw Error(`No script initialized!`);
            }
            this.stepForward();
            // TODO: remove this.script.isFinished() check, when stepForward is refactored, rather let stepForward do the checks, but the actions after check are correct here
            if (this.script.isFinished()) {
                this.clearAnimationInterval();
                this.setControlsDisabledState(false);
            }
        }, this.#animationIntervalTimeout);
    };

    // animation
    // TODO: this is a click handler, rename
    animation() {
        if (this.#animationIntervalId) {
            this.clearAnimationInterval();
            this.setControlsDisabledState(false);
            return;
        }
        this.setControlsDisabledState(true);
        this.startSelectionAnimation();
    };

    // animation - control panel
    animationIntervalTimeoutInputHandler(event: InputEvent) {
        if (!event.target || !(event.target instanceof HTMLInputElement)) return;
        const rawValue = event.target.value;
        let numberValue = this.#animationIntervalTimeout;
        try {
            numberValue = parseInt(rawValue);
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
        if (numberValue < 1) numberValue = 1;
        if (numberValue > 5000) numberValue = 5000;
        this.#animationIntervalTimeout = numberValue;
        event.target.value = this.#animationIntervalTimeout.toString();
    };

    // TODO: make testable, move drawBarChart in a clickHandler with this method
    skipBack() {
        this.clearAnimationInterval();

        if (!this.script) {
            throw Error(`No script initialized!`);
        }

        const firstGeneration = this.script.resetScript();
        this.drawBarChart(firstGeneration.data, firstGeneration.selectionIndizes);
    };

    // TODO: make testable, move drawBarChart in a clickHandler with this method
    skipForward() {
        this.clearAnimationInterval();
        if (!this.script) {
            throw Error(`No script initialized!`);
        }
        const lastGeneration = this.script.finishScript();
        this.drawBarChart(lastGeneration.data, lastGeneration.selectionIndizes);
    };
}
