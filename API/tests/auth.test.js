import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../index.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

beforeAll(async () => {
	await prisma.user.deleteMany().catch(() => {});
});

afterAll(async () => {
	await prisma.$disconnect();
});

afterEach(async () => {
	await prisma.user.deleteMany().catch(() => {});
});

describe("POST /auth/register", () => {
	it("Should create a new user with hashed password", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "_1fakePassword",
		});

		const users = await prisma.user.findMany();
		const user = await prisma.user.findUnique({
			where: { email: "fakeEmail" },
		});

		expect(users.length).toBe(1);
		expect(user.email).toBe("fakeEmail");
		expect(user.name).toBe("fakeName");
		expect(user.password).not.toBe("_1fakePassword");

		expect(response.body.user.id).toBeGreaterThan(0);
		expect(response.body.user.name).toBe("fakeName");
		expect(response.body.user.email).toBe("fakeEmail");
		expect(response.body.user.password).toBeUndefined();
		expect(response.statusCode).toBe(200);
	});

	it("Should return 400 status if password missing", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
		});

		const users = await prisma.user.findMany();

		expect(users.length).toBe(0);
		expect(response.statusCode).toBe(400);
	});

	it("Should return 400 status if email missing", async () => {
		const response = await request(app).post("/auth/register").send({
			name: "fakeName",
			password: "fakePassword",
		});

		const users = await prisma.user.findMany();

		expect(users.length).toBe(0);
		expect(response.statusCode).toBe(400);
	});

	it("Should return 400 status if name missing", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "fakeEmail",
			password: "_1fakePassword",
		});

		const users = await prisma.user.findMany();

		expect(users.length).toBe(0);
		expect(response.statusCode).toBe(400);
	});

	it("Should return 409 status if email already registered", async () => {
		await prisma.user.create({
			data: {
				email: "fakeEmail",
				name: "fakeName",
				password: "_1fakePassword",
			},
		});

		const response = await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "_1fakePassword",
		});

		const users = await prisma.user.findMany();

		expect(users.length).toBe(1);
		expect(response.statusCode).toBe(409);
	});

	it("Should reject passwords with less than 8 chars", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "_1fakeP",
		});

		const users = await prisma.user.findMany();

		expect(users.length).toBe(0);
		expect(response.statusCode).toBe(400);
	});

	it("Should reject passwords with no lowercase", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "_1FAKEPASSWORD",
		});

		const users = await prisma.user.findMany();

		expect(users.length).toBe(0);
		expect(response.statusCode).toBe(400);
	});

	it("Should reject passwords with no uppercase", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "_1fakepassword",
		});

		const users = await prisma.user.findMany();

		expect(users.length).toBe(0);
		expect(response.statusCode).toBe(400);
	});

	it("Should reject passwords with no number", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "_fakePassword",
		});

		const users = await prisma.user.findMany();

		expect(users.length).toBe(0);
		expect(response.statusCode).toBe(400);
	});

	it("Should reject passwords with no special char", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "1fakePassword",
		});

		const users = await prisma.user.findMany();

		expect(users.length).toBe(0);
		expect(response.statusCode).toBe(400);
	});

	it("Should reject passwords containing spaces", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "1fake Password",
		});

		const users = await prisma.user.findMany();

		expect(users.length).toBe(0);
		expect(response.statusCode).toBe(400);
	});
});

describe("POST /auth/login", () => {
	it("Should return token when valid user", async () => {
		await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "_1fakePassword",
		});

		const response = await request(app).post("/auth/login").send({
			email: "fakeEmail",
			password: "_1fakePassword",
		});

		expect(response.statusCode).toBe(200);
		expect(response.body.token).not.toBeUndefined();

		const decoded = jwt.verify(response.body.token, JWT_SECRET);

		expect(decoded.userId).toBeGreaterThan(0);
		expect(decoded.exp - decoded.iat).toBe(86400);
	});

	it("Should return 401 when unknown email", async () => {
		await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "_1fakePassword",
		});

		const response = await request(app).post("/auth/login").send({
			email: "unknownEmail",
			password: "_1fakePassword",
		});

		expect(response.statusCode).toBe(401);
	});

	it("Should return 401 when wrong password", async () => {
		await request(app).post("/auth/register").send({
			email: "fakeEmail",
			name: "fakeName",
			password: "_1fakePassword",
		});

		const response = await request(app).post("/auth/login").send({
			email: "fakeEmail",
			password: "*2otherPass",
		});

		expect(response.statusCode).toBe(401);
	});
});

