import { planAudio, playAudio } from "../utils/audio";
import Color from "../utils/Color";
import { setupAudio, setupUserInput } from "./setupFunctions";

const bpm = 60;

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
}

function handleMetronome(deltaTime: number) {
    const beatPeriod = 60 / bpm;
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