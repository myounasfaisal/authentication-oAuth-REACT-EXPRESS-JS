import { Router } from "express";
import { loginUser, registerUser } from "../controllers/userControllers.js";

const router = Router();

router.route("/auth/login").post(loginUser);
router.post("/auth/signup", registerUser);

export default router;
