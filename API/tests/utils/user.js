import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

export async function createUser() {
    return await prisma.user.create({
        data: {
            name: "FakeName",
            email: `${faker.string.uuid()}@mail.com`,
            password: "haçze!hjfiuqsdf",
        }
    });
}

export function connectUser(user) {
    user.token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
    return user;
}

export async function promoteToManager(user) {
    let promotedUser = await prisma.user.update({
        where: { id: user.id },
        data: { isManager: true }
    });

    if (user.token)
        promotedUser.token = user.token;

    return promotedUser;
}

export async function unpromoteFromManager(user) {
    let unpromotedUser = await prisma.user.update({
        where: { id: user.id },
        data: { isManager: false }
    });

    if (user.token)
        unpromotedUser.token = user.token;

    return unpromotedUser;
}