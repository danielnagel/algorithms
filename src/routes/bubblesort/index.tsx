import { component$, useOnWindow, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const drawHouse = (canvas?: HTMLCanvasElement) => {
    if(!canvas) {
        console.error("no canvas")
        return;
    }
    const ctx = canvas.getContext("2d");
    if(!ctx) {
        console.error("no context")
        return;
    }
    ctx.lineWidth = 10;

    // Wall
    ctx.strokeRect(75, 140, 150, 110);

    // Door
    ctx.fillRect(130, 190, 40, 60);

    // Roof
    ctx.beginPath();
    ctx.moveTo(50, 140);
    ctx.lineTo(150, 60);
    ctx.lineTo(250, 140);
    ctx.closePath();
    ctx.stroke();
}

export default component$(() => {
    const canvasRef = useSignal<HTMLCanvasElement>();
    useOnWindow('load', $((_event) => {
        drawHouse(canvasRef.value);
       })
    );

    return (
        <>
            <h1>Bubble Sort</h1>
            <div>
                <canvas ref={canvasRef} width="500" height="400"></canvas>
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
