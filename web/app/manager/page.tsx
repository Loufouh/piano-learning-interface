"use server";

import Link from "next/link";

export default async function ManagerPage() {
	return (
		<div className="flex flex-col items-center gap-5 min-h-200">
			<Link
				className="bg-blue-600 p-4 rounded font-bold text-white"
				href="/manager/spaces"
			>
				Spaces
			</Link>
		</div>
	);
}
