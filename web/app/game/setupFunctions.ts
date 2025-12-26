import { loadAudio, setupAudioContext } from "../utils/audio";

export function setupAudio() {
    setupAudioContext();

    loadAudio("Ride Bell", "./audio/Ride Bell.mp3");
    loadAudio("Side Kick", "./audio/Snare Side Kick.mp3");
    loadAudio("Snare", "./audio/Snare.mp3");
    loadAudio("Tom 10", "./audio/Tom 10.mp3");
}

export function setupUserInput(triggerTouch: () => void) {
    window.addEventListener("touchstart", triggerTouch);
    window.addEventListener("mousedown", triggerTouch);
    window.addEventListener("keydown", e => {
        if (e.key === " ")
            triggerTouch();
    });
}