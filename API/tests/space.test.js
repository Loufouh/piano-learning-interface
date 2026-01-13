import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../index.js";
import { connectUser, createUser } from "./utils/user.js";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.spaceItemsOnUsers.deleteMany().catch(() => {});
	await prisma.spaceItem.deleteMany().catch(() => {});
	await prisma.user.deleteMany().catch(() => {});
});

afterAll(async () => {
	await prisma.$disconnect();
});

afterEach(async () => {
	await prisma.spaceItemsOnUsers.deleteMany().catch(() => {});
	await prisma.spaceItem.deleteMany().catch(() => {});
	await prisma.user.deleteMany().catch(() => {});
});

describe("GET /space/myItems", () => {
	it("Should Return The list of items of my space (in order)", async () => {
		const user = await createUser();
		const connectedUser = connectUser(user);

		await prisma.spaceItem.createMany({
			data: [{ text: "item1" }, { text: "item2" }, { text: "item3" }],
		});
		const items = await prisma.spaceItem.findMany({
			orderBy: { id: "asc" },
		});

		await prisma.spaceItemsOnUsers.createMany({
			data: [
				{ order: 0, spaceItemId: items[1].id, userId: connectedUser.id },
				{ order: 1, spaceItemId: items[0].id, userId: connectedUser.id },
				{ order: 2, spaceItemId: items[2].id, userId: connectedUser.id },
			],
		});

		const response = await request(app)
			.get("/space/myItems")
			.set("Authorization", `Bearer ${connectedUser.token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.items[0].id).toBe(items[1].id);
		expect(response.body.items[0].text).toBe(items[1].text);

		expect(response.body.items[1].id).toBe(items[0].id);
		expect(response.body.items[1].text).toBe(items[0].text);

		expect(response.body.items[2].id).toBe(items[2].id);
		expect(response.body.items[2].text).toBe(items[2].text);
	});
	it("Should Return 401 if user not connected", async () => {
		const response = await request(app).get("/space/myItems");

		expect(response.statusCode).toBe(401);
	});
});
