import { setupAudioContext, loadAudio, planAudio, playAudio } from "../utils/audio";
import Color from "../utils/Color";

const bpm = 120;

let timeSinceLastBeat: number;
let visualBeat_trigger: boolean;
let touchTriggered: boolean;

export function setup() {
    timeSinceLastBeat = 0;
    touchTriggered = false;

    setupAudioContext();

    loadAudio("Ride Bell", "./audio/Ride Bell.mp3");
    loadAudio("Side Kick", "./audio/Snare Side Kick.mp3");
    loadAudio("Snare", "./audio/Snare.mp3");
    loadAudio("Tom 10", "./audio/Tom 10.mp3");
}

export function draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    const beatPeriod = 60000 / bpm;
    timeSinceLastBeat += deltaTime;

    if (timeSinceLastBeat > beatPeriod - 1) {
        const timeDifference = timeSinceLastBeat - beatPeriod;
        planAudio("Side Kick", .001 * timeDifference);

        timeSinceLastBeat -= beatPeriod;
        visualBeat_trigger = true;
    }

    if (touchTriggered) {
        touchTriggered = false;

        playAudio("Tom 10");
    }

    if(visualBeat_trigger) {
        visualBeat_trigger = false;
        ctx.fillStyle = Color.random().toText();
        ctx.fillRect(0, 0, 700, 700);
    }
}