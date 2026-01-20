import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

export async function createUser() {
	return await prisma.user.create({
		data: {
			name: "FakeName",
			email: `${faker.string.uuid()}@mail.com`,
			phoneNumber: faker.phone.number(),
			password: "haçze!hjfiuqsdf",
		},
	});
}

export function connectUser(user) {
	user.token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
	return user;
}

export async function promoteToManager(user) {
	const promotedUser = await prisma.user.update({
		where: { id: user.id },
		data: { isManager: true },
	});

	if (user.token) promotedUser.token = user.token;

	return promotedUser;
}

export async function unpromoteFromManager(user) {
	const unpromotedUser = await prisma.user.update({
		where: { id: user.id },
		data: { isManager: false },
	});

	if (user.token) unpromotedUser.token = user.token;

	return unpromotedUser;
}

export async function getNonExistingUserId() {
	const maxIdUser = await prisma.user.findMany({
		orderBy: {
			id: "desc",
		},
		take: 1,
	});

	return maxIdUser[0].id + 1;
}
