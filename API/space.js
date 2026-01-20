import { PrismaClient } from "@prisma/client";
import express from "express";
import { authenticateManagerToken, authenticateToken } from "./auth.js";

const router = express.Router();
const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.DB_URL,
		},
	},
});

async function getOrderedUserItems(userId) {
	const usersToItems = await prisma.spaceItemsOnUsers.findMany({
		where: { userId: userId },
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

	const ordered = usersToItems.map((userToItem) => {
		return items.find((item) => item.id === userToItem.spaceItemId);
	});

	return ordered;
}

router.get("/myItems", authenticateToken, async (req, res) => {
	res.status(200).json({
		items: await getOrderedUserItems(req.user.id),
	});
});

router.get(
	"/manager/itemsOfUser/:id",
	authenticateManagerToken,
	async (req, res) => {
		const userId = parseInt(req.params.id, 10);
		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({
			items: await getOrderedUserItems(userId),
		});
	},
);

export default router;
