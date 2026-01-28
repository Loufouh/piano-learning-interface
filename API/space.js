import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import { authenticateManagerToken, authenticateToken } from "./auth.js";
import { throwIfMissingField, verifyRequiredFields } from "./utils.js";

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

router.get("/manager/item/:id", authenticateManagerToken, async (req, res) => {
	const itemId = parseInt(req.params.id, 10);
	const item = await prisma.spaceItem.findUnique({ where: { id: itemId } });

	if (!item) {
		return res.status(404).json({ error: "Item not found" });
	}

	res.status(200).json(item);
});

router.post("/manager/item", authenticateManagerToken, async (req, res) => {
	try {
		const item = await prisma.spaceItem.create({ data: req.body });
		res.status(200).json(item);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientValidationError) {
			return res
				.status(400)
				.json({ error: "Invalid data format for creating the spaceItem" });
		}
		return res
			.status(500)
			.json({ error: "An error occurred while creating the spaceItem" });
	}
});

router.patch(
	"/manager/item/:id",
	authenticateManagerToken,
	async (req, res) => {
		const itemId = parseInt(req.params.id, 10);
		const item = await prisma.spaceItem.findUnique({ where: { id: itemId } });

		if (!item) {
			return res.status(404).json({ error: "SpaceItem not found" });
		}

		try {
			await prisma.spaceItem.update({
				where: { id: itemId },
				data: {
					...req.body,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientValidationError) {
				return res
					.status(400)
					.json({ error: "Invalid data format for updating the spaceItem" });
			}
			return res
				.status(500)
				.json({ error: "An error occurred while updating the spaceItem" });
		}

		res.json();
	},
);

router.delete(
	"/manager/item/:id",
	authenticateManagerToken,
	async (req, res) => {
		const itemId = parseInt(req.params.id, 10);

		const item = await prisma.spaceItem.findUnique({ where: { id: itemId } });

		if (!item) {
			return res.status(404).json({ error: "Item not found" });
		}

		await prisma.spaceItem.delete({ where: { id: itemId } });

		res.status(200).json();
	},
);

router.post("/manager/linkItem", authenticateManagerToken, async (req, res) => {
	try {
		throwIfMissingField(["userId", "spaceItemId", "order"], req);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}

	const user = await prisma.user.findUnique({ where: { id: req.body.userId } });
	const item = await prisma.spaceItem.findUnique({
		where: { id: req.body.spaceItemId },
	});

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}
	if (!item) {
		return res.status(404).json({ error: "SpaceItem not found" });
	}

	const searchLink = await prisma.spaceItemsOnUsers.findFirst({
		where: { spaceItemId: req.body.spaceItemId, userId: req.body.userId },
	});
	if (searchLink) {
		return res.status(409).json({ error: "Item already linked to user" });
	}

	await prisma.spaceItemsOnUsers.create({
		data: req.body,
	});

	return res.status(200).json();
});

router.delete(
	"/manager/unlinkItem/",
	authenticateManagerToken,
	async (req, res) => {
		try {
			throwIfMissingField(["userId", "spaceItemId"], req);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}

		const link = await prisma.spaceItemsOnUsers.findUnique({
			where: {
				userId_spaceItemId: {
					userId: req.body.userId,
					spaceItemId: req.body.spaceItemId,
				},
			},
		});

		if (!link) {
			return res.status(404).json({ error: "Link not found" });
		}

		await prisma.spaceItemsOnUsers.delete({
			where: {
				userId_spaceItemId: {
					userId: req.body.userId,
					spaceItemId: req.body.spaceItemId,
				},
			},
		});
		return res.status(200).json();
	},
);

export default router;
