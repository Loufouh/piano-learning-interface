import { PrismaClient } from "@prisma/client";
import express from "express";
import { authenticateManagerToken } from "./auth.js";

const router = express.Router();
const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.DB_URL,
		},
	},
});

router.get("/all", authenticateManagerToken, async (req, res) => {
	const users = await prisma.user.findMany();

	users.forEach((user) => {
		delete user.password;
	});

	res.json({ users });
});

router.get("/:id", authenticateManagerToken, async (req, res) => {
	const userId = parseInt(req.params.id, 10);
	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	delete user.password;

	res.json(user);
});

export default router;
