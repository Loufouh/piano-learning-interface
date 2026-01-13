import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import express from "express";
import { authenticateToken } from "./auth.js";

const router = express.Router();
const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.DB_URL,
		},
	},
});

router.get("/myItems", authenticateToken, async (req, res) => {
	const usersToItems = await prisma.spaceItemsOnUsers.findMany({
		where: { userId: req.user.id },
		orderBy: { order: "asc" },
	});
	const items = await prisma.spaceItem.findMany({
		where: {
			id: {
				in: usersToItems.map((item) => item.spaceItemId),
			},
		},
		orderBy: { id: "asc" },
	});
	const orderedItems = usersToItems.map((userToItem) => {
		return items.find((item) => item.id === userToItem.spaceItemId);
	});

	res.status(200).json({
		items: orderedItems,
	});
});

export default router;
