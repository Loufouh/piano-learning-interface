"use client";

let playEnabled = false; 

export function drawControl(drawFunction: Function, ctx: CanvasRenderingContext2D, lastTime: number) {
    const time = Date.now();
    const deltaTime = .001 * (time - lastTime);

    drawFunction(ctx, deltaTime);

    if (playEnabled)
        requestAnimationFrame(drawControl.bind(null, drawFunction, ctx, time));
}

export function startPlaying(drawFunction: Function, ctx: CanvasRenderingContext2D) {
    if (playEnabled)
        return;

    playEnabled = true;

    const startTime = Date.now();

    drawControl(drawFunction, ctx, startTime);
}

export function stopPlaying() {
    playEnabled = false;
}