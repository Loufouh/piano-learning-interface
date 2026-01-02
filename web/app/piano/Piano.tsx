"use client";

import { useEffect, useState } from "react";
import Soundfont, { type Player } from "soundfont-player";
import Note from "../../utils/Notes/Note";

export default function Piano() {
	const [pianoInstrument, setPianoInstrument] = useState<Player | null>(null);
	const [note, setNote] = useState<Note>(Note.fromString("C4"));

	const increaseSemitone = () => {
		setNote(note.shiftBySemitones(1));
	};
	const decreaseSemitone = () => {
		setNote(note.shiftBySemitones(-1));
	};

	window.addEventListener("load", async () => {
		console.log("Creating the Piano...");

		const ctx = new AudioContext();
		const piano = await Soundfont.instrument(ctx, "acoustic_grand_piano");

		setPianoInstrument(piano);
	});

	useEffect(() => {
		if (!pianoInstrument) return;

		console.log("piano set!");
		const playNote = () => {
			pianoInstrument.play(note.toString());
			console.log(`playing: ${note.toString()} (${note.MidiCode})`);
		};

		playNote();
		const intervalId = setInterval(playNote, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [pianoInstrument, note]);
	return (
		<div>
			<button
				className="p-2 border-3 rounded"
				type="button"
				onClick={increaseSemitone}
			>
				Increase
			</button>
			<button
				className="p-2 border-3 rounded"
				type="button"
				onClick={decreaseSemitone}
			>
				Decrease
			</button>
		</div>
	);
}
