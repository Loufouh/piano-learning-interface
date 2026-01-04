"use client";

import { Interval, Note } from "@loufouh/solfege";
import { useState } from "react";
import Soundfont, { type Player } from "soundfont-player";

export default function Piano() {
	const [audioContext, setAudioContext] = useState(new AudioContext());
	const [pianoInstrument, setPianoInstrument] = useState<Player | null>(null);
	const [note, setNote] = useState<Note>(Note.fromString("C4"));

	const [keys, setKeys] = useState<Note[]>([]);

	const createPiano = async () => {
		const piano = await Soundfont.instrument(
			audioContext,
			"acoustic_grand_piano",
		);
		setPianoInstrument(piano);

		setKeys([
			Note.fromString("C4"),
			Note.fromString("D4"),
			Note.fromString("E4"),
			Note.fromString("F4"),
			Note.fromString("G4"),
			Note.fromString("A4"),
			Note.fromString("B4"),
		]);
	};

	const playNote = () => {
		pianoInstrument?.play(note.toString(), 0, { gain: 0.99 });

		pianoInstrument?.stop(audioContext.currentTime + 1);
	};

	const playKey = (key: Note) => {
		pianoInstrument?.play(key.toString(), 0, { duration: 1 });
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
					<div className="bg-blue-700 p-3 rounded w-13 font-bold text-white text-center">
						{note.toString()}
					</div>
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
					{keys.length > 0 && (
						<div>
							{keys.map((key) => (
								<button
									type="button"
									key={key.toString()}
									className="bg-white hover:bg-gray-300 border border-black w-10 h-10"
									onClick={() => playKey(key)}
								>
									{key.toString()}
								</button>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}
