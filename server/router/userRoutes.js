import { Router } from "express";
import { loginUser, registerUser } from "../controllers/userControllers.js";

const router = Router();

router.route("/auth/login").post(loginUser);
router.post("/auth/register", registerUser);// ✅ Fix applied here

export default router;
