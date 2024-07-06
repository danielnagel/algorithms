import { $, component$, noSerialize, useOnWindow, useSignal, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from './style.module.css';



export default component$(() => {
    const canvasRef = useSignal<HTMLCanvasElement>();
    const state = useStore<CanvasDataStore>({
        data: [],
        dataCount: 35,
        maxNumberSize: 100,
        generateRandomData: $(function (this: CanvasDataStore): void {
            this.data = [];
            for (let i = 0; i < this.dataCount; i++) {
                const randomNumber = Math.floor(Math.random() * this.maxNumberSize);
                this.data.push(randomNumber);
            }
        }),
        selection: [],
        animationIntervalTimeout: 50,
        sortDataAtIndex: $(function (this: CanvasDataStore): boolean {
            if(this.selection.length < 2 || this.data.length <= this.selection[1]) return false;
            const a = this.data[this.selection[0]];
            const b = this.data[this.selection[1]];
            if(a <= b) return false;
            this.data[this.selection[0]] = b;
            this.data[this.selection[1]] = a;
            return true;
        }),
        isDataSorted: $(function (this: CanvasDataStore): boolean {
            for(let i = 0; i < this.data.length - 1; i++) {
                const a = this.data[i];
                const b = this.data[i+1];
                if(a > b) return false;
            }
            return true;
        })
    });

    const drawBarChart = $((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, data: number[], selection?: number[]) => {
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
    });
    
    const drawCanvas = $((data: number[], canvas?: HTMLCanvasElement, selection?: number[]) => {
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
    });

    const drawRandomDataCanvas = $(async () => {
        await state.generateRandomData();
        state.selection = [];
        drawCanvas(state.data, canvasRef.value);
    });

    const clearAnimationInterval = $(() => {
        state.clearInterval && state.clearInterval();
        state.clearInterval = undefined;
    })

    const updateSelectionIndex = $(() => {
        const lastIndex = state.selection.pop();
        state.selection.pop();
        if(!lastIndex)  throw new Error(`last index should not be undefined!`)
        state.selection.push(lastIndex);
        state.selection.push(lastIndex + 1);
    })

    const animationStep = $(async () => {
        if(! await state.sortDataAtIndex()) {
            updateSelectionIndex();
        }
        if(state.selection[state.selection.length - 1] >= state.data.length) {
            if(await state.isDataSorted()) {
                // is the selection at the end of data
                // and is the data sorted? then quit animation
                clearAnimationInterval();
                state.selection = [];
            } else {
                // reset selection to the begining
                state.selection = [0, 1];
            }
        }
        drawCanvas(state.data, canvasRef.value, state.selection);
    });

    const stepForward = $(async () => {
        if(state.data.length === 0) await state.generateRandomData();
        if(state.selection.length === 0) state.selection = [0, 1];
        animationStep();
    });

    const startSelectionAnimation = $(async () => {
        if(state.data.length === 0) await state.generateRandomData();
        if(state.selection.length === 0) state.selection = [0, 1];
        drawCanvas(state.data, canvasRef.value, state.selection);
        const intervalId = setInterval(animationStep, state.animationIntervalTimeout);
        state.clearInterval = noSerialize(() => {
            clearInterval(intervalId);
        })
    });

    const animation = $(() => {
        if(state.clearInterval) {
            clearAnimationInterval();
            return;
        }
        startSelectionAnimation();
    });

    const handleInput = $((event: InputEvent) => {
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
    })

    useOnWindow('load', $((_event) => {
        drawRandomDataCanvas();
    }));

    return (
        <>
            <h1>Bubble Sort 🧼</h1>
            <div>
                <a href="/">main page</a>
            </div>
            <div>
                <canvas class={styles.canvas} ref={canvasRef} width="1000" height="500"></canvas>
                <div>
                    <button disabled={!!state.clearInterval} onClick$={drawRandomDataCanvas}>random data</button>
                    <button onClick$={animation}>{state.clearInterval ? 'pause' : 'play'}</button>
                    <button disabled={!!state.clearInterval} onClick$={stepForward}>step forward</button>
                    <label for="interval-timeout">interval timeout</label>
                    <input disabled={!!state.clearInterval} name="interval-timeout" type="number" min={1} max={5000} onInput$={handleInput} value={state.animationIntervalTimeout}></input>
                </div>
            </div>
        </>
    );
});

export const head: DocumentHead = {
    title: "Algorithms - Bubble Sort",
    meta: [
        {
            name: "description",
            content: "This page visualizes the bubble sort algorithm.",
        },
    ],
};
