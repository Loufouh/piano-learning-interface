import { planAudio, playAudio } from "../utils/audio";
import Color from "../utils/Color";
import { setupAudio, setupUserInput } from "./setupFunctions";
import {Vector2} from "../utils/Vector2";

const bpm = 10;
const beatPeriod = 60 / bpm;

let timeSinceLastBeat: number;
let visualBeat_trigger: boolean;
let touchTriggered: boolean;

export function setup() {
    timeSinceLastBeat = 0;
    touchTriggered = false;

    setupAudio();
    setupUserInput(() => touchTriggered = true);
}

export function draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    handleMetronome(deltaTime);
    handleTouchSound();
    handleVisualBeat(deltaTime, ctx);

    ctx.fillStyle = black.toText();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.moveTo(0, ctx.canvas.height * .5);
    ctx.lineTo(ctx.canvas.width, ctx.canvas.height * .5);
    ctx.moveTo(ctx.canvas.width * .5, 0);
    ctx.lineTo(ctx.canvas.width * .5, ctx.canvas.height);

    ctx.strokeStyle = "rgb(0, 0, 255)";
    ctx.lineWidth = 5;
    ctx.stroke();

    const startPoint = new Vector2(ctx.canvas.width, ctx.canvas.height * .5);
    const endPoint = new Vector2(ctx.canvas.width * .5, ctx.canvas.height * .5);

    const beatPos = Vector2.lerp(startPoint, endPoint, timeSinceLastBeat / beatPeriod);

    ctx.beginPath();
    ctx.arc(beatPos.x, beatPos.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = white.toText();
    ctx.fill();
}

function handleMetronome(deltaTime: number) {
    timeSinceLastBeat += deltaTime;

    if (timeSinceLastBeat > beatPeriod - .025) {
        const timeDifference = timeSinceLastBeat - beatPeriod;
        
        try {
            planAudio("Side Kick", timeDifference);
        } catch {
            console.error("Failed to plan audio");
        }

        timeSinceLastBeat -= beatPeriod;
        visualBeat_trigger = true;
    }
}

function handleTouchSound() {
    if (touchTriggered) {
        touchTriggered = false;

        playAudio("Tom 10");
    }
}

let white = new Color(255, 255, 255);
let black = new Color(0, 0, 0);
let t = 1;

function handleVisualBeat(deltaTime: number, ctx: CanvasRenderingContext2D) {
    t = Math.min(t + deltaTime , 1);
    if (visualBeat_trigger) {
        visualBeat_trigger = false;
        t = 0;
    }

    ctx.fillStyle = Color.lerp(white, black, t).toText();
    ctx.fillRect(0, 0, 700, 700);
}