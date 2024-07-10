type CanvasDataStore = {
    data: number[];
    dataCount: number;
    maxNumberSize: number;
    selection: number[];
    animationIntervalTimeout: number;
    steps: {data: number[], selection: number[]}[];
}
const state: CanvasDataStore = {
    data: [],
    dataCount: 35,
    maxNumberSize: 100,
    selection: [],
    animationIntervalTimeout: 50,
    steps: []
};

let animationIntervalId: ReturnType<typeof setInterval> | undefined = undefined;
const canvasElement = document.getElementById("algorithm-canvas") as HTMLCanvasElement;
if(!canvasElement) throw Error ("Damn no canvas!");
const randomizeButton = document.getElementById("randomize-button") as HTMLButtonElement;
if(!randomizeButton) throw Error ("Damn no randomize button!");
const playButton = document.getElementById("play-button") as HTMLButtonElement;
if(!playButton) throw Error ("Damn no play button!");
const skipBackButton = document.getElementById("skip-back-button") as HTMLButtonElement;
if(!skipBackButton) throw Error ("Damn no skip back button!");
const stepBackButton = document.getElementById("step-back-button") as HTMLButtonElement;
if(!stepBackButton) throw Error ("Damn no step back button!");
const stepForwardButton = document.getElementById("step-forward-button") as HTMLButtonElement;
if(!stepForwardButton) throw Error ("Damn no step forward button!");
const skipForwardButton = document.getElementById("skip-forward-button") as HTMLButtonElement;
if(!skipForwardButton) throw Error ("Damn no skip forward button!");
const intervalTimeoutInput = document.getElementById("interval-timeout-input") as HTMLInputElement;
if(!intervalTimeoutInput) throw Error ("Damn no interval timeout input!");

const generateRandomData = (): void => {
        state.data = [];
        for (let i = 0; i < state.dataCount; i++) {
            const randomNumber = Math.floor(Math.random() * state.maxNumberSize);
            state.data.push(randomNumber);
        }
    }
    const sortDataAtIndex = (): boolean => {
        if(state.selection.length < 2 || state.data.length <= state.selection[1]) return false;
        const a = state.data[state.selection[0]];
        const b = state.data[state.selection[1]];
        if(a <= b) return false;
        state.data[state.selection[0]] = b;
        state.data[state.selection[1]] = a;
        return true;
    }

    
    const isDataSorted = (): boolean => {
        for(let i = 0; i < state.data.length - 1; i++) {
            const a = state.data[i];
            const b = state.data[i+1];
            if(a > b) return false;
        }
        return true;
    };

    const drawBarChart = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, data: number[], selection?: number[]) => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const drawAreaWidth = canvasWidth - 5;
    const barWidth = drawAreaWidth / data.length;
    const maxBarHeight = Math.max(...data);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    data.forEach((value, index) => {
        const barHeight = (value / maxBarHeight) * (canvasHeight - 30); // Leave space for value text
        const x = index * barWidth;
        const y = canvasHeight - barHeight - 30; // start from the top, begin to draw where the bar ends, leave space for the text
        
        // Draw the bar
        ctx.fillStyle = selection?.includes(index) ? "#f00" : "#666";
        ctx.fillRect(x+5, y+5, barWidth - 5, barHeight); // Leave some space between bars
        ctx.strokeStyle = selection?.includes(index) ? "#5e0000" : "#222";
        ctx.strokeRect(x+5, y+5, barWidth - 5, barHeight);

        // Draw the value above the bar
        ctx.fillStyle = "#000";
        
        ctx.font = "16px arial";
        ctx.textRendering = "optimizeSpeed";
        const xPosition = value < 10 ?  x + barWidth / 2 - 5.5 : x + barWidth / 2 - 11;
        ctx.fillText(`[${value}]`, xPosition, canvasHeight - 5);
    });
};

const drawCanvas = (data: number[], canvas?: HTMLCanvasElement, selection?: number[]) => {
    if(!canvas) {
        console.error("no canvas")
        return;
    }
    const ctx = canvas.getContext("2d");
    if(!ctx) {
        console.error("no context")
        return;
    }

    drawBarChart(canvas, ctx, data, selection);
};

const drawRandomDataCanvas = () => {
    generateRandomData();
    state.selection = [];
    state.steps = [];
    drawCanvas(state.data, canvasElement);
};

