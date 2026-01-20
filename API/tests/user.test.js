import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../index.js";
import {
	connectUser,
	createUser,
	getNonExistingUserId,
	promoteToManager,
	unpromoteFromManager,
} from "./utils/user.js";

const prisma = new PrismaClient();

let connectedUser;
let otherUser;

beforeAll(async () => {
	await prisma.user.deleteMany().catch(() => {});

	connectedUser = await createUser();
	connectedUser = connectUser(connectedUser);

	otherUser = await createUser();
});

afterAll(async () => {
	await prisma.user.deleteMany().catch(() => {});
	await prisma.$disconnect();
});

afterEach(async () => {
	connectedUser = await unpromoteFromManager(connectedUser);
});

describe("GET /user/all", () => {
	it("Should return all users", async () => {
		connectedUser = await promoteToManager(connectedUser);

		const response = await request(app)
			.get("/user/all")
			.set("Authorization", `Bearer ${connectedUser.token}`);

		expect(response.statusCode).toBe(200);

		expect(response.body.users.length).toBe(2);

		expect(response.body.users[0].id).toBe(connectedUser.id);
		expect(response.body.users[0].name).toBe(connectedUser.name);
		expect(response.body.users[0].email).toBe(connectedUser.email);
		expect(response.body.users[0].phoneNumber).toBe(connectedUser.phoneNumber);
		expect(response.body.users[0].isManager).toBe(connectedUser.isManager);
		expect(response.body.users[0].password).toBeUndefined();

		expect(response.body.users[1].id).toBe(otherUser.id);
		expect(response.body.users[1].name).toBe(otherUser.name);
		expect(response.body.users[1].email).toBe(otherUser.email);
		expect(response.body.users[1].phoneNumber).toBe(otherUser.phoneNumber);
		expect(response.body.users[1].isManager).toBe(otherUser.isManager);
		expect(response.body.users[1].password).toBeUndefined();
	});
	it("Should return 401 if not a manager", async () => {
		const response = await request(app)
			.get("/user/all")
			.set("Authorization", `Bearer ${connectedUser.token}`);

		expect(response.statusCode).toBe(401);
	});
	it("Should return 401 if not authenticated", async () => {
		const response = await request(app).get("/user/all");

		expect(response.statusCode).toBe(401);
	});
});

describe("GET /user/:id", () => {
	it("Should return the specified user", async () => {
		connectedUser = await promoteToManager(connectedUser);

		const response = await request(app)
			.get(`/user/${otherUser.id}`)
			.set("Authorization", `Bearer ${connectedUser.token}`);

		expect(response.statusCode).toBe(200);

		expect(response.body.id).toBe(otherUser.id);
		expect(response.body.name).toBe(otherUser.name);
		expect(response.body.email).toBe(otherUser.email);
		expect(response.body.phoneNumber).toBe(otherUser.phoneNumber);
		expect(response.body.isManager).toBe(otherUser.isManager);
		expect(response.body.password).toBeUndefined();
	});
	it("Should return 404 if the user does not exist", async () => {
		connectedUser = await promoteToManager(connectedUser);
		const nonExistingId = await getNonExistingUserId();

		const response = await request(app)
			.get(`/user/${nonExistingId}`)
			.set("Authorization", `Bearer ${connectedUser.token}`);

		expect(response.statusCode).toBe(404);
	});
	it("Should return 401 if not a manager", async () => {
		const response = await request(app)
			.get(`/user/${otherUser.id}`)
			.set("Authorization", `Bearer ${connectedUser.token}`);

		expect(response.statusCode).toBe(401);
	});
	it("Should return 401 if not authenticated", async () => {
		const response = await request(app).get(`/user/${otherUser.id}`);

		expect(response.statusCode).toBe(401);
	});
});
