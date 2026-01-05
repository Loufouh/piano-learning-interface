"use client";

import { Interval, Note } from "@loufouh/solfege";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Soundfont, { type Player } from "soundfont-player";

export default function EarTraining() {
	const [audioContext, setAudioContext] = useState(new AudioContext());
	const [pianoInstrument, setPianoInstrument] = useState<Player | null>(null);
	const [message, setMessage] = useState<string>("");
	const [win, setWin] = useState<boolean>(false);
	const [startNote, setStartNote] = useState<Note>(Note.fromString("C4"));

	const [intervalToGuess, setIntervalToGuess] = useState<Interval>(
		Interval.fromString("M3"),
	);

	useEffect(() => {
		if (!pianoInstrument) return;

		const note1 = startNote;
		const note2 = note1.transposeUp(intervalToGuess);

		const intervalId = setInterval(() => {
			if (message !== "") clearInterval(intervalId);
			pianoInstrument.play(note1.toString(), 0, { duration: 2 });
			pianoInstrument.play(note2.toString(), audioContext.currentTime + 0.3, {
				duration: 1.7,
			});
		}, 2000);

		return () => clearInterval(intervalId);
	}, [startNote, intervalToGuess, pianoInstrument]);

	const pickInterval = () => {
		const interval = Interval.fromString(Math.random() > 0.5 ? "M3" : "P5");
		setIntervalToGuess(interval);
	};

	const pickStartNote = () => {
		const C4 = Note.fromString("C4");
		const midiCode = C4.MidiCode + Math.floor(Math.random() * 12);

		setStartNote(Note.fromMidiCode(midiCode));
	};

	const start = async () => {
		const piano = await Soundfont.instrument(
			audioContext,
			"acoustic_grand_piano",
		);
		setPianoInstrument(piano);
	};

	const playNote = (note: Note, when: number = 0) => {
		pianoInstrument?.play(note.toString(), when, { duration: 1 });
	};

	const guess = (interval: Interval) => {
		if (interval.equals(intervalToGuess)) {
			setWin(true);
			setMessage("Correct!");
		} else {
			setWin(false);
			setMessage("Wrong!");
		}

		setTimeout(() => {
			setMessage("");
			pickStartNote();
			pickInterval();
		}, 2000);
	};

	return (
		<div className="flex flex-col justify-center items-center w-screen h-screen">
			{pianoInstrument === null && (
				<button
					className="hover:bg-blue-700 p-2 border-8 border-blue-700 hover:border-white rounded font-bold text-blue-700 hover:text-white"
					type="button"
					onClick={start}
				>
					Start
				</button>
			)}
			{pianoInstrument && (
				<>
					{message !== "" && (
						<h2
							className={clsx(
								"mb-5 p-3 border-3 border-black rounded-full font-bold text-4xl",
								win ? "text-green-500" : "text-red-500",
							)}
						>
							{message}
						</h2>
					)}
					<h1 className="mb-10 p-3 border-3 border-black rounded-full font-bold text-8xl">
						?
					</h1>
					<div className="flex flex-row gap-4">
						<button
							className="bg-orange-400 p-4 rounded font-bold text-white cursor-pointer"
							type="button"
							onClick={() => guess(Interval.fromString("M3"))}
						>
							Tierce Majeure (M3)
						</button>
						<button
							className="bg-green-500 p-4 rounded font-bold text-white cursor-pointer"
							type="button"
							onClick={() => guess(Interval.fromString("P5"))}
						>
							Quinte (P5)
						</button>
					</div>
				</>
			)}
		</div>
	);
}
