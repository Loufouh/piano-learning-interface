import cors from "cors";
import express from "express";

import authRouter from "./auth.js";
import spaceRouter from "./space.js";

const app = express();
app.use(express.json());

const allowedServers = [process.env.MANAGER_URL, process.env.CLIENT_URL];

app.use(
	cors({
		origin: (origin, callback) => {
			if (allowedServers.includes(origin)) {
				return callback(null, true);
			} else {
				return callback(new Error("Not allowed by CORS"));
			}
		},
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		credentials: true,
	}),
);

app.use("/auth", authRouter);
app.use("/space", spaceRouter);

export default app;