describe("POST /auth/checkToken", () => {
	it("Should return 200 if token valid", async () => {
		await prisma.user.create({
			data: {
				id: 1,
				email: "testEm",
				name: "testName",
				password: "fake",
			},
		});
		const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: "1d" });

		const response = await request(app)
			.get("/auth/checkToken")
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
	});

	it("Should return 401 if user does not exist", async () => {
		const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: "1d" });

		const response = await request(app)
			.get("/auth/checkToken")
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(401);
	});

	it("Should return 401 if token invalid", async () => {
		const token = "AOIHSDFIOHSDOFIHQSD";

		const response = await request(app)
			.get("/auth/checkToken")
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(401);
	});

	it("Should return 401 if no token provided", async () => {
		const response = await request(app).get("/auth/checkToken");

		expect(response.statusCode).toBe(401);
	});
});

describe("POST /auth/manager/login", () => {
	it("Should return token when valid manager", async () => {
		await prisma.user.create({
			data: {
				email: "managerEmail",
				name: "managerName",
				password: await bcrypt.hash("_1managerPassword", 10),
				isManager: true,
			},
		});

		const response = await request(app).post("/auth/manager/login").send({
			email: "managerEmail",
			password: "_1managerPassword",
		});

		expect(response.statusCode).toBe(200);

		const decoded = jwt.verify(response.body.token, JWT_SECRET);

		expect(decoded.userId).toBeGreaterThan(0);
		expect(decoded.exp - decoded.iat).toBe(86400);
	});
	it("Should return 401 if user is not a manager", async () => {
		await prisma.user.create({
			data: {
				email: "fakeEmail",
				name: "fakeName",
				password: await bcrypt.hash("_1fakePassword", 10),
				isManager: false,
			},
		});

		const response = await request(app).post("/auth/manager/login").send({
			email: "fakeEmail",
			password: "_1fakePassword",
		});

		expect(response.statusCode).toBe(401);
	});

	it("Should return 401 when unknown email", async () => {
		const response = await request(app).post("/auth/manager/login").send({
			email: "unknownEmail",
			password: "_1fakePassword",
		});

		expect(response.statusCode).toBe(401);
	});

	it("Should return 401 when wrong password", async () => {
		await prisma.user.create({
			data: {
				email: "fakeEmail",
				name: "fakeName",
				password: await bcrypt.hash("_1fakePassword", 10),
				isManager: false,
			},
		});

		const response = await request(app).post("/auth/manager/login").send({
			email: "fakeEmail",
			password: "*2otherPass",
		});

		expect(response.statusCode).toBe(401);
	});
});

describe("GET /auth/manager/checkToken", () => {
	it("Should return 200 if token valid and user a manager", async () => {
		await prisma.user.create({
			data: {
				id: 1,
				name: "FakeName",
				email: "fake@mail",
				password: "haçze!hjfiuqsdf",
				isManager: true,
			},
		});

		const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: "1d" });

		const response = await request(app)
			.get("/auth/manager/checkToken")
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
	});
	it("Should return 401 if not a manager", async () => {
		await prisma.user.create({
			data: {
				id: 1,
				name: "FakeName",
				email: "fake@mail",
				password: "haçze!hjfiuqsdf",
				isManager: false,
			},
		});

		const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: "1d" });

		const response = await request(app)
			.get("/auth/manager/checkToken")
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(401);
	});
	it("Should return 401 if token invalid", async () => {
		const token = "AOIHSDFIOHSDOFIHQSD";

		const response = await request(app)
			.get("/auth/manager/checkToken")
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(401);
	});

	it("Should return 401 if no token provided", async () => {
		const response = await request(app).get("/auth/manager/checkToken");

		expect(response.statusCode).toBe(401);
	});
});

describe("GET /auth/userFromToken", () => {
	it("Should return 200 and user if token valid", async () => {
		await prisma.user.create({
			data: {
				id: 12,
				name: "FakeName",
				email: "fake@mail",
				password: "haçze!hjfiuqsdf",
			},
		});

		const token = jwt.sign({ userId: 12 }, JWT_SECRET, { expiresIn: "1d" });

		const response = await request(app)
			.get("/auth/userFromToken")
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.id).toBe(12);
		expect(response.body.name).toBe("FakeName");
		expect(response.body.email).toBe("fake@mail");
		expect(response.body.isManager).toBe(false);
		expect(response.body.password).toBeUndefined();
	});
});
