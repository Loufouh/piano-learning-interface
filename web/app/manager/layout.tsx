import { redirect } from "next/navigation";
import { isManagerConnected } from "@/utils/auth";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const isManager = await isManagerConnected();
	if (!isManager) {
		redirect("/");
	}

	return <div>{children}</div>;
}
