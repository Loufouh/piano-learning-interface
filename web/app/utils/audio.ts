let audioCtx: AudioContext | null = null;
const audioData: Map<string, AudioBuffer> = new Map<string, AudioBuffer>();

export function setupAudioContext() {
    audioCtx = new AudioContext();
}

export function planAudio(name: string, delay: number) {
    createSource(name)
        .start(audioCtx!.currentTime + delay);
}

export async function playAudio(name: string) {
    if (audioCtx!.state === "suspended") {
        await audioCtx!.resume();
    }

    createSource(name).start();
}

export function createSource(name: string) {
    if (!audioData.has(name)) {
        throw new Error("Unknown audio: " + name);
    }

    const source = audioCtx!.createBufferSource();

    source.buffer = audioData.get(name)!;
    source.connect(audioCtx!.destination);

    return source;
}

export async function loadAudio(name: string, url: string) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();

    audioData.set(name, await audioCtx!.decodeAudioData(arrayBuffer));
}