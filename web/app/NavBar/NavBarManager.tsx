"use client";

import { useSearchParams } from "next/navigation";
import NavBar from "./NavBar";

export default function NavBarManager() {
	const params = useSearchParams();
	const hide = params.get("hideNavBar");

	return hide ? null : <NavBar />;
}
