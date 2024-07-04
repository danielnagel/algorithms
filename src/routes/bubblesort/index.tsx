import { $, component$, useOnWindow, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from './style.module.css';

const drawBarChart = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, data: number[]) => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const barWidth = canvasWidth / data.length;
    const maxBarHeight = Math.max(...data);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    data.forEach((value, index) => {
        const barHeight = (value / maxBarHeight) * (canvasHeight - 30); // Leave space for value text
        const x = index * barWidth;
        const y = canvasHeight - barHeight - 30; // start from the top, begin to draw where the bar ends, leave space for the text
        
        // TODO: fill selected index bar in different color
        // Draw the bar
        ctx.fillStyle = "#666";
        ctx.fillRect(x+5, y+5, barWidth - 10, barHeight); // Leave some space between bars
        ctx.strokeStyle = "#222";
        ctx.strokeRect(x+5, y+5, barWidth - 10, barHeight);

        // Draw the value above the bar
        ctx.fillStyle = "#000";
        
        ctx.font = "16px arial";
        ctx.textRendering = "optimizeSpeed";
        ctx.fillText(`[${value}]`, x + barWidth / 2 - 12, canvasHeight - 5);
    });
}

const drawCanvas = (data: number[], canvas?: HTMLCanvasElement) => {
    if(!canvas) {
        console.error("no canvas")
        return;
    }
    const ctx = canvas.getContext("2d");
    if(!ctx) {
        console.error("no context")
        return;
    }

    drawBarChart(canvas, ctx, data);
}

const generateRandomNumbers = (count: number) => {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        const randomNumber = Math.floor(Math.random() * 101);
        numbers.push(randomNumber);
    }
    return numbers;
}


export default component$(() => {
    const canvasRef = useSignal<HTMLCanvasElement>();
    const dataCount = 5;

    const drawRandomDataCanvas = $(() => {
        const data = generateRandomNumbers(dataCount);
        drawCanvas(data, canvasRef.value);
    });

    useOnWindow('load', $((_event) => {
        drawRandomDataCanvas();
    }));

    return (
        <>
            <h1>Bubble Sort</h1>
            <div>
                <canvas class={styles.canvas} ref={canvasRef} width="500" height="400"></canvas>
                <button onClick$={drawRandomDataCanvas}>random data</button>
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
