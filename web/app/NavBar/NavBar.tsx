"use server";

import Link from "next/link";
import { isConnected, isManagerConnected } from "@/utils/auth";
import LogOutButton from "../login/LogOutButton";

export default async function NavBar() {
	const isUserConnected = await isConnected();
	const isManager = await isManagerConnected();

	return (
		<nav className="bg-blue-300 p-3 h-25">
			<ul className="flex flex-row justify-end items-center gap-10">
				{isManager && (
					<Link
						className="bg-purple-700 p-2 rounded text-white"
						href="/manager"
					>
						Manager
					</Link>
				)}
				{isUserConnected ? (
					<>
						<Link
							className="bg-green-600 p-2 rounded text-white"
							href="/mySpace"
						>
							Mon espace
						</Link>
						<LogOutButton />
					</>
				) : (
					<Link href="/login" className="bg-orange-400 p-2 rounded text-white">
						Se connecter
					</Link>
				)}
			</ul>
		</nav>
	);
}
