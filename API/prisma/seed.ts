import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	await prisma.user.create({
		data: {
			name: "TestManager",
			email: "manager@mail.com",
			password: await bcrypt.hash(process.env.TEST_MANAGER_PASSWORD, 10),
			isManager: true,
		},
	});

	console.log("✅ Fixtures insérées avec succès !");
}

main()
	.then(() => prisma.$disconnect())
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