const updateSelectionIndex = () => {
    const lastIndex = state.selection.pop();
    state.selection.pop();
    if(!lastIndex)  throw new Error(`last index should not be undefined!`)
    state.selection.push(lastIndex);
    state.selection.push(lastIndex + 1);
}

const nextGeneration = () => {
    state.steps.push({data: [...state.data], selection: [...state.selection]});
    if(!sortDataAtIndex()) {
        updateSelectionIndex();
    }
    let isSorted = false;
    if(state.selection[state.selection.length - 1] >= state.data.length) {
        if(isDataSorted()) {
            // is the selection at the end of data
            // and is the data sorted? then quit animation
            state.selection = [];
            isSorted = true;
        } else {
            // reset selection to the begining
            state.selection = [0, 1];
        }
    }
    return isSorted;
}

const stepForward = () => {
    if(isDataSorted() && state.selection.length === 0) return;
    if(state.data.length === 0) generateRandomData();
    if(state.selection.length === 0) state.selection = [0, 1];
    nextGeneration();
    drawCanvas(state.data, canvasElement, state.selection);
}

const stepBackward = () => {
    if(state.steps.length === 0) return;
    let lastStep = state.steps.pop();
    if(!lastStep) return;
    state.data = lastStep.data;
    state.selection = lastStep.selection;
    drawCanvas(lastStep.data, canvasElement, lastStep.selection);
};

const clearAnimationInterval = () => {
    clearInterval(animationIntervalId);
    animationIntervalId = undefined;
}

const startSelectionAnimation = () => {
    if(state.data.length === 0) generateRandomData();
    if(state.selection.length === 0) state.selection = [0, 1];
    drawCanvas(state.data, canvasElement, state.selection);
    animationIntervalId = setInterval(async () => {
        const isSorted = nextGeneration()
        drawCanvas(state.data, canvasElement, state.selection);
        if(isSorted) {
            clearAnimationInterval();
        }
    }, state.animationIntervalTimeout);
};

const animation = () => {
    if(animationIntervalId) {
        clearAnimationInterval();
        setControlsDisabledState(false);
        return;
    }
    setControlsDisabledState(true);
    startSelectionAnimation();
}

const handleInput = (event: InputEvent) => {
    if(!event.target || !(event.target instanceof HTMLInputElement)) return;
    const rawValue = event.target.value;
    let numberValue = state.animationIntervalTimeout;
    try {
        numberValue = parseInt(rawValue);
    } catch (error) {
        if(error instanceof Error) {
            console.error(error.message);
        }
    }
    if(numberValue < 1) numberValue = 1;
    if(numberValue > 5000) numberValue = 5000;
    state.animationIntervalTimeout = numberValue;
    event.target.value = state.animationIntervalTimeout.toString();
}

const skipBack = () => {
    clearAnimationInterval();
    if(state.steps.length === 0) return;
    const firstStep = state.steps[0];
    state.data = firstStep.data;
    state.steps = [];
    state.selection = [0, 1];
    drawCanvas(state.data, canvasElement);
}

const skipForward = () => {
    clearAnimationInterval();
    if(state.data.length === 0) generateRandomData();
    if(state.selection.length === 0) state.selection = [0, 1];
    // TODO: optimize
    let isSorted = nextGeneration();
    while(!isSorted) {
        isSorted = nextGeneration();
    }
    drawCanvas(state.data, canvasElement);
}

const setControlsDisabledState = (state: boolean) => {
    playButton.innerText = state ? "pause" : "play";
    randomizeButton.disabled = state;
    skipBackButton.disabled = state;
    stepBackButton.disabled = state;
    stepForwardButton.disabled = state;
    skipForwardButton.disabled = state;
    intervalTimeoutInput.disabled = state
}

const setup = () => {
    randomizeButton.onclick = drawRandomDataCanvas;
    playButton.onclick = animation;
    skipBackButton.onclick = skipBack;
    stepBackButton.onclick = stepBackward;
    stepForwardButton.onclick = stepForward;
    skipForwardButton.onclick = skipForward;
    intervalTimeoutInput.oninput = (event) => handleInput(event as InputEvent);
    intervalTimeoutInput.value = state.animationIntervalTimeout.toString();
}

window.onload = () => {
    drawRandomDataCanvas();
    setup();
}