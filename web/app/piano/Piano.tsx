"use client";

import { useState } from "react";
import Soundfont, { type Player } from "soundfont-player";
import Interval from "@/utils/Notes/Interval";
import Note from "../../utils/Notes/Note";

export default function Piano() {
	const [pianoInstrument, setPianoInstrument] = useState<Player | null>(null);
	const [note, setNote] = useState<Note>(Note.fromString("C4"));

	const createPiano = async () => {
		const ctx = new AudioContext();
		const piano = await Soundfont.instrument(ctx, "acoustic_grand_piano");
		setPianoInstrument(piano);
	};

	const playNote = () => {
		pianoInstrument?.play(note.toString());
		console.log(`playing: ${note.toString()}`);
	};

	const transposeUp = () => {
		setNote(note.transposeUp(new Interval(1)));
	};
	const transposeDown = () => {
		setNote(note.transposeDown(new Interval(1)));
	};

	return (
		<div className="flex flex-col justify-center items-center w-screen h-screen">
			{pianoInstrument === null && (
				<button
					className="hover:bg-blue-700 p-2 border-8 border-blue-700 hover:border-white rounded font-bold text-blue-700 hover:text-white"
					type="button"
					onClick={createPiano}
				>
					Create Piano
				</button>
			)}

			{pianoInstrument && (
				<>
					<button
						className="hover:bg-black m-3 p-2 border-3 hover:border-white rounded w-10 h-10 font-bold hover:text-white"
						type="button"
						onClick={transposeUp}
					>
						^
					</button>
					<button
						className="hover:bg-green-700 p-2 border-8 border-green-700 hover:border-white rounded font-bold text-green-700 hover:text-white"
						type="button"
						onClick={playNote}
					>
						Play
					</button>{" "}
					<button
						className="hover:bg-black m-3 p-2 border-3 hover:border-white rounded w-10 h-10 font-bold hover:text-white"
						type="button"
						onClick={transposeDown}
					>
						v
					</button>
				</>
			)}
		</div>
	);
}
