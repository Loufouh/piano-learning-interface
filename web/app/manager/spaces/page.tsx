"use server";

import Link from "next/link";
import type { UserType } from "@/app/types/UserType";
import { apiGet } from "@/utils/api";

export default async function SpacesPage() {
	const allUsersResponse = await apiGet("/user/all");
	const allUsers: UserType[] = (await allUsersResponse.json()).users;

	return (
		<div className="flex flex-col items-center">
			<h1 className="mt-5 mb-10 font-bold text-3xl">Espaces</h1>
			<ul className="flex flex-col items-center gap-5">
				{allUsers.map((user: UserType) => (
					<Link
						className="bg-cyan-500 p-4 rounded font-bold text-white"
						href={`/manager/spaces/${user.id}`}
						key={user.id}
					>
						{user.name}
					</Link>
				))}
			</ul>
		</div>
	);
}
