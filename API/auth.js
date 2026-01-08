import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DB_URL
        }
    }
});

function isPasswordSecurityOk(password) {
    // At least : 1 lowercase, 1 uppercase, 1 number, 1 special character (@ $ ! % * ? &), total of 8 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/;
    return passwordRegex.test(password);
}

router.post("/register", async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ messages: "Email, name and password are required" });
    } else if (!isPasswordSecurityOk(password)) {
        return res.status(400).json({ messages: "Password does not respect the security rules" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                name: true,
            }
        });

        res.json({ messages: "User registered successfully", user });
    } catch (error) {
        // Prisma unique constraint error
        if (error.code === "P2002") {
            return res.status(409).json({ messages: "Email already registered" });
        }
        
        // Unknown error
        return res.status(500).json({ messages: error.message });
    }
});

async function passwordCheck(req, res, next) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user)
        res.status(401).json({ messages: "Login failed" })


    const passValid = await bcrypt.compare(password, user.password);

    if (!passValid)
        res.status(401).json({ messages: "Login failed" })

    next();
}

function generateUserToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
}

router.post("/login", passwordCheck, async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email }});
    
    res.json({
        token: generateUserToken(user.id)
    });
});

router.post("/manager/login", passwordCheck, async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email }});

    if (!user.isManager) {
        return res.sendStatus(401);
    }
    
    res.json({
        token: generateUserToken(user.id)
    });
});

router.get("/checkToken", authenticateToken, async (req, res) => {
    res.status(200).json("valid");
});

router.get("/manager/checkToken", authenticateManagerToken, async (req, res) => {
    res.status(200).json("valid");
});

router.get("/userFromToken", authenticateToken, async (req, res) => {
    res.json(req.user);
});

export function authenticateManagerToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
        return res.status(401).json({ message: "You need to log in first." });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err)
            return res.status(401).json({ message: "You need to log in first." });

        req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if(!req.user || !req.user.isManager)
            return res.status(401).json({ message: "You need to log in first." });

        next();
    })
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
        return res.status(401).json({ message: "You need to log in first." });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err)
            return res.status(401).json({ message: "You need to log in first." });

        req.user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                isManager: true,
                password: false
            }
        });

        if(!req.user)
            return res.status(401).json({ message: "You need to log in first." });

        next();
    })
}

export default router;