"use client";

import clsx from "clsx";

export enum MessageType {
	Info = "info",
	Success = "success",
	Error = "error",
}

export default function MessageBox({
	text,
	type,
}: {
	text: string;
	type: MessageType;
}) {
	const textLines = text.split("\n");

	return (
		<div
			className={clsx(
				"border-3",
				type === MessageType.Info && "text-black-500 border-gray-300",
				type === MessageType.Success && "text-green-500 border-green-500",
				type === MessageType.Error && "text-red-500 border-red-500",
			)}
		>
			{textLines.map((line, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: It Doesn't matter
				<p key={index}>{line}</p>
			))}
		</div>
	);
}
