"use client";

import { useState } from "react";
import Interval from "../Notes/Interval";
import Note from "../Notes/Note";

export default function piano() {
	const [message, setMessage] = useState("");
	const [txt, setTxt] = useState("");

	const validate = () => {
		try {
			const interval = new Interval(parseInt(txt));
			setMessage(`Note: ${interval.toString()}`);
		} catch (e) {
			setMessage(`Error: ${e.message}`);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center bg-gray-400 w-screen h-screen">
			{message.length > 0 && (
				<p className="bg-blue-300 mb-4 p-4 rounded-3xl animate-bounce">
					{message}
				</p>
			)}
			<input
				className="bg-white mb-2 p-3 rounded"
				type="number"
				value={txt}
				onChange={(e) => setTxt(`${Math.abs(parseInt(e.target.value))}`)}
				placeholder="Note"
			/>

			<button
				className="bg-green-400 p-3 border-3 rounded-3xl"
				type="button"
				onClick={validate}
			>
				Valider
			</button>
		</div>
	);
}
