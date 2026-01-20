"use server";

import Link from "next/link";
import { apiGet } from "@/utils/api";

export default async function SpacesPage() {
	const allUsers = await apiGet("/users");
	return (
		<div>
			<h1>Espaces</h1>
			<ul className="flex flex-col items-center gap-5">
				<Link className="bg-cyan-500 p-4 rounded font-bold text-white" href="#">
					Eytann
				</Link>
				<Link className="bg-cyan-500 p-4 rounded font-bold text-white" href="#">
					Paul
				</Link>
				<Link className="bg-cyan-500 p-4 rounded font-bold text-white" href="#">
					Manuel
				</Link>
			</ul>
		</div>
	);
}
