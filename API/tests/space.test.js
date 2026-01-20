import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../index.js";
import {
	connectUser,
	createUser,
	getNonExistingUserId,
	promoteToManager,
} from "./utils/user.js";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.spaceItemsOnUsers.deleteMany().catch(() => {});
	await prisma.spaceItem.deleteMany().catch(() => {});
	await prisma.user.deleteMany().catch(() => {});
});

afterAll(async () => {
	await prisma.spaceItemsOnUsers.deleteMany().catch(() => {});
	await prisma.spaceItem.deleteMany().catch(() => {});
	await prisma.user.deleteMany().catch(() => {});

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
			data: [
				{ text: "item1", linkUrl: "https://google.com" },
				{ text: "item2", linkUrl: "https://item2.com" },
				{ text: "item3", linkUrl: "https://item3.com" },
			],
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
		expect(response.body.items[0].linkUrl).toBe(items[1].linkUrl);

		expect(response.body.items[1].id).toBe(items[0].id);
		expect(response.body.items[1].text).toBe(items[0].text);
		expect(response.body.items[1].linkUrl).toBe(items[0].linkUrl);

		expect(response.body.items[2].id).toBe(items[2].id);
		expect(response.body.items[2].text).toBe(items[2].text);
		expect(response.body.items[2].linkUrl).toBe(items[2].linkUrl);
	});
	it("Should Return 401 if user not connected", async () => {
		const response = await request(app).get("/space/myItems");

		expect(response.statusCode).toBe(401);
	});
});

