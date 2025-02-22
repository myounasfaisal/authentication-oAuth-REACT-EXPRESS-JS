import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./DB/DB.js";
import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
}));
app.use(cookieParser());

connectDB();

import userRouter from "./router/userRoutes.js";

app.use("/api/v1/users", userRouter);


export default app;