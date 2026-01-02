"use client";

import { useState } from "react";
import Interval from "../../../utils/Notes/Interval";
import Note from "../../../utils/Notes/Note";

export default function piano() {
	const [note, setNote] = useState<Note>(Note.fromString("C4"));
	const [interval, setInterval] = useState<Interval>(new Interval(0));
	const [txt, setTxt] = useState("");

	const transposeDown = () => {
		setNote(note.transposeDown(interval));
	};

	const transposeUp = () => {
		setNote(note.transposeUp(interval));
	};

	const handleChange = (e) => {
		const semitones = Math.abs(parseInt(e.target.value, 10));

		setInterval(new Interval(semitones));
		setTxt(semitones.toString());
	};

	return (
		<div className="flex flex-col justify-center items-center bg-gray-400 w-screen h-screen">
			<p className="bg-blue-700 mb-4 p-4 rounded-3xl font-bold text-white animate-bounce">
				{note.toString()}
			</p>
			<input
				className="bg-white mb-2 p-3 rounded"
				type="number"
				value={txt}
				onChange={handleChange}
				placeholder="Semitones"
			/>
			<p className="bg-white mb-2 p-3 rounded">
				Interval: {interval.toString()}
			</p>

			<button
				className="bg-green-400 p-3 border-3 rounded-3xl"
				type="button"
				onClick={transposeUp}
			>
				Transpose Up
			</button>
			<button
				className="bg-green-400 p-3 border-3 rounded-3xl"
				type="button"
				onClick={transposeDown}
			>
				Transpose Down
			</button>
		</div>
	);
}
