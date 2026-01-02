"use server";

import Link from "next/link";

export default async function MySpace() {
	return (
		<div>
			<h1>My Space</h1>

			<Link
				href="/Musiques"
				className="bg-blue-800 opacity-90 p-4 rounded w-10 h-10 text-white text-2xl"
			>
				Musiques
			</Link>
			<Link
				href="/Technique"
				className="bg-blue-800 opacity-90 p-4 rounded w-10 h-10 text-white text-2xl"
			>
				Technique
			</Link>
			<Link
				href="/Jeux"
				className="bg-blue-800 opacity-90 p-4 rounded w-10 h-10 text-white text-2xl"
			>
				Jeux
			</Link>
		</div>
	);
}