describe("GET /space/manager/itemsOfUser/:id", () => {
	it("Should Return The list of items of specified user", async () => {
		let managerUser = await createUser();
		managerUser = connectUser(managerUser);
		managerUser = await promoteToManager(managerUser);

		await prisma.spaceItem.createMany({
			data: [
				{ text: "item1", linkUrl: "https://google.com" },
				{ text: "item2", linkUrl: "https://item2.com" },
				{ text: "item3", linkUrl: "https://item3.com" },
			],
		});
		const items = await prisma.spaceItem.findMany({
			orderBy: { id: "asc" },
		});

		const user = await createUser();
		await prisma.spaceItemsOnUsers.createMany({
			data: [
				{ order: 0, spaceItemId: items[1].id, userId: user.id },
				{ order: 1, spaceItemId: items[0].id, userId: user.id },
				{ order: 2, spaceItemId: items[2].id, userId: user.id },
			],
		});

		const response = await request(app)
			.get(`/space/manager/itemsOfUser/${user.id})`)
			.set("Authorization", `Bearer ${managerUser.token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.items[0].id).toBe(items[1].id);
		expect(response.body.items[0].text).toBe(items[1].text);
		expect(response.body.items[0].linkUrl).toBe(items[1].linkUrl);

		expect(response.body.items[1].id).toBe(items[0].id);
		expect(response.body.items[1].text).toBe(items[0].text);
		expect(response.body.items[1].linkUrl).toBe(items[0].linkUrl);

		expect(response.body.items[2].id).toBe(items[2].id);
		expect(response.body.items[2].text).toBe(items[2].text);
		expect(response.body.items[2].linkUrl).toBe(items[2].linkUrl);
	});
	it("Should Return 404 if user not found", async () => {
		let managerUser = await createUser();
		managerUser = connectUser(managerUser);
		managerUser = await promoteToManager(managerUser);

		const nonExistingId = await getNonExistingUserId();

		const response = await request(app)
			.get(`/space/manager/itemsOfUser/${nonExistingId}`)
			.set("Authorization", `Bearer ${managerUser.token}`);

		expect(response.statusCode).toBe(404);
	});
	it("Should Return 401 if not authenticated as manager", async () => {
		let managerUser = await createUser();
		managerUser = connectUser(managerUser);

		const response = await request(app)
			.get(`/space/manager/itemsOfUser/${managerUser.id}`)
			.set("Authorization", `Bearer ${managerUser.token}`);

		expect(response.statusCode).toBe(401);
	});
	it("Should Return 401 if not authenticated", async () => {
		const user = await createUser();

		const response = await request(app).get(
			`/space/manager/itemsOfUser/${user.id}`,
		);

		expect(response.statusCode).toBe(401);
	});
});

describe("GET /space/manager/item/:id", () => {
	it("Should Return the specified item", async () => {
		let managerUser = await createUser();
		managerUser = connectUser(managerUser);
		managerUser = await promoteToManager(managerUser);

		await prisma.spaceItem.createMany({
			data: [{ text: "item", linkUrl: "https://google.com" }],
		});
		const item = await prisma.spaceItem.findFirst();

		const response = await request(app)
			.get(`/space/manager/item/${item.id}`)
			.set("Authorization", `Bearer ${managerUser.token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.id).toBe(item.id);
		expect(response.body.text).toBe(item.text);
		expect(response.body.linkUrl).toBe(item.linkUrl);
	});
	it("Should Return 404 if user not found", async () => {
		let managerUser = await createUser();
		managerUser = connectUser(managerUser);
		managerUser = await promoteToManager(managerUser);

		const nonExistingId = 1; // NonExisting, cause no item created

		const response = await request(app)
			.get(`/space/manager/item/${nonExistingId}`)
			.set("Authorization", `Bearer ${managerUser.token}`);

		expect(response.statusCode).toBe(404);
	});
	it("Should Return 401 if not authenticated as manager", async () => {
		let managerUser = await createUser();
		managerUser = connectUser(managerUser);

		const response = await request(app)
			.get(`/space/manager/item/1`)
			.set("Authorization", `Bearer ${managerUser.token}`);

		expect(response.statusCode).toBe(401);
	});
	it("Should Return 401 if not authenticated", async () => {
		const response = await request(app).get(`/space/manager/item/1`);

		expect(response.statusCode).toBe(401);
	});
});

describe("PATCH /space/manager/item/:id", () => {
	it("Should modify valid fields if specified", async () => {
		let managerUser = await createUser();
		managerUser = connectUser(managerUser);
		managerUser = await promoteToManager(managerUser);

		const item = await prisma.spaceItem.create({
			data: { text: "item", linkUrl: "https://google.com" },
		});

		const response = await request(app)
			.patch(`/space/manager/item/${item.id}`)
			.set("Authorization", `Bearer ${managerUser.token}`)
			.send({
				text: "newText",
				linkUrl: "https://newLink.com",
			});

		const dbItem = await prisma.spaceItem.findUnique({
			where: { id: item.id },
		});

		expect(response.statusCode).toBe(200);

		expect(dbItem.text).toBe("newText");
		expect(dbItem.linkUrl).toBe("https://newLink.com");
	});
	it("Should Return 404 if item not found", async () => {
		let managerUser = await createUser();
		managerUser = connectUser(managerUser);
		managerUser = await promoteToManager(managerUser);

		const nonExistingId = 1; // NonExisting, cause no item created

		const response = await request(app)
			.patch(`/space/manager/item/${nonExistingId}`)
			.set("Authorization", `Bearer ${managerUser.token}`)
			.send({
				text: "newText",
				linkUrl: "https://newLink.com",
			});

		expect(response.statusCode).toBe(404);
	});
	it("Should Return 401 if not authenticated as manager", async () => {
		let managerUser = await createUser();
		managerUser = connectUser(managerUser);

		const response = await request(app)
			.patch(`/space/manager/item/1`)
			.set("Authorization", `Bearer ${managerUser.token}`)
			.send({
				text: "newText",
				linkUrl: "https://newLink.com",
			});

		expect(response.statusCode).toBe(401);
	});
	it("Should Return 401 if not authenticated", async () => {
		const response = await request(app).get(`/space/manager/item/1`).send({
			text: "newText",
			linkUrl: "https://newLink.com",
		});

		expect(response.statusCode).toBe(401);
	});
	it("Should return 400 if unexpected fields/values are provided", async () => {
		let managerUser = await createUser();
		managerUser = connectUser(managerUser);
		managerUser = await promoteToManager(managerUser);

		const item = await prisma.spaceItem.create({
			data: { text: "item", linkUrl: "https://google.com" },
		});

		const response = await request(app)
			.patch(`/space/manager/item/${item.id}`)
			.set("Authorization", `Bearer ${managerUser.token}`)
			.send({
				bloup: "BLIIIIP",
			});

		expect(response.statusCode).toBe(400);
	});
});
