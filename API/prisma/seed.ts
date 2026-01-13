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
	await prisma.user.create({
		data: {
			name: "TestUser",
			email: "user@mail.com",
			password: await bcrypt.hash(process.env.TEST_MANAGER_PASSWORD, 10),
			isManager: false,
		},
	});
	const manager = (await prisma.user.findUnique({
		where: { email: "manager@mail.com" },
	})) || { id: -1 };
	const user = (await prisma.user.findUnique({
		where: { email: "user@mail.com" },
	})) || { id: -1 };

	await prisma.spaceItem.createMany({
		data: [
			{
				text: "Bonjour",
				linkUrl:
					"https://www.shutterstock.com/image-vector/bonjour-text-inscription-handwriting-banner-600nw-2427608041.jpg",
			},
			{
				text: "Au revoir",
				linkUrl: "https://www.google.com/search?q=au+revoir",
			},
			{
				text: "Hé, je suis là aussi :3",
				linkUrl: "https://youtu.be/s4ExNz_xgZ4?si=Ieh2KTKF3syK3z7K&t=26",
			},
			{
				text: "Tu vas bien ? :eyes:",
				linkUrl: "https://www.google.com/search?q=tu+vas+bien+%3Aeyes%3A",
			},
		],
	});
	const spaceItems = await prisma.spaceItem.findMany();
	await prisma.spaceItemsOnUsers.createMany({
		data: [
			// Manager
			{
				order: 0,
				spaceItemId: spaceItems[0].id,
				userId: manager.id,
			},
			{
				order: 1,
				spaceItemId: spaceItems[2].id,
				userId: manager.id,
			},
			{
				order: 2,
				spaceItemId: spaceItems[1].id,
				userId: manager.id,
			},
			// User
			{
				order: 0,
				spaceItemId: spaceItems[3].id,
				userId: user.id,
			},
		],
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
